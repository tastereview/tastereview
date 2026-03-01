import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) {
    // Turnstile not configured — skip verification gracefully
    return NextResponse.json({ success: true })
  }

  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      }
    )

    const data = await response.json()
    return NextResponse.json({ success: data.success })
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
