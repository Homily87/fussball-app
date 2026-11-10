import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  // 1. Cache komplett deaktivieren (verhindert 304 Not Modified)
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // 2. CORS-Freigabe für GitHub Pages
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(200).json({ success: true, tab, count: 0, matches: [] });
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const matches = [];

    $('tr').each((index, element) => {
      const $row = $(element);
      const text = $row.text().trim();

      // Uhrzeit prüfen
      const timeMatch = text.match(/(\d{2}:\d{2})/);
      if (!timeMatch) return;

      // Datum prüfen
      const dateMatch = text.match(/([Mo|Di|Mi|Do|Fr|Sa|So],\s*\d{2}\.\d{2}\.?)/i);

      // Teams ermitteln
      const teamLinks = $row.find('a[href*="/mannschaft/"], a[href*="/verein/"], a[href*="/team/"]');
      let home = '';
      let away = '';

      if (teamLinks.length >= 2) {
        home = $(teamLinks[0]).text().trim();
        away = $(teamLinks[1]).text().trim();
      } else {
        // Alternative Textextraktion
        const textParts = text.replace(/\s+/g, ' ').split(timeMatch[1]);
        if (textParts[1]) {
          const matchString = textParts[1].split('TV')[0].split(' Stream')[0];
          const vsSplit = matchString.split(/\s*-\s*|\s*vs\.?\s*/i);
          if (vsSplit.length >= 2) {
            home = vsSplit[0].trim();
            away = vsSplit[1].trim();
          }
        }
      }

      if (!home || !away) return;

      // Wettbewerb
      const comp = $row.find('a[href*="/wettbewerb/"]').first().text().trim() || 'Fußball Live';

      // Sender & Streams
      const tvChannels = [];
      const hdChannels = [];
      const streams = [];

      $row.find('a, span').each((_, el) => {
        const val = $(el).text().trim();
        const lower = val.toLowerCase();

        if (!val || val.length > 30) return;

        if (lower.includes('rtl+') || lower.includes('stream') || lower.includes('dazn app') || lower.includes('joyn')) {
          if (!streams.some(s => s.name === val)) streams.push({ name: val });
        } else if (lower.includes('hd')) {
          if (!hdChannels.some(h => h.name === val)) hdChannels.push({ name: val, free: lower.includes('free') });
        } else if (lower.includes('rtl') || lower.includes('sky') || lower.includes('zdf') || lower.includes('ard') || lower.includes('sat.1')) {
          if (!tvChannels.some(t => t.name === val)) tvChannels.push({ name: val, free: lower.includes('free') });
        }
      });

      let displayDate = dateMatch ? dateMatch[1] : (tab === 'heute' ? 'Heute' : (tab === 'morgen' ? 'Morgen' : 'Vorschau'));

      matches.push({
        id: Math.random().toString(36).substring(2, 9),
        date: displayDate,
        time: timeMatch[1],
        homeTeam: home,
        awayTeam: away,
        competition: comp,
        flag: '⚽',
        isGerman: true,
        tvChannels,
        hdChannels,
        streams
      });
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
