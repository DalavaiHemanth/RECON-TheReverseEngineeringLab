import { expect, it } from "vitest";
import { recordingTimes, normalizeRect, redactPixels } from "./media-review";
it("selected moments keep original times and are ordered", () =>
  expect(recordingTimes(10, [8, 1, 8])).toEqual([1, 8]));
it("recording moment limits cannot be bypassed", () => {
  expect(() => recordingTimes(181, [1])).toThrow();
  expect(() => recordingTimes(10, [10])).toThrow();
  expect(() =>
    recordingTimes(
      10,
      Array.from({ length: 13 }, (_, i) => i / 2),
    ),
  ).toThrow();
});
it("crop rectangles stay inside the image", () =>
  expect(normalizeRect({ x: 0.8, y: 0.8 }, { x: 0.2, y: 0.3 })).toEqual({
    x: 0.2,
    y: 0.3,
    width: 0.6000000000000001,
    height: 0.5,
  }));
it("redaction replaces private pixels rather than hiding an overlay", () => {
  const pixels = new Uint8ClampedArray([200, 100, 50, 255, 20, 30, 40, 255]);
  redactPixels(pixels, 2, 1, { x: 0, y: 0, width: 0.5, height: 1 });
  expect([...pixels]).toEqual([0, 0, 0, 255, 20, 30, 40, 255]);
});
