import React, { useState, useRef } from 'react'

const SAMPLE_PLACEHOLDER = `Sarah: Hi, is this Mike Reyes?\nMike: Yeah, this is Mike.\nSarah: Hey Mike, this is Sarah Chen calling from NorthBridge IT Solutions... (see test case for full transcript)`

export default function App(){
  const [transcript, setTranscript] = useState(SAMPLE_PLACEHOLDER)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const fileRef = useRef()

  const API_URL = import.meta.env.VITE_API_URL || '/transcripts/summarize'

  function handleFile(e){
    const f = e.target.files && e.target.files[0]
    if(!f) return
    if(!f.name.endsWith('.txt')){ setError('Only .txt files are supported.'); return }
    const r = new FileReader()
    r.onload = ()=> setTranscript(r.result)
    r.readAsText(f)
  }

  function reset(){ setTranscript(''); setResult(null); setError(null) }

  async function generate(){
    setError(null)
    if(!transcript || !transcript.trim()){ setError('Please provide a transcript.'); return }
    setLoading(true)
    try{
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ transcript })
      })
      if(!resp.ok){ const t = await resp.text(); throw new Error(`API error: ${resp.status} ${t}`) }
      const json = await resp.json()
      setResult(json)
      // scroll output into view
      setTimeout(()=> document.getElementById('outputPanel')?.scrollIntoView({behavior:'smooth'}), 50)
    }catch(err){ setError(err.message || 'Unknown error') }
    setLoading(false)
  }

  function copyArray(arr){
    if(!arr || !arr.length) return
    navigator.clipboard.writeText(arr.join('\n')).catch(()=> setError('Copy failed'))
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,120,212,0.12),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#f3f2f1_100%)] px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                AI call insights
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Sales Call Summary Generator</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">Turn call transcripts into polished summaries, follow-up actions, and CRM-ready metadata in seconds.</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Works with your local FastAPI backend
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="card rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Call Transcript</h2>
                <p className="text-sm text-slate-600">Paste a transcript or upload a .txt file. Everything stays in-session.</p>
              </div>
              <div className="text-xs text-slate-500">Supports mobile and desktop editing</div>
            </div>

            <textarea value={transcript} onChange={e=> setTranscript(e.target.value)} rows={14} className="min-h-[280px] w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm shadow-inner outline-none ring-0 transition focus:border-blue-400 focus:bg-white" />

            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={generate} disabled={loading} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70" style={{background:'var(--primary)'}}>{loading? 'Processing…':'Generate summary'}</button>
                <button onClick={reset} className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">Reset input</button>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <input ref={fileRef} type="file" accept=".txt" onChange={handleFile} className="hidden" />
                <button onClick={()=> fileRef.current?.click()} className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-50">Upload transcript</button>
                <span className="text-xs text-slate-500">(.txt)</span>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-500">Transcripts are processed in-session only and never stored.</div>
            {error && <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          </section>

          <section id="outputPanel" className={`rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:p-4 ${!result ? 'hidden' : ''}`}>
            <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
                  <p id="summaryText" className="mt-1 text-sm leading-6 text-slate-600">{result?.summary || ''}</p>
                </div>
                <div className="text-sm text-slate-600 sm:text-right">
                  <div className="font-semibold" style={{color: result?.follow_up_needed ? 'var(--success)' : 'var(--muted)'}}>
                    Follow-up: {result?.follow_up_needed ? 'Yes' : 'No'}
                  </div>
                  <div className="mt-1 text-slate-500">{result?.caller_name ? `Caller: ${result.caller_name}` : ''}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="card rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2"><span>📋</span><h4 className="font-medium text-slate-900">Key Discussion Points</h4></div>
                  <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-sm text-slate-600" onClick={()=> copyArray(result?.key_points)}>Copy</button>
                </div>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                  { (result?.key_points && result.key_points.length>0) ? result.key_points.map((k,i)=>(<li key={i}>{k}</li>)) : <li>(none)</li> }
                </ul>
              </div>

              <div className="card rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2"><span>🎯</span><h4 className="font-medium text-slate-900">Customer Needs</h4></div>
                  <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-sm text-slate-600" onClick={()=> copyArray(result?.customer_needs || result?.key_points)}>Copy</button>
                </div>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                  { (result?.customer_needs && result.customer_needs.length>0) ? result.customer_needs.map((k,i)=>(<li key={i}>{k}</li>)) : (result?.key_points && result.key_points.length>0) ? result.key_points.map((k,i)=>(<li key={i}>{k}</li>)) : <li>(none)</li> }
                </ul>
              </div>

              <div className="card rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2"><span>✅</span><h4 className="font-medium text-slate-900">Next Actions</h4></div>
                  <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-sm text-slate-600" onClick={()=> copyArray(result?.action_items)}>Copy</button>
                </div>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                  { (result?.action_items && result.action_items.length>0) ? result.action_items.map((k,i)=>(<li key={i}>{k}</li>)) : <li>(none)</li> }
                </ul>
              </div>

              <div className="card rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2"><span>💬</span><h4 className="font-medium text-slate-900">Sentiment</h4></div>
                  <div className="text-sm font-medium" style={{color: result?.sentiment === 'positive' ? 'var(--success)' : 'var(--muted)'}}>{result?.sentiment || 'neutral'}</div>
                </div>
                <div className="text-sm text-slate-600">Overall tone of the call.</div>
              </div>

              <div className="card rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2"><span>🧾</span><h4 className="font-medium text-slate-900">Call Metadata</h4></div>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>{result?.caller_name ? `Caller: ${result.caller_name}` : 'Caller: (unknown)'}</li>
                  <li>{result?.phone_number ? `Phone: ${result.phone_number}` : 'Phone: (redacted)'}</li>
                  <li>{result?.call_date ? `Date: ${result.call_date}` : 'Date: (unknown)'}</li>
                </ul>
              </div>
            </div>
          </section>
        </main>

        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl">
              <div className="mb-3 text-2xl">⏳</div>
              <div className="font-semibold text-slate-900">Processing your transcript…</div>
              <div className="mt-2 text-sm text-slate-600">This app calls a backend API at <code>{API_URL}</code>. In production, use a server-side proxy for API keys.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
