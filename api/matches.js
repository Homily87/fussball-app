import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const tab = req.query.tab || 'heute';
  
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
    const $ = cheerio.load(html);
    const matches = [];

    $('tr').each((index, element) => {
      const rowText = $(element).text();
      const lower = rowText.toLowerCase();

      // Sofortiger, kompromissloser Ausschluss bei Treffern nach Frauen oder Women
      if (lower.includes('frauen') || lower.includes('women')) {
        return;
      }

      // Uhrzeit & Datum extrahieren
      const timeMatch = rowText.match(/(\d{2}:\d{2})/);
      const dateMatch = rowText.match(/([Mo|Di|Mi|Do|Fr|Sa|So],\s*\d{2}\.\d{2}\.?)/i);

      // Teams und Wettbewerb ermitteln
      const teamLinks = $(element).find('a[href*="/mannschaft/"], a[href*="/verein/"]');
      const compLink = $(element).find('a[href*="/wettbewerb/"]').first().text().trim();

      if (timeMatch && teamLinks.length >= 2) {
        const home = $(teamLinks[0]).text().trim();
        const away = $(teamLinks[1]).text().trim();

        // TV / Stream Sender auslesen
        const tvChannels = [];
        const hdChannels = [];
        const streams = [];

        $(element).find('a, span').each((i, el) => {
          const txt = $(el).text().trim();
          const txtLower = txt.toLowerCase();

          if (txtLower.includes('rtl+') || txtLower.includes('dazn app') || txtLower.includes('stream')) {
            if (txt && !streams.some(s => s.name === txt)) streams.push({ name: txt });
          } else if (txtLower.includes('hd')) {
            if (txt && !hdChannels.some(h => h.name === txt)) hdChannels.push({ name: txt, free: txtLower.includes('free') });
          } else if (txtLower.includes('rtl') || txtLower.includes('sky') || txtLower.includes('zdf') || txtLower.includes('ard')) {
            if (txt && !tvChannels.some(t => t.name === txt)) tvChannels.push({ name: txt, free: txtLower.includes('free') });
          }
        });

        let displayDate = dateMatch ? dateMatch[1] : (tab === 'heute' ? 'Heute' : (tab === 'morgen' ? 'Morgen' : 'Vorschau'));

        matches.push({
          id: Math.random().toString(36).substring(2, 9),
          date: displayDate,
          time: timeMatch[1],
          homeTeam: home,
          awayTeam: away,
          competition: compLink || 'Fußball Live',
          flag: compLink.toLowerCase().includes('nations') || compLink.toLowerCase().includes('champions') ? '🇪🇺' : '🇩🇪',
          isGerman: true,
          tvChannels,
          hdChannels,
          streams
        });
      }
    });

    return res.status(200).json({ 
      success: true, 
      tab,
      count: matches.length, 
      matches 
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, matches: [] });
  }
}
