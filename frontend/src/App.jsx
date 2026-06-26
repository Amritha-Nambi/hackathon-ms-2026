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
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Sales Call Summary Generator</h1>
        <p className="text-sm" style={{color:'var(--muted)'}}>Turn transcripts into CRM-ready summaries in seconds.</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="card p-5 rounded-lg shadow-sm">
          <h2 className="font-medium mb-2">Call Transcript</h2>
          <div className="mb-3 text-sm" style={{color:'var(--muted)'}}>Paste the call transcript or upload a text file. Transcripts are processed in-session only and never stored.</div>

          <textarea value={transcript} onChange={e=> setTranscript(e.target.value)} rows={14} className="w-full p-3 border rounded-md mb-3" />

          <div className="flex items-center gap-3">
            <button onClick={generate} disabled={loading} className="px-4 py-2 rounded-md text-white" style={{background:'var(--primary)'}}>{loading? 'Processing…':'Generate summary'}</button>
            <button onClick={reset} className="px-3 py-2 rounded-md border" style={{borderColor:'var(--divider)'}}>Reset input</button>
            <div className="ml-auto flex items-center gap-2 text-sm" style={{color:'var(--muted)'}}>
              <input ref={fileRef} type="file" accept=".txt" onChange={handleFile} className="hidden" />
              <button onClick={()=> fileRef.current?.click()} className="px-3 py-1 rounded bg-white border" style={{borderColor:'var(--divider)'}}>Upload transcript</button>
              <span className="text-xs">(.txt)</span>
            </div>
          </div>

          <div className="mt-3 text-xs" style={{color:'var(--muted)'}}>Transcripts are processed in-session only and never stored.</div>
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        </section>

        <section id="outputPanel" className={`p-5 rounded-lg ${!result? 'hidden':''}`}>
          <div className="card p-4 rounded mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Summary</h3>
                <p id="summaryText" className="text-sm" style={{color:'var(--muted)'}}>{result?.summary || ''}</p>
              </div>
              <div className="text-sm" style={{textAlign:'right'}}>
                <div style={{color: result?.follow_up_needed ? 'var(--success)' : 'var(--muted)'}}>
                  Follow-up: {result?.follow_up_needed ? 'Yes' : 'No'}
                </div>
                <div style={{color:'var(--muted)'}}>{result?.caller_name ? `Caller: ${result.caller_name}` : ''}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="card p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><span>📋</span><h4 className="font-medium">Key Discussion Points</h4></div>
                <button className="px-2 py-1 text-sm rounded border" onClick={()=> copyArray(result?.key_points)}>Copy</button>
              </div>
              <ul className="list-disc pl-5 text-sm" style={{color:'var(--muted)'}}>
                { (result?.key_points && result.key_points.length>0) ? result.key_points.map((k,i)=>(<li key={i}>{k}</li>)) : <li>(none)</li> }
              </ul>
            </div>

            <div className="card p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><span>🎯</span><h4 className="font-medium">Customer Needs</h4></div>
                <button className="px-2 py-1 text-sm rounded border" onClick={()=> copyArray(result?.customer_needs || result?.key_points)}>Copy</button>
              </div>
              <ul className="list-disc pl-5 text-sm" style={{color:'var(--muted)'}}>
                { (result?.customer_needs && result.customer_needs.length>0) ? result.customer_needs.map((k,i)=>(<li key={i}>{k}</li>)) : (result?.key_points && result.key_points.length>0) ? result.key_points.map((k,i)=>(<li key={i}>{k}</li>)) : <li>(none)</li> }
              </ul>
            </div>

            <div className="card p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><span>✅</span><h4 className="font-medium">Next Actions</h4></div>
                <button className="px-2 py-1 text-sm rounded border" onClick={()=> copyArray(result?.action_items)}>Copy</button>
              </div>
              <ul className="list-disc pl-5 text-sm" style={{color:'var(--muted)'}}>
                { (result?.action_items && result.action_items.length>0) ? result.action_items.map((k,i)=>(<li key={i}>{k}</li>)) : <li>(none)</li> }
              </ul>
            </div>

            <div className="card p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><span>💬</span><h4 className="font-medium">Sentiment</h4></div>
                <div className="text-sm" style={{color: result?.sentiment === 'positive' ? 'var(--success)' : 'var(--muted)'}}>{result?.sentiment || 'neutral'}</div>
              </div>
              <div className="text-sm" style={{color:'var(--muted)'}}>Overall tone of the call.</div>
            </div>

            <div className="card p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><span>🧾</span><h4 className="font-medium">Call Metadata</h4></div>
              </div>
              <ul className="text-sm" style={{color:'var(--muted)'}}>
                <li>{result?.caller_name ? `Caller: ${result.caller_name}` : 'Caller: (unknown)'}</li>
                <li>{result?.phone_number ? `Phone: ${result.phone_number}` : 'Phone: (redacted)'}</li>
                <li>{result?.call_date ? `Date: ${result.call_date}` : 'Date: (unknown)'}</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded shadow text-center">
            <div className="mb-3">⏳ Processing…</div>
            <div className="text-sm" style={{color:'var(--muted)'}}>This app calls a backend API at <code>{API_URL}</code>. In production, use a server-side proxy for API keys.</div>
          </div>
        </div>
      )}
    </div>
  )
}
