# dump-files

A simple CLI tool to combine multiple files into a single markdown file, with each file's content prefixed by its filename as a header.

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

# Dump files excluding specific patterns
npx dump-files --output combined.md
```

## Features

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

- .exe
- .bin
- .dat
- .db
- .sqlite
- .dll
- .so
- .jpg, .jpeg, .png, .gif, .bmp, .ico, .svg
- .mp3, .wav, .ogg, .m4a, .flac
- .mp4, .avi, .mkv, .mov, .wmv, .flv
- .zip, .rar, .7z, .tar, .gz, .bz2
- .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx
- .ttf, .otf, .woff, .woff2
- .pyc, .pyo, .o, .class

### Additional Features

- Skips binary files automatically
- Prevents infinite loops by excluding output file
- Provides detailed console feedback during processing
- Handles errors gracefully
- Respects .gitignore patterns
- Case-insensitive license file exclusion

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
- Skip files matching .gitignore patterns
- Skip license files
- Provide feedback about skipped files
- Continue processing even if some files fail

## License

This project is licensed under the GNU General Public License v3 (GPL-3.0) - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to open issues and pull requests!

## Credits

This tool was created with the assistance of Claude (Anthropic).
The implementation includes file handling, directory traversal, gitignore support, and smart filtering features to make file dumping more convenient and safe.
