// Simple test store to verify if the issue is with the store implementation
import { create } from 'zustand';

interface TestState {
  testValue: string;
  setTestValue: (value: string) => void;
}

export const useTestStore = create<TestState>((set) => ({
  testValue: 'Hello World',
  setTestValue: (value) => set({ testValue: value }),
}));
