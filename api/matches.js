export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const tab = req.query.tab || 'heute';
  
  // Exakte URLs der Quellseite festlegen
  let targetUrl = 'https://fussballgucken.info/fussball-heute';
  if (tab === 'morgen') {
    targetUrl = 'https://fussballgucken.info/fussball-morgen';
  } else if (tab === 'naechste') {
    targetUrl = 'https://fussballgucken.info/fussball-alle-termine';
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(200).json({ success: true, tab, count: 0, matches: [] });
    }

    const html = await response.text();
    const allMatches = [];

    // Aufspalten der HTML-Struktur in Zeilen/Blöcke
    const rows = html.split('<tr');

    for (const row of rows) {
      const lower = row.toLowerCase();

      // Striker Filter gegen Frauenfußball & Juniorinnen
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

      // Datenpunkte parsen
      const timeMatch = row.match(/(\d{2}:\d{2})/);
      const dateMatch = row.match(/([Mo|Di|Mi|Do|Fr|Sa|So],\s*\d{2}\.\d{2}\.?)/i);
      const homeMatch = row.match(/class="[^"]*home[^"]*"[^>]*>([^<]+)</i);
      const awayMatch = row.match(/class="[^"]*away[^"]*"[^>]*>([^<]+)</i);
      const compMatch = row.match(/class="[^"]*league[^"]*"[^>]*>([^<]+)</i);

      if (timeMatch && homeMatch && awayMatch) {
        const home = homeMatch[1].trim();
        const away = awayMatch[1].trim();
        const time = timeMatch[1];
        const comp = compMatch ? compMatch[1].trim() : 'Fußball Live';

        // Sender & Streams aus den Tabellenzellen auslesen
        const tvList = [];
        const hdList = [];
        const streamList = [];

        // Suche nach TV-Sendern, HD-Sendern und Streams im HTML-Zeilenblock
        if (lower.includes('rtl') && !lower.includes('rtl+')) {
          if (lower.includes('rtl hd')) hdList.push({ name: 'RTL HD', free: true });
          else tvList.push({ name: 'RTL', free: true });
        }
        if (lower.includes('rtl+')) streamList.push({ name: 'RTL+' });
        if (lower.includes('dazn')) {
          if (lower.includes('dazn 1') || lower.includes('dazn 2')) hdList.push({ name: 'DAZN HD', free: false });
          else streamList.push({ name: 'DAZN' });
        }
        if (lower.includes('sky')) hdList.push({ name: 'Sky Sport HD', free: false });
        if (lower.includes('zdf')) hdList.push({ name: 'ZDF HD', free: true });
        if (lower.includes('ard') || lower.includes('daserste')) hdList.push({ name: 'Das Erste HD', free: true });

        allMatches.push({
          id: Math.random().toString(36).substring(2, 9),
          date: dateMatch ? dateMatch[1] : (tab === 'heute' ? 'Heute' : (tab === 'morgen' ? 'Morgen' : 'Vorschau')),
          time: time,
          homeTeam: home,
          awayTeam: away,
          competition: comp,
          flag: comp.toLowerCase().includes('nations') || comp.toLowerCase().includes('champions') ? '🇪🇺' : '🇩🇪',
          isGerman: true,
          tvChannels: tvList,
          hdChannels: hdList,
          streams: streamList
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
