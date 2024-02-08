import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type DashboardStoreState = {
    isCollapsed: boolean;
    defaultSizes: number[];
    setCollapsed: (isCollapsed: boolean) => void;
    setDefaultSizes: (sizes: number[]) => void;
};

const useDashboardStore = create<DashboardStoreState>()(
    persist(
        (set) => ({
            isCollapsed: false,
            defaultSizes: [25, 75],
            setCollapsed: (isCollapsed) => set({ isCollapsed }),
            setDefaultSizes: (defaultSizes) => set({ defaultSizes }),
        }),
        {
            name: 'dashboard-settings',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useDashboardStore;