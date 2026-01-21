import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  Segment,
  WheelConfig,
  SavedWheel,
  AppSettings,
  SpinResult
} from '@/types';
import { DEFAULT_SEGMENTS, DEFAULT_CONFIG, DEFAULT_SETTINGS } from '@/constants/defaults';
import { generateId } from '@/lib/utils';

interface WheelState {
  // Segment State
  segments: Segment[];

  // Wheel State
  config: WheelConfig;
  isSpinning: boolean;
  lastResult: Segment | null;

  // Current wheel name (editable)
  currentWheelName: string;

  // Saved Wheels
  savedWheels: SavedWheel[];

  // Settings
  settings: AppSettings;

  // History
  history: SpinResult[];
}

interface WheelActions {
  // Segment Actions
  addSegment: (segment: Omit<Segment, 'id'>) => void;
  updateSegment: (id: string, updates: Partial<Segment>) => void;
  removeSegment: (id: string) => void;
  reorderSegments: (startIndex: number, endIndex: number) => void;
  clearSegments: () => void;
  setSegments: (segments: Segment[]) => void;

  // Wheel Actions
  updateConfig: (config: Partial<WheelConfig>) => void;
  setSpinning: (isSpinning: boolean) => void;
  setResult: (result: Segment | null) => void;
  setCurrentWheelName: (name: string) => void;

  // Saved Wheel Actions
  saveCurrentWheel: (name: string) => string;
  loadWheel: (id: string) => void;
  deleteWheel: (id: string) => void;
  renameWheel: (id: string, name: string) => void;
  duplicateWheel: (id: string) => string;

  // Settings Actions
  updateSettings: (settings: Partial<AppSettings>) => void;

  // History Actions
  addToHistory: (result: SpinResult) => void;
  clearHistory: () => void;

  // Utility Actions
  reset: () => void;
}

type WheelStore = WheelState & WheelActions;

const DEFAULT_WHEEL: SavedWheel = {
  id: 'default-wheel-of-misfortune',
  name: 'The Wheel of Misfortune',
  segments: DEFAULT_SEGMENTS,
  config: DEFAULT_CONFIG,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const INITIAL_STATE: WheelState = {
  segments: DEFAULT_SEGMENTS,
  config: DEFAULT_CONFIG,
  isSpinning: false,
  lastResult: null,
  currentWheelName: 'The Wheel of Misfortune',
  savedWheels: [DEFAULT_WHEEL],
  settings: DEFAULT_SETTINGS,
  history: [],
};

export const useWheelStore = create<WheelStore>()(
  persist(
    immer((set, get) => ({
      ...INITIAL_STATE,

      // Segment Actions
      addSegment: (segment) => set((state) => {
        const id = generateId();
        state.segments.push({ ...segment, id });
      }),

      updateSegment: (id, updates) => set((state) => {
        const index = state.segments.findIndex((s: Segment) => s.id === id);
        if (index !== -1) {
          state.segments[index] = { ...state.segments[index], ...updates };
        }
      }),

      removeSegment: (id) => set((state) => {
        state.segments = state.segments.filter((s: Segment) => s.id !== id);
      }),

      reorderSegments: (startIndex, endIndex) => set((state) => {
        const [removed] = state.segments.splice(startIndex, 1);
        state.segments.splice(endIndex, 0, removed);
      }),

      clearSegments: () => set((state) => {
        state.segments = [];
      }),

      setSegments: (segments) => set((state) => {
        state.segments = segments;
      }),

      // Wheel Actions
      updateConfig: (config) => set((state) => {
        state.config = { ...state.config, ...config };
      }),

      setSpinning: (isSpinning) => set((state) => {
        state.isSpinning = isSpinning;
      }),

      setResult: (result) => set((state) => {
        state.lastResult = result;
      }),

      setCurrentWheelName: (name) => set((state) => {
        state.currentWheelName = name;
      }),

      // Saved Wheel Actions
      saveCurrentWheel: (name) => {
        const id = generateId();
        const { segments, config } = get();
        set((state) => {
          state.savedWheels.push({
            id,
            name,
            segments: [...segments],
            config: { ...config },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        });
        return id;
      },

      loadWheel: (id) => set((state) => {
        const wheel = state.savedWheels.find((w: SavedWheel) => w.id === id);
        if (wheel) {
          state.segments = [...wheel.segments];
          state.config = { ...wheel.config };
          state.currentWheelName = wheel.name;
        }
      }),

      deleteWheel: (id) => set((state) => {
        state.savedWheels = state.savedWheels.filter((w: SavedWheel) => w.id !== id);
      }),

      renameWheel: (id, name) => set((state) => {
        const wheel = state.savedWheels.find((w: SavedWheel) => w.id === id);
        if (wheel) {
          wheel.name = name;
          wheel.updatedAt = new Date().toISOString();
        }
      }),

      duplicateWheel: (id) => {
        const { savedWheels } = get();
        const wheel = savedWheels.find((w) => w.id === id);
        if (!wheel) return '';

        const newId = generateId();
        set((state) => {
          state.savedWheels.push({
            ...wheel,
            id: newId,
            name: `${wheel.name} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        });
        return newId;
      },

      // Settings Actions
      updateSettings: (settings) => set((state) => {
        state.settings = { ...state.settings, ...settings };
      }),

      // History Actions
      addToHistory: (result) => set((state) => {
        state.history.unshift(result);
        // Keep last 50 results
        if (state.history.length > 50) {
          state.history = state.history.slice(0, 50);
        }
      }),

      clearHistory: () => set((state) => {
        state.history = [];
      }),

      // Utility Actions
      reset: () => set(INITIAL_STATE),
    })),
    {
      name: 'random-wheel-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        segments: state.segments,
        config: state.config,
        currentWheelName: state.currentWheelName,
        savedWheels: state.savedWheels,
        settings: state.settings,
        history: state.history,
      }),
      migrate: (persistedState, version) => {
        const state = persistedState as Partial<WheelState>;

        // Migration from version 0 (or no version) to version 1:
        // Add the default "Wheel of Misfortune" to saved wheels if it doesn't exist
        if (version < 1) {
          const savedWheels = state.savedWheels || [];
          const hasDefaultWheel = savedWheels.some(
            (w) => w.id === DEFAULT_WHEEL.id
          );

          if (!hasDefaultWheel) {
            state.savedWheels = [DEFAULT_WHEEL, ...savedWheels];
          }
        }

        return state as WheelState;
      },
    }
  )
);

// Selectors for optimized re-renders
export const useSegments = () => useWheelStore((state) => state.segments);
export const useConfig = () => useWheelStore((state) => state.config);
export const useIsSpinning = () => useWheelStore((state) => state.isSpinning);
export const useLastResult = () => useWheelStore((state) => state.lastResult);
export const useCurrentWheelName = () => useWheelStore((state) => state.currentWheelName);
export const useSavedWheels = () => useWheelStore((state) => state.savedWheels);
export const useSettings = () => useWheelStore((state) => state.settings);
export const useHistory = () => useWheelStore((state) => state.history);

// Computed selectors
export const useSegmentCount = () => useWheelStore((state) => state.segments.length);
export const useTotalWeight = () => useWheelStore((state) =>
  state.segments.reduce((sum, s) => sum + s.weight, 0)
);
export const useCanSpin = () => useWheelStore((state) =>
  state.segments.length >= 2 && !state.isSpinning
);
