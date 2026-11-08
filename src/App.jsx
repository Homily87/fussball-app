import React, { useState, useEffect, useMemo } from 'react';
import { 
  Tv, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Star, 
  Check, 
  Clock, 
  Bookmark, 
  BookmarkCheck,
  Shield,
  Radio,
  ExternalLink,
  SlidersHorizontal,
  RotateCcw,
  Download,
  Share2,
  Sparkles,
  Smartphone,
  ChevronRight,
  Flame
} from 'lucide-react';

// --- INITIAL MOCK DATA WITH EXTENSIVE MATCH INFORMATION ---
const INITIAL_MATCHES = [
  {
    id: 'm1',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November 2026',
    time: '15:30',
    status: 'DEMNÄCHST', // 'LIVE', 'DEMNÄCHST', 'BEENDET'
    homeTeam: 'FC Bayern München',
    awayTeam: 'Borussia Dortmund',
    homeFlag: '🇩🇪',
    awayFlag: '🇩🇪',
    competition: '1. Bundesliga',
    isGerman: true,
    channels: [
      { name: 'Sky Sport Bundesliga 1', type: 'Pay-TV', color: 'bg-sky-600', isFree: false },
      { name: 'WOW', type: 'Stream', color: 'bg-cyan-600', isFree: false }
    ],
    highlight: true,
    venue: 'Allianz Arena, München'
  },
  {
    id: 'm2',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November 2026',
    time: '17:30',
    status: 'DEMNÄCHST',
    homeTeam: 'Eintracht Frankfurt',
    awayTeam: 'Bayer 04 Leverkusen',
    homeFlag: '🇩🇪',
    awayFlag: '🇩🇪',
    competition: '1. Bundesliga',
    isGerman: true,
    channels: [
      { name: 'DAZN 1', type: 'Pay-TV', color: 'bg-slate-700', isFree: false },
      { name: 'DAZN App', type: 'Stream', color: 'bg-amber-600', isFree: false }
    ],
    highlight: false,
    venue: 'Deutsche Bank Park, Frankfurt'
  },
  {
    id: 'm3',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November 2026',
    time: '17:30',
    status: 'DEMNÄCHST',
    homeTeam: 'Arsenal FC',
    awayTeam: 'Chelsea FC',
    homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    awayFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    competition: 'Premier League',
    isGerman: false,
    channels: [
      { name: 'Sky Sport Premier League', type: 'Pay-TV', color: 'bg-sky-600', isFree: false }
    ],
    highlight: false,
    venue: 'Emirates Stadium, London'
  },
  {
    id: 'm4',
    date: '2026-11-08',
    dateFormatted: 'Heute, 08. November 2026',
    time: '20:30',
    status: 'DEMNÄCHST',
    homeTeam: '1. FC Köln',
    awayTeam: 'Hamburger SV',
    homeFlag: '🇩🇪',
    awayFlag: '🇩🇪',
    competition: '2. Bundesliga',
    isGerman: true,
    channels: [
      { name: 'Sport1', type: 'Free-TV', color: 'bg-emerald-600', isFree: true },
      { name: 'Sky Sport Bundesliga 2', type: 'Pay-TV', color: 'bg-sky-600', isFree: false }
    ],
    highlight: true,
    venue: 'RheinEnergieStadion, Köln'
  },
  {
    id: 'm5',
    date: '2026-11-09',
    dateFormatted: 'Morgen, 09. November 2026',
    time: '19:00',
    status: 'DEMNÄCHST',
    homeTeam: 'Dynamo Dresden',
    awayTeam: '1. FC Saarbrücken',
    homeFlag: '🇩🇪',
    awayFlag: '🇩🇪',
    competition: '3. Liga',
    isGerman: true,
    channels: [
      { name: 'MDR Fernsehen', type: 'Free-TV', color: 'bg-emerald-600', isFree: true },
      { name: 'MagentaSport', type: 'Pay-TV', color: 'bg-pink-600', isFree: false }
    ],
    highlight: false,
    venue: 'Rudolf-Harbig-Stadion, Dresden'
  },
  {
    id: 'm6',
    date: '2026-11-10',
    dateFormatted: 'Dienstag, 10. November 2026',
    time: '21:00',
    status: 'DEMNÄCHST',
    homeTeam: 'Real Madrid',
    awayTeam: 'RB Leipzig',
    homeFlag: '🇪🇸',
    awayFlag: '🇩🇪',
    competition: 'UEFA Champions League',
    isGerman: true,
    channels: [
      { name: 'Amazon Prime Video', type: 'Stream', color: 'bg-blue-600', isFree: false }
    ],
    highlight: true,
    venue: 'Santiago Bernabéu, Madrid'
  },
  {
    id: 'm7',
    date: '2026-11-11',
    dateFormatted: 'Mittwoch, 11. November 2026',
    time: '21:00',
    status: 'DEMNÄCHST',
    homeTeam: 'FC Barcelona',
    awayTeam: 'Paris Saint-Germain',
    homeFlag: '🇪🇸',
    awayFlag: '🇫🇷',
    competition: 'UEFA Champions League',
    isGerman: false,
    channels: [
      { name: 'DAZN 1', type: 'Pay-TV', color: 'bg-slate-700', isFree: false },
      { name: 'DAZN App', type: 'Stream', color: 'bg-amber-600', isFree: false }
    ],
    highlight: false,
    venue: 'Spotify Camp Nou, Barcelona'
  },
  {
    id: 'm8',
    date: '2026-11-12',
    dateFormatted: 'Donnerstag, 12. November 2026',
    time: '18:45',
    status: 'DEMNÄCHST',
    homeTeam: 'VfB Stuttgart',
    awayTeam: 'AS Roma',
    homeFlag: '🇩🇪',
    awayFlag: '🇮🇹',
    competition: 'UEFA Europa League',
    isGerman: true,
    channels: [
      { name: 'RTL', type: 'Free-TV', color: 'bg-emerald-600', isFree: true },
      { name: 'RTL+', type: 'Stream', color: 'bg-purple-600', isFree: false }
    ],
    highlight: true,
    venue: 'MHPArena, Stuttgart'
  },
  {
    id: 'm9',
    date: '2026-11-13',
    dateFormatted: 'Freitag, 13. November 2026',
    time: '20:45',
    status: 'DEMNÄCHST',
    homeTeam: 'Deutschland',
    awayTeam: 'Niederlande',
    homeFlag: '🇩🇪',
    awayFlag: '🇳🇱',
    competition: 'UEFA Nations League',
    isGerman: true,
    channels: [
      { name: 'ZDF', type: 'Free-TV', color: 'bg-emerald-600', isFree: true },
      { name: 'ZDFmediathek', type: 'Free-TV', color: 'bg-emerald-600', isFree: true }
    ],
    highlight: true,
    venue: 'Signal Iduna Park, Dortmund'
  }
];

