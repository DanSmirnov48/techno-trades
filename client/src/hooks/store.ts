import { create } from 'zustand';

interface SortCategory {
    value: string;
    label: string;
}

interface ShowPerPageOption {
    value: string;
    label: string;
}

export const sortCategories: SortCategory[] = [
    {
        value: "relevance",
        label: "Sort By: Relevance",
    },
    {
        value: "brandAsc",
        label: "Sort By: Brand - A to Z",
    },
    {
        value: "brandDesc",
        label: "Sort By: Brand - Z to A",
    },
    {
        value: "priceAsc",
        label: "Sort By: Price - low to high",
    },
    {
        value: "priceDesc",
        label: "Sort By: Price - hight to low",
    },
    {
        value: "customerRating",
        label: "Sort By: Customer Rating",
    },
];

export const showPerPage: ShowPerPageOption[] = [
    {
        value: "2",
        label: "Show: 2",
    },
    {
        value: "4",
        label: "Show: 4",
    },
    {
        value: "6",
        label: "Show: 6",
    },
];

interface SortingState {
    isChecked: boolean;
    selectedSort: string;
    selectedShowPerPage: string;
    setSort: (value: string) => void;
    toggleCheckbox: () => void;
    setShowPerPage: (value: string) => void;
}

interface FilteringState {
    selectedBrands: string[];
    toggleBrand: (brand: string) => void;
    setBrands: (brands: string[]) => void;
}

interface RatingFilteringState {
    minRating: number | null;
    maxRating: number | null;
    setRating: (min: number | null, max: number | null) => void;
}

export const useSorting = create<SortingState>((set) => ({
    isChecked: false,
    selectedSort: sortCategories[0].value,
    selectedShowPerPage: showPerPage[0].value,
    toggleCheckbox: () => set((state) => ({ isChecked: !state.isChecked })),
    setSort: (value) => set(() => ({ selectedSort: value })),
    setShowPerPage: (value) => set(() => ({ selectedShowPerPage: value })),
}));

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

export const useRatingFiltering = create<RatingFilteringState>((set) => ({
    minRating: null,
    maxRating: null,
    setRating: (min, max) =>
        set(() => ({
            minRating: min,
            maxRating: max,
        })),
}));