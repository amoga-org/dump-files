# dump-files

A simple CLI tool to combine multiple files into a single markdown file, with each file's content prefixed by its filename as a header.

> Note: This tool was created with the help of Claude (Anthropic) on Nov 23, 2024

## Installation

```bash
# Install globally
npm install -g dump-files

# Or use directly with npx
npx dump-files
```

## Usage

```bash
# Basic usage - dumps all files into output.md
dump-files

# Specify output file
dump-files --output combined.txt

# Dump specific files
dump-files *.js *.ts --output code.md
```

## Features

- Automatically combines files into a single markdown document
- Uses filename as header (# filename) for each file's content
- Default output file is `output.md` if not specified
- Recursive directory scanning
- Smart file filtering

### Default Blacklist

The following are automatically excluded:

#### Directories

- node_modules
- .git
- dist
- build
- coverage

#### Files

- .DS_Store
- .env
- \*.log
- \*.lock
- package-lock.json
- yarn.lock

#### File Extensions

- .exe
- .bin
- .dat
- .db
- .sqlite

### Additional Features

- Skips binary files automatically
- Prevents infinite loops by excluding output file
- Provides detailed console feedback during processing
- Handles errors gracefully

## Examples

```bash
# Combine all JavaScript files
dump-files *.js --output javascript.md

# Combine all files in current directory
dump-files

# Combine specific files
dump-files file1.txt file2.js --output combined.md
```

## Output Format

The output file will look like this:

```markdown
# path/to/file1.js

// content of file1.js

# path/to/file2.js

// content of file2.js
```

## Error Handling

The tool will:

- Skip binary files
- Skip unreadable files
- Skip blacklisted files and directories
- Provide feedback about skipped files
- Continue processing even if some files fail

## License

ISC

## Contributing

Feel free to open issues and pull requests!

## Credits

This tool was created with the assistance of Claude (Anthropic) as part of a CLI tool development exercise. The implementation includes file handling, directory traversal, and smart filtering features to make file dumping more convenient and safe.
