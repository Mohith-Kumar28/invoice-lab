import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SAVED_ITEMS_LIMIT } from "@/lib/tool-defaults";

export type SavedItemsState<T extends { id: string }> = {
  items: T[];
  saveItem: (item: T) => void;
  deleteItem: (id: string) => void;
  clearAll: () => void;
  getItem: (id: string) => T | undefined;
  importItems: (items: T[]) => void;
};

export function createSavedItemsStore<T extends { id: string }>({
  storageKey,
  isEmpty,
  sanitize,
  prepare,
  limit = SAVED_ITEMS_LIMIT,
}: {
  storageKey: string;
  limit?: number;
  isEmpty?: (item: T) => boolean;
  sanitize?: (item: T) => T;
  prepare?: (nextItem: T, existingItem?: T) => T;
}) {
  return create<SavedItemsState<T>>()(
    persist(
      (set, get) => ({
        items: [],
        saveItem: (item) =>
          set((state) => {
            if (isEmpty?.(item)) return state;
            const sanitized = sanitize ? sanitize(item) : item;

            const existingIndex = state.items.findIndex(
              (i) => i.id === sanitized.id,
            );
            const existingItem =
              existingIndex >= 0 ? state.items[existingIndex] : undefined;
            const nextItem = prepare
              ? prepare(sanitized, existingItem)
              : sanitized;
            if (existingIndex >= 0) {
              const updated = [...state.items];
              updated[existingIndex] = nextItem;
              return { items: updated.slice(0, limit) };
            }
            return { items: [nextItem, ...state.items].slice(0, limit) };
          }),
        deleteItem: (id) =>
          set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
        clearAll: () => set({ items: [] }),
        getItem: (id) => get().items.find((i) => i.id === id),
        importItems: (newItems) =>
          set((state) => {
            const currentIds = new Set(state.items.map((i) => i.id));
            const toAdd = newItems.filter((i) => !currentIds.has(i.id));
            return { items: [...state.items, ...toAdd].slice(0, limit) };
          }),
      }),
      { name: storageKey },
    ),
  );
}
