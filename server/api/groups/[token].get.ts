import type { PublicGroupSummary } from '../../../app/types/summary'
import { isPlausibleToken, toGroupRecap, upstreamError } from '../../utils/recap'

export default defineEventHandler(async (event) => {
  const { apiBase } = useRuntimeConfig()
  const token = getRouterParam(event, 'token')
  if (!isPlausibleToken(token)) throw createError({ statusCode: 404, statusMessage: 'Not Found' })

  try {
    const raw = await $fetch<PublicGroupSummary>(`${apiBase}/api/v1/public/groups/${encodeURIComponent(token)}`)
    return toGroupRecap(raw)
  }
  catch (e) {
    throw createError(upstreamError(e))
  }
})
