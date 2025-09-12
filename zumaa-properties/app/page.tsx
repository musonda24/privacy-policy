"use client"

import { useMemo, useState } from 'react'

type LocationKey = 'Namayani' | 'Lusaka West' | 'Chalala Shantumbu'
type PlotKey = '20×20' | '25×30' | '30×40' | '50×50'

type Step =
  | { kind: 'welcome' }
  | { kind: 'select_location'; location?: LocationKey }
  | { kind: 'select_plot'; location: LocationKey; plot?: PlotKey }
  | { kind: 'ask_book'; location: LocationKey; plot: PlotKey }
  | { kind: 'collect_details'; location: LocationKey; plot: PlotKey; want: boolean }
  | { kind: 'submitted'; id?: string }

const LOCATIONS: LocationKey[] = ['Namayani', 'Lusaka West', 'Chalala Shantumbu']
const PLOTS: { key: PlotKey; label: string; price: string }[] = [
  { key: '20×20', label: '20×20 (low cost)', price: 'K15,000 – K25,000' },
  { key: '25×30', label: '25×30 (medium)', price: 'K30,000 – K45,000' },
  { key: '30×40', label: '30×40 (high)', price: 'K60,000 – K90,000' },
  { key: '50×50', label: '50×50 (premium)', price: 'K120,000 – K180,000' },
]

export default function HomePage() {
  const [step, setStep] = useState<Step>({ kind: 'welcome' })
  const [location, setLocation] = useState<LocationKey | undefined>()
  const [plot, setPlot] = useState<PlotKey | undefined>()
  const [wantBook, setWantBook] = useState<boolean | undefined>()
  const [form, setForm] = useState({ name: '', phone: '', datetime: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const messages = useMemo(() => {
    const arr: Array<{ side: 'left' | 'right'; text: string }> = []
    arr.push({ side: 'left', text: 'Hello 👋, are you looking for land in Namayani, Lusaka West, or Chalala Shantumbu?' })
    if (location) arr.push({ side: 'right', text: location })
    if (location) arr.push({ side: 'left', text: 'What size of land are you interested in? (20×20, 25×30, 30×40, 50×50)' })
    if (plot) arr.push({ side: 'right', text: plot })
    if (location && plot) arr.push({ side: 'left', text: 'Would you like to book an appointment?' })
    if (wantBook !== undefined) arr.push({ side: 'right', text: wantBook ? 'Yes' : 'No' })
    return arr
  }, [location, plot, wantBook])

  const canSubmit = useMemo(() => {
    return form.name.trim() && form.phone.trim() && form.datetime.trim()
  }, [form])

  const onSubmit = async () => {
    try {
      setSubmitting(true)
      setError(undefined)
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          datetime: form.datetime,
          location,
          plot,
        }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      const data = await res.json()
      setStep({ kind: 'submitted', id: data.id })
    } catch (e: any) {
      setError(e?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-md min-h-screen bg-white sm:rounded-2xl sm:shadow-sm sm:my-6">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b px-4 py-3 bg-white">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-brand" />
          <div>
            <p className="font-semibold">Zumaa properties</p>
            <p className="text-xs text-slate-500">Green & white • Real estate</p>
          </div>
        </div>
        <a href="#chat" className="inline-flex items-center rounded-full bg-brand px-3 py-1 text-white text-sm">Chat Now</a>
      </header>

      <section id="chat" className="px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.side === 'left' ? 'justify-start' : 'justify-end'}`}>
            <div className={`bubble ${m.side === 'left' ? 'bubble-left' : 'bubble-right'}`}>{m.text}</div>
          </div>
        ))}

        {/* Location selection */}
        {!location && (
          <div className="grid grid-cols-1 gap-2">
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm hover:border-brand"
                onClick={() => {
                  setLocation(loc)
                  setStep({ kind: 'select_plot', location: loc })
                }}
              >
                {loc}
              </button>
            ))}
          </div>
        )}

        {/* Plot selection */}
        {location && !plot && (
          <div className="space-y-2">
            {PLOTS.map((p) => (
              <button
                key={p.key}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm hover:border-brand"
                onClick={() => {
                  setPlot(p.key)
                  setStep({ kind: 'ask_book', location: location!, plot: p.key })
                }}
              >
                <div className="font-medium">{p.label}</div>
                <div className="text-xs text-slate-500">{p.price}</div>
              </button>
            ))}
          </div>
        )}

        {/* Ask to book */}
        {location && plot && wantBook === undefined && (
          <div className="flex gap-2">
            <button
              className="flex-1 rounded-xl bg-brand px-4 py-3 text-white text-sm"
              onClick={() => {
                setWantBook(true)
                setStep({ kind: 'collect_details', location: location!, plot: plot!, want: true })
              }}
            >
              Yes, book
            </button>
            <button
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
              onClick={() => {
                setWantBook(false)
                setStep({ kind: 'submitted' })
              }}
            >
              No, thanks
            </button>
          </div>
        )}

        {/* Details form */}
        {wantBook && step.kind === 'collect_details' && (
          <div className="space-y-3">
            <div className="grid gap-2">
              <label className="text-xs text-slate-600">Name</label>
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs text-slate-600">Phone (WhatsApp preferred)</label>
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. +2609xxxxxxx"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs text-slate-600">Preferred date & time</label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={form.datetime}
                onChange={(e) => setForm({ ...form, datetime: e.target.value })}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              className="w-full rounded-xl bg-brand px-4 py-3 text-white text-sm disabled:opacity-60"
              disabled={!canSubmit || submitting}
              onClick={onSubmit}
            >
              {submitting ? 'Submitting…' : 'Submit appointment'}
            </button>
          </div>
        )}

        {step.kind === 'submitted' && (
          <div className="bubble bubble-left">
            {wantBook === false
              ? 'Thanks for exploring our listings! Reach out anytime.'
              : 'Thank you! Your appointment request has been received. We will confirm shortly.'}
          </div>
        )}
      </section>

      <footer className="px-4 py-6 text-center text-xs text-slate-500">© {new Date().getFullYear()} Zumaa properties</footer>
    </main>
  )
}

