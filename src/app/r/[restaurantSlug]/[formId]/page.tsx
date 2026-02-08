import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{
    restaurantSlug: string
    formId: string
  }>
}

export default async function FeedbackRedirectPage({ params }: Props) {
  const { restaurantSlug, formId } = await params
  redirect(`/r/${restaurantSlug}/${formId}/1`)
}
