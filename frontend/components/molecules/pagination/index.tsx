import { cn } from "@/lib/utils"
import { range } from "@/utils/range"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"

function BtnPage(
  {
    page,
    currentPage,
    setCurrentPage,
    onChangePage,
    btntype = "number",
    btnNext = false,
    maxPage,
    colorScheme
  }:
    {
      page?: number,
      currentPage: number,
      setCurrentPage: Dispatch<SetStateAction<number>>
      onChangePage: (arg: number) => any,
      btntype?: "number" | "page"
      btnNext?: boolean,
      maxPage?: number,
      colorScheme: string
    }
) {
  return (
    <>
      {btntype === "number" && page ? (
        <button
          onClick={() => {
            setCurrentPage(page)
            onChangePage(page)
          }}
        // isActive={page === currentPage}
        className={cn(
          "font-medium p-1 px-3 rounded-lg",
          page === currentPage ? 'text-blue bg-blue-100 hover:text-blue-600 hover:bg-blue-200' : 'hover:text-blue hover:bg-blue-100'
        )}
        >
          {page}
        </button>
      ) : (
        <button
          onClick={() => {
            if (maxPage) {
              const n = btnNext ? currentPage + 1 : currentPage - 1
              if (n < 1 || n > maxPage) {
                return
              }
              setCurrentPage(n)
              onChangePage(n)
            }
          }}
        // icon={btnNext ? <FiChevronsRight /> : <FiChevronsLeft />}
        className={cn(
          "hover:text-blue hover:bg-blue-100 font-medium p-1 rounded-lg",
        )}
        >
          {btnNext ? <ChevronRightIcon className="size-4" /> : <ChevronLeftIcon className="size-4" />}
        </button>
      )}
    </>
  )
}

export function PaginationPure(
  {
    pages,
    activePage = 1,
    onChangePage,
    colorScheme = "red"
  }:
    {
      pages: number,
      activePage?: number
      onChangePage: (arg: number) => any
      colorScheme?: string
    }
) {
  const [currentPage, setCurrentPage] = useState(activePage)
  const [n, setN] = useState<Array<number>>([])
  const [nRight, setNRight] = useState<Array<number>>([])
  const [nLeft, setNLeft] = useState<Array<number>>([])

  const handleChangePage = useCallback((currPage: number, page: number) => {
    setCurrentPage(currPage)
    if (page > 5) {
      if (page - currPage <= 3 && page - currPage > 1) {
        setNLeft(range(currPage - 1, currPage + 1, 1))
        setNRight(range(currPage + 2, page + 1, 1))
      } else if (page - currPage <= 1) {
        setNLeft(range(currPage - 3, currPage - 1, 1))
        setNRight(range(currPage - 1, page + 1, 1))
      } else {
        setNLeft(range(currPage, currPage + 3, 1))
        setNRight(range(page - 1, page + 1, 1))
      }
    }
  }, [])

  useEffect(() => {
    setN(Array.from({ length: pages }, (_, i) => i + 1))

    return () => {
    }
  }, [pages])

  useEffect(() => {
    handleChangePage(currentPage, pages)
  }, [currentPage, handleChangePage, pages])

  return (
    <div className="flex gap-2">
      <BtnPage setCurrentPage={setCurrentPage} colorScheme={colorScheme} onChangePage={onChangePage} currentPage={currentPage} btntype="page" maxPage={pages} />
      {n.length <= 5 ? n.map((p, idx) => (<BtnPage setCurrentPage={setCurrentPage} colorScheme={colorScheme} onChangePage={onChangePage} page={p} currentPage={currentPage} key={idx} maxPage={pages} />)) : ''}
      {n.length > 5 ? nLeft.map((p, idx) => (<BtnPage setCurrentPage={setCurrentPage} colorScheme={colorScheme} onChangePage={onChangePage} page={p} currentPage={currentPage} key={idx} maxPage={pages} />)) : ''}
      {n.length > 5 ? (<p className={cn(`text-${colorScheme}-400`)}>...</p>) : ''}
      {n.length > 5 ? nRight.map((p, idx) => (<BtnPage setCurrentPage={setCurrentPage} colorScheme={colorScheme} onChangePage={onChangePage} page={p} currentPage={currentPage} key={idx} maxPage={pages} />)) : ''}
      <BtnPage setCurrentPage={setCurrentPage} colorScheme={colorScheme} onChangePage={onChangePage} currentPage={currentPage} btntype="page" maxPage={pages} btnNext />
    </div>
  )
}