import { create } from 'zustand';

interface SortCategory {
    value: string;
    label: string;
}

interface ShowPerPageOption {
    value: number;
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
        value: 5,
        label: "Show: 5",
    },
    {
        value: 10,
        label: "Show: 10",
    },
    {
        value: 20,
        label: "Show: 20",
    },
    {
        value: 999,
        label: "Show: All",
    },
];

interface SortingState {
    isChecked: boolean;
    selectedSort: string;
    selectedShowPerPage: number;
    setSort: (value: string) => void;
    toggleCheckbox: () => void;
    setShowPerPage: (value: number) => void;
}

interface FilteringState {
    selectedBrands: string[];
    toggleBrand: (brand: string) => void;
    setBrands: (brands: string[]) => void;
    removeBrand: (brand: string) => void;
    removeAllBrands: () => void;
}

interface RatingFilteringState {
    minRating: number | null;
    maxRating: number | null;
    setRating: (min: number | null, max: number | null) => void;
}

interface StockFilteringState {
    hideOutOfStock: boolean;
    toggleHideOutOfStock: () => void;
}

interface PriceRange {
    min: number;
    max: number;
}

interface PriceFilterStoreState {
    selectedRanges: PriceRange[];
    addSelectedRange: (range: PriceRange) => void;
    removeSelectedRange: (min: number, max: number) => void;
    removeAllRanges: () => void;
}

interface RatingFilterStoreState {
    selectedRatings: number[];
    addSelectedRating: (rating: number) => void;
    removeSelectedRating: (rating: number) => void;
    removeAllRatings: () => void;
}

interface CategoryFilterStoreState {
    selectedCategories: string[];
    toggleCategory: (category: string) => void;
    setCategories: (categories: string[]) => void;
    removeCategory: (category: string) => void;
    removeAllCategories: () => void;
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
    removeBrand: (brand) => set((state) => ({
        selectedBrands: state.selectedBrands.filter((selectedBrand) => selectedBrand !== brand),
    })),
    removeAllBrands: () => set(() => ({ selectedBrands: [] })),
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

export const useStockFiltering = create<StockFilteringState>((set) => ({
    hideOutOfStock: false,
    toggleHideOutOfStock: () =>
        set((state) => ({ hideOutOfStock: !state.hideOutOfStock })),
}));

export const usePriceFilterStore = create<PriceFilterStoreState>((set) => ({
    selectedRanges: [],
    addSelectedRange: (range) => set((state) => ({ selectedRanges: [...state.selectedRanges, range] })),
    removeSelectedRange: (min, max) =>
        set((state) => ({
            selectedRanges: state.selectedRanges.filter((range) => range.min !== min || range.max !== max),
        })),
    removeAllRanges: () => set(() => ({ selectedRanges: [] })),
}));

export const useRatingFilterStore = create<RatingFilterStoreState>((set) => ({
    selectedRatings: [],
    addSelectedRating: (rating) => set((state) => ({ selectedRatings: [...state.selectedRatings, rating] })),
    removeSelectedRating: (rating) =>
        set((state) => ({ selectedRatings: state.selectedRatings.filter((selectedRating) => selectedRating !== rating) })),
    removeAllRatings: () => set(() => ({ selectedRatings: [] })),
}));

export const useCategoryFilter = create<CategoryFilterStoreState>((set) => ({
    selectedCategories: [],
    categoryCounts: {},
    toggleCategory: (category) =>
      set((state) => ({
        selectedCategories: state.selectedCategories.includes(category)
          ? state.selectedCategories.filter((selectedCategory) => selectedCategory !== category)
          : [...state.selectedCategories, category],
      })),
    setCategories: (categories) => set(() => ({ selectedCategories: categories })),
    removeCategory: (category) => set((state) => ({
      selectedCategories: state.selectedCategories.filter((selectedCategory) => selectedCategory !== category),
    })),
    removeAllCategories: () => set(() => ({ selectedCategories: [] })),
  }));