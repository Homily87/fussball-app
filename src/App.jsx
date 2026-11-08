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

  // Mock-Daten für Sportsbars
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
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚽</span>
            <h1 className="font-bold text-lg tracking-wide text-emerald-400">fussballgucken.info</h1>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() =>
