#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");
const { CONFIG } = require("./constants");
const { getFilesInDirectory, validateFiles } = require("./helpers");

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
