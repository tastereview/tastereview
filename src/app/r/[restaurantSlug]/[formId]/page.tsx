import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{
    restaurantSlug: string
    formId: string
  }>
  searchParams: Promise<{ t?: string; preview?: string }>
}

export default async function FeedbackRedirectPage({ params, searchParams }: Props) {
  const { restaurantSlug, formId } = await params
  const { t, preview } = await searchParams
  const queryParts: string[] = []
  if (t) queryParts.push(`t=${encodeURIComponent(t)}`)
  if (preview) queryParts.push(`preview=${encodeURIComponent(preview)}`)
  const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : ''
  redirect(`/r/${restaurantSlug}/${formId}/1${query}`)
}
