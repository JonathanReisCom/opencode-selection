"use strict";

const assert = require("assert");
const { buildReference, sanitizeText } = require("./logic");

function run() {
  // sanitizeText: single line passes through
  assert.strictEqual(sanitizeText("hello world"), "hello world");

  // sanitizeText: tab becomes spaces
  assert.strictEqual(sanitizeText("hello\tworld"), "hello    world");

  // sanitizeText: newline becomes space, wrapped in backticks
  assert.strictEqual(sanitizeText("line1\nline2"), "`line1 line2`");

  // sanitizeText: \r\n handled
  assert.strictEqual(sanitizeText("line1\r\nline2"), "`line1 line2`");

  // sanitizeText: control chars stripped
  assert.strictEqual(sanitizeText("a\x00b\x07c"), "abc");

  // sanitizeText: DEL char stripped
  assert.strictEqual(sanitizeText("a\x7Fb"), "ab");

  // sanitizeText: backticks inside text escaped
  assert.strictEqual(sanitizeText("code with `backtick`\nmore"), "`code with \\`backtick\\` more`");

  // sanitizeText: trimmed
  assert.strictEqual(sanitizeText("  hello  "), "hello");

  // buildReference: null when no workspace folder
  assert.strictEqual(buildReference({}, null, "path", { isEmpty: true }), null);

  // buildReference: file ref without selection
  assert.strictEqual(
    buildReference({}, { uri: "ws" }, "src/foo.ts", { isEmpty: true }),
    "@src/foo.ts"
  );

  // buildReference: single line selection
  assert.strictEqual(
    buildReference({}, { uri: "ws" }, "src/foo.ts", {
      isEmpty: false,
      start: { line: 4 },
      end: { line: 4 },
    }),
    "@src/foo.ts#L5"
  );

  // buildReference: multi line selection
  assert.strictEqual(
    buildReference({}, { uri: "ws" }, "src/foo.ts", {
      isEmpty: false,
      start: { line: 9 },
      end: { line: 14 },
    }),
    "@src/foo.ts#L10-15"
  );

  console.log("All tests passed.");
}

run();
