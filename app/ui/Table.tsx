import React from "react"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const Table = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <table
        ref={ref}
        className={cn(
            "w-full text-left text-sm text-gray-500 dark:text-gray-400",
            className
        )}
        {...props}
    />
))
Table.displayName = "Table"

const TableHead = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <thead
        ref={ref}
        className={cn(
            "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
            className
        )}
        {...props}
    />
))
TableHead.displayName = "TableHead"

const TableHeadCell = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "bg-gray-50 px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700",
            className
        )}
        {...props}
    />
))
TableHeadCell.displayName = "TableHeadCell"

export { Table, TableHead, TableHeadCell }