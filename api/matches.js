export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const tab = req.query.tab || 'heute';
  
  // Dynamische URL-Auswahl basierend auf dem gewählten Tab
  let targetUrl = 'https://fussballgucken.info/fussball-heute';
  if (tab === 'morgen') {
    targetUrl = 'https://fussballgucken.info/fussball-morgen';
  } else if (tab === 'naechste') {
    targetUrl = 'https://fussballgucken.info/vorschau'; // Falls abweichend, ggf. anpassen
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const html = await response.text();
    const allMatches = [];

    // Echter HTML-Parsing-Block für die Live-Daten
    const rows = html.split('<tr');

    for (const row of rows) {
      const lower = row.toLowerCase();

      // Frauenfußball und Juniorinnen absolut strikt filtern
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

      // Hier greift die echte Extraktion aus den Tabellenzeilen der Zielseite
      const timeMatch = row.match(/(\d{2}:\d{2})/);
      const dateMatch = row.match(/([Mo|Di|Mi|Do|Fr|Sa|So],\s*\d{2}\.\d{2}\.?)/i);
      const homeMatch = row.match(/class="[^"]*home[^"]*"[^>]*>([^<]+)</i);
      const awayMatch = row.match(/class="[^"]*away[^"]*"[^>]*>([^<]+)</i);
      const compMatch = row.match(/class="[^"]*league[^"]*"[^>]*>([^<]+)</i);

      if (timeMatch && homeMatch && awayMatch) {
        allMatches.push({
          id: Math.random().toString(36).substring(2, 9),
          date: dateMatch ? dateMatch[1] : (tab === 'heute' ? 'Heute' : 'Morgen'),
          time: timeMatch[1],
          homeTeam: homeMatch[1].trim(),
          awayTeam: awayMatch[1].trim(),
          competition: compMatch ? compMatch[1].trim() : 'Fußball Live',
          flag: '⚽',
          isGerman: true,
          tvChannels: [],
          hdChannels: [],
          streams: []
        });
      }
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
