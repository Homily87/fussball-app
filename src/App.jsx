import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Loader2 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('heute');
  const [onlyGerman, setOnlyGerman] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveMatches() {
      setLoading(true);
      try {
        const currentYear = new Date().getFullYear();
        const leagues = [
          { shortcut: 'bl1', name: '1. Bundesliga', flag: '🇩🇪', isGerman: true },
          { shortcut: 'bl2', name: '2. Bundesliga', flag: '🇩🇪', isGerman: true },
          { shortcut: 'bl3', name: '3. Liga', flag: '🇩🇪', isGerman: true }
        ];

        let allFetchedMatches = [];

        for (const league of leagues) {
          try {
            const response = await fetch(`https://api.openligadb.de/getmatchdata/${league.shortcut}/${currentYear}`);
            const data = await response.json();

            if (Array.isArray(data)) {
              const formatted = data.map((m, index) => {
                const matchDate = new Date(m.matchDateTime);
                const dateString = matchDate.toISOString().split('T')[0];
                
                const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
                const dateFormatted = matchDate.toLocaleDateString('de-DE', options);
                const timeString = matchDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

                let tvChannels = ['Sky Sport Bundesliga'];
                let streamChannels = ['WOW'];

                if (league.shortcut === 'bl3') {
                  tvChannels = ['MagentaSport'];
                  streamChannels = ['NDR Live-Stream', 'WDR Stream'];
                } else if (league.shortcut === 'bl1' && index % 2 === 0) {
                  tvChannels = ['DAZN 1'];
                  streamChannels = ['DAZN App'];
                }

                return {
                  id: `${league.shortcut}-${m.matchID || index}`,
                  date: dateString,
                  dateFormatted: dateFormatted,
                  time: timeString,
                  homeTeam: m.team1.teamName,
                  awayTeam: m.team2.teamName,
                  competition: league.name,
                  flag: league.flag,
                  isGerman: league.isGerman,
                  tvChannels: tvChannels,
                  streamChannels: streamChannels
                };
              });

              allFetchedMatches = [...allFetchedMatches, ...formatted];
            }
          } catch (err) {
            console.error(`Fehler beim Laden von ${league.name}:`, err);
          }
        }

        if (allFetchedMatches.length > 0) {
          setMatches(allFetchedMatches);
        } else {
          setMatches(getFallbackMatches());
        }
      } catch (error) {
        console.error('API-Fehler, nutze Fallback:', error);
        setMatches(getFallbackMatches());
      } finally {
        setLoading(false);
      }
    }

    fetchLiveMatches();
  }, []);

  const getFallbackMatches = () => [
    {
      id: 'm1',
      date: '2026-11-08',
      dateFormatted: 'Heute, 08.11.2026',
      time: '13:00',
      homeTeam: 'Fortuna Köln',
      awayTeam: 'Borussia Dortmund',
      competition: 'Frauen-Regionalliga West',
      flag: '🇩🇪',
      isGerman: true,
      tvChannels: ['—'],
      streamChannels: ['DFB Play'],
    },
    {
      id: 'm2',
      date: '2026-11-08',
      dateFormatted: 'Heute, 08.11.2026',
      time: '15:30',
      homeTeam: 'FC Bayern München',
      awayTeam: 'Borussia Dortmund',
      competition: '1. Bundesliga',
      flag: '🇩🇪',
      isGerman: true,
      tvChannels: ['Sky Sport Bundesliga 1'],
      streamChannels: ['WOW'],
    }
  ];

  const filteredMatches = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    return matches.filter((match) => {
      if (onlyGerman && !match.isGerman) return false;
      
      if (activeTab === 'heute') {
        if (match.date !== todayStr && matches.some(m => m.date === todayStr)) return false;
      } else if (activeTab === 'morgen') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        if (match.date !== tomorrowStr) return false;
      } else if (activeTab === 'naechste') {
        if (match.date <= todayStr) return false;
      } else if (activeTab === 'freetv') {
        if (!match.streamChannels.some(c => c.includes('Free') || c.includes('DFB')) && !match.tvChannels.some(c => c.includes('NDR') || c.includes('WDR'))) return false;
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
      
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#1e2229] border-b border-slate-700 shadow-md">
        <div className="max-w-5xl mx-auto px-2 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black px-2.5 py-1.5 rounded uppercase tracking-tighter text-sm italic shadow flex items-center shrink-0">
            FUSSBALL<span className="text-cyan-300 ml-0.5">GUCKEN</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button 
              onClick={() => setActiveTab('freetv')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold border transition ${activeTab === 'freetv' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-[#262b35] border-slate-700 text-slate-300'}`}
            >
              Free-TV
            </button>
            <button 
              onClick={() => setActiveTab('heute')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold border transition ${activeTab === 'heute' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-[#262b35] border-slate-700 text-slate-300'}`}
            >
              Heute
            </button>
            <button 
              onClick={() => setActiveTab('morgen')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold border transition ${activeTab === 'morgen' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-[#262b35] border-slate-700 text-slate-300'}`}
            >
              Morgen
            </button>
            <button 
              onClick={() => setActiveTab('naechste')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold border transition ${activeTab === 'naechste' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-[#262b35] border-slate-700 text-slate-300'}`}
            >
              Nächste Tage
            </button>
            <button 
              onClick={() => setOnlyGerman(!onlyGerman)}
              className={`px-2.5 py-1.5 rounded text-xs font-bold border transition ${onlyGerman ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-[#262b35] border-slate-700 text-slate-300'}`}
            >
              🇩🇪 DE
            </button>
          </div>
        </div>
      </header>

      {/* Suche */}
      <div className="max-w-5xl mx-auto px-3 mt-3">
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

      {/* Tabellen / Matrix-Ansicht */}
      <main className="max-w-5xl mx-auto px-3 mt-3">
        {loading ? (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg p-10 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            <span>Lade aktuelle Spieldaten live...</span>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg p-6 text-center text-slate-400 text-xs">
            Keine Spiele für diese Auswahl gefunden.
          </div>
        ) : (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg shadow overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#262b35] border-b border-slate-700 text-[11px] font-extrabold uppercase text-amber-400 tracking-wider">
                  <th className="py-2.5 px-3 w-20 text-center">Uhrzeit</th>
                  <th className="py-2.5 px-3 w-40">Liga</th>
                  <th className="py-2.5 px-3">Mannschaften</th>
                  <th className="py-2.5 px-3 w-36">TV</th>
import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

const INITIAL_MATCHES = [
  {
    id: 'm1',
    date: '2026-11-08',
    time: '13:30',
    competition: '2. Bundesliga',
    flag: '🇩🇪',
    isGerman: true,
    homeTeam: '1. FC Heidenheim 1846',
    awayTeam: 'Hannover 96',
    tvChannels: [
      { name: 'Sky Sport Bundesliga', hd: false, konferenz: true, type: 'TV' },
      { name: 'Sky Sport Bundesliga 1', hd: false, konferenz: true, type: 'TV' },
      { name: 'Sky Sport Bundesliga 3', hd: false, konferenz: false, type: 'TV' },
      { name: 'Sky Sport Top Event', hd: false, konferenz: true, type: 'TV' },
      { name: 'Sky Sport Bundesliga 1 HD', hd: true, konferenz: true, type: 'HD-TV' },
      { name: 'Sky Sport Bundesliga 3 HD', hd: true, konferenz: false, type: 'HD-TV' },
      { name: 'Sky Sport Bundesliga HD', hd: true, konferenz: true, type: 'HD-TV' },
      { name: 'Sky Sport Top Event HD', hd: true, konferenz: true, type: 'HD-TV' }
    ],
    streams: [
      { name: 'Sky (Schweiz)', type: 'Stream' },
      { name: 'Sky Go', type: 'Stream' },
      { name: 'WOW', type: 'Stream' }
    ]
  },
  {
    id: 'm2',
    date: '2026-11-08',
    time: '13:30',
    competition: '3. Liga',
    flag: '🇩🇪',
    isGerman: true,
    homeTeam: 'SV Meppen',
    awayTeam: 'SSV Jahn Regensburg',
    tvChannels: [
      { name: 'MagentaSport', hd: false, konferenz: false, type: 'TV' },
      { name: 'NDR Fernsehen', hd: true, konferenz: false, type: 'Free-TV' }
    ],
    streams: [
      { name: 'MagentaSport App', type: 'Stream' },
      { name: 'NDR.de Livestream', type: 'Free-Stream' }
    ]
  },
  {
    id: 'm3',
    date: '2026-11-08',
    time: '13:00',
    competition: 'Frauen-Regionalliga West',
    flag: '🇩🇪',
    isGerman: true,
    homeTeam: 'Fortuna Köln',
    awayTeam: 'Borussia Dortmund',
    tvChannels: [],
    streams: [
      { name: 'DFB Play', type: 'Free-Stream' }
    ]
  },
  {
    id: 'm4',
    date: '2026-11-09',
    time: '15:30',
    competition: '1. Bundesliga',
    flag: '🇩🇪',
    isGerman: true,
    homeTeam: 'FC Bayern München',
    awayTeam: 'Borussia Mönchengladbach',
    tvChannels: [
      { name: 'Sky Sport Bundesliga UHD', hd: true, konferenz: false, type: 'TV' },
      { name: 'Sky Sport Bundesliga 1', hd: false, konferenz: true, type: 'TV' },
      { name: 'Sky Sport Bundesliga 1 HD', hd: true, konferenz: true, type: 'HD-TV' }
    ],
    streams: [
      { name: 'Sky Go', type: 'Stream' },
      { name: 'WOW', type: 'Stream' }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('heute');
  const [onlyGerman, setOnlyGerman] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMatches = useMemo(() => {
    const todayStr = '2026-11-08';

    return INITIAL_MATCHES.filter((match) => {
      if (onlyGerman && !match.isGerman) return false;
      
      if (activeTab === 'heute') {
        if (match.date !== todayStr) return false;
      } else if (activeTab === 'morgen') {
        if (match.date !== '2026-11-09') return false;
      } else if (activeTab === 'naechste') {
        if (match.date <= '2026-11-09') return false;
      } else if (activeTab === 'freetv') {
        const hasFree = [...match.tvChannels, ...match.streams].some(c => c.type.includes('Free'));
        if (!hasFree) return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTeam = match.homeTeam.toLowerCase().includes(q) || match.awayTeam.toLowerCase().includes(q);
        const matchComp = match.competition.toLowerCase().includes(q);
        if (!matchTeam && !matchComp) return false;
      }
      return true;
    });
  }, [onlyGerman, activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-16">
      
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#1e2229] border-b border-slate-700 shadow-md">
        <div className="max-w-6xl mx-auto px-2 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black px-2.5 py-1.5 rounded uppercase tracking-tighter text-sm italic shadow flex items-center shrink-0">
            FUSSBALL<span className="text-cyan-300 ml-0.5">GUCKEN</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button 
              onClick={() => setActiveTab('freetv')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold border transition ${activeTab === 'freetv' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-[#262b35] border-slate-700 text-slate-300'}`}
            >
              Free-TV
            </button>
            <button 
              onClick={() => setActiveTab('heute')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold border transition ${activeTab === 'heute' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-[#262b35] border-slate-700 text-slate-300'}`}
            >
              Heute
            </button>
            <button 
              onClick={() => setActiveTab('morgen')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold border transition ${activeTab === 'morgen' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-[#262b35] border-slate-700 text-slate-300'}`}
            >
              Morgen
            </button>
            <button 
              onClick={() => setActiveTab('naechste')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold border transition ${activeTab === 'naechste' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-[#262b35] border-slate-700 text-slate-300'}`}
            >
              Nächste Tage
            </button>
            <button 
              onClick={() => setOnlyGerman(!onlyGerman)}
              className={`px-2.5 py-1.5 rounded text-xs font-bold border transition ${onlyGerman ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-[#262b35] border-slate-700 text-slate-300'}`}
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

      {/* Tabellen / Matrix-Ansicht mit vollständigen Daten */}
      <main className="max-w-6xl mx-auto px-3 mt-3">
        {filteredMatches.length === 0 ? (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg p-6 text-center text-slate-400 text-xs">
            Keine Spiele für diese Auswahl gefunden.
          </div>
        ) : (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg shadow overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#262b35] border-b border-slate-700 text-[11px] font-extrabold uppercase text-amber-400 tracking-wider">
                  <th className="py-2.5 px-3 w-20 text-center">Uhrzeit</th>
                  <th className="py-2.5 px-3 w-40">Liga</th>
                  <th className="py-2.5 px-3 w-52">Mannschaften</th>
                  <th className="py-2.5 px-3">TV & HD-TV Angebote</th>
                  <th className="py-2.5 px-3 w-48">Live Streams</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {filteredMatches.map((match) => (
                  <tr key={match.id} className="hover:bg-slate-800/50 transition align-top">
                    
                    {/* Spalte: Uhrzeit */}
                    <td className="py-3 px-3 text-center font-bold text-amber-400 whitespace-nowrap bg-[#1a1d24]">
                      {match.time}
                    </td>

                    {/* Spalte: Liga */}
                    <td className="py-3 px-3 font-semibold text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{match.flag}</span>
                        <span className="truncate">{match.competition}</span>
                      </div>
                    </td>

                    {/* Spalte: Mannschaften */}
                    <td className="py-3 px-3 font-bold text-white">
                      <div className="flex flex-col gap-0.5">
                        <span>{match.homeTeam}</span>
                        <span className="text-slate-400 text-[10px] font-normal">vs</span>
                        <span>{match.awayTeam}</span>
                      </div>
                    </td>

                    {/* Spalte: TV & HD-TV inklusive Konferenz-Badge (K) */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1.5">
                        {match.tvChannels.length === 0 ? (
                          <span className="text-slate-500 italic">Keine TV-Daten</span>
                        ) : (
                          match.tvChannels.map((c, i) => (
                            <span 
                              key={i} 
                              className={`font-black text-[11px] px-2 py-1 rounded shadow-sm inline-flex items-center gap-1.5 ${
                                c.hd ? 'bg-slate-200 text-slate-900 border border-slate-400' : 'bg-[#facc15] text-slate-950'
                              }`}
                            >
                              {c.hd && <span className="text-[9px] bg-slate-800 text-white px-1 rounded">HD</span>}
                              <span>{c.name}</span>
                              {c.konferenz && (
                                <span className="bg-slate-950 text-white w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px] font-bold" title="Konferenz verfügbar">
                                  K
                                </span>
                              )}
                            </span>
                          ))
                        )}
                      </div>
                    </td>

                    {/* Spalte: Live Streams */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1">
                        {match.streams.length === 0 ? (
                          <span className="text-slate-500 italic">Keine Streams</span>
                        ) : (
                          match.streams.map((s, i) => (
                            <span key={i} className="bg-sky-500 text-slate-950 font-black text-[11px] px-2 py-1 rounded shadow-sm inline-block w-fit">
                              {s.name}
                            </span>
                          ))
                        )}
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

                   </td>

                    {/* Spalte: TV */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1">
                        {match.tvChannels.map((c, i) => (
                          <span key={i} className="bg-[#facc15] text-slate-950 font-black text-[11px] px-2 py-0.5 rounded shadow-sm inline-block w-fit">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Spalte: Live Streams */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1">
                        {match.streamChannels.map((c, i) => (
                          <span key={i} className="bg-sky-500 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded shadow-sm inline-block w-fit">
                            {c}
                          </span>
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
