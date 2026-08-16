import type { PublicExpenseSummary } from '~/types/summary'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getRouterParam(event, 'token')!
  const query = getQuery(event)

  const params = new URLSearchParams()
  if (typeof query.viewerName === 'string' && query.viewerName) {
    params.set('viewerName', query.viewerName)
  }
  const qs = params.toString()

  try {
    return await $fetch<PublicExpenseSummary>(
      `${config.apiBase}/api/v1/public/summary/${token}${qs ? `?${qs}` : ''}`,
    )
  } catch (e) {
    if (e instanceof Error && 'response' in e && (e as { response: { status: number } }).response?.status) {
      const status = (e as { response: { status: number } }).response.status
      throw createError({ statusCode: status, statusMessage: (e as Error).message })
    }
    throw createError({ statusCode: 502, statusMessage: 'API unreachable' })
  }
})
