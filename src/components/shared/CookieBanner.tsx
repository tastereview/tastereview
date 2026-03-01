'use client'

import CookieConsent from 'react-cookie-consent'
import Link from 'next/link'

export function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Ho capito"
      cookieName="5stelle_cookie_consent"
      contentStyle={{ flex: 1, margin: 0 }}
      style={{
        background: 'hsl(var(--card) / 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: 'hsl(var(--card-foreground))',
        borderTop: '2px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.1)',
        padding: '12px 24px',
        alignItems: 'center',
        flexWrap: 'nowrap',
        fontSize: '14px',
      }}
      buttonStyle={{
        background: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        borderRadius: '8px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
      expires={365}
    >
      Questo sito usa cookie tecnici.{' '}
      <Link href="/privacy" className="underline hover:no-underline">
        Maggiori informazioni
      </Link>
    </CookieConsent>
  )
}
