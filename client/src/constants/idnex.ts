import { categories } from "@/components/tables/products-table/filters";

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

interface PriceRanges {
    min: number;
    max: number;
}

export const priceRanges: PriceRanges[] = [
    { min: 10, max: 100 },
    { min: 100, max: 500 },
    { min: 500, max: 1000 },
    { min: 1000, max: 5000 },
];

type Category = typeof categories[number];

export const categoriesValues: Array<Category['value']> = categories.map(category => category.value);
