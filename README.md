# dump-files

A lightweight, zero-dependency CLI tool to combine multiple files into a single markdown file, with each file's content prefixed by its filename as a header.

> Note: This tool was created with the help of Claude (Anthropic)

## Usage

No installation required! Use directly with npx:

```bash
# Basic usage - dumps all files into output.md
npx dump-files

# Specify output file
npx dump-files --output combined.txt

# Dump specific files
npx dump-files *.js *.ts --output code.md

# Dump files from specific directory
cd your/directory
npx dump-files
```

## Features

- Zero dependencies - runs anywhere with Node.js
- Automatically combines files into a single markdown document
- Uses filename as header (# filename) for each file's content
- Default output file is `output.md` if not specified
- Recursive directory scanning
- Smart file filtering
- Respects .gitignore patterns
- License file exclusion

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
- LICENSE files (LICENSE, license.txt, COPYING, etc.)
- Files matching patterns in .gitignore

#### File Extensions

- Executables: .exe, .bin, .dll, .so
- Data files: .dat, .db, .sqlite
- Media: .jpg, .jpeg, .png, .gif, .bmp, .ico, .svg
- Audio: .mp3, .wav, .ogg, .m4a, .flac
- Video: .mp4, .avi, .mkv, .mov, .wmv, .flv
- Archives: .zip, .rar, .7z, .tar, .gz, .bz2
- Documents: .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx
- Fonts: .ttf, .otf, .woff, .woff2
- Compiled: .pyc, .pyo, .o, .class

### Additional Features

- Skips binary files automatically
- Zero external dependencies
- Prevents infinite loops by excluding output file
- Provides detailed console feedback during processing
- Handles errors gracefully
- Case-insensitive license file exclusion

## Examples

```bash
# Combine all JavaScript files
npx dump-files *.js --output javascript.md

# Combine all files in current directory
npx dump-files

# Combine specific files
npx dump-files file1.txt file2.js --output combined.md
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
- Skip files matching .gitignore patterns
- Skip license files
- Provide feedback about skipped files
- Continue processing even if some files fail

## Size Limits

To ensure reliable operation:

- Maximum file size: 5MB per file
- Maximum number of files: 500
- Binary files are automatically excluded

## Contributing

Feel free to open issues and pull requests!

## License

This project is licensed under the GNU General Public License v3 (GPL-3.0) - see the [LICENSE](LICENSE) file for details.

## Credits

This tool was created with the assistance of Claude (Anthropic).
The implementation includes file handling, directory traversal, and smart filtering features to make file dumping more convenient and safe.
