import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Termini di Servizio — TasteReview',
}

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold mt-4">Termini di Servizio</h1>
          <p className="text-muted-foreground mt-1">
            Ultimo aggiornamento: 1 marzo 2026
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-6 text-sm leading-relaxed text-foreground/90">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              1. Definizioni
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>&ldquo;Servizio&rdquo;</strong>: la piattaforma
                TasteReview, accessibile via web, che consente ai ristoratori di
                raccogliere feedback dai propri clienti tramite QR code.
              </li>
              <li>
                <strong>&ldquo;Fornitore&rdquo;</strong>: Miral Media di Aggio
                Filippo, P.IVA IT04901620262.
              </li>
              <li>
                <strong>&ldquo;Utente&rdquo;</strong>: il titolare o gestore del
                ristorante che si registra e utilizza il Servizio.
              </li>
              <li>
                <strong>&ldquo;Cliente finale&rdquo;</strong>: il cliente del
                ristorante che compila un modulo di feedback.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              2. Accettazione dei termini
            </h2>
            <p>
              Registrandosi e utilizzando il Servizio, l&apos;Utente accetta
              integralmente i presenti Termini di Servizio e la{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              . In caso di disaccordo, l&apos;Utente è tenuto a non utilizzare il
              Servizio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              3. Descrizione del servizio
            </h2>
            <p>TasteReview offre le seguenti funzionalità:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Creazione di moduli di feedback personalizzabili
              </li>
              <li>
                Generazione di QR code (generali e per singolo tavolo)
              </li>
              <li>
                Raccolta e visualizzazione dei feedback ricevuti
              </li>
              <li>
                Indirizzamento dei clienti soddisfatti verso le piattaforme di
                recensioni configurate dall&apos;Utente
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              4. Registrazione e account
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                L&apos;Utente deve fornire un indirizzo email valido e una
                password sicura
              </li>
              <li>
                L&apos;Utente è responsabile della riservatezza delle proprie
                credenziali
              </li>
              <li>
                Ogni account è personale e non cedibile a terzi
              </li>
              <li>
                Il Fornitore si riserva il diritto di sospendere o eliminare
                account che violino i presenti termini
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              5. Abbonamento e pagamenti
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Il Servizio prevede un periodo di prova gratuita di 7 giorni,
                senza obbligo di inserimento della carta di credito
              </li>
              <li>
                Al termine del periodo di prova, è necessario sottoscrivere un
                abbonamento al costo di <strong>€39/mese</strong> (IVA inclusa
                ove applicabile)
              </li>
              <li>
                I pagamenti sono gestiti tramite <strong>Stripe</strong>.
                Il Fornitore non memorizza i dati della carta di credito
              </li>
              <li>
                L&apos;abbonamento si rinnova automaticamente ogni mese. È
                possibile annullarlo in qualsiasi momento tramite il portale
                di gestione
              </li>
              <li>
                In caso di annullamento, il Servizio resta attivo fino alla fine
                del periodo già pagato
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              6. Obblighi dell&apos;utente
            </h2>
            <p>L&apos;Utente si impegna a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Utilizzare il Servizio in conformità alla legge e ai presenti
                termini
              </li>
              <li>
                Non utilizzare il Servizio per raccogliere dati personali
                identificativi dei clienti finali senza adeguata base giuridica
              </li>
              <li>
                Informare i propri clienti della raccolta di feedback
                (es. tramite informativa visibile nel locale)
              </li>
              <li>
                Non tentare di accedere in modo non autorizzato al Servizio o ai
                dati di altri utenti
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              7. Proprietà dei dati
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                I dati dei feedback appartengono all&apos;Utente (ristoratore)
              </li>
              <li>
                Il Fornitore non utilizza i dati dei feedback per finalità
                proprie, al di fuori dell&apos;erogazione del Servizio
              </li>
              <li>
                In caso di cancellazione dell&apos;account, i dati vengono
                eliminati entro 30 giorni
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              8. Limitazione di responsabilità
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Il Servizio è fornito &ldquo;così com&apos;è&rdquo;. Il
                Fornitore non garantisce l&apos;assenza di interruzioni o errori
              </li>
              <li>
                Il Fornitore non è responsabile per danni indiretti, perdite di
                profitto o danni derivanti dall&apos;utilizzo o
                dall&apos;impossibilità di utilizzare il Servizio
              </li>
              <li>
                La responsabilità complessiva del Fornitore è limitata
                all&apos;importo corrisposto dall&apos;Utente nei 12 mesi
                precedenti
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              9. Disponibilità del servizio
            </h2>
            <p>
              Il Fornitore si impegna a mantenere il Servizio disponibile ma non
              garantisce un uptime del 100%. Interventi di manutenzione
              programmata saranno comunicati con ragionevole anticipo ove
              possibile.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              10. Modifiche ai termini
            </h2>
            <p>
              Il Fornitore si riserva il diritto di modificare i presenti
              Termini. Le modifiche significative saranno comunicate via email o
              tramite avviso nel Servizio con almeno 15 giorni di preavviso.
              L&apos;utilizzo continuato del Servizio dopo tale periodo implica
              l&apos;accettazione dei nuovi termini.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              11. Recesso e cancellazione
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                L&apos;Utente può cancellare il proprio account in qualsiasi
                momento
              </li>
              <li>
                Il Fornitore può sospendere o cancellare un account in caso di
                violazione dei presenti termini, previo avviso ove possibile
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              12. Legge applicabile e foro competente
            </h2>
            <p>
              I presenti Termini sono regolati dalla legge italiana. Per
              qualsiasi controversia è competente in via esclusiva il Foro di
              Treviso.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              13. Contatti
            </h2>
            <p>
              Per domande o comunicazioni relative ai presenti Termini,
              scrivere a <strong>[EMAIL]</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
