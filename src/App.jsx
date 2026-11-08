import React, { useState, useMemo } from 'react';
import { 
  Tv, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Clock, 
  Bookmark, 
  BookmarkCheck,
  Radio,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

const INITIAL_MATCHES = [
  {
    id: 'm1',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November',
    time: '15:30',
    status: 'DEMNÄCHST',
    homeTeam: 'FC Bayern München',
    awayTeam: 'Borussia Dortmund',
    homeFlag: '🔴',
    awayFlag: '🟡',
    competition: '1. Bundesliga',
    isGerman: true,
    channels: [
      { name: 'Sky Sport Bundesliga 1', type: 'Pay-TV', color: 'bg-sky-600 border-sky-400 text-white', isFree: false },
      { name: 'WOW', type: 'Stream', color: 'bg-teal-600 border-teal-400 text-white', isFree: false }
    ],
    highlight: true,
    venue: 'Allianz Arena, München'
  },
  {
    id: 'm2',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November',
    time: '17:30',
    status: 'DEMNÄCHST',
    homeTeam: 'Eintracht Frankfurt',
    awayTeam: 'Bayer 04 Leverkusen',
    homeFlag: '🦅',
    awayFlag: '🦁',
    competition: '1. Bundesliga',
    isGerman: true,
    channels: [
      { name: 'DAZN 1', type: 'Pay-TV', color: 'bg-slate-800 border-amber-400 text-amber-300', isFree: false },
      { name: 'DAZN App', type: 'Stream', color: 'bg-slate-800 border-amber-400 text-amber-300', isFree: false }
    ],
    highlight: false,
    venue: 'Deutsche Bank Park, Frankfurt'
  },
  {
    id: 'm3',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November',
    time: '17:30',
    status: 'DEMNÄCHST',
    homeTeam: 'Arsenal FC',
    awayTeam: 'Chelsea FC',
    homeFlag: '🔴',
    awayFlag: '🔵',
    competition: 'Premier League',
    isGerman: false,
    channels: [
      { name: 'Sky Sport Premier League', type: 'Pay-TV', color: 'bg-sky-600 border-sky-400 text-white', isFree: false }
    ],
    highlight: false,
    venue: 'Emirates Stadium, London'
  },
  {
    id: 'm4',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November',
    time: '20:30',
    status: 'DEMNÄCHST',
    homeTeam: '1. FC Köln',
    awayTeam: 'Hamburger SV',
    homeFlag: '🐐',
    awayFlag: '⚓',
    competition: '2. Bundesliga',
    isGerman: true,
    channels: [
      { name: 'Sport1', type: 'Free-TV', color: 'bg-emerald-600 border-emerald-400 text-white font-bold', isFree: true },
      { name: 'Sky Sport Bundesliga 2', type: 'Pay-TV', color: 'bg-sky-600 border-sky-400 text-white', isFree: false }
    ],
    highlight: true,
    venue: 'RheinEnergieStadion, Köln'
  },
  {
    id: 'm5',
    date: '2026-11-09',
    dateFormatted: 'Morgen, 09. November',
    time: '19:00',
    status: 'DEMNÄCHST',
    homeTeam: 'Dynamo Dresden',
    awayTeam: '1. FC Saarbrücken',
    homeFlag: '🟡',
    awayFlag: '🔵',
    competition: '3. Liga',
    isGerman: true,
    channels: [
      { name: 'MDR Fernsehen', type: 'Free-TV', color: 'bg-emerald-600 border-emerald-400 text-white font-bold', isFree: true },
      { name: 'MagentaSport', type: 'Pay-TV', color: 'bg-pink-600 border-pink-400 text-white', isFree: false }
    ],
    highlight: false,
    venue: 'Rudolf-Harbig-Stadion, Dresden'
  },
  {
    id: 'm6',
    date: '2026-11-10',
    dateFormatted: 'Dienstag, 10. November',
    time: '21:00',
    status: 'DEMNÄCHST',
    homeTeam: 'Real Madrid',
    awayTeam: 'RB Leipzig',
    homeFlag: '⚪',
    awayFlag: '🔴',
    competition: 'UEFA Champions League',
    isGerman: true,
    channels: [
      { name: 'Amazon Prime Video', type: 'Stream', color: 'bg-blue-600 border-blue-400 text-white', isFree: false }
    ],
    highlight: true,
    venue: 'Santiago Bernabéu, Madrid'
  }
];

const SPORTSBARS = [
  {
    id: 'b1',
    name: 'Stadion an der Schleißheimer Straße',
    city: 'München',
    address: 'Schleißheimer Str. 82, 80797 München',
    features: ['DAZN & Sky HD', 'XXL Leinwand', 'Küche durchgehend'],
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'b2',
    name: 'Tante Käthe Fussballkneipe',
    city: 'Berlin',
    address: 'Bernauer Str. 63-64, 13355 Berlin',
    features: ['DFB-Pokal', 'Free-TV & Pay-TV', 'Biergarten'],
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=600&q=80'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('heute');
  const [onlyGerman, setOnlyGerman] = useState(false);
  const [selectedBroadcasterType, setSelectedBroadcasterType] = useState('Alle');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('fg_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const toggleBookmark = (id) => {
    const updated = bookmarks.includes(id) 
      ? bookmarks.filter(item => item !== id) 
      : [...bookmarks, id];
    setBookmarks(updated);
    try {
      localStorage.setItem('fg_bookmarks', JSON.stringify(updated));
    } catch (e) {}
  };

  const filteredMatches = useMemo(() => {
    return INITIAL_MATCHES.filter((match) => {
      if (activeTab === 'heute' && match.date !== '2026-11-08') return false;
      if (activeTab === 'morgen' && match.date !== '2026-11-09') return false;
      if (activeTab === 'freetv' && !match.channels.some(c => c.isFree)) return false;
      if (activeTab === 'favoriten' && !bookmarks.includes(match.id)) return false;

      if (onlyGerman && !match.isGerman) return false;

      if (selectedBroadcasterType !== 'Alle') {
        if (!match.channels.some(c => c.type === selectedBroadcasterType)) return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTeam = match.homeTeam.toLowerCase().includes(q) || match.awayTeam.toLowerCase().includes(q);
        const matchesComp = match.competition.toLowerCase().includes(q);
        const matchesChan = match.channels.some(c => c.name.toLowerCase().includes(q));
        if (!matchesTeam && !matchesComp && !matchesChan) return false;
      }

      return true;
    });
  }, [activeTab, onlyGerman, selectedBroadcasterType, searchQuery, bookmarks]);

  const groupedMatches = useMemo(() => {
    const groups = {};
    filteredMatches.forEach((match) => {
      if (!groups[match.dateFormatted]) {
        groups[match.dateFormatted] = [];
      }
      groups[match.dateFormatted].push(match);
    });
    return groups;
  }, [filteredMatches]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-emerald-500 p-2 rounded-xl text-slate-950 shadow-md shadow-emerald-500/20">
              <Tv className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white">
                Fussballgucken<span className="text-emerald-400">.info</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">TV & Stream Guide</p>
            </div>
          </div>

          <button
            onClick={() => setOnlyGerman(!onlyGerman)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition border ${
              onlyGerman
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <span>🇩🇪</span>
            <span>Nur DE Spiele</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-3xl mx-auto px-2 flex overflow-x-auto no-scrollbar gap-1 border-t border-slate-800/60">
          {[
            { id: 'heute', label: 'Heute', icon: Clock },
            { id: 'morgen', label: 'Morgen', icon: Calendar },
            { id: '7tage', label: 'Alle Spiele', icon: Sparkles },
            { id: 'freetv', label: 'Free-TV', icon: Radio },
            { id: 'favoriten', label: 'Gemerkt', icon: Bookmark },
            { id: 'sportsbars', label: 'Sportsbars', icon: MapPin }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition ${
                  isActive
                    ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 pt-5">

        {/* Suchleiste */}
        {activeTab !== 'sportsbars' && (
          <div className="mb-5 space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Team, Liga oder Sender (Sky, DAZN...) suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 ${
                  showFilters || selectedBroadcasterType !== 'Alle' 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Filter-Ausklapper */}
            {showFilters && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-400 font-medium">Empfang:</span>
                <div className="flex gap-1">
                  {['Alle', 'Free-TV', 'Pay-TV', 'Stream'].map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedBroadcasterType(type)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        selectedBroadcasterType === type 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Spiele Liste */}
        {activeTab !== 'sportsbars' && (
          <div className="space-y-6">
            {Object.keys(groupedMatches).length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
                Keine Spiele für die gewählten Filter gefunden.
              </div>
            ) : (
              Object.entries(groupedMatches).map(([dateLabel, matches]) => (
                <div key={dateLabel} className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{dateLabel}</span>
                  </div>

                  {matches.map((match) => {
                    const isBookmarked = bookmarks.includes(match.id);
                    return (
                      <div
                        key={match.id}
                        className="bg-slate-900 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-4 shadow-lg transition"
                      >
                        {/* Match Header: Liga & Anstoßzeit */}
                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800/60 text-xs">
                          <span className="bg-slate-950 border border-slate-800 px-2.5 py-0.5 rounded-md text-slate-300 font-semibold">
                            {match.competition}
                          </span>
                          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{match.time} Uhr</span>
                          </div>
                        </div>

                        {/* Teams */}
                        <div className="flex justify-between items-center my-3 px-1">
                          <div className="flex items-center gap-2 font-bold text-sm text-slate-100 flex-1">
                            <span className="text-lg">{match.homeFlag}</span>
                            <span>{match.homeTeam}</span>
                          </div>
                          <span className="text-xs font-black text-slate-600 px-2">VS</span>
                          <div className="flex items-center gap-2 font-bold text-sm text-slate-100 flex-1 justify-end">
                            <span>{match.awayTeam}</span>
                            <span className="text-lg">{match.awayFlag}</span>
                          </div>
                        </div>

                        {/* FOKUS: Übertragungs-Sender & Merken-Button */}
                        <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between items-center gap-2">
                          
                          {/* Sender Chips */}
                          <div className="flex flex-wrap gap-1.5 flex-1">
                            {match.channels.map((chan, idx) => (
                              <span
                                key={idx}
                                className={`px-2.5 py-1 rounded-lg text-xs border flex items-center gap-1 shadow-sm ${chan.color}`}
                              >
                                <Tv className="w-3 h-3" />
                                <span className="font-bold">{chan.name}</span>
                              </span>
                            ))}
                          </div>

                          {/* Favorit Button */}
                          <button
                            onClick={() => toggleBookmark(match.id)}
                            className={`p-2 rounded-xl border transition ${
                              isBookmarked
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {isBookmarked ? (
                              <BookmarkCheck className="w-4 h-4 fill-emerald-400/20" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        )}

        {/* Sportsbar Tab */}
        {activeTab === 'sportsbars' && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sportsbars mit Live-Übertragung</h2>
            {SPORTSBARS.map((bar) => (
              <div key={bar.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex gap-4">
                <img src={bar.image} alt={bar.name} className="w-24 h-24 rounded-xl object-cover bg-slate-950" />
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-slate-100">{bar.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" /> {bar.address}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {bar.features.map((f, i) => (
                      <span key={i} className="text-[10px] bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
