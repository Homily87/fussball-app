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
      
      {/* Header */}
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
      <main className="max-w-2xl mx-auto px-3 mt-3 space-y-3">
        {filteredMatches.length === 0 ? (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg p-6 text-center text-slate-400 text-xs">
            Keine Spiele für diese Auswahl gefunden.
          </div>
        ) : (
          filteredMatches.map((match) => (
            <div key={match.id} className="bg-[#1e2229] border border-slate-700/80 rounded-lg shadow overflow-hidden">
              
              {/* Wettbewerb, Flagge & Zeit Header */}
              <div className="bg-[#262b35] px-3 py-1.5 text-xs text-slate-300 font-medium flex items-center justify-between border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{match.flag}</span>
                  <span className="font-bold text-white">{match.competition}</span>
                </div>
                <span className="text-[11px] text-amber-400 font-bold">{match.dateFormatted} • {match.time} Uhr</span>
              </div>

              {/* Match-Info (Teams + Liga-Badge) */}
              <div className="p-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {match.homeTeam}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {match.competition}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {match.awayTeam}
                  </div>
                </div>
              </div>
import React, { useState, useMemo } from 'react';
import { 
  Tv, 
  Search
} from 'lucide-react';

const INITIAL_MATCHES = [
  {
    id: 'm1',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November 2026',
    time: '13:00',
    homeTeam: 'Fortuna Köln',
    awayTeam: 'Borussia Dortmund',
    competition: 'Frauen-Regionalliga West',
    flag: '🇩🇪',
    isGerman: true,
    channels: [
      { name: 'DFB Play', type: 'Stream' }
    ],
  },
  {
    id: 'm2',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November 2026',
    time: '13:00',
    homeTeam: 'FC Liverpool',
    awayTeam: 'FC Arsenal WFC',
    competition: "WSL - Women's Super League (England)",
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    isGerman: false,
    channels: [
      { name: 'Sky Sport', type: 'TV' },
      { name: 'WOW', type: 'Stream' }
    ],
  },
  {
    id: 'm3',
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
      { name: 'Eleven Sports', type: 'Stream' }
    ],
  },
  {
    id: 'm4',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November 2026',
    time: '13:30',
    homeTeam: 'SV Meppen',
    awayTeam: 'SSV Jahn Regensburg',
    competition: '3. Liga',
    flag: '🇩🇪',
    isGerman: true,
    channels: [
      { name: 'MagentaSport', type: 'TV' },
      { name: 'NDR Fernsehen', type: 'Free-TV' }
    ],
  },
  {
    id: 'm5',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November 2026',
    time: '13:30',
    homeTeam: '1. FC Magdeburg',
    awayTeam: 'FC St. Pauli',
    competition: '2. Bundesliga',
    flag: '🇩🇪',
    isGerman: true,
    channels: [
      { name: 'Sky Sport Bundesliga', type: 'TV' },
      { name: 'WOW', type: 'Stream' }
    ],
  },
  {
    id: 'm6',
    date: '2026-11-09',
    dateFormatted: 'Morgen, 09. November 2026',
    time: '15:30',
    homeTeam: 'FC Bayern München',
    awayTeam: 'Borussia Mönchengladbach',
    competition: '1. Bundesliga',
    flag: '🇩🇪',
    isGerman: true,
    channels: [
      { name: 'Sky Sport Bundesliga 1', type: 'TV' },
      { name: 'Sky Go', type: 'Stream' }
    ],
  },
  {
    id: 'm7',
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
      { name: 'Amazon Prime', type: 'Stream' }
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
      
      {/* Header */}
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
      <main className="max-w-2xl mx-auto px-3 mt-3 space-y-2">
        {filteredMatches.length === 0 ? (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg p-6 text-center text-slate-400 text-xs">
            Keine Spiele für diese Auswahl gefunden.
          </div>
        ) : (
          filteredMatches.map((match) => (
            <div key={match.id} className="bg-[#1e2229] border border-slate-700/80 rounded-lg shadow overflow-hidden">
              
              {/* Zeile 1: Uhrzeit, Flagge & Liga */}
              <div className="bg-[#262b35] px-3 py-1.5 text-xs text-slate-300 font-medium flex items-center gap-2 border-b border-slate-700/60">
                <span className="text-amber-400 font-bold">{match.time}</span>
                <span>{match.flag}</span>
                <span className="font-semibold text-white truncate">{match.competition}</span>
              </div>

              {/* Zeile 2: Teams */}
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Tv, 
  Search, 
  Clock, 
  Loader2 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('heute');
  const [onlyGerman, setOnlyGerman] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Spiele beim Laden der Seite dynamisch von der Live-API abrufen
  useEffect(() => {
    async function fetchLiveMatches() {
      setLoading(true);
      try {
        // Aktuelles Jahr für die Abfrage (z.B. 2026)
        const currentYear = new Date().getFullYear();
        
        // Wir laden die aktuellen Spieltage der 1. Bundesliga, 2. Bundesliga und 3. Liga
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
              // Die nächsten/heutigen Spiele verarbeiten
              const formatted = data.map((m, index) => {
                const matchDate = new Date(m.matchDateTime);
                const dateString = matchDate.toISOString().split('T')[0]; // YYYY-MM-DD
                
                // Formatiertes Datum für die Anzeige
                const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
                const dateFormatted = matchDate.toLocaleDateString('de-DE', options);
                
                // Uhrzeit (HH:MM)
                const timeString = matchDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

                // Beispielhafte Sender-Zuweisung je nach Liga (wie beim Original)
                let channels = [{ name: 'Sky Sport Bundesliga', type: 'TV' }, { name: 'WOW', type: 'Stream' }];
                if (league.shortcut === 'bl3') {
                  channels = [{ name: 'MagentaSport', type: 'TV' }, { name: 'NDR / WDR', type: 'Free-TV' }];
                } else if (league.shortcut === 'bl1' && index % 2 === 0) {
                  channels = [{ name: 'DAZN 1', type: 'TV' }, { name: 'DAZN App', type: 'Stream' }];
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
                  channels: channels
                };
              });

              allFetchedMatches = [...allFetchedMatches, ...formatted];
            }
          } catch (err) {
            console.error(`Fehler beim Laden von ${league.name}:`, err);
          }
        }

        // Falls die API Daten liefert, diese nutzen. Ansonsten Fallback auf Basis-Spiele.
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

  // Fallback-Spiele, falls die API einmal nicht erreichbar sein sollte
  const getFallbackMatches = () => [
    {
      id: 'm1',
      date: '2026-11-08',
      dateFormatted: 'Heute, 08.11.2026',
      time: '13:00',
      homeTeam: 'Fortuna Köln (Frauen)',
      awayTeam: 'Borussia Dortmund (Frauen)',
      competition: 'Frauen-Regionalliga West',
      flag: '🇩🇪',
      isGerman: true,
      channels: [{ name: 'DFB Play', type: 'Stream' }],
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
      channels: [{ name: 'Sky Sport Bundesliga 1', type: 'TV' }, { name: 'WOW', type: 'Stream' }],
    }
  ];

  // Filter-Logik für Tabs, Suche und DE-Filter
  const filteredMatches = useMemo(() => {
    // Heutiges Datum als String im Format YYYY-MM-DD ermitteln
    const todayStr = new Date().toISOString().split('T')[0];

    return matches.filter((match) => {
      if (onlyGerman && !match.isGerman) return false;
      
      if (activeTab === 'heute') {
        // Zeige Spiele von heute (oder zum Testen alle, falls heute keine anstehen)
        if (match.date !== todayStr && matches.some(m => m.date === todayStr)) return false;
      } else if (activeTab === 'morgen') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        if (match.date !== tomorrowStr) return false;
      } else if (activeTab === 'naechste') {
        if (match.date <= todayStr) return false;
      } else if (activeTab === 'freetv') {
        if (!match.channels.some(c => c.type.includes('Free-TV') || c.type.includes('ARD') || c.type.includes('ZDF'))) return false;
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

      {/* Ladeanimation oder Spiele-Liste */}
      <main className="max-w-2xl mx-auto px-3 mt-3 space-y-2">
        {loading ? (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg p-10 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            <span>Lade aktuelle Spieldaten live...</span>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="bg-[#1e2229] border border-slate-700 rounded-lg p-6 text-center text-slate-400 text-xs">
            Keine Spiele für diese Auswahl gefunden. (Tipp: Klicke auf "Nächste Tage", um kommende Spieltage zu sehen).
          </div>
        ) : (
          filteredMatches.map((match) => (
            <div key={match.id} className="bg-[#1e2229] border border-slate-700/80 rounded-lg shadow overflow-hidden">
              
              {/* Zeile 1: Uhrzeit, Flagge & Liga */}
              <div className="bg-[#262b35] px-3 py-1.5 text-xs text-slate-300 font-medium flex items-center gap-2 border-b border-slate-700/60">
                <span className="text-amber-400 font-bold">{match.time}</span>
                <span>{match.flag}</span>
                <span className="font-semibold text-white truncate">{match.competition}</span>
              </div>

              {/* Zeile 2: Teams */}
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

              {/* Zeile 3: Übertragungssender */}
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

className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
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
