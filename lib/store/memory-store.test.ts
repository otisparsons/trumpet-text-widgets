import { MemoryWidgetStore } from "./memory-store";

describe("MemoryWidgetStore", () => {
  let store: MemoryWidgetStore;

  beforeEach(() => {
    // Fresh Store per test
    store = new MemoryWidgetStore();
  });

  describe("create", () => {
    it("creates a widget with empty text and a unique id", async () => {
      const widget = await store.create();

      expect(widget.text).toBe("");
    });

    it("gives each widget a distinct id", async () => {
      const first = await store.create();
      const second = await store.create();

      expect(first.id).not.toBe(second.id);
    });
  });

  describe("update", () => {
    it("updates the text of an existing widget", async () => {
      const widget = await store.create();

      const updated = await store.update(widget.id, "hello");

      expect(updated).not.toBeNull();
      expect(updated?.text).toBe("hello");
      expect(updated?.id).toBe(widget.id);
    });

    it("persists the update so it is reflected in getAll", async () => {
      const widget = await store.create();
      await store.update(widget.id, "persisted");

      const all = await store.getAll();
      expect(all[0].text).toBe("persisted");
    });

    it("returns null when updating a non-existent widget", async () => {
      expect(await store.update("does-not-exist", "hello")).toBeNull();
    });

    it("handles large strings (1000+ characters)", async () => {
      const widget = await store.create();
      const longText = "a".repeat(1000);

      const updated = await store.update(widget.id, longText);

      expect(updated?.text).toBe(longText);
      expect(updated?.text).toHaveLength(1000);
    });

    it("persists an empty string (clearing a widget)", async () => {
      const widget = await store.create();
      await store.update(widget.id, "some text");

      const cleared = await store.update(widget.id, "");

      expect(cleared?.text).toBe("");
    });

    describe("delete", () => {
      it("removes a widget and returns true", async () => {
        const widget = await store.create();

        expect(await store.delete(widget.id)).toBe(true);
        expect(await store.getAll()).toHaveLength(0);
      });

      it("returns false when deleting a non-existent widget", async () => {
        expect(await store.delete("does-not-exist")).toBe(false);
      });

      it("only deletes the targeted widget", async () => {
        const keep = await store.create();
        const remove = await store.create();

        await store.delete(remove.id);

        const all = await store.getAll();
        expect(all).toHaveLength(1);
        expect(all[0].id).toBe(keep.id);
      });
    });
  });
});
