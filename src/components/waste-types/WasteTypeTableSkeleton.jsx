import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function WasteTypeTableSkeleton() {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-6 w-24" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 w-24" />
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              <Skeleton className="h-6 w-40" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 w-20" />
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Skeleton className="h-6 w-24" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 w-14" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 w-10" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-5 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Skeleton className="h-10 w-10 rounded-md" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
