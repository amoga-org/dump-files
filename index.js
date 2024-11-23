#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");
const {
  DEFAULT_BLACKLIST,
  TEXT_FILE_EXTENSIONS,
  CONFIG,
} = require("./constants");

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

async function dumpFiles() {
  try {
    const args = process.argv.slice(2);
    console.log("Arguments received:", args);

    const outputIndex = args.indexOf("--output");
    let outputFile = CONFIG.DEFAULT_OUTPUT_FILE;
    let filePatterns = args;

    if (outputIndex !== -1) {
      if (!args[outputIndex + 1]) {
        console.error(
          "No filename specified after --output flag, using default:",
          CONFIG.DEFAULT_OUTPUT_FILE
        );
      } else {
        outputFile = args[outputIndex + 1];
        filePatterns = [
          ...args.slice(0, outputIndex),
          ...args.slice(outputIndex + 2),
        ];
      }
    }

    if (filePatterns.length === 0) {
      console.log("No files specified, reading all files recursively...");
      filePatterns = await getFilesInDirectory();
    }

    if (filePatterns.length === 0) {
      console.error(
        "No files found to process. Are you in the right directory?"
      );
      process.exit(1);
    }

    try {
      filePatterns = await validateFiles(filePatterns);
    } catch (validationError) {
      console.error("\n❌ Validation Error:");
      console.error(validationError.message);
      process.exit(1);
    }

    console.log("\n✅ File validation passed");
    console.log("Output file:", outputFile);
    console.log(`Found ${filePatterns.length} files to process`);

    let output = "";
    let processedFiles = 0;
    let skippedFiles = 0;

    output += `# File Dump\n\n`;
    output += `Generated on: ${new Date().toLocaleString()}\n`;
    output += `Directory: ${process.cwd()}\n`;
    output += `Total files: ${filePatterns.length}\n\n`;
    output += `---\n\n`;

    for (const pattern of filePatterns) {
      if (path.resolve(pattern) === path.resolve(outputFile)) {
        console.log("Skipping output file:", pattern);
        continue;
      }

      try {
        console.log("Reading file:", pattern);
        const content = await fs.readFile(pattern, "utf8");
        output += `# ${pattern}\n`;
        output += content;
        output += "\n\n";
        processedFiles++;
        process.stdout.write(`\rProcessed ${processedFiles} files...`);
      } catch (err) {
        console.warn(`\nSkipping file ${pattern}: ${err.message}`);
        skippedFiles++;
        continue;
      }
    }

    await fs.writeFile(outputFile, output);
    console.log(
      `\n✅ Successfully combined ${processedFiles} files into ${outputFile}`
    );
    console.log(`ℹ️  Skipped ${skippedFiles} files`);

    if (processedFiles === 0) {
      console.warn(
        "\n⚠️  Warning: No files were processed. The output file might be empty."
      );
      console.warn("This could be because all files were either:");
      console.warn("- Binary files");
      console.warn("- Blacklisted files");
      console.warn("- Unreadable files");
    }
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    process.exit(1);
  }
}

dumpFiles();
