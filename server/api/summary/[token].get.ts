import type { PublicExpenseSummary } from '../../../app/types/summary'
import { isPlausibleToken, toExpenseRecap, upstreamError, upstreamStatus } from '../../utils/recap'

export default defineEventHandler(async (event) => {
  const { apiBase } = useRuntimeConfig()
  const token = getRouterParam(event, 'token')
  if (!isPlausibleToken(token)) throw createError({ statusCode: 404, statusMessage: 'Not Found' })

  const query = getQuery(event)
  const viewerName = typeof query.viewerName === 'string' && query.viewerName ? query.viewerName.slice(0, 80) : null
  const url = `${apiBase}/api/v1/public/summary/${encodeURIComponent(token)}`

  try {
    const raw = await $fetch<PublicExpenseSummary>(url, { query: viewerName ? { viewerName } : undefined })
    return toExpenseRecap(raw)
  }
  catch (e) {
    // Unknown name on a PRIVATE link: hand back the list so the page can ask again.
    if (viewerName && upstreamStatus(e) === 400) {
      try {
        return toExpenseRecap(await $fetch<PublicExpenseSummary>(url), true)
      }
      catch (retry) {
        throw createError(upstreamError(retry))
      }
    }
    throw createError(upstreamError(e))
  }
})
