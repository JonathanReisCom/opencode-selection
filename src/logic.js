"use strict";

function buildReference(doc, workspaceFolder, asRelativePath, selection) {
  if (!workspaceFolder) return null;

  let ref = "@" + asRelativePath;
  if (!selection.isEmpty) {
    const startLine = selection.start.line + 1;
    const endLine = selection.end.line + 1;
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

module.exports = { buildReference, sanitizeText };
