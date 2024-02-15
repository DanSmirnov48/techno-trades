import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductType } from "@/lib/validation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ViewProps = {
  payment: ProductType;
};

export default function ViewDialog({ payment }: ViewProps) {
  const entries = Object.entries(payment).filter(([key]) => key !== 'image');
  return (
    <DialogHeader>
      <DialogTitle>View Product Details</DialogTitle>
      <DialogDescription className='py-4'>
        <Table className="border-2">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map(([key, value], index) => (
              <TableRow key={index}>
                <TableCell>{key}</TableCell>
                {/* @ts-ignore */}
                <TableCell>{value ? value : ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogDescription>
    </DialogHeader>
  );
}
