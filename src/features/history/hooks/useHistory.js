import { useMemo, useState } from 'react'

export function useHistory(historyData, pageSize = 8) {
  const [search, setSearch] = useState('')
  const [filterRisk, setFilterRisk] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return historyData.filter(h => {
      const matchSearch = !search || 
        h.name.toLowerCase().includes(search.toLowerCase()) || 
        h.id.toLowerCase().includes(search.toLowerCase())
      const matchRisk = !filterRisk || h.riskLevel === filterRisk
      return matchSearch && matchRisk
    })
  }, [historyData, search, filterRisk])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  const resetFilters = () => {
    setSearch('')
    setFilterRisk('')
    setPage(1)
  }

  return {
    search,
    setSearch,
    filterRisk,
    setFilterRisk,
    page,
    setPage,
    paginated,
    totalPages,
    totalRecords: filtered.length,
    resetFilters
  }
}
