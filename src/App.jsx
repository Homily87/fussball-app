import React, { useState, useMemo } from 'react';
import { 
  Tv, 
  Search, 
  Calendar, 
  Clock, 
  Radio
} from 'lucide-react';

const INITIAL_MATCHES = [
  {
    id: 'm1',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November 2026',
    time: '13:30',
    homeTeam: 'Fortuna Köln',
    awayTeam: 'Borussia Dortmund',
    competition: '3. Liga',
    flag: '🇩🇪',
    isGerman: true,
    channels: [
      { name: 'Sky Sport Bundesliga 1', type: 'TV' },
      { name: 'WOW Live-Stream', type: 'Stream' }
    ],
  },
  {
    id: 'm2',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November 2026',
    time: '13:30',
    homeTeam: 'Club Brügge',
    awayTeam: 'RSC Anderlecht',
    competition: 'Jupiler Pro League (Belgien)',
    flag: '🇧🇪',
    isGerman: false,
    channels: [
      { name: 'DAZN 1', type: 'TV' },
      { name: 'Eleven Sports App', type: 'Stream' }
    ],
  },
  {
    id: 'm3',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November 2026',
    time: '13:30',
    homeTeam: 'SV Meppen',
    awayTeam: 'SSV Jahn Regensburg',
    competition: '3. Liga',
    flag: '🇩🇪',
    isGerman: true,
    channels: [
      { name: 'MagentaSport', type: 'TV / Stream' },
      { name: 'NDR Fernsehen', type: 'Free-TV' }
    ],
  },
  {
    id: 'm4',
    date: '2026-11-09',
    dateFormatted: 'Morgen, 09. November 2026',
    time: '15:30',
    homeTeam: 'FC Bayern München',
    awayTeam: 'Borussia Mönchengladbach',
    competition: '1. Bundesliga',
    flag: '🇩🇪',
    isGerman: true,
    channels: [
      { name: 'Sky Sport Bundesliga UHD', type: 'TV' },
      { name: 'Sky Go', type: 'Stream' }
    ],
  },
  {
    id: 'm5',
    date: '2026-11-10',
    dateFormatted: 'Dienstag, 10. November 2026',
    time: '21:00',
    homeTeam: 'Real Madrid',
    awayTeam: 'Manchester City',
    competition: 'UEFA Champions League',
    flag: '🇪🇸',
    isGerman: false,
    channels: [
      { name: 'DAZN 2', type: 'TV' },
      { name: 'DAZN App', type: 'Stream' }
    ],
  },
  {
    id: 'm6',
    date: '2026-11-11',
    dateFormatted: 'Mittwoch, 11. November 2026',
    time: '21:00',
    homeTeam: 'Paris Saint-Germain',
    awayTeam: 'FC Barcelona',
    competition: 'UEFA Champions League',
    flag: '🇫🇷',
    isGerman: false,
    channels: [
      { name: 'Amazon Prime Video', type: 'Stream' }
    ],
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('heute');
  const [onlyGerman, setOnlyGerman] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMatches = useMemo(() => {
    return INITIAL_MATCHES.filter((match) => {
      if (onlyGerman && !match.isGerman) return false;
      if (activeTab === 'heute' && match.date !== '2026-11-08') return false;
      if (activeTab === 'morgen' && match.date !== '2026-11-09') return false;
      if (activeTab === 'naechste' && match.date <= '2026-11-09') return false;
      if (activeTab === 'freetv' && !match.channels.some(c => c.type.includes('Free-TV'))) return false;

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
      
      <header className="sticky top-0 z-50 bg-[#1e2229] border-b border-slate-700 shadow-md">
        <div className="max-w-2xl mx-auto px-2 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          
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
              Die nächsten Tage
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

      <div className="max-w-2xl mx-auto px-3 mt-3">
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

      <main className="max-w-2xl mx-auto px-3 mt-3 space-y-3">
        {filteredMatches.length === 0 ? (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg p-6 text-center text-slate-400 text-xs">
            Keine Spiele für diese Auswahl gefunden.
          </div>
        ) : (
          filteredMatches.map((match) => (
            <div key={match.id} className="bg-[#1e2229] border border-slate-700/80 rounded-lg shadow overflow-hidden">
              
              <div className="bg-[#262b35] px-3 py-1.5 text-xs text-slate-300 font-medium flex items-center justify-between border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{match.flag}</span>
                  <span>{match.competition}</span>
                </div>
                <span className="text-[11px] text-amber-400 font-bold">{match.dateFormatted} • {match.time} Uhr</span>
              </div>

              <div className="p-3">
                <div className="space-y-1">
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {match.homeTeam}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {match.awayTeam}
                  </div>
                </div>
              </div>

              <div className="bg-[#171a20] px-3 py-2.5 border-t border-slate-800 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
                  <Tv className="w-3 h-3 text-amber-400" /> TV & Live-Stream Übertragungen:
                </span>
                <div className="space-y-1">
                  {match.channels.map((chan, idx) => (
                    <div
                      key={idx}
                      className="bg-[#facc15] text-slate-950 font-black text-xs px-3 py-1.5 rounded shadow flex items-center justify-between"
                    >
                      <span>{chan.name}</span>
                      <span className="text-[10px] bg-slate-950/20 px-2 py-0.5 rounded uppercase tracking-wider">{chan.type}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))
        )}
      </main>

    </div>
  );
}
