#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");

const DEFAULT_OUTPUT_FILE = "output.md";
const DEFAULT_BLACKLIST = {
  directories: ["node_modules", ".git", "dist", "build", "coverage"],
  files: [
    ".DS_Store",
    ".env",
    "*.log",
    "*.lock",
    "package-lock.json",
    "yarn.lock",
  ],
  extensions: [".exe", ".bin", ".dat", ".db", ".sqlite"],
};

// ... [previous helper functions remain the same: shouldIncludeFile, getFilesInDirectory, isTextFile]

async function dumpFiles() {
  try {
    const args = process.argv.slice(2);
    console.log("Arguments received:", args);

    // Find the output file argument
    const outputIndex = args.indexOf("--output");
    let outputFile = DEFAULT_OUTPUT_FILE; // Default output file
    let filePatterns = args; // Start with all args as file patterns

    // If --output is specified, use that instead of default
    if (outputIndex !== -1) {
      if (!args[outputIndex + 1]) {
        console.error(
          "No filename specified after --output flag, using default:",
          DEFAULT_OUTPUT_FILE
        );
      } else {
        outputFile = args[outputIndex + 1];
        // Remove --output and its value from file patterns
        filePatterns = [
          ...args.slice(0, outputIndex),
          ...args.slice(outputIndex + 2),
        ];
      }
    }

    // If no files specified, get all files in current directory and subdirectories
    if (filePatterns.length === 0) {
      console.log("No files specified, reading all files recursively...");
      filePatterns = await getFilesInDirectory();
    }

    console.log("Output file:", outputFile);
    console.log("Files to process:", filePatterns);

    let output = "";
    let processedFiles = 0;
    let skippedFiles = 0;

    for (const pattern of filePatterns) {
      // Skip the output file to prevent infinite loops
      if (path.resolve(pattern) === path.resolve(outputFile)) {
        console.log("Skipping output file:", pattern);
        continue;
      }

      try {
        // Check if it's a text file
        if (!(await isTextFile(pattern))) {
          console.log(`Skipping binary file: ${pattern}`);
          skippedFiles++;
          continue;
        }

        console.log("Reading file:", pattern);
        const content = await fs.readFile(pattern, "utf8");
        output += `# ${pattern}\n`; // Using full path for better context
        output += content;
        output += "\n\n";
        processedFiles++;
      } catch (err) {
        console.warn(`Skipping file ${pattern}: ${err.message}`);
        skippedFiles++;
        continue;
      }
    }

    await fs.writeFile(outputFile, output);
    console.log(
      `Successfully combined ${processedFiles} files into ${outputFile}`
    );
    console.log(`Skipped ${skippedFiles} files`);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

dumpFiles();
