"use strict";

const vscode = require("vscode");

const OPENCODE_TERMINAL_NAME = "opencode";

function buildReference(editor) {
  const doc = editor.document;
  const wsFolder = vscode.workspace.getWorkspaceFolder(doc.uri);
  if (!wsFolder) return null;

  const relPath = vscode.workspace.asRelativePath(doc.uri, false);
  const sel = editor.selection;
  const startLine = sel.start.line + 1;
  const endLine = sel.end.line + 1;

  let ref = "@" + relPath;
  if (!sel.isEmpty) {
    ref += startLine === endLine ? `#L${startLine}` : `#L${startLine}-${endLine}`;
  }
  return ref;
}

function sanitizeText(text) {
  const isMultiline = text.includes("\n");
  let safe = text
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, "    ")
    .replace(/\n/g, " ")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();

  if (isMultiline) {
    safe = "`" + safe.replace(/`/g, "\\`") + "`";
  }

  return safe;
}

function buildPayload(editor) {
  const selection = editor.selection;
  const hasSelection = !selection.isEmpty;
  const ref = buildReference(editor);

  if (ref) {
    return ref;
  }

  const text = hasSelection
    ? editor.document.getText(selection)
    : editor.document.lineAt(selection.active.line).text;

  if (!text || !text.trim()) {
    return null;
  }

  return sanitizeText(text);
}

async function sendToTerminal(terminal, payload) {
  const env = terminal.creationOptions && terminal.creationOptions.env;
  const port = env ? env._EXTENSION_OPENCODE_PORT : undefined;

  if (!port) {
    terminal.sendText(payload, false);
    terminal.show();
    return;
  }

  const url = `http://localhost:${port}/tui/append-prompt`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: payload }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenCode responded ${res.status}: ${body}`);
  }

  terminal.show();
}

function activate(context) {
  const disposable = vscode.commands.registerCommand(
    "opencodeSelection.send",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("No active editor.");
        return;
      }

      const terminal = vscode.window.terminals.find(
        (t) => t.name === OPENCODE_TERMINAL_NAME
      );
      if (!terminal) {
        vscode.window.showWarningMessage(
          "OpenCode terminal not found. Open it with Cmd+Esc first."
        );
        return;
      }

      const payload = buildPayload(editor);
      if (!payload) {
        vscode.window.showWarningMessage("Nothing to send.");
        return;
      }

      try {
        await sendToTerminal(terminal, payload + " ");
      } catch (err) {
        vscode.window.showErrorMessage(
          `Failed to send to OpenCode: ${err.message}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
