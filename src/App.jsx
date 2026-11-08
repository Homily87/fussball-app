import React, { useState } from 'react';
import { 
  Tv, 
  MapPin, 
  Bookmark, 
  Search, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Star, 
  CheckCircle2,
  Filter,
  Share2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('heute');
  const [onlyGerman, setOnlyGerman] = useState(false);
  const [selectedChannelType, setSelectedChannelType] = useState('alle');
  const [selectedCompetition, setSelectedCompetition] = useState('alle');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarks, setBookmarks] = useState([]);

  // Mock-Daten für Spiele
  const matches = [
    {
      id: 1,
      homeTeam: 'FC Bayern München',
      awayTeam: 'Borussia Dortmund',
      competition: 'Bundesliga',
      date: 'Heute, 18:30',
      venue: 'Allianz Arena, München',
      isGerman: true,
      channelType: 'Pay-TV',
      channels: ['Sky Sport Bundesliga', 'WOW'],
      logoHome: '🔴',
      logoAway: '🟡'
    },
    {
      id: 2,
      homeTeam: 'Real Madrid',
      awayTeam: 'Manchester City',
      competition: 'Champions League',
      date: 'Heute, 21:00',
      venue: 'Santiago Bernabéu',
      isGerman: false,
      channelType: 'Stream',
      channels: ['DAZN'],
      logoHome: '⚪',
      logoAway: '🔵'
    },
    {
      id: 3,
      homeTeam: 'Eintracht Frankfurt',
      awayTeam: 'RB Leipzig',
      competition: 'Bundesliga',
      date: 'Heute, 15:30',
      venue: 'Deutsche Bank Park',
      isGerman: true,
      channelType: 'Pay-TV',
      channels: ['Sky Sport Bundesliga'],
      logoHome: '🦅',
      logoAway: '🔴'
    },
    {
      id: 4,
      homeTeam: 'Deutschland',
      awayTeam: 'Frankreich',
      competition: 'Länderspiel',
      date: 'Morgen, 20:45',
      venue: 'Signal Iduna Park, Dortmund',
      isGerman: true,
      channelType: 'Free-TV',
      channels: ['ZDF'],
      logoHome: '🇩🇪',
      logoAway: '🇫🇷'
    },
    {
      id: 5,
      homeTeam: 'FC Barcelona',
      awayTeam: 'FC Sevilla',
      competition: 'La Liga',
      date: 'Morgen, 21:00',
      venue: 'Camp Nou',
      isGerman: false,
      channelType: 'Pay-TV',
      channels: ['DAZN'],
      logoHome: '🔵🔴',
      logoAway: '⚪🔴'
    }
  ];

  // Mock-Daten für Sportsbars
  const bars = [
    {
      id: 1,
      name: 'Paddy’s Irish Pub',
      city: 'Berlin',
      address: 'Friedrichstraße 100',
      rating: 4.8,
      screens: 'Großbildleinwand & 5 TVs',
      specials: 'Zeigt alle Bundesligaspiele & Champions League',
      distance: '1.2 km'
    },
    {
      id: 2,
      name: 'Tor 11 - Die Fussballkneipe',
      city: 'München',
      address: 'Leopoldstraße 44',
      rating: 4.9,
      screens: 'Beamer + Sky & DAZN Konferenz',
      specials: 'Biergarten & Burger',
      distance: '2.5 km'
    },
    {
      id: 3,
      name: 'Sportsbar Kick',
      city: 'Hamburg',
      address: 'Reeperbahn 22',
      rating: 4.6,
      screens: '4 OLED TVs',
      specials: 'Happy Hour während des Topspiels',
      distance: '3.1 km'
    }
  ];

  const toggleBookmark = (id) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  // Filter-Logik
  const filteredMatches = matches.filter(match => {
    if (onlyGerman && !match.isGerman) return false;
    if (selectedChannelType !== 'alle' && match.channelType !== selectedChannelType) return false;
    if (selectedCompetition !== 'alle' && match.competition !== selectedCompetition) return false;
    if (searchTerm && !match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !match.competition.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (activeTab === 'merker' && !bookmarks.includes(match.id)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-12">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚽</span>
            <h1 className="text-xl font-bold tracking-wider text-white">FUSSBALL<span className="text-emerald-400">GUCKEN</span>.INFO</h1>
          </div>
          
          {/* Nur deutsche Spiele Toggle-Button */}
          <button 
            onClick={() => setOnlyGerman(!onlyGerman)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              onlyGerman 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Filter size={16} />
            <span>Nur deutsche Spiele</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-slate-800/60 border-b border-slate-700 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 flex overflow-x-auto gap-2 py-2 no-scrollbar">
          <button 
            onClick={() => setActiveTab('heute')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'heute' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            📅 Heute
          </button>
          <button 
            onClick={() => setActiveTab('kommende')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'kommende' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            🗓️ Nächste 7 Tage
          </button>
          <button 
            onClick={() => setActiveTab('free-tv')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'free-tv' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            📺 Free-TV
          </button>
          <button 
            onClick={() => setActiveTab('bars')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'bars' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            🍺 Sportsbars
          </button>
          <button 
            onClick={() => setActiveTab('merker')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${activeTab === 'merker' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Bookmark size={14} /> Merkliste ({bookmarks.length})
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 mt-6">
        {activeTab !== 'bars' ? (
          <>
            {/* Such- und Filterleiste */}
            <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 mb-6 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Team, Wettbewerb suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select 
                value={selectedChannelType}
                onChange={(e) => setSelectedChannelType(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="alle">Alle Sender-Typen</option>
                <option value="Free-TV">Free-TV</option>
                <option value="Pay-TV">Pay-TV</option>
                <option value="Stream">Stream</option>
              </select>

              <select 
                value={selectedCompetition}
                onChange={(e) => setSelectedCompetition(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="alle">Alle Wettbewerbe</option>
                <option value="Bundesliga">Bundesliga</option>
                <option value="Champions League">Champions League</option>
                <option value="Länderspiel">Länderspiel</option>
              </select>
            </div>

            {/* Match-Liste */}
            <div className="space-y-4">
              {filteredMatches.length > 0 ? (
                filteredMatches.map(match => {
                  const isBookmarked = bookmarks.includes(match.id);
                  return (
                    <div key={match.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-all shadow-md">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-700 text-emerald-400">
                            {match.competition}
                          </span>
                          {match.isGerman && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              🇩🇪 Deutsches Spiel
                            </span>
                          )}
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={12} /> {match.date}
                          </span>
                        </div>
                        <button 
                          onClick={() => toggleBookmark(match.id)}
                          className={`text-slate-400 hover:text-emerald-400 transition-colors ${isBookmarked ? 'text-emerald-400' : ''}`}
                        >
                          <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
                        </button>
                      </div>

                      {/* Teams */}
                      <div className="flex justify-between items-center my-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{match.logoHome}</span>
                          <span className="font-bold text-lg text-white">{match.homeTeam}</span>
                        </div>
                        <span className="text-slate-500 font-bold text-sm px-2">VS</span>
                        <div className="flex items-center gap-3 justify-end">
                          <span className="font-bold text-lg text-white text-right">{match.awayTeam}</span>
                          <span className="text-2xl">{match.logoAway}</span>
                        </div>
                      </div>

                      {/* Stadion & Sender */}
                      <div className="mt-4 pt-3 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm">
                        <div className="text-slate-400 flex items-center gap-1.5 text-xs">
                          <MapPin size={14} className="text-slate-500" />
                          <span>{match.venue}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-slate-400">Sender:</span>
                          {match.channels.map((chan, idx) => (
                            <span key={idx} className="bg-emerald-950 text-emerald-300 border border-emerald-800/50 px-2.5 py-0.5 rounded text-xs font-semibold">
                              {chan}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="text-slate-400">Keine Spiele gefunden, die den Filterkriterien entsprechen.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Sportsbars Tab */
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">⚽ Fussballkneipen & Sportsbars Finder</h2>
            <p className="text-sm text-slate-400 mb-6">Finde Kneipen in deiner Nähe, die Live-Spiele übertragen.</p>
            
            <div className="grid gap-4 md:grid-cols-2">
              {bars.map(bar => (
                <div key={bar.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-white">{bar.name}</h3>
                      <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded text-xs font-bold border border-amber-500/20">
                        <Star size={12} fill="currentColor" /> {bar.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin size={12} /> {bar.address}, {bar.city} ({bar.distance})
                    </p>
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="bg-slate-900/80 p-2 rounded text-slate-300">
                        📺 <span className="font-semibold">Screens:</span> {bar.screens}
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded text-slate-300">
                        🍻 <span className="font-semibold">Highlights:</span> {bar.specials}
                      </div>
                    </div>
                  </div>
                  <button className="mt-5 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2">
                    Route anzeigen <ExternalLink size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
