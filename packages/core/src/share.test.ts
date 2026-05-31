import { describe, expect, it } from "vitest";
import { decodeShareState, encodeShareState } from "./share.js";

describe("share", () => {
  it("round-trips state in hash", () => {
    const state = { mode: "code" as const, payload: { language: "rust" } };
    const hash = encodeShareState(state);
    const decoded = decodeShareState(hash);
    expect(decoded).toEqual(state);
  });
});
