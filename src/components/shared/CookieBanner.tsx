'use client'

import CookieConsent from 'react-cookie-consent'
import Link from 'next/link'

export function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Ho capito"
      cookieName="tastereview_cookie_consent"
      style={{
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        borderTop: '1px solid hsl(var(--border))',
        padding: '12px 24px',
        alignItems: 'center',
        fontSize: '14px',
      }}
      buttonStyle={{
        background: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        borderRadius: '6px',
        padding: '8px 20px',
        fontSize: '14px',
        fontWeight: 500,
      }}
      expires={365}
    >
      Questo sito utilizza solo cookie tecnici necessari al funzionamento del
      servizio.{' '}
      <Link href="/privacy" className="underline hover:no-underline">
        Maggiori informazioni
      </Link>
    </CookieConsent>
  )
}
