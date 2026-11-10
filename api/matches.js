export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Welcher Tab wurde angefragt? (heute, morgen, naechste)
  const tab = req.query.tab || 'heute';

  let targetUrl = 'https://fussballgucken.info/fussball-heute';
  if (tab === 'morgen') {
    targetUrl = 'https://fussballgucken.info/fussball-morgen';
  } else if (tab === 'naechste') {
    // Falls fussballgucken.info eine Wochen- oder Vorschauseite hat, hier einbinden.
    // Alternativ greifen wir hier auf die Live-Vorschau zu:
    targetUrl = 'https://fussballgucken.info/fussball-morgen'; 
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const html = await response.text();
    const matches = [];

    const blocks = html.split('<tr').slice(1);

    for (const block of blocks) {
      const lower = block.toLowerCase();

      // Frauenfußball und Juniorinnen strikt filtern
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
        matches.push({
          id: Math.random().toString(36).substring(2, 9),
          time: timeMatch[1],
          homeTeam: homeMatch[1].trim(),
          awayTeam: awayMatch[1].trim(),
          competition: compMatch ? compMatch[1].trim() : 'Fußball Live',
          flag: '⚽',
          isGerman: true,
          tvChannels: [{ name: 'TV Sender', hd: true, konferenz: false }],
          streams: [{ name: 'Stream' }]
        });
      }
    }

    return res.status(200).json({ 
      success: true, 
      tab: tab,
      count: matches.length, 
      matches: matches 
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, matches: [] });
  }
}
