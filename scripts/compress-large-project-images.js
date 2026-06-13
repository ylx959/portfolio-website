#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const projectsRoot = path.join(root, "assets", "images", "projects");
const targetBytes = 1000000;
const workDir = path.join(root, ".image-compress-tmp");
const jpegQualities = [88, 84, 80, 76, 72, 68];
const maxDimensions = [null, 4200, 3600, 3200, 2800, 2400, 2200, 2000, 1800, 1600];

function walk(dir, files) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(function (entry) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            walk(fullPath, files);
            return;
        }

        files.push(fullPath);
    });
}

function isTargetImage(filePath) {
    const relativePath = path.relative(projectsRoot, filePath);
    return /^project[1-9]\//.test(relativePath) &&
        /\/(?:detail|gallery)\//.test(relativePath) &&
        /\.(jpe?g|png)$/i.test(filePath);
}

function getExt(filePath) {
    return path.extname(filePath).toLowerCase();
}

function getCandidatePath(filePath, label) {
    const relativePath = path.relative(root, filePath);
    return path.join(workDir, relativePath + "." + label + path.extname(filePath));
}

function runSips(args) {
    execFileSync("sips", args, { stdio: "ignore" });
}

function makeCandidate(filePath, candidatePath, options) {
    fs.mkdirSync(path.dirname(candidatePath), { recursive: true });

    const args = [];

    if (options.maxDimension) {
        args.push("-Z", String(options.maxDimension));
    }

    if (options.format) {
        args.push("-s", "format", options.format);
    }

    if (options.quality) {
        args.push("-s", "formatOptions", String(options.quality));
    }

    args.push(filePath, "--out", candidatePath);
    runSips(args);
}

function compressImage(filePath) {
    const originalBytes = fs.statSync(filePath).size;
    const ext = getExt(filePath);
    const format = ext === ".png" ? "png" : "jpeg";
    let bestPath = null;
    let bestBytes = Infinity;
    let bestLabel = "";

    function keepCandidate(candidatePath, candidateBytes, label) {
        if (candidateBytes < bestBytes) {
            if (bestPath && bestPath !== candidatePath && fs.existsSync(bestPath)) {
                fs.rmSync(bestPath, { force: true });
            }

            bestPath = candidatePath;
            bestBytes = candidateBytes;
            bestLabel = label;
            return;
        }

        fs.rmSync(candidatePath, { force: true });
    }

    if (originalBytes <= targetBytes) {
        return null;
    }

    if (format === "jpeg") {
        for (const maxDimension of maxDimensions) {
            for (const quality of jpegQualities) {
                const label = (maxDimension || "same") + "-q" + quality;
                const candidatePath = getCandidatePath(filePath, label);
                makeCandidate(filePath, candidatePath, { format: "jpeg", quality, maxDimension });
                const candidateBytes = fs.statSync(candidatePath).size;

                if (candidateBytes <= targetBytes) {
                    fs.copyFileSync(candidatePath, filePath);
                    fs.rmSync(candidatePath, { force: true });
                    if (bestPath && bestPath !== candidatePath && fs.existsSync(bestPath)) {
                        fs.rmSync(bestPath, { force: true });
                    }
                    return { originalBytes, finalBytes: candidateBytes, label };
                }

                keepCandidate(candidatePath, candidateBytes, label);
            }
        }
    } else {
        for (const maxDimension of maxDimensions.filter(Boolean)) {
            const label = String(maxDimension);
            const candidatePath = getCandidatePath(filePath, label);
            makeCandidate(filePath, candidatePath, { format: "png", maxDimension });
            const candidateBytes = fs.statSync(candidatePath).size;

            if (candidateBytes <= targetBytes) {
                fs.copyFileSync(candidatePath, filePath);
                fs.rmSync(candidatePath, { force: true });
                if (bestPath && bestPath !== candidatePath && fs.existsSync(bestPath)) {
                    fs.rmSync(bestPath, { force: true });
                }
                return { originalBytes, finalBytes: candidateBytes, label };
            }

            keepCandidate(candidatePath, candidateBytes, label);
        }
    }

    if (bestPath && bestBytes < originalBytes) {
        fs.copyFileSync(bestPath, filePath);
        fs.rmSync(bestPath, { force: true });
        return { originalBytes, finalBytes: bestBytes, label: bestLabel + " (best effort)" };
    }

    return { originalBytes, finalBytes: originalBytes, label: "unchanged" };
}

if (fs.existsSync(workDir)) {
    fs.rmSync(workDir, { recursive: true, force: true });
}

const allFiles = [];
walk(projectsRoot, allFiles);

const oversizedImages = allFiles
    .filter(isTargetImage)
    .filter(function (filePath) {
        return fs.statSync(filePath).size > targetBytes;
    });

const results = oversizedImages.map(function (filePath) {
    const result = compressImage(filePath);
    return Object.assign({ filePath }, result);
});

fs.rmSync(workDir, { recursive: true, force: true });

const stillOversized = results.filter(function (result) {
    return result.finalBytes > targetBytes;
});

results.forEach(function (result) {
    const relativePath = path.relative(root, result.filePath);
    const before = (result.originalBytes / 1000000).toFixed(2) + "MB";
    const after = (result.finalBytes / 1000000).toFixed(2) + "MB";
    console.log(relativePath + "  " + before + " -> " + after + "  [" + result.label + "]");
});

console.log("Processed: " + results.length);
console.log("Still over 1MB: " + stillOversized.length);

if (stillOversized.length) {
    process.exitCode = 1;
}
