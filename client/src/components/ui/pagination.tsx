import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronFirst, ChevronLast } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto my-10 flex w-full justify-center", className)}
    {...props}
  />
);

type PaginationContentProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
} & React.ComponentProps<"ul">;

const PaginationContent = React.forwardRef<HTMLUListElement, PaginationContentProps>(
  ({ className, totalPages, currentPage, onPageChange, ...props }, ref) => {
    const handlePageChange = (newPage: number) => {
      onPageChange(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const generatePageLinks = () => {
      const links = [];
      for (let i = 1; i <= totalPages; i++) {
        links.push(
          <li key={i}>
            <PaginationLink onClick={() => handlePageChange(i)} isActive={i === currentPage}>
              {i}
            </PaginationLink>
          </li>
        );
      }
      return links;
    };

    return (
      <ul
        ref={ref}
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
      >
        <PaginationItem>
          <PaginationFirst onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        </PaginationItem>
        {generatePageLinks()}
        <PaginationItem>
          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
        </PaginationItem>
      </ul>
    );
  }
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
  )
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
  onClick?: () => void;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"button">;

const PaginationLink = ({ className, isActive, size = "icon", onClick, ...props }: PaginationLinkProps) => (
  <PaginationItem>
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      onClick={onClick}
      {...props}
    />
  </PaginationItem>
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, onClick, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    onClick={onClick}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, onClick, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    onClick={onClick} 
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);

type PaginationFirstProps = React.ComponentProps<typeof PaginationLink>;

const PaginationFirst = ({ className, onClick, ...props }: PaginationFirstProps) => (
  <PaginationLink
    size="default"
    className={cn("bg-gray-100", className)}
    onClick={onClick}
    {...props}
  >
    <ChevronFirst className="h-4 w-4" />
  </PaginationLink>
);
PaginationFirst.displayName = "PaginationFirst";

type PaginationLastProps = React.ComponentProps<typeof PaginationLink>;

const PaginationLast = ({ className, onClick, ...props }: PaginationLastProps) => (
  <PaginationLink
    size="default"
    className={cn("bg-gray-100", className)}
    onClick={onClick}
    {...props}
  >
    <ChevronLast className="h-4 w-4" />
  </PaginationLink>
);
PaginationLast.displayName = "PaginationLast";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};