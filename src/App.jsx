import React, { useState, useEffect, useMemo } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('heute');
  const [onlyGerman, setOnlyGerman] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Direktes Laden und Parsen im Frontend über CORS-Proxy
  useEffect(() => {
    async function fetchMatchesDirectly() {
      setLoading(true);
      try {
        let endpoint = 'https://fussballgucken.info/fussball-heute';
        if (activeTab === 'morgen') endpoint = 'https://fussballgucken.info/fussball-morgen';
        if (activeTab === 'naechste') endpoint = 'https://fussballgucken.info/fussball-alle-termine';

        // Wir nutzen AllOrigins als Proxy, um CORS-Beschränkungen des Browsers zu umgehen
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(endpoint)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();

        if (!data.contents) {
          setMatches([]);
          setLoading(false);
          return;
        }

        // HTML im Browser parsen
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        const rows = doc.querySelectorAll('tr');
        const parsedMatches = [];

        rows.forEach((row) => {
          const text = row.textContent.replace(/\s+/g, ' ').trim();

          // Uhrzeit finden
          const timeMatch = text.match(/(\d{2}:\d{2})/);
          if (!timeMatch) return;

          // Datum finden
          const dateMatch = text.match(/([Mo|Di|Mi|Do|Fr|Sa|So],\s*\d{2}\.\d{2}\.?)/i);

          // Teams finden
          const teamLinks = row.querySelectorAll('a[href*="/mannschaft/"], a[href*="/verein/"], a[href*="/team/"]');
          let home = '';
          let away = '';

          if (teamLinks.length >= 2) {
            home = teamLinks[0].textContent.trim();
            away = teamLinks[1].textContent.trim();
          } else {
            const parts = text.split(timeMatch[1]);
            if (parts[1]) {
              const vsSplit = parts[1].split(/\s*-\s*|\s*vs\.?\s*/i);
              if (vsSplit.length >= 2) {
                home = vsSplit[0].trim();
                away = vsSplit[1].trim();
              }
            }
          }

          if (!home || !away) return;

          // Wettbewerb
          const compEl = row.querySelector('a[href*="/wettbewerb/"]');
          const competition = compEl ? compEl.textContent.trim() : 'Fußball Live';

          // TV & Streams
          const tvChannels = [];
          const hdChannels = [];
          const streams = [];

          row.querySelectorAll('a, span').forEach((el) => {
            const val = el.textContent.trim();
            const lower = val.toLowerCase();
            if (!val || val.length > 30) return;

            if (lower.includes('rtl+') || lower.includes('stream') || lower.includes('dazn app') || lower.includes('joyn')) {
              if (!streams.some(s => s.name === val)) streams.push({ name: val });
            } else if (lower.includes('hd')) {
              if (!hdChannels.some(h => h.name === val)) hdChannels.push({ name: val, free: lower.includes('free') });
            } else if (lower.includes('rtl') || lower.includes('sky') || lower.includes('zdf') || lower.includes('ard') || lower.includes('sat.1')) {
              if (!tvChannels.some(t => t.name === val)) tvChannels.push({ name: val, free: lower.includes('free') });
            }
          });

          let displayDate = dateMatch ? dateMatch[1] : (activeTab === 'heute' ? 'Heute' : (activeTab === 'morgen' ? 'Morgen' : 'Vorschau'));

          parsedMatches.push({
            id: Math.random().toString(36).substring(2, 9),
            date: displayDate,
            time: timeMatch[1],
            homeTeam: home,
            awayTeam: away,
            competition: competition,
            flag: '⚽',
            isGerman: true,
            tvChannels,
            hdChannels,
            streams
          });
        });

        setMatches(parsedMatches);
      } catch (error) {
        console.error('Fehler beim Laden der Spieldaten:', error);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMatchesDirectly();
  }, [activeTab]);

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTeam = (match.homeTeam || '').toLowerCase().includes(q) || (match.awayTeam || '').toLowerCase().includes(q);
        const matchComp = (match.competition || '').toLowerCase().includes(q);
        if (!matchTeam && !matchComp) return false;
      }
      return true;
    });
  }, [matches, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-16">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1e2229] border-b border-slate-700 shadow-md">
        <div className="max-w-7xl mx-auto px-3 py-3 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black px-3 py-1.5 rounded uppercase tracking-tighter text-sm italic shadow flex items-center shrink-0">
            FUSSBALL<span className="text-cyan-300 ml-0.5">GUCKEN</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button 
              onClick={() => setActiveTab('heute')}
              className={`px-3 py-1.5 rounded text-xs font-bold border transition ${activeTab === 'heute' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-[#262b35] border-slate-700 text-slate-300'}`}
            >
              Heute
            </button>
            <button 
              onClick={() => setActiveTab('morgen')}
              className={`px-3 py-1.5 rounded text-xs font-bold border transition ${activeTab === 'morgen' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-[#262b35] border-slate-700 text-slate-300'}`}
            >
              Morgen
            </button>
            <button 
              onClick={() => setActiveTab('naechste')}
              className={`px-3 py-1.5 rounded text-xs font-bold border transition ${activeTab === 'naechste' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-[#262b35] border-slate-700 text-slate-300'}`}
            >
              Nächste 7 Tage
            </button>
          </div>
        </div>
      </header>

      {/* Suche */}
      <div className="max-w-7xl mx-auto px-3 mt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Team oder Liga suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e2229] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Tabelle */}
      <main className="max-w-7xl mx-auto px-3 mt-3">
        {loading ? (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            <span>Lade Live-Spieldaten...</span>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg p-10 text-center text-slate-400 text-xs">
            Keine Spiele gefunden.
          </div>
        ) : (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-[#262b35] border-b border-slate-700 text-[11px] font-extrabold uppercase text-amber-400 tracking-wider">
                  <th className="py-3 px-3 w-28">Datum</th>
                  <th className="py-3 px-3 w-24">Uhrzeit</th>
                  <th className="py-3 px-3 w-44">Liga / Pokal</th>
                  <th className="py-3 px-3 w-56">Mannschaften</th>
                  <th className="py-3 px-3">TV & HD-TV</th>
                  <th className="py-3 px-3 w-52">Internet (Livestreams)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {filteredMatches.map((match) => (
                  <tr key={match.id} className="hover:bg-slate-800/40 transition align-top">
                    <td className="py-3.5 px-3 whitespace-nowrap bg-[#171a20] font-semibold text-slate-300">
                      {match.date || 'Heute'}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap bg-[#171a20] font-bold text-amber-400">
                      {match.time} Uhr
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{match.flag}</span>
                        <span className="font-semibold truncate">{match.competition}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white">
                      <div className="flex flex-col space-y-1 my-1">
                        <div className="text-slate-100">{match.homeTeam}</div>
                        <div className="text-amber-400 text-[10px] font-black tracking-widest uppercase">vs</div>
                        <div className="text-slate-100">{match.awayTeam}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col space-y-1.5 my-1">
                        {match.tvChannels.map((c, i) => (
                          <div key={`tv-${i}`} className="bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded shadow-sm inline-flex items-center justify-between max-w-[200px]">
                            <span className="truncate">{c.name}</span>
                            {c.free && <span className="text-[9px] bg-red-600 text-white px-1 rounded ml-1 font-bold">FREE</span>}
                          </div>
                        ))}
                        {match.hdChannels.map((c, i) => (
                          <div key={`hd-${i}`} className="bg-slate-200 text-slate-900 border border-slate-300 font-black text-[11px] px-2.5 py-1 rounded shadow-sm inline-flex items-center justify-between max-w-[200px]">
                            <div className="flex items-center gap-1.5 overflow-hidden">
                              <span className="text-[9px] bg-slate-900 text-white px-1 rounded shrink-0">HD</span>
                              <span className="truncate">{c.name}</span>
                            </div>
                            {c.free && <span className="text-[9px] bg-red-600 text-white px-1 rounded ml-1 font-bold">FREE</span>}
                          </div>
                        ))}
                        {(!match.tvChannels.length && !match.hdChannels.length) && <span className="text-slate-500 italic text-[11px]">-</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col space-y-1.5 my-1">
                        {match.streams.map((s, i) => (
                          <div key={i} className="bg-sky-500 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded shadow-sm max-w-[180px] truncate">
                            {s.name}
                          </div>
                        ))}
                        {!match.streams.length && <span className="text-slate-500 italic text-[11px]">-</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
