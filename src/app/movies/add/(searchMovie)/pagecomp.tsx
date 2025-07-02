"use client"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis
} from "@/components/ui/pagination"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { MoreHorizontal } from "lucide-react"

function getVisiblePages(current: number, total: number, delta = 2) {
  // Always show first and last
  const pages: (number | "...")[] = []
  const left = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)

  // Push first page
  pages.push(1)

  // Ellipsis before
  if (left > 2) {
    pages.push("...")
  }

  // Main pages
  for (let i = left; i <= right; i++) {
    pages.push(i)
  }

  // Ellipsis after
  if (right < total - 1) {
    pages.push("...")
  }

  // Last page
  if (total > 1) {
    pages.push(total)
  }

  return pages
}

const PageComp = ({ totalPages }: { totalPages: number }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const currentPage = Number(searchParams.get("page")) || 1

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    replace(`${pathname}?${params.toString()}`)
  }

  const visiblePages = getVisiblePages(currentPage, totalPages, 2)

  return (
    <Pagination>
      <PaginationContent>
        {visiblePages.map((page, index) =>
          page === "..." ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <MoreHorizontal className="h-4 w-4" />
            </PaginationItem>
          ) : (
            <PaginationItem
              key={page}
              onClick={() => createPageURL(page)}
              
            >
              <PaginationLink href="#" isActive={page === currentPage}>{page}</PaginationLink>
            </PaginationItem>
          )
        )}
      </PaginationContent>
    </Pagination>
  )
}

export default PageComp