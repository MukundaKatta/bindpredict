import { describe, it, expect } from "vitest";
import { Bindpredict } from "../src/core.js";
describe("Bindpredict", () => {
  it("init", () => { expect(new Bindpredict().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Bindpredict(); await c.track(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Bindpredict(); await c.track(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
