import { create } from 'zustand';

interface FilteringState {
    selectedBrands: string[];
    toggleBrand: (brand: string) => void;
    setBrands: (brands: string[]) => void;
}

export const useFiltering = create<FilteringState>((set) => ({
    selectedBrands: [],
    toggleBrand: (brand) =>
        set((state) => ({
            selectedBrands: state.selectedBrands.includes(brand)
                ? state.selectedBrands.filter((selectedBrand) => selectedBrand !== brand)
                : [...state.selectedBrands, brand],
        })),
    setBrands: (brands) => set(() => ({ selectedBrands: brands })),
}));