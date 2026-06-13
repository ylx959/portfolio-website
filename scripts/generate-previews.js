#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const projectDataPath = path.join(root, "scripts", "mineport-project-data.js");
const source = fs.readFileSync(projectDataPath, "utf8");
const context = { window: {} };
const shouldForce = process.argv.includes("--force");

vm.createContext(context);
vm.runInContext(source, context, { filename: projectDataPath });

const projectDetails = Array.isArray(context.window.MINEPORT_PROJECT_DETAIL_DATA)
    ? context.window.MINEPORT_PROJECT_DETAIL_DATA
    : [];

function getSourcePath(imageUrl) {
    return path.join(root, imageUrl.split("?")[0].replace(/^\.\.\//, ""));
}

function getPreviewPath(imageUrl) {
    const imagePath = imageUrl
        .split("?")[0]
        .replace(/^\.\.\/assets\/images\//, "assets/images/previews/")
        .replace(/\.[^/.]+$/, ".jpg");

    return path.join(root, imagePath);
}

const imageUrls = new Set();

projectDetails.forEach(function (detail) {
    (detail.images || []).forEach(function (imageUrl) {
        imageUrls.add(imageUrl);
    });

    (detail.galleryImages || []).forEach(function (imageUrl) {
        imageUrls.add(imageUrl);
    });
});

let createdCount = 0;
let skippedCount = 0;
const missingSources = [];

imageUrls.forEach(function (imageUrl) {
    const sourcePath = getSourcePath(imageUrl);
    const previewPath = getPreviewPath(imageUrl);

    if (!fs.existsSync(sourcePath)) {
        missingSources.push(path.relative(root, sourcePath));
        return;
    }

    if (fs.existsSync(previewPath) && !shouldForce) {
        skippedCount += 1;
        return;
    }

    fs.mkdirSync(path.dirname(previewPath), { recursive: true });
    execFileSync("sips", [
        "-Z", "48",
        "-s", "format", "jpeg",
        "-s", "formatOptions", "45",
        sourcePath,
        "--out", previewPath
    ], { stdio: "ignore" });

    createdCount += 1;
});

console.log("Preview generation complete.");
console.log("Images found: " + imageUrls.size);
console.log("Created: " + createdCount);
console.log("Skipped: " + skippedCount);
console.log("Force: " + (shouldForce ? "yes" : "no"));

if (missingSources.length) {
    console.warn("Missing source images:");
    missingSources.forEach(function (sourcePath) {
        console.warn("- " + sourcePath);
    });
    process.exitCode = 1;
}
