import type { SurgeryCreateInput } from './schemas';

export type SurgeryItem = SurgeryCreateInput & { id: string; createdAt: string };

class SurgeryStore {
  private items: SurgeryItem[] = [];

  list(): { items: SurgeryItem[]; count: number } {
    return { items: this.items, count: this.items.length };
  }

  create(input: SurgeryCreateInput): SurgeryItem {
    const item: SurgeryItem = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...input,
    };
    this.items.push(item);
    return item;
  }

  get(id: string): SurgeryItem | undefined {
    return this.items.find((i) => i.id === id);
  }

  update(id: string, input: Partial<SurgeryCreateInput>): SurgeryItem | undefined {
    const idx = this.items.findIndex((i) => i.id === id);
    if (idx === -1) return undefined;
    this.items[idx] = { ...this.items[idx], ...input };
    return this.items[idx];
  }

  remove(id: string): boolean {
    const before = this.items.length;
    this.items = this.items.filter((i) => i.id !== id);
    return this.items.length < before;
  }
}

export const surgeryStore = new SurgeryStore();