// --- SPORTSBAR DATA ---
const SPORTSBARS = [
  {
    id: 'b1',
    name: 'Stadion an der Schleißheimer Straße',
    city: 'München',
    address: 'Schleißheimer Str. 82, 80797 München',
    rating: 4.8,
    reviews: 1420,
    features: ['DAZN & Sky HD', 'XXL Leinwand', 'Küche durchgehend', 'Reservierung online'],
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80',
    description: 'Deutschlands wohl bekannteste Fußballkneipe mit über 10 HD-Bildschirmen und Spitzenstimmung.'
  },
  {
    id: 'b2',
    name: 'Tante Käthe Fussballkneipe',
    city: 'Berlin',
    address: 'Bernauer Str. 63-64, 13355 Berlin',
    rating: 4.6,
    reviews: 890,
    features: ['DFB-Pokal', 'Free-TV & Pay-TV', 'Kicker-Tisch', 'Biergarten'],
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=600&q=80',
    description: 'Direkt am Mauerpark gelegen – unvergleichliche Stimmung bei allen Bundesliga- und Champions League Spielen.'
  },
  {
    id: 'b3',
    name: 'Gottesgrüne Kneipe & Sportbar',
    city: 'Hamburg',
    address: 'Schulterblatt 73, 20357 Hamburg',
    rating: 4.7,
    reviews: 630,
    features: ['HSV & St. Pauli Live', 'Sky & DAZN HD', 'Craft Beer Auswah'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    description: 'Die Kultadresse im Schanzenviertel für leidenschaftliche Fußballabende mit guter Bierauswahl.'
  },
  {
    id: 'b4',
    name: 'Gaffel am Dom',
    city: 'Köln',
    address: 'Bahnhofsvorplatz 1, 50667 Köln',
    rating: 4.5,
    reviews: 2100,
    features: ['1. FC Köln Spiele', 'Riesen-Leinwand', 'Frisches Kölsch', 'Zentrale Lage'],
    image: 'https://images.unsplash.com/photo-1538488881022-790100742188?auto=format&fit=crop&w=600&q=80',
    description: 'Brauhaus-Atmosphäre trifft auf Live-Fußball der Spitzenklasse direkt am Kölner Dom.'
  }
];

export default function App() {
  // PWA Prompt Deferred Event State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  // Tab Navigation State
  const [activeTab, setActiveTab] = useState('heute'); // 'heute', 'morgen', '7tage', 'freetv', 'favoriten', 'sportsbars'
  
  // Filter States
  const [onlyGerman, setOnlyGerman] = useState(false);
  const [selectedBroadcasterType, setSelectedBroadcasterType] = useState('Alle'); // 'Alle', 'Free-TV', 'Pay-TV', 'Stream'
  const [selectedChannelName, setSelectedChannelName] = useState('Alle');
  const [selectedCompetition, setSelectedCompetition] = useState('Alle');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // LocalStorage Bookmarks / Favorites State
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('fg_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sportsbar Search Filter State
  const [barSearchQuery, setBarSearchQuery] = useState('');

  // Save Bookmarks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('fg_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  }, [bookmarks]);

  // Handle PWA `beforeinstallprompt` event & Service Worker Setup
  useEffect(() => {
    // 1. Listen for PWA installation prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 2. Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsAppInstalled(true);
    }

    // 3. Register Service Worker dynamically
    if ('serviceWorker' in navigator) {
      const swCode = `
        const CACHE_NAME = 'fg-app-v1';
        self.addEventListener('install', (e) => {
          e.waitUntil(
            caches.open(CACHE_NAME).then((cache) => cache.addAll(['/']))
          );
        });
        self.addEventListener('fetch', (e) => {
          e.respondWith(
            caches.match(e.request).then((res) => res || fetch(e.request))
          );
        });
      `;
      const blob = new Blob([swCode], { type: 'application/javascript' });
      const swUrl = URL.createObjectURL(blob);
      navigator.serviceWorker.register(swUrl).catch((err) => {
        console.warn('SW registration skipped or not supported:', err);
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Trigger PWA Installation
  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsAppInstalled(true);
    }
    setDeferredPrompt(null);
  };

  // Toggle Favorite / Bookmark
  const toggleBookmark = (id) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Unique Competitions List
  const competitions = useMemo(() => {
    const list = INITIAL_MATCHES.map((m) => m.competition);
    return ['Alle', ...Array.from(new Set(list))];
  }, []);

  // Unique Channel Names List
  const channelNames = useMemo(() => {
    const names = [];
    INITIAL_MATCHES.forEach((m) => {
      m.channels.forEach((c) => names.push(c.name));
    });
    return ['Alle', ...Array.from(new Set(names))];
  }, []);

  // Filter Logic
  const filteredMatches = useMemo(() => {
    return INITIAL_MATCHES.filter((match) => {
      // 1. Tab Filtering
      if (activeTab === 'heute' && match.date !== '2026-11-08') return false;
      if (activeTab === 'morgen' && match.date !== '2026-11-09') return false;
      if (activeTab === 'freetv') {
        const hasFreeTv = match.channels.some((c) => c.isFree);
        if (!hasFreeTv) return false;
      }
      if (activeTab === 'favoriten' && !bookmarks.includes(match.id)) {
        return false;
      }

      // 2. German Matches Checkbox
      if (onlyGerman && !match.isGerman) return false;

      // 3. Broadcaster Type Filter
      if (selectedBroadcasterType !== 'Alle') {
        const matchHasType = match.channels.some((c) => c.type === selectedBroadcasterType);
        if (!matchHasType) return false;
      }

      // 4. Specific Channel Name Filter
      if (selectedChannelName !== 'Alle') {
        const matchHasChannel = match.channels.some((c) => c.name === selectedChannelName);
        if (!matchHasChannel) return false;
      }

      // 5. Competition Filter
      if (selectedCompetition !== 'Alle' && match.competition !== selectedCompetition) {
        return false;
      }

      // 6. Text Search Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesHome = match.homeTeam.toLowerCase().includes(query);
        const matchesAway = match.awayTeam.toLowerCase().includes(query);
        const matchesComp = match.competition.toLowerCase().includes(query);
        const matchesChannel = match.channels.some((c) => c.name.toLowerCase().includes(query));

        if (!matchesHome && !matchesAway && !matchesComp && !matchesChannel) {
          return false;
        }
      }

      return true;
    });
  }, [activeTab, onlyGerman, selectedBroadcasterType, selectedChannelName, selectedCompetition, searchQuery, bookmarks]);

  // Group Matches by Date
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

  // Filter Sportsbars
  const filteredSportsbars = useMemo(() => {
    if (!barSearchQuery) return SPORTSBARS;
    const q = barSearchQuery.toLowerCase();
    return SPORTSBARS.filter(
      (bar) =>
        bar.city.toLowerCase().includes(q) ||
        bar.name.toLowerCase().includes(q) ||
        bar.features.some((f) => f.toLowerCase().includes(q))
    );
  }, [barSearchQuery]);

  // Reset Filters
  const resetFilters = () => {
    setOnlyGerman(false);
    setSelectedBroadcasterType('Alle');
    setSelectedChannelName('Alle');
    setSelectedCompetition('Alle');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-16">
      
      {/* PWA HEADER BAR */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-emerald-600 to-emerald-400 p-2.5 rounded-xl text-slate-950 shadow-md shadow-emerald-500/20">
              <Tv className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Fußballgucken<span className="text-emerald-400 font-extrabold">.info</span>
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Live-Fußball im TV & Stream • Alle Sender im Überblick
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2">
            
            {/* Install PWA Button (Visible if prompt available) */}
            {deferredPrompt && !isAppInstalled && (
              <button
                onClick={handleInstallPWA}
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-md shadow-emerald-500/20 animate-pulse transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>App Installieren</span>
              </button>
            )}

            {/* Only German Matches Toggle Pill */}
            <button
              onClick={() => setOnlyGerman(!onlyGerman)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                onlyGerman
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>🇩🇪</span>
              <span className="hidden xs:inline">Deutsche Spiele</span>
              {onlyGerman && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* PWA TABS NAVIGATION BAR */}
        <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto no-scrollbar gap-1 border-t border-slate-800/60">
          <button
            onClick={() => setActiveTab('heute')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'heute'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Clock className="w-4 h-4" />
            Heute
          </button>
          <button
            onClick={() => setActiveTab('morgen')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'morgen'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Morgen
          </button>
          <button
            onClick={() => setActiveTab('7tage')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === '7tage'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Nächste 7 Tage
          </button>
          <button
            onClick={() => setActiveTab('freetv')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'freetv'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Radio className="w-4 h-4" />
            Free-TV
          </button>
          <button
            onClick={() => setActiveTab('favoriten')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'favoriten'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Merkliste {bookmarks.length > 0 && <span className="bg-emerald-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">{bookmarks.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab('sportsbars')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'sportsbars'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Sportsbars
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto px-4 pt-6">

        {/* SEARCH & FILTER CONTROLS BAR */}
        {activeTab !== 'sportsbars' && (
          <div className="mb-6 bg-slate-900 border border-slate-800/80 rounded-2xl p-4 shadow-lg">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              
              {/* Search Bar Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Team, Liga oder Sender (z.B. Sky, DAZN, Bayern) suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-8 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-semibold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition ${
                    showFilters || selectedCompetition !== 'Alle' || selectedBroadcasterType !== 'Alle' || selectedChannelName !== 'Alle'
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filter</span>
                  {(selectedCompetition !== 'Alle' || selectedBroadcasterType !== 'Alle' || selectedChannelName !== 'Alle') && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>

                {(onlyGerman || selectedBroadcasterType !== 'Alle' || selectedChannelName !== 'Alle' || selectedCompetition !== 'Alle' || searchQuery) && (
                  <button
                    onClick={resetFilters}
                    title="Filter zurücksetzen"
                    className="p-2.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 rounded-xl transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* EXPANDABLE EXTENDED FILTERS */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Broadcast Type Filter */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Übertragungsart
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Alle', 'Free-TV', 'Pay-TV', 'Stream'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedBroadcasterType(type)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          selectedBroadcasterType === type
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specific Sender Dropdown Filter */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Sender / Anbieter
                  </label>
                  <select
                    value={selectedChannelName}
                    onChange={(e) => setSelectedChannelName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {channelNames.map((chan) => (
                      <option key={chan} value={chan}>
                        {chan}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Competition Filter Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Wettbewerb / Liga
                  </label>
                  <select
                    value={selectedCompetition}
                    onChange={(e) => setSelectedCompetition(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {competitions.map((comp) => (
                      <option key={comp} value={comp}>
                        {comp}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            )}
          </div>
        )}

        {/* MATCH LISTING VIEWS */}
        {activeTab !== 'sportsbars' && (
          <div>
            {Object.keys(groupedMatches).length === 0 ? (
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-10 text-center shadow-lg">
                <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-200 mb-1">Keine passenden Spiele gefunden</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                  Es gibt derzeit keine Partien, die Ihren ausgewählten Filtern oder der Suche entsprechen.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-emerald-500/20"
                >
                  Alle Filter zurücksetzen
                </button>
              </div>
            ) : (
              Object.entries(groupedMatches).map(([dateLabel, matches]) => (
                <div key={dateLabel} className="mb-8">
                  
                  {/* Group Date Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-sm sm:text-base font-bold text-slate-200 tracking-wide">
                      {dateLabel}
                    </h2>
                    <span className="text-[11px] bg-slate-800/80 border border-slate-700/50 text-slate-400 px-2.5 py-0.5 rounded-full font-bold ml-1">
                      {matches.length}
                    </span>
                  </div>

                  {/* List of Match Cards */}
                  <div className="grid grid-cols-1 gap-3">
                    {matches.map((match) => {
                      const isBookmarked = bookmarks.includes(match.id);
                      return (
                        <div
                          key={match.id}
                          className={`bg-slate-900 border rounded-2xl p-4 transition-all duration-200 hover:border-slate-700 shadow-md ${
                            match.highlight
                              ? 'border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/20'
                              : 'border-slate-800/90'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            
                            {/* Match Main Information */}
                            <div className="flex items-start md:items-center gap-3.5 flex-1">
                              
                              {/* Time & Status Badge */}
                              <div className="flex flex-col items-center justify-center bg-slate-950 border border-slate-800/90 rounded-xl px-3 py-2 min-w-[68px]">
                                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                  {match.status}
                                </span>
                                <span className="text-base sm:text-lg font-extrabold text-emerald-400">
                                  {match.time}
                                </span>
                              </div>

                              {/* Teams & Metadata */}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="text-[11px] font-semibold text-slate-300 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                                    {match.competition}
                                  </span>
                                  {match.isGerman && (
                                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                                      🇩🇪 Deutsches Spiel
                                    </span>
                                  )}
                                </div>

                                <div className="text-sm sm:text-base font-bold text-slate-100 flex items-center flex-wrap gap-2">
                                  <span className="flex items-center gap-1.5">
                                    <span className="text-base">{match.homeFlag}</span>
                                    <span>{match.homeTeam}</span>
                                  </span>
                                  <span className="text-xs text-slate-500 font-normal">vs</span>
                                  <span className="flex items-center gap-1.5">
                                    <span className="text-base">{match.awayFlag}</span>
                                    <span>{match.awayTeam}</span>
                                  </span>
                                </div>

                                {match.venue && (
                                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                                    <span className="truncate">{match.venue}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Broadcasters & Bookmark Action */}
                            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0">
                              
                              {/* Broadcaster Chips */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                {match.channels.map((chan, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1.5 bg-slate-950 border border-slate-800/80 px-2.5 py-1.5 rounded-xl shadow-inner"
                                  >
                                    <span className={`w-2 h-2 rounded-full ${chan.color}`} />
                                    <span className="text-xs font-semibold text-slate-200">{chan.name}</span>
                                    <span
                                      className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase tracking-wider ${
                                        chan.isFree
                                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                                      }`}
                                    >
                                      {chan.type}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Bookmark Button */}
                              <button
                                onClick={() => toggleBookmark(match.id)}
                                title={isBookmarked ? 'Aus Merkliste entfernen' : 'Auf Merkliste setzen'}
                                className={`p-2.5 rounded-xl border transition-all ${
                                  isBookmarked
                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
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
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* SPORTSBAR FINDER VIEW */}
        {activeTab === 'sportsbars' && (
          <div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    Sportsbar & Kneipen Finder
                  </h2>
                  <p className="text-xs text-slate-400">
                    Finde Orte in deiner Stadt, die Fußballspiele live im TV übertragen.
                  </p>
                </div>

                {/* City Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Stadt oder Name suchen..."
                    value={barSearchQuery}
                    onChange={(e) => setBarSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Grid of Sportsbars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSportsbars.map((bar) => (
                <div
                  key={bar.id}
                  className="bg-slate-900 border border-slate-800/90 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 w-full relative overflow-hidden bg-slate-950">
                      <img
                        src={bar.image}
                        alt={bar.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur border border-slate-800 px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{bar.rating}</span>
                        <span className="text-slate-400 text-[10px]">({bar.reviews})</span>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-bold text-emerald-400">
                        {bar.city}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-base font-bold text-slate-100 mb-1">{bar.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{bar.address}</span>
                      </p>

                      <p className="text-xs text-slate-300 mb-4 line-clamp-2">
                        {bar.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {bar.features.map((feat, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md"
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() => alert(`Tisch-Anfrage / Details für ${bar.name} aufgerufen.`)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                      Details & Reservierung
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-4 mt-12 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p className="mb-2">
          © 2026 Fußballgucken.info PWA Edition • Alle Live-Sender & TV-Termine im Überblick.
        </p>
      </footer>
    </div>
  );
}
