import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{
    restaurantSlug: string
    formId: string
  }>
  searchParams: Promise<{ t?: string }>
}

export default async function FeedbackRedirectPage({ params, searchParams }: Props) {
  const { restaurantSlug, formId } = await params
  const { t } = await searchParams
  const query = t ? `?t=${encodeURIComponent(t)}` : ''
  redirect(`/r/${restaurantSlug}/${formId}/1${query}`)
}
