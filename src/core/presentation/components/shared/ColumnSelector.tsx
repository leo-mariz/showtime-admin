
import { useState } from "react";
import { Button } from "@/core/presentation/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/presentation/components/ui/popover";
import { Checkbox } from "@/core/presentation/components/ui/checkbox";
import { Columns } from "lucide-react";

interface Column {
  id: string;
  label: string;
}

interface ColumnSelectorProps {
  availableColumns: Column[];
  visibleColumns: string[];
  onColumnsChange: (columns: string[]) => void;
}

export const ColumnSelector = ({
  availableColumns,
  visibleColumns,
  onColumnsChange,
}: ColumnSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleColumnToggle = (columnId: string) => {
    if (visibleColumns.includes(columnId)) {
      onColumnsChange(visibleColumns.filter(id => id !== columnId));
    } else {
      onColumnsChange([...visibleColumns, columnId]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Columns className="h-4 w-4 mr-2" />
          Colunas
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Colunas visíveis</h4>
          <div className="space-y-2">
            {availableColumns.map((column) => (
              <div key={column.id} className="flex items-center space-x-2">
                <Checkbox
                  id={column.id}
                  checked={visibleColumns.includes(column.id)}
                  onCheckedChange={() => handleColumnToggle(column.id)}
                />
                <label
                  htmlFor={column.id}
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
