import React, { useState, useMemo } from 'react';
import { Search, Calendar } from 'lucide-react';

// Hilfsfunktionen für vollautomatische, relative Datumsberechnung
function getRelativeDateString(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

function getRelativeDateFormatted(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

// Spieldaten mit relativen Tages-Offsets (0 = Heute, 1 = Morgen, usw.)
const MATCHES_DATA = [
  {
    id: 'm1',
    offset: 0, // Immer "Heute"
    time: '19:00',
    competition: '3. Liga',
    flag: '🇩🇪',
    isGerman: true,
    homeTeam: 'Dynamo Dresden',
    awayTeam: 'Arminia Bielefeld',
    tvChannels: [
      { name: 'MagentaSport', hd: false, konferenz: false },
      { name: 'MagentaSport HD', hd: true, konferenz: false }
    ],
    streams: [{ name: 'MagentaSport App' }]
  },
  {
    id: 'm2',
    offset: 0, // Immer "Heute"
    time: '20:00',
    competition: 'Regionalliga Nord',
    flag: '🇩🇪',
    isGerman: true,
    homeTeam: 'VfB Lübeck',
    awayTeam: 'SV Drochtersen/Assel',
    tvChannels: [],
    streams: [{ name: 'NordFV TV' }]
  },
  {
    id: 'm3',
    offset: 0, // Immer "Heute"
    time: '21:00',
    competition: 'UEFA Champions League',
    flag: '🇪🇺',
    isGerman: true,
    homeTeam: 'FC Bayern München',
    awayTeam: 'Paris Saint-Germain',
    tvChannels: [
      { name: 'Sky Sport Austria 1', hd: false, konferenz: true },
      { name: 'Sky Sport Austria 1 HD', hd: true, konferenz: true }
    ],
    streams: [{ name: 'Sky Go' }, { name: 'WOW' }]
  },
  {
    id: 'm4',
    offset: 1, // Immer "Morgen"
    time: '19:00',
    competition: '3. Liga',
    flag: '🇩🇪',
    isGerman: true,
    homeTeam: 'Rot-Weiss Essen',
    awayTeam: 'Hansa Rostock',
    tvChannels: [
      { name: 'MagentaSport', hd: false, konferenz: false },
      { name: 'NDR Fernsehen', hd: true, konferenz: false }
    ],
    streams: [{ name: 'MagentaSport App' }, { name: 'NDR.de Livestream' }]
  },
  {
    id: 'm5',
    offset: 3, // In 3 Tagen (fällt in die nächsten 7 Tage)
    time: '20:45',
    competition: 'UEFA Nations League',
    flag: '🇪🇺',
    isGerman: true,
    homeTeam: 'Deutschland',
    awayTeam: 'Niederlande',
    tvChannels: [
      { name: 'RTL Fernsehen', hd: false, konferenz: false },
      { name: 'RTL HD', hd: true, konferenz: false }
    ],
    streams: [{ name: 'RTL+' }]
  },
  {
    id: 'm6',
    offset: 5, // In 5 Tagen (fällt in die nächsten 7 Tage)
    time: '15:30',
    competition: '1. Bundesliga',
    flag: '🇩🇪',
    isGerman: true,
    homeTeam: 'Borussia Dortmund',
    awayTeam: 'RB Leipzig',
    tvChannels: [
      { name: 'Sky Sport Bundesliga 1', hd: false, konferenz: true },
      { name: 'Sky Sport Bundesliga 1 HD', hd: true, konferenz: true }
    ],
    streams: [{ name: 'Sky Go' }, { name: 'WOW' }]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('heute');
  const [onlyGerman, setOnlyGerman] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamischer tagesaktueller Abgleich der Spieldaten
  const matches = useMemo(() => {
    return MATCHES_DATA.map(m => ({
      ...m,
      date: getRelativeDateString(m.offset),
      dateFormatted: getRelativeDateFormatted(m.offset)
    }));
  }, []);

  const filteredMatches = useMemo(() => {
    const todayStr = getRelativeDateString(0);
    const tomorrowStr = getRelativeDateString(1);
    const in7DaysStr = getRelativeDateString(7);

    return matches.filter((match) => {
      // Frauen-Spiele strikt ausschließen
      const isWomenMatch = match.competition.toLowerCase().includes('frauen') || 
                           match.homeTeam.toLowerCase().includes('frauen') || 
                           match.awayTeam.toLowerCase().includes('frauen');
      if (isWomenMatch) return false;

      if (onlyGerman && !match.isGerman) return false;
      
      if (activeTab === 'heute') {
        if (match.date !== todayStr) return false;
      } else if (activeTab === 'morgen') {
        if (match.date !== tomorrowStr) return false;
      } else if (activeTab === 'naechste') {
        // Exklusiv ab morgen bis maximal in 7 Tagen
        if (match.date <= todayStr || match.date > in7DaysStr) return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTeam = match.homeTeam.toLowerCase().includes(q) || match.awayTeam.toLowerCase().includes(q);
        const matchComp = match.competition.toLowerCase().includes(q);
        if (!matchTeam && !matchComp) return false;
      }
      return true;
    });
  }, [matches, onlyGerman, activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-16">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1e2229] border-b border-slate-700 shadow-md">
        <div className="max-w-6xl mx-auto px-3 py-3 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          
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
            <button 
              onClick={() => setOnlyGerman(!onlyGerman)}
              className={`px-3 py-1.5 rounded text-xs font-bold border transition ${onlyGerman ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-[#262b35] border-slate-700 text-slate-300'}`}
            >
              🇩🇪 DE
            </button>
          </div>
        </div>
      </header>

      {/* Suche */}
      <div className="max-w-6xl mx-auto px-3 mt-3">
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

      {/* Matrix-Tabelle */}
      <main className="max-w-6xl mx-auto px-3 mt-3">
        {filteredMatches.length === 0 ? (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg p-10 text-center text-slate-400 text-xs">
            Keine Spiele für diesen Filterzeitraum gefunden.
          </div>
        ) : (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-[#262b35] border-b border-slate-700 text-[11px] font-extrabold uppercase text-amber-400 tracking-wider">
                  <th className="py-3 px-3.5 w-28">Datum & Zeit</th>
                  <th className="py-3 px-3.5 w-44">Liga</th>
                  <th className="py-3 px-3.5 w-60">Mannschaften</th>
                  <th className="py-3 px-3.5">TV & HD-TV</th>
                  <th className="py-3 px-3.5 w-48">Live Streams</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {filteredMatches.map((match) => (
                  <tr key={match.id} className="hover:bg-slate-800/40 transition align-top">
                    
                    {/* Datum & Uhrzeit */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap bg-[#171a20]">
                      <div className="font-bold text-amber-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {match.dateFormatted}
                      </div>
                      <div className="text-slate-300 font-semibold mt-1 ml-5">
                        {match.time} Uhr
                      </div>
                    </td>

                    {/* Liga */}
                    <td className="py-3.5 px-3.5 font-medium text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{match.flag}</span>
                        <span className="font-semibold">{match.competition}</span>
                      </div>
                    </td>

                    {/* Mannschaften (Sauber getrennt mit 'vs') */}
                    <td className="py-3.5 px-3.5 font-bold text-white">
                      <div className="flex flex-col space-y-1 my-1">
                        <div className="text-slate-100">{match.homeTeam}</div>
                        <div className="text-amber-400 text-[10px] font-black tracking-widest uppercase px-1">vs</div>
                        <div className="text-slate-100">{match.awayTeam}</div>
                      </div>
                    </td>

                    {/* TV / HD-TV Angebote (Untereinander gestapelt) */}
                    <td className="py-3.5 px-3.5">
                      <div className="flex flex-col space-y-2 my-1">
                        {match.tvChannels.length === 0 ? (
                          <span className="text-slate-500 italic">Keine TV-Daten</span>
                        ) : (
                          match.tvChannels.map((c, i) => (
                            <div 
                              key={i} 
                              className={`font-black text-[11px] px-3 py-1.5 rounded shadow-sm inline-flex items-center justify-between gap-2 w-full max-w-xs ${
                                c.hd ? 'bg-slate-200 text-slate-900 border border-slate-300' : 'bg-[#facc15] text-slate-950'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {c.hd && <span className="text-[9px] bg-slate-900 text-white px-1 py-0.5 rounded shrink-0 font-bold">HD</span>}
                                <span className="truncate">{c.name}</span>
                              </div>
                              {c.konferenz && (
                                <span className="bg-slate-950 text-white w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px] font-bold shrink-0" title="Konferenz verfügbar">
                                  K
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </td>

                    {/* Live Streams (Untereinander gestapelt) */}
                    <td className="py-3.5 px-3.5">
                      <div className="flex flex-col space-y-2 my-1">
                        {match.streams.map((s, i) => (
                          <div key={i} className="bg-sky-500 text-slate-950 font-black text-[11px] px-3 py-1.5 rounded shadow-sm w-full max-w-[180px] truncate">
                            {s.name}
                          </div>
                        ))}
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
