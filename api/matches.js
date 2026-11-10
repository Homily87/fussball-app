export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const matches = [
    {
      id: 'm1',
      time: '21:00',
      homeTeam: 'FC Bayern München',
      awayTeam: 'Paris Saint-Germain',
      competition: 'UEFA Champions League',
      flag: '🇪🇺',
      isGerman: true,
      tvChannels: [{ name: 'DAZN 1 HD', hd: true, konferenz: false }],
      streams: [{ name: 'DAZN App' }]
    },
    {
      id: 'm2',
      time: '20:45',
      homeTeam: 'Serbien',
      awayTeam: 'Deutschland',
      competition: 'UEFA Nations League',
      flag: '🇪🇺',
      isGerman: true,
      tvChannels: [{ name: 'RTL HD', hd: true, konferenz: false }],
      streams: [{ name: 'RTL+' }]
    }
  ];

  return res.status(200).json({
    success: true,
    count: matches.length,
    matches: matches
  });
}
