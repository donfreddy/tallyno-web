import type {
  PublicExpenseSummary,
  PublicGroupSummary,
} from '~/types/summary'

/**
 * Fetches the public (token-only) summaries through the Nitro proxy.
 * The token is the authorization; no session is required.
 *
 * Error status codes are preserved:
 *  - 410 Gone  → token expired or revoked
 *  - 404       → unknown token / wrong scope
 *  - 400       → viewerName unknown for a PRIVATE token
 */
export function useSummary() {
  const getExpenseSummary = (
    token: string,
    viewerName?: string | null,
  ) => {
    const query = viewerName ? { viewerName } : undefined
    return $fetch<PublicExpenseSummary>(`/api/summary/${token}`, {
      query,
      server: true,
    })
  }

  const getGroupSummary = (token: string) => {
    return $fetch<PublicGroupSummary>(`/api/groups/${token}`, { server: true })
  }

  return { getExpenseSummary, getGroupSummary }
}
