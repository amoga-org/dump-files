const DEFAULT_BLACKLIST = {
  directories: ["node_modules", ".git", "dist", "build", "coverage"],
  files: [
    ".DS_Store",
    ".env",
    "*.log",
    "*.lock",
    "package-lock.json",
    "yarn.lock",
    "LICENSE*",
    "license*",
    "COPYING*",
  ],
  extensions: [
    ".exe",
    ".bin",
    ".dat",
    ".db",
    ".sqlite",
    ".dll",
    ".so",
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
    ".zip",
    ".rar",
    ".7z",
    ".tar",
    ".gz",
    ".bz2",
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".ttf",
    ".otf",
    ".woff",
    ".woff2",
    ".pyc",
    ".pyo",
    ".o",
    ".class",
  ],
};

const TEXT_FILE_EXTENSIONS = new Set([
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
  ".html",
  ".htm",
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".json",
  ".xml",
  ".yaml",
  ".yml",
  ".toml",
  ".ini",
  ".conf",
  ".md",
  ".markdown",
  ".txt",
  ".rst",
  ".asciidoc",
  ".env",
  ".gitignore",
  ".dockerignore",
  ".eslintrc",
  ".prettierrc",
  ".csv",
  ".tsv",
  ".sql",
  ".log",
]);

const CONFIG = {
  MAX_FILES: 500,
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  DEFAULT_OUTPUT_FILE: "output.md",
};

module.exports = {
  DEFAULT_BLACKLIST,
  TEXT_FILE_EXTENSIONS,
  CONFIG,
};
