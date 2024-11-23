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
  // Extended list of binary and non-text extensions
  extensions: [
    // Executables and binaries
    ".exe",
    ".bin",
    ".dat",
    ".db",
    ".sqlite",
    ".dll",
    ".so",
    // Media files
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".ico",
    ".svg",
    ".mp3",
    ".wav",
    ".ogg",
    ".m4a",
    ".flac",
    ".mp4",
    ".avi",
    ".mkv",
    ".mov",
    ".wmv",
    ".flv",
    // Archive files
    ".zip",
    ".rar",
    ".7z",
    ".tar",
    ".gz",
    ".bz2",
    // Document formats
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    // Font files
    ".ttf",
    ".otf",
    ".woff",
    ".woff2",
    // Other binary formats
    ".pyc",
    ".pyo",
    ".o",
    ".class",
  ],
};

const TEXT_FILE_EXTENSIONS = new Set([
  // Programming languages
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".ruby",
  ".php",
  ".java",
  ".c",
  ".cpp",
  ".h",
  ".cs",
  ".go",
  ".rs",
  ".swift",
  ".kt",
  ".scala",
  ".r",
  ".pl",
  ".sh",
  ".bash",
  // Web files
  ".html",
  ".htm",
  ".css",
  ".scss",
  ".sass",
  ".less",
  // Data formats
  ".json",
  ".xml",
  ".yaml",
  ".yml",
  ".toml",
  ".ini",
  ".conf",
  // Documentation
  ".md",
  ".markdown",
  ".txt",
  ".rst",
  ".asciidoc",
  // Configuration
  ".env",
  ".gitignore",
  ".dockerignore",
  ".eslintrc",
  ".prettierrc",
  // Other text formats
  ".csv",
  ".tsv",
  ".sql",
  ".log",
]);

const CONFIG = {
  MAX_FILES: 500,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  DEFAULT_OUTPUT_FILE: "output.md",
};

module.exports = {
  DEFAULT_BLACKLIST,
  TEXT_FILE_EXTENSIONS,
  CONFIG,
};
