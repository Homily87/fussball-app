import React, { useState } from 'react';
import { 
  Tv, 
  MapPin, 
  Bookmark, 
  Search, 
  Clock, 
  Filter 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('heute');
  const [onlyGerman, setOnlyGerman] = useState(false);
  const [selectedChannelType, setSelectedChannelType] = useState('alle');
  const [selectedCompetition, setSelectedCompetition] = useState('alle');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarks, setBookmarks] = useState([]);

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
      channelType: 'Pay-TV',
      channels: ['DAZN'],
      logoHome: '⚪',
      logoAway: '🔵'
    },
    {
      id: 3,
      homeTeam: 'Eintracht Frankfurt',
      awayTeam: 'SC Freiburg',
      competition: 'Bundesliga',
      date: 'Morgen, 15:30',
      venue: 'Deutsche Bank Park',
      isGerman: true,
      channelType: 'Pay-TV',
      channels: ['Sky Sport Bundesliga'],
      logoHome: '🦅',
      logoAway: '🦊'
    }
  ];

  const bars = [
    {
      id: 1,
      name: 'Tor 3 - Sportsbar',
      city: 'Berlin',
      address: 'Friedrichstraße 12',
      features: ['Sky', 'DAZN', 'Burger & Bier', 'Großleinwand'],
      distance: '1.2 km'
    },
    {
      id: 2,
      name: 'Public Viewing Eck',
      city: 'München',
      address: 'Leopoldstraße 45',
      features: ['Sky', 'Alle Spiele', 'Biergarten'],
      distance: '2.5 km'
    }
  ];

  const toggleBookmark = (id) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter(bId => bId !== id));
    } else {
      setBookmarks([...bookmarks, id]);
    }
  };

  const filteredMatches = matches.filter(match => {
    if (onlyGerman && !match.isGerman) return false;
    if (selectedChannelType !== 'alle' && match.channelType !== selectedChannelType) return false;
    if (selectedCompetition !== 'alle' && match.competition !== selectedCompetition) return false;
    if (searchTerm && !match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) && !match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-12">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚽</span>
            <h1 className="font-bold text-lg tracking-wide text-emerald-400">fussballgucken.info</h1>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveTab('heute')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'heute' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}
            >
              Spiele
            </button>
            <button 
              onClick={() => setActiveTab('bars')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'bars' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}
            >
              Sportsbars
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-4">
        {activeTab === 'heute' ? (
          <div>
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Team suchen..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-700">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Filter size={16} className="text-emerald-400" /> Nur deutsche Spiele
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={onlyGerman} 
                    onChange={() => setOnlyGerman(!onlyGerman)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              {filteredMatches.length > 0 ? (
                filteredMatches.map(match => (
                  <div key={match.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-md">
                    <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                      <span className="bg-slate-700 px-2 py-0.5 rounded text-emerald-300 font-medium">{match.competition}</span>
                      <span className="flex items-center gap-1"><Clock size={12}/> {match.date}</span>
                    </div>

                    <div className="flex justify-between items-center my-3">
                      <div className="flex items-center gap-2 font-semibold">
                        <span>{match.logoHome}</span> {match.homeTeam}
                      </div>
                      <span className="text-xs text-slate-500 font-bold">VS</span>
                      <div className="flex items-center gap-2 font-semibold">
                        {match.awayTeam} <span>{match.logoAway}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-700/60 pt-3 mt-3 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Tv size={14} className="text-emerald-400"/>
                        <span>{match.channels.join(', ')}</span>
                      </div>
                      <button 
                        onClick={() => toggleBookmark(match.id)}
                        className={`p-1.5 rounded-lg transition ${bookmarks.includes(match.id) ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-white'}`}
                      >
                        <Bookmark size={16} fill={bookmarks.includes(match.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-500 text-sm">
                  Keine Spiele gefunden für diese Filter.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Sportsbars in deiner Nähe</h2>
            {bars.map(bar => (
              <div key={bar.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-md">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-base text-white">{bar.name}</h3>
                  <span className="text-xs bg-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-700/40">{bar.distance}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin size={12}/> {bar.address}, {bar.city}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {bar.features.map((feat, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
