#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const indexPath = process.argv[2]
    ? path.resolve(root, process.argv[2])
    : path.join(root, "index.html");
const html = fs.readFileSync(indexPath, "utf8");
const assetPattern = /((?:href|src)="(?:styles|scripts)\/[^"]+\.(?:css|js)\?v=)(\d+)(")/g;
let bumpedCount = 0;

const nextHtml = html.replace(assetPattern, function (match, prefix, version, suffix) {
    bumpedCount += 1;
    return prefix + (Number(version) + 1) + suffix;
});

if (!bumpedCount) {
    console.error("No local CSS/JS asset versions found in index.html.");
    process.exit(1);
}

fs.writeFileSync(indexPath, nextHtml);

console.log("Bumped " + bumpedCount + " local CSS/JS asset version" + (bumpedCount === 1 ? "" : "s") + ".");
