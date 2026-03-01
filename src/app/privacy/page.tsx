import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — TasteReview',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-8">
        <div>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Torna alla home
          </Link>
          <h1 className="text-3xl font-bold mt-4">Privacy Policy</h1>
          <p className="text-muted-foreground mt-1">
            Ultimo aggiornamento: 1 marzo 2026
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-6 text-sm leading-relaxed text-foreground/90">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              1. Titolare del trattamento
            </h2>
            <p>
              Il Titolare del trattamento dei dati è{' '}
              <strong>Miral Media di Aggio Filippo</strong>, P.IVA
              IT04901620262.
            </p>
            <p>
              Per qualsiasi comunicazione relativa al trattamento dei dati
              personali è possibile contattarci all&apos;indirizzo email:{' '}
              <strong>[EMAIL]</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              2. Dati raccolti
            </h2>
            <h3 className="text-base font-medium text-foreground">
              2.1 Titolari di ristoranti (utenti registrati)
            </h3>
            <p>
              Al momento della registrazione e dell&apos;utilizzo del servizio
              raccogliamo:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Indirizzo email e password (criptata)</li>
              <li>
                Nome del ristorante e informazioni inserite nelle impostazioni
              </li>
              <li>
                Link ai profili social e piattaforme di recensioni configurati
              </li>
              <li>Dati di fatturazione gestiti tramite Stripe</li>
            </ul>

            <h3 className="text-base font-medium text-foreground">
              2.2 Clienti dei ristoranti (utenti non registrati)
            </h3>
            <p>
              I clienti che compilano i moduli di feedback non devono registrarsi
              né fornire dati identificativi. Raccogliamo esclusivamente:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Le risposte al modulo di feedback (sentiment, valutazioni,
                risposte testuali)
              </li>
              <li>
                Identificativo del tavolo (se il QR code è associato a un
                tavolo)
              </li>
              <li>Data e ora della compilazione</li>
            </ul>
            <p>
              Non raccogliamo nomi, email, indirizzi IP né altri dati
              identificativi dei clienti.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              3. Finalità del trattamento
            </h2>
            <p>I dati personali sono trattati per le seguenti finalità:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Erogazione del servizio (creazione account, gestione moduli,
                raccolta feedback)
              </li>
              <li>Gestione dell&apos;abbonamento e dei pagamenti</li>
              <li>
                Comunicazioni di servizio (es. notifiche relative
                all&apos;account)
              </li>
              <li>Adempimento di obblighi di legge</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              4. Base giuridica
            </h2>
            <p>Il trattamento si fonda su:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Esecuzione del contratto</strong> (Art. 6.1.b GDPR) —
                per l&apos;erogazione del servizio
              </li>
              <li>
                <strong>Obbligo legale</strong> (Art. 6.1.c GDPR) — per gli
                obblighi fiscali e contabili
              </li>
              <li>
                <strong>Legittimo interesse</strong> (Art. 6.1.f GDPR) — per la
                sicurezza e il miglioramento del servizio
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              5. Condivisione dei dati
            </h2>
            <p>
              I dati possono essere condivisi con i seguenti soggetti terzi,
              esclusivamente per le finalità indicate:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Supabase Inc.</strong> — hosting del database e
                autenticazione (server EU)
              </li>
              <li>
                <strong>Stripe Inc.</strong> — gestione pagamenti e
                abbonamenti
              </li>
              <li>
                <strong>Vercel Inc.</strong> — hosting dell&apos;applicazione
              </li>
            </ul>
            <p>Non vendiamo né cediamo dati personali a terzi.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              6. Cookie
            </h2>
            <p>
              TasteReview utilizza esclusivamente{' '}
              <strong>cookie tecnici necessari</strong> al funzionamento del
              servizio (autenticazione e gestione della sessione). Questi cookie
              non richiedono il consenso ai sensi dell&apos;Art. 5.3 della
              Direttiva ePrivacy, in quanto strettamente necessari.
            </p>
            <p>
              Non utilizziamo cookie di profilazione, analytics o di marketing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              7. Conservazione dei dati
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Dati account:</strong> conservati per tutta la durata del
                rapporto contrattuale e per i successivi 10 anni per obblighi
                fiscali
              </li>
              <li>
                <strong>Dati feedback:</strong> conservati per tutta la durata
                dell&apos;account del ristorante. Alla cancellazione
                dell&apos;account, i dati vengono eliminati entro 30 giorni
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              8. Diritti dell&apos;interessato
            </h2>
            <p>
              Ai sensi degli Artt. 15-22 del GDPR, l&apos;interessato ha il
              diritto di:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Accedere ai propri dati personali</li>
              <li>Richiederne la rettifica o la cancellazione</li>
              <li>Limitare od opporsi al trattamento</li>
              <li>Richiedere la portabilità dei dati</li>
              <li>
                Proporre reclamo al Garante per la Protezione dei Dati Personali
                (
                <a
                  href="https://www.garanteprivacy.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  www.garanteprivacy.it
                </a>
                )
              </li>
            </ul>
            <p>
              Per esercitare i propri diritti, scrivere a{' '}
              <strong>[EMAIL]</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              9. Modifiche alla presente policy
            </h2>
            <p>
              Ci riserviamo il diritto di aggiornare questa Privacy Policy. Le
              modifiche significative saranno comunicate tramite il sito o via
              email. L&apos;utilizzo continuato del servizio dopo la
              pubblicazione delle modifiche implica l&apos;accettazione delle
              stesse.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
