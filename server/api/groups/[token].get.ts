import type { PublicGroupSummary } from '~/types/summary'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getRouterParam(event, 'token')!

  try {
    return await $fetch<PublicGroupSummary>(
      `${config.apiBase}/api/v1/public/groups/${token}`,
    )
  } catch (e) {
    if (e instanceof Error && 'response' in e && (e as { response: { status: number } }).response?.status) {
      const status = (e as { response: { status: number } }).response.status
      throw createError({ statusCode: status, statusMessage: (e as Error).message })
    }
    throw createError({ statusCode: 502, statusMessage: 'API unreachable' })
  }
})
