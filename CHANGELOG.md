# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

## [0.1.0] - 2026-07-24

### Added

- Send current selection or file reference from VS Code to the OpenCode terminal via `Cmd+L` (Mac) or `Ctrl+L` (Windows/Linux).
- Workspace files are sent as compact `@path#Lstart-end` references.
- Untitled or out-of-workspace files fall back to sanitized text (tabs and newlines collapsed, control characters stripped, multiline wrapped in backticks).
- HTTP POST to the OpenCode terminal's internal `/tui/append-prompt` endpoint, with `terminal.sendText` fallback when the port is unavailable.

[Unreleased]: https://github.com/JonathanReisCom/opencode-selection/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/JonathanReisCom/opencode-selection/releases/tag/v0.1.0
