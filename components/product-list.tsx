"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Grid, List, ArrowUpDown, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import type { Product } from "@/lib/types"
import { formatDate } from "@/lib/utils"


export default function ProductList({ products }: { products: Product[] }) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("list")
    const [sortBy, setSortBy] = useState<"dateAdded" | "dateUpdated" | "price" | "name">("dateAdded")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const [searchTerm, setSearchTerm] = useState<string>("")

    const filteredAndSortedProducts = [...products]
        .filter((product) => searchTerm === "" || product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "name") {
                return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
            } else if (sortBy === "price") {
                return sortOrder === "asc" ? a.price - b.price : b.price - a.price
            } else if (sortBy === "dateAdded") {
                return sortOrder === "asc"
                    ? new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
                    : new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
            } else {
                return sortOrder === "asc"
                    ? new Date(a.dateUpdated).getTime() - new Date(b.dateUpdated).getTime()
                    : new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime()
            }
        })

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Products</h1>
                <div className="flex gap-2">
                    <div className="relative w-64 mr-2">
                        <Input
                            type="search"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                        {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                        <span className="sr-only">Toggle view</span>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                Sort by:{" "}
                                {sortBy === "name"
                                    ? "Name"
                                    : sortBy === "price"
                                        ? "Price"
                                        : sortBy === "dateAdded"
                                            ? "Date Added"
                                            : "Date Updated"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    setSortBy("name")
                                    setSortOrder("asc")
                                }}
                            >
                                Name (A-Z)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSortBy("name")
                                    setSortOrder("desc")
                                }}
                            >
                                Name (Z-A)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSortBy("price")
                                    setSortOrder("asc")
                                }}
                            >
                                Price (Low to High)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSortBy("price")
                                    setSortOrder("desc")
                                }}
                            >
                                Price (High to Low)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSortBy("dateAdded")
                                    setSortOrder("desc")
                                }}
                            >
                                Date Added (Newest)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSortBy("dateUpdated")
                                    setSortOrder("desc")
                                }}
                            >
                                Date Updated (Newest)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Link href="/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Product
                        </Button>
                    </Link>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No products found</p>
                    <Link href="/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add your first product
                        </Button>
                    </Link>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAndSortedProducts.map((product) => (
                        <Link key={product.id} href={`/update/${product.id}`}>
                            <Card className="h-full overflow-hidden hover:border-primary transition-colors">
                                <div className="aspect-square relative">
                                    <Image
                                        src={product.image || "/placeholder.svg?height=200&width=200"}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <h2 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h2>
                                    <p className="text-xl font-bold mb-2">Rp{product.price}</p>
                                    <div className="text-xs text-muted-foreground">
                                        <p>Added: {formatDate(product.dateAdded)}</p>
                                        <p>Updated: {formatDate(product.dateUpdated)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {filteredAndSortedProducts.map((product) => (
                        <Link key={product.id} href={`/update/${product.id}`}>
                            <Card className="overflow-hidden hover:border-primary transition-colors">
                                <div className="flex">
                                    <div className="w-24 h-24 relative">
                                        <Image
                                            src={product.image || "/placeholder.svg?height=100&width=100"}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <CardContent className="p-4 flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="font-semibold text-lg">{product.name}</h2>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    <p>Added: {formatDate(product.dateAdded)}</p>
                                                    <p>Updated: {formatDate(product.dateUpdated)}</p>
                                                </div>
                                            </div>
                                            <p className="text-xl font-bold">Rp{product.price}</p>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
