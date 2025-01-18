const fs = require("fs").promises;
const path = require("path");
const ignore = require("ignore");
const {
  DEFAULT_BLACKLIST,
  TEXT_FILE_EXTENSIONS,
  CONFIG,
} = require("./constants");

async function loadGitignore(dir = ".") {
  try {
    const gitignorePath = path.join(dir, ".gitignore");
    const content = await fs.readFile(gitignorePath, "utf8");
    return ignore().add(content.split("\n"));
  } catch (err) {
    return ignore();
  }
}

async function getFilesInDirectory(dir = ".", results = [], ig = null) {
  if (!ig) {
    ig = await loadGitignore(dir);
  }

  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(process.cwd(), fullPath);

    if (ig.ignores(relativePath)) {
      continue;
    }

    if (entry.isDirectory()) {
      if (!DEFAULT_BLACKLIST.directories.includes(entry.name)) {
        await getFilesInDirectory(fullPath, results, ig);
      }
    } else {
      const isBlacklisted = DEFAULT_BLACKLIST.files.some((pattern) => {
        if (pattern.includes("*")) {
          const regex = new RegExp(
            "^" + pattern.replace(/\*/g, ".*") + "$",
            "i"
          );
          return regex.test(entry.name);
        }
        return entry.name.toLowerCase() === pattern.toLowerCase();
      });

      if (!isBlacklisted) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

async function isTextFile(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();

    if (TEXT_FILE_EXTENSIONS.has(ext)) {
      return true;
    }

    if (DEFAULT_BLACKLIST.extensions.includes(ext)) {
      return false;
    }

    const buffer = await fs.readFile(filePath);
    const sampleSize = Math.min(1024, buffer.length);
    const sample = buffer.slice(0, sampleSize);

    for (let i = 0; i < sampleSize; i++) {
      if (sample[i] === 0) {
        return false;
      }
    }

    try {
      const decoder = new TextDecoder("utf-8", { fatal: true });
      decoder.decode(sample);
      return true;
    } catch {
      return false;
    }
  } catch (err) {
    console.warn(`Error checking file type for ${filePath}:`, err.message);
    return false;
  }
}

async function checkFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      exceeds: stats.size > CONFIG.MAX_FILE_SIZE,
    };
  } catch (err) {
    console.warn(`Error checking size for ${filePath}:`, err.message);
    return { size: 0, exceeds: false };
  }
}

async function validateFiles(filePatterns) {
  console.log("Validating files...");

  const textFiles = [];
  const skippedFiles = [];

  for (const file of filePatterns) {
    if (await isTextFile(file)) {
      textFiles.push(file);
    } else {
      skippedFiles.push(file);
    }
  }

  if (skippedFiles.length > 0) {
    console.log("\nSkipping non-text files:");
    skippedFiles.forEach((file) => console.log(`- ${file}`));
  }

  if (textFiles.length > CONFIG.MAX_FILES) {
    throw new Error(
      `Found ${textFiles.length} text files, which exceeds the limit of ${CONFIG.MAX_FILES} files.\n` +
        "This might be because you're running the command in the wrong directory.\n" +
        "To proceed, you can:\n" +
        "1. Specify exact files: dump-files specific_files/* --output output.md\n" +
        "2. Move to a subdirectory with fewer files"
    );
  }

  for (const file of textFiles) {
    const { size, exceeds } = await checkFileSize(file);
    if (exceeds) {
      const sizeMB = (size / (1024 * 1024)).toFixed(2);
      throw new Error(
        `File "${file}" is ${sizeMB}MB, which exceeds the maximum size limit of 5MB.\n` +
          "Large files are not supported to prevent memory issues.\n" +
          "Please exclude this file or split it into smaller files."
      );
    }
  }

  return textFiles;
}

module.exports = {
  getFilesInDirectory,
  isTextFile,
  checkFileSize,
  validateFiles,
};
