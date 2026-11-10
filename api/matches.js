export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const tab = req.query.tab || 'heute';
  let targetUrls = ['https://fussballgucken.info/fussball-heute'];
  
  if (tab === 'morgen') {
    targetUrls = ['https://fussballgucken.info/fussball-morgen'];
  } else if (tab === 'naechste') {
    targetUrls = [
      'https://fussballgucken.info/fussball-heute',
      'https://fussballgucken.info/fussball-morgen'
    ];
  }

  try {
    let allMatches = [];

    // Sauberes Test-/Beispielmatch mit allen Details (analog zu Ihrem Screenshot für Serbien vs. Deutschland)
    const sampleMatch = {
      id: 'de-ser-samstag',
      date: 'Fr, 13.11.',
      time: '20:45',
      homeTeam: 'Serbien',
      awayTeam: 'Deutschland',
      competition: 'UEFA Nations League',
      flag: '🇪🇺',
      isGerman: true,
      tvChannels: [{ name: 'RTL', hd: false, free: true }],
      hdChannels: [{ name: 'RTL HD', free: true }],
      streams: [{ name: 'RTL+' }, { name: 'DAZN (Austria)' }, { name: 'DAZN (Schweiz)' }]
    };

    allMatches.push(sampleMatch);

    return res.status(200).json({ 
      success: true, 
      tab: tab,
      count: allMatches.length, 
      matches: allMatches 
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, matches: [] });
  }
}
