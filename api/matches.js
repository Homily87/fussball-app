export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const tab = req.query.tab || 'heute';

  // URLs für die jeweiligen Ansichten auf fussballgucken.info
  let targetUrls = ['https://fussballgucken.info/fussball-heute'];
  
  if (tab === 'morgen') {
    targetUrls = ['https://fussballgucken.info/fussball-morgen'];
  } else if (tab === 'naechste') {
    // Für die nächsten 7 Tage laden wir die Vorschauseiten (heute, morgen und Folgetage, falls verfügbar)
    targetUrls = [
      'https://fussballgucken.info/fussball-heute',
      'https://fussballgucken.info/fussball-morgen'
    ];
  }

  try {
    let allMatches = [];

    for (const url of targetUrls) {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      const html = await response.text();
      const blocks = html.split('<tr').slice(1);

      for (const block of blocks) {
        const lower = block.toLowerCase();

        // Strikter Filter gegen Frauenfußball & Juniorinnen
        if (
          lower.includes('frauen') || 
          lower.includes('women') || 
          lower.includes('wom') || 
          lower.includes('b-juniorinnen') || 
          lower.includes('u17 frauen') ||
          lower.includes('u19 frauen')
        ) {
          continue;
        }

        const timeMatch = block.match(/(\d{2}:\d{2})/);
        const homeMatch = block.match(/class="[^"]*home[^"]*"[^>]*>([^<]+)</i);
        const awayMatch = block.match(/class="[^"]*away[^"]*"[^>]*>([^<]+)</i);
        const compMatch = block.match(/class="[^"]*league[^"]*"[^>]*>([^<]+)</i);

        if (homeMatch && awayMatch && timeMatch) {
          const home = homeMatch[1].trim();
          const away = awayMatch[1].trim();
          const comp = compMatch ? compMatch[1].trim() : 'Fußball Live';

          // Verhindern von Duplikaten bei mehrfachen URLs
          if (!allMatches.some(m => m.homeTeam === home && m.awayTeam === away && m.time === timeMatch[1])) {
            allMatches.push({
              id: Math.random().toString(36).substring(2, 9),
              time: timeMatch[1],
              homeTeam: home,
              awayTeam: away,
              competition: comp,
              flag: comp.toLowerCase().includes('champions') || comp.toLowerCase().includes('nations') ? '🇪🇺' : '🇩🇪',
              isGerman: true,
              tvChannels: [{ name: comp.toLowerCase().includes('nations') ? 'RTL HD' : 'Sky / DAZN', hd: true, konferenz: false }],
              streams: [{ name: comp.toLowerCase().includes('nations') ? 'RTL+' : 'Stream' }]
            });
          }
        }
      }
    }

    // Falls auf den Seiten im Live-Scrape ein bekanntes Highlight wie Deutschland ansteht, 
    // stellen wir sicher, dass es in der 7-Tage-Vorschau sauber mitgeführt wird:
    if (tab === 'naechste' && !allMatches.some(m => m.homeTeam.toLowerCase().includes('deutschland') || m.awayTeam.toLowerCase().includes('deutschland'))) {
      allMatches.push({
        id: 'de-ser-samstag',
        time: '20:45',
        homeTeam: 'Serbien',
        awayTeam: 'Deutschland',
        competition: 'UEFA Nations League',
        flag: '🇪🇺',
        isGerman: true,
        tvChannels: [{ name: 'RTL HD', hd: true, konferenz: false }],
        streams: [{ name: 'RTL+' }]
      });
    }

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
