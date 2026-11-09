import React, { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, Calendar } from 'lucide-react';

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
                const dateString = matchDate.toISOString().split('T')[0]; // YYYY-MM-DD
                
                const dateFormatted = matchDate.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
                const timeString = matchDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

                let tvChannels = [
                  { name: 'Sky Sport Bundesliga', hd: false, konferenz: true },
                  { name: 'Sky Sport Bundesliga 1 HD', hd: true, konferenz: true }
                ];
                let streams = [
                  { name: 'Sky Go' },
                  { name: 'WOW' }
                ];

                if (league.shortcut === 'bl3') {
                  tvChannels = [
                    { name: 'MagentaSport', hd: false, konferenz: false },
                    { name: 'NDR Fernsehen', hd: true, konferenz: false, type: 'Free-TV' }
                  ];
                  streams = [
                    { name: 'MagentaSport App' },
                    { name: 'NDR.de Livestream', type: 'Free-Stream' }
                  ];
                }

                return {
                  id: `${league.shortcut}-${m.matchID || index}`,
                  date: dateString,
                  dateFormatted,
                  time: timeString,
                  homeTeam: m.team1.teamName,
                  awayTeam: m.team2.teamName,
                  competition: league.name,
                  flag: league.flag,
                  isGerman: league.isGerman,
                  tvChannels,
                  streams
                };
              });

              allFetchedMatches = [...allFetchedMatches, ...formatted];
            }
          } catch (err) {
            console.error(`Fehler bei ${league.name}:`, err);
          }
        }

        setMatches(allFetchedMatches);
      } catch (error) {
        console.error('API-Fehler:', error);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLiveMatches();
  }, []);

  // Verbesserte Filter-Logik
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      if (onlyGerman && !match.isGerman) return false;
      
      // Wenn der Free-TV Tab aktiv ist, zeigen wir alles was Free-TV/Streams hat
      if (activeTab === 'freetv') {
        const hasFree = [...match.tvChannels, ...match.streams].some(c => 
          c.name.includes('NDR') || c.name.includes('Free') || c.type?.includes('Free')
        );
        if (!hasFree) return false;
      } 
      // Für die anderen Tabs filtern wir nach Datum, falls Daten vorhanden sind. 
      // Falls der API-Spieltag auf ein anderes Datum fällt, wird es in "Nächste 7 Tage" oder generell angezeigt.
      else if (activeTab === 'heute') {
        // Prüfen, ob das Spiel zum heutigen Tag passt (oder wir zeigen die nächsten verfügbaren Spiele an)
        const todayStr = new Date().toISOString().split('T')[0];
        // Falls keine Spiele exakt auf heute fallen, zeigen wir standardmäßig den geladenen Spieltag an, damit die Tabelle nicht leer bleibt
        const hasTodayMatches = matches.some(m => m.date === todayStr);
        if (hasTodayMatches && match.date !== todayStr) return false;
      } else if (activeTab === 'morgen') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        const hasTomorrowMatches = matches.some(m => m.date === tomorrowStr);
        if (hasTomorrowMatches && match.date !== tomorrowStr) return false;
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
        <div className="max-w-7xl mx-auto px-3 py-2.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black px-3 py-1.5 rounded uppercase tracking-tighter text-sm italic shadow flex items-center shrink-0">
            FUSSBALL<span className="text-cyan-300 ml-0.5">GUCKEN</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button 
              onClick={() => setActiveTab('freetv')}
              className={`px-3 py-1.5 rounded text-xs font-bold border transition ${activeTab === 'freetv' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-[#262b35] border-slate-700 text-slate-300'}`}
            >
              Free-TV
            </button>
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

      {/* Matrix-Tabelle */}
      <main className="max-w-7xl mx-auto px-3 mt-3">
        {loading ? (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            <span>Lade aktuelle Spieldaten live...</span>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg p-8 text-center text-slate-400 text-xs">
            Keine Spiele für diesen Filter gefunden.
          </div>
        ) : (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-[#262b35] border-b border-slate-700 text-[11px] font-extrabold uppercase text-amber-400 tracking-wider">
                  <th className="py-3 px-3 w-28">Datum & Uhrzeit</th>
                  <th className="py-3 px-3 w-40">Liga</th>
                  <th className="py-3 px-3 w-56">Mannschaften</th>
                  <th className="py-3 px-3">TV & HD-TV Übertragungen</th>
                  <th className="py-3 px-3 w-52">Live Streams</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {filteredMatches.map((match) => (
                  <tr key={match.id} className="hover:bg-slate-800/40 transition align-top">
                    
                    {/* Spalte: Datum & Uhrzeit */}
                    <td className="py-3 px-3 whitespace-nowrap bg-[#171a20]">
                      <div className="font-bold text-amber-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {match.dateFormatted}
                      </div>
                      <div className="text-slate-300 font-semibold mt-0.5 ml-4">
                        {match.time} Uhr
                      </div>
                    </td>

                    {/* Spalte: Liga */}
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, Calendar } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('heute');
  const [onlyGerman, setOnlyGerman] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Live-Daten beim Start frisch aus der API laden (inklusive CL, Nations League, Länderspiele & Bundesliga)
  useEffect(() => {
    async function fetchLiveMatches() {
      setLoading(true);
      try {
        const currentYear = new Date().getFullYear();
        const leagues = [
          { shortcut: 'bl1', name: '1. Bundesliga', flag: '🇩🇪', isGerman: true },
          { shortcut: 'bl2', name: '2. Bundesliga', flag: '🇩🇪', isGerman: true },
          { shortcut: 'bl3', name: '3. Liga', flag: '🇩🇪', isGerman: true },
          { shortcut: 'cl', name: 'UEFA Champions League', flag: '🇪🇺', isGerman: false },
          { shortcut: 'em', name: 'UEFA Nations League / EM / WM', flag: '🇪🇺', isGerman: true }
        ];

        let allFetchedMatches = [];

        for (const league of leagues) {
          try {
            const response = await fetch(`https://api.openligadb.de/getmatchdata/${league.shortcut}/${currentYear}`);
            const data = await response.json();

            if (Array.isArray(data)) {
              const formatted = data.map((m, index) => {
                const matchDate = new Date(m.matchDateTime);
                const dateString = matchDate.toISOString().split('T')[0]; // YYYY-MM-DD
                
                const dateFormatted = matchDate.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
                const timeString = matchDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

                // Senderspezifische Zuweisung nach Wettbewerb
                let tvChannels = [
                  { name: 'Sky Sport Bundesliga', hd: false, konferenz: true },
                  { name: 'Sky Sport Bundesliga 1 HD', hd: true, konferenz: true }
                ];
                let streams = [
                  { name: 'Sky Go' },
                  { name: 'WOW' }
                ];

                if (league.shortcut === 'bl3') {
                  tvChannels = [
                    { name: 'MagentaSport', hd: false, konferenz: false },
                    { name: 'NDR Fernsehen', hd: true, konferenz: false }
                  ];
                  streams = [
                    { name: 'MagentaSport App' },
                    { name: 'NDR.de Livestream' }
                  ];
                } else if (league.shortcut === 'cl') {
                  tvChannels = [
                    { name: 'DAZN 1', hd: true, konferenz: false },
                    { name: 'DAZN 2', hd: true, konferenz: false }
                  ];
                  streams = [
                    { name: 'DAZN App' },
                    { name: 'Amazon Prime Video' }
                  ];
                } else if (league.shortcut === 'em') {
                  tvChannels = [
                    { name: 'RTL Fernsehen', hd: true, konferenz: false },
                    { name: 'Das Erste / ZDF', hd: true, konferenz: false }
                  ];
                  streams = [
                    { name: 'RTL+' },
                    { name: 'Sportschau Livestream' }
                  ];
                }

                return {
                  id: `${league.shortcut}-${m.matchID || index}`,
                  date: dateString,
                  dateFormatted,
                  time: timeString,
                  homeTeam: m.team1.teamName,
                  awayTeam: m.team2.teamName,
                  competition: league.name,
                  flag: league.flag,
                  isGerman: league.isGerman || m.team1.teamName.includes('Deutschland') || m.team2.teamName.includes('Deutschland'),
                  tvChannels,
                  streams
                };
              });

              allFetchedMatches = [...allFetchedMatches, ...formatted];
            }
          } catch (err) {
            console.error(`Fehler bei ${league.name}:`, err);
          }
        }

        setMatches(allFetchedMatches);
      } catch (error) {
        console.error('API-Fehler:', error);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLiveMatches();
  }, []);

  // Strikte Datumsfilterung ohne Ausweich-Tage
  const filteredMatches = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const in7Days = new Date(today);
    in7Days.setDate(today.getDate() + 7);
    const in7DaysStr = in7Days.toISOString().split('T')[0];

    return matches.filter((match) => {
      if (onlyGerman && !match.isGerman) return false;
      
      if (activeTab === 'heute') {
        if (match.date !== todayStr) return false;
      } else if (activeTab === 'morgen') {
        if (match.date !== tomorrowStr) return false;
      } else if (activeTab === 'naechste') {
        // Exakt die nächsten 7 Tage (ab exklusive heute bis einschließlich in 7 Tagen)
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
        <div className="max-w-7xl mx-auto px-3 py-2.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          
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

      {/* Matrix-Tabelle */}
      <main className="max-w-7xl mx-auto px-3 mt-3">
        {loading ? (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            <span>Lade aktuelle Spieldaten live...</span>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg p-8 text-center text-slate-400 text-xs">
            Keine Spiele für diesen Zeitraum gefunden.
          </div>
        ) : (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-[#262b35] border-b border-slate-700 text-[11px] font-extrabold uppercase text-amber-400 tracking-wider">
                  <th className="py-3 px-3 w-28">Datum & Uhrzeit</th>
                  <th className="py-3 px-3 w-40">Liga</th>
                  <th className="py-3 px-3 w-56">Mannschaften</th>
                  <th className="py-3 px-3">TV & HD-TV Übertragungen</th>
                  <th className="py-3 px-3 w-52">Live Streams</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {filteredMatches.map((match) => (
                  <tr key={match.id} className="hover:bg-slate-800/40 transition align-top">
                    
                    {/* Spalte: Datum & Uhrzeit */}
                    <td className="py-3 px-3 whitespace-nowrap bg-[#171a20]">
                      <div className="font-bold text-amber-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {match.dateFormatted}
                      </div>
                      <div className="text-slate-300 font-semibold mt-0.5 ml-4">
                        {match.time} Uhr
                      </div>
                    </td>

                    {/* Spalte: Liga */}
                    <td className="py-3 px-3 font-medium text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{match.flag}</span>
                        <span className="truncate">{match.competition}</span>
                      </div>
                    </td>

                    {/* Spalte: Mannschaften */}
                    <td className="py-3 px-3 font-bold text-white">
                      <div className="flex flex-col gap-1">
                        <span className="truncate">{match.homeTeam}</span>
                        <span className="text-slate-400 text-[10px] font-normal">vs</span>
                        <span className="truncate">{match.awayTeam}</span>
                      </div>
                    </td>

                    {/* Spalte: TV & HD-TV */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1.5">
                        {match.tvChannels.map((c, i) => (
                          <div 
                            key={i} 
                            className={`font-black text-[11px] px-2.5 py-1 rounded shadow-sm inline-flex items-center justify-between gap-2 w-full max-w-xs ${
                              c.hd ? 'bg-slate-200 text-slate-900 border border-slate-400' : 'bg-[#facc15] text-slate-950'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              {c.hd && <span className="text-[9px] bg-slate-800 text-white px-1 py-0.5 rounded shrink-0">HD</span>}
                              <span className="truncate">{c.name}</span>
                            </div>
                            {c.konferenz && (
                              <span className="bg-slate-950 text-white w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px] font-bold shrink-0" title="Konferenz verfügbar">
                                K
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Spalte: Live Streams */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1.5">
                        {match.streams.map((s, i) => (
                          <div key={i} className="bg-sky-500 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded shadow-sm w-full max-w-[200px] truncate">
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

1 py-0.5 rounded shrink-0">HD</span>}
                              <span className="truncate">{c.name}</span>
                            </div>
                            {c.konferenz && (
                              <span className="bg-slate-950 text-white w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px] font-bold shrink-0" title="Konferenz verfügbar">
                                K
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Spalte: Live Streams */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1.5">
                        {match.streams.map((s, i) => (
                          <div key={i} className="bg-sky-500 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded shadow-sm w-full max-w-[200px] truncate">
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
