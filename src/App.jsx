import React, { useState, useMemo } from 'react';
import { 
  Tv, 
  Search, 
  Calendar, 
  Clock, 
  Bookmark, 
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
      { name: 'Sky Sport Bundesliga 1', type: 'Pay-TV' }
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
      { name: 'DAZN 1', type: 'Pay-TV' },
      { name: 'Eleven Sports', type: 'Stream' }
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
      { name: 'MagentaSport', type: 'Pay-TV' },
      { name: 'NDR Fernsehen', type: 'Free-TV' }
    ],
  },
  {
    id: 'm4',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November 2026',
    time: '13:30',
    homeTeam: '1. FC Magdeburg',
    awayTeam: 'FC St. Pauli',
    competition: '2. Bundesliga',
    flag: '🇩🇪',
    isGerman: true,
    channels: [
      { name: 'Sky Sport Bundesliga 2', type: 'Pay-TV' },
      { name: 'WOW', type: 'Stream' }
    ],
  },
  {
    id: 'm5',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November 2026',
    time: '13:30',
    homeTeam: 'VfL Bochum',
    awayTeam: 'Karlsruher SC',
    competition: '2. Bundesliga',
    flag: '🇩🇪',
    isGerman: true,
    channels: [
      { name: 'Sky Sport Bundesliga 3', type: 'Pay-TV' }
    ],
  },
  {
    id: 'm6',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November 2026',
    time: '14:00',
    homeTeam: 'IF Gnistan',
    awayTeam: 'Vaasan PS',
    competition: 'Veikkausliiga (Finnland)',
    flag: '🇫🇮',
    isGerman: false,
    channels: [
      { name: 'Ruutu+', type: 'Stream' }
    ],
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('heute');
  const [onlyGerman, setOnlyGerman] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('fg_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    const updated = bookmarks.includes(id) 
      ? bookmarks.filter(item => item !== id) 
      : [...bookmarks, id];
    setBookmarks(updated);
    try {
      localStorage.setItem('fg_bookmarks', JSON.stringify(updated));
    } catch (err) {}
  };

  const filteredMatches = useMemo(() => {
    return INITIAL_MATCHES.filter((match) => {
      if (onlyGerman && !match.isGerman) return false;
      if (activeTab === 'favoriten' && !bookmarks.includes(match.id)) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTeam = match.homeTeam.toLowerCase().includes(q) || match.awayTeam.toLowerCase().includes(q);
        const matchComp = match.competition.toLowerCase().includes(q);
        if (!matchTeam && !matchComp) return false;
      }
      return true;
    });
  }, [onlyGerman, activeTab, searchQuery, bookmarks]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-16">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1e2229] border-b border-slate-700 shadow-md">
        <div className="max-w-2xl mx-auto px-2 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black px-2.5 py-1.5 rounded uppercase tracking-tighter text-sm italic shadow flex items-center shrink-0">
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
              onClick={() => setActiveTab('favoriten')}
              className={`p-1.5 rounded border transition ${activeTab === 'favoriten' ? 'bg-slate-700 border-slate-600 text-amber-400' : 'bg-[#262b35] border-slate-700 text-slate-300'}`}
            >
              ★
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

      {/* Spiele-Liste */}
      <main className="max-w-2xl mx-auto px-3 mt-3 space-y-2.5">
        {filteredMatches.map((match) => {
          const isBookmarked = bookmarks.includes(match.id);
          return (
            <div key={match.id} className="bg-[#1e2229] border border-slate-700/80 rounded-lg shadow overflow-hidden">
              
              {/* Wettbewerb & Zeit */}
              <div className="bg-[#262b35] px-3 py-1.5 text-xs text-slate-300 font-medium flex items-center justify-between border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{match.flag}</span>
                  <span>{match.competition}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-semibold">{match.time} Uhr</span>
              </div>

              {/* Match-Info (Teams + Merken) */}
              <div className="p-3 flex items-start justify-between gap-3">
                
                {/* Teams untereinander */}
                <div className="space-y-1 flex-1">
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {match.homeTeam}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {match.awayTeam}
                  </div>
                </div>

                {/* Merkliste Button */}
                <button
                  onClick={(e) => toggleBookmark(match.id, e)}
                  className={`p-1.5 rounded text-sm transition ${isBookmarked ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  ★
                </button>
              </div>

              {/* DAUERHAFT AUFGEKLAPPTE ÜBERTRAGUNGSSENDER UNTERHALB */}
              <div className="bg-[#171a20] px-3 py-2.5 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
                  <Tv className="w-3 h-3 text-amber-400" /> Übertragung:
                </span>
                {match.channels.map((chan, idx) => (
                  <span
                    key={idx}
                    className="bg-[#facc15] text-slate-950 font-black text-xs px-2.5 py-1 rounded shadow flex items-center gap-1"
                  >
                    {chan.name}
                  </span>
                ))}
              </div>

            </div>
          );
        })}
      </main>

    </div>
  );
}
