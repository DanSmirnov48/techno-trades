import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    AppliedFilters,
    HideOutOfStock,
    ProductBrandFilters,
    ProductCategoryFilter,
    ProductPriceFilter,
    ProductRatingFilter,
} from ".";
import { Separator } from "../ui/separator";

const MobileProductFilters = () => {
    return (
        <Sheet>
            <SheetTrigger asChild className="block xl:hidden">
                <Button variant="outline" className="h-14">
                    Filters
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-2 py-10">
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col space-y-4">
                    <div>
                        <AppliedFilters />
                    </div>
                    <div>
                        <HideOutOfStock />
                        <Separator className="my-3" />
                    </div>
                    <div>
                        <ProductPriceFilter />
                        <Separator className="my-3" />
                    </div>
                    <div>
                        <ProductCategoryFilter />
                        <Separator className="my-3" />
                    </div>
                    <div>
                        <ProductBrandFilters />
                        <Separator className="my-3" />
                    </div>
                    <div>
                        <ProductRatingFilter />
                    </div>
                </div>

                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit" className="w-full mt-4">
                            Save changes
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default MobileProductFilters;
