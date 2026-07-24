# opencode-selection

[![Version](https://img.shields.io/badge/version-0.1.0-blue)](https://github.com/JonathanReisCom/opencode-selection)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.85.0-blue?logo=visualstudiocode)](https://code.visualstudio.com)

> Send selected code or file references from VS Code to the OpenCode terminal with a single shortcut.

A lightweight VS Code extension that bridges your editor to the [OpenCode](https://opencode.ai) terminal. Select code (or place your cursor on a line), press `Cmd+L` (Mac) or `Ctrl+L` (Windows/Linux), and the context is sent to the OpenCode prompt — no copy-paste needed.

Built by [Sunstone Apps](https://sunstoneapps.com).

## How it works

The extension inspects your current selection and decides what to send:

| Scenario | What gets sent |
| --- | --- |
| File in workspace + selection | `@path#Lstart-end` (compact reference) |
| File in workspace + no selection | `@path` (file reference) |
| Untitled or out-of-workspace file | Sanitized text (tabs and newlines collapsed, wrapped in backticks if multiline) |

Workspace files become **references** — the OpenCode agent reads the file directly, so your prompt stays clean. Unsaved or external files fall back to **sanitized text** since there's no path to reference.

## Why

The official OpenCode VS Code extension only sends file references for files inside the workspace folder. This extension adds the missing piece: send **any** selection to the OpenCode prompt, including unsaved files or files outside the project — and sends workspace selections as compact `@path#L` references instead of raw text.

## Requirements

- [OpenCode](https://opencode.ai) installed and available in your PATH
- The official OpenCode VS Code extension (provides `Cmd+Esc` to open the OpenCode terminal)

## Install

### From the VS Code Marketplace

Install directly from the [Marketplace page](https://marketplace.visualstudio.com/items?itemName=sunstoneapps.opencode-selection) or via the command line:

```bash
code --install-extension sunstoneapps.opencode-selection
```

### From source (local development)

```bash
git clone https://github.com/JonathanReisCom/opencode-selection.git
cd opencode-selection
```

Then in VS Code:

1. Open the `opencode-selection` folder
2. Press `F5` to launch an Extension Development Host
3. Open the OpenCode terminal with `Cmd+Esc` (Mac) or `Ctrl+Esc` (Windows/Linux)
4. Select code in any file and press `Cmd+L` / `Ctrl+L`

### Manual install (without building)

Copy the extension folder into your VS Code extensions directory:

```bash
cp -r . ~/.vscode/extensions/sunstoneapps.opencode-selection-0.1.0
```

Restart VS Code.

## Usage

1. Open the OpenCode terminal with `Cmd+Esc` (this creates a terminal named "opencode")
2. Select code in any editor (or place your cursor on a line)
3. Press `Cmd+L` (Mac) or `Ctrl+L` (Windows/Linux)
4. The reference or sanitized text appears in the OpenCode prompt, ready for you to type your question

## How it sends data

When the OpenCode terminal is created via the official extension, it registers a local HTTP port in the terminal's environment variables. This extension reads that port and sends the payload via `POST http://localhost:<port>/tui/append-prompt`.

If the port is not available (e.g., the terminal was opened manually), it falls back to `terminal.sendText()` which types the text directly into the terminal.

## Limitations

- Depends on the OpenCode terminal being created via `Cmd+Esc` (the official extension's command). A manually opened `opencode` terminal won't have the HTTP port registered.
- The `/tui/append-prompt` endpoint and `_EXTENSION_OPENCODE_PORT` environment variable are internal APIs of the OpenCode VS Code extension — they may change between releases.

## License

MIT — &copy; [Sunstone Apps](https://sunstoneapps.com)
