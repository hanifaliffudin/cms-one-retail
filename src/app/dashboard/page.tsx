"use client";

import { Icon } from "@iconify/react";
import { InputHTMLAttributes, useEffect, useState } from "react";
import SideBar from "../components/SideBar";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";

import { rankItem } from "@tanstack/match-sorter-utils";
import Link from "next/link";

type Blog = {
  id: string;
  image: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
};

const defaultData: Blog[] = [
  {
    id: "1",
    image:
      "https://main--preeminent-crostata-f5e2a5.netlify.app/blog/hero-blog-1.svg",
    category: "Customer Relationship Management",
    title: "How to optimize and expand your business with product analytics",
    content:
      "Gadgets have been a part of our lives for centuries. From the first mechanical clock to the latest smartphone, gadgets have transformed the way we live, work, and play. As we continue to embrace new technologies and innovations, gadgets are becoming more sophisticated and powerful than ever before.",
    tags: ["Customer", "Management", "Product", "Analytics"],
  },
  {
    id: "2",
    image: "https://placehold.co/600x400/EEE/31343C",
    category: "Order Management System",
    title: "Customer Journey : Definitions, analysis and best practices",
    content:
      "When we set out to bring product analytics to our business, we knew.",
    tags: ["uuy", "Analytics"],
  },
  {
    id: "3",
    image: "https://placehold.jp/150x150.png",
    category: "Order Management System",
    title: "Customer Journey : Definitions, analysis and best practices",
    content:
      "When we set out to bring product analytics to our business, we knew.",
    tags: ["uuy", "Analytics"],
  },
];

const columnHelper = createColumnHelper<Blog>();

const columns = [
  columnHelper.accessor("image", {
    cell: (info) => (
      <img
        className="w-full h-full object-cover"
        src={info.getValue()}
        alt=""
      />
    ),
  }),
  columnHelper.accessor("category", {
    cell: (info) => <div className="">{info.getValue()}</div>,
  }),
  columnHelper.accessor("title", {
    cell: (info) => (
      <div className="sm:w-40 font-semibold">{info.getValue()}</div>
    ),
  }),
  columnHelper.accessor("content", {
    cell: (info) => <div className="line-clamp-6">{info.renderValue()}</div>,
  }),
  columnHelper.accessor("tags", {
    cell: (info) => <div>{info.renderValue()}</div>,
  }),
  columnHelper.display({
    header: () => "Actions",
    id: "actions",
    cell: (props) => (
      <>
        <div className="flex items-center gap-x-2">
          <Link href={"/edit/" + props.row.original.id}>
            <Icon icon="material-symbols:edit" />
          </Link>
          <button>
            <Icon icon="material-symbols:delete" />
          </button>
        </div>
      </>
    ),
  }),
];

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const DashboardPage = () => {
  const [data, setData] = useState(() => [...defaultData]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  return (
    <>
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            placeholder="Search all columns..."
          />
          <Link
            href="/add"
            className="text-white bg-blue-700 hover:bg-blue-800font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Add New Blog
          </Link>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th className="px-4 py-3" key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr className="bg-white border-b" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td className="p-4" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default DashboardPage;
