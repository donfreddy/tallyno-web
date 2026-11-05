import type { ExpenseRecap, GroupRecap } from '~/types/summary'

/**
 * Fetches recaps through this app's server (server/api), which filters them
 * by token level. Error statuses: 410 expired, 404 unknown, 502 API down.
 */
export function useSummary() {
  const getExpenseSummary = (token: string, viewerName?: string | null) =>
    $fetch<ExpenseRecap>(`/api/summary/${token}`, { query: viewerName ? { viewerName } : undefined })

  const getGroupSummary = (token: string) => $fetch<GroupRecap>(`/api/groups/${token}`)

  return { getExpenseSummary, getGroupSummary }
}
