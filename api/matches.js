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

    // Durchsuche alle Zeilen in Tabellen
    $('tr').each((index, element) => {
      const $row = $(element);
      const rowText = $row.text().trim();

      // Uhrzeit finden (z.B. 20:45)
      const timeMatch = rowText.match(/(\d{2}:\d{2})/);
      if (!timeMatch) return;

      // Datum finden (z.B. Fr, 13.11.)
      const dateMatch = rowText.match(/([Mo|Di|Mi|Do|Fr|Sa|So],\s*\d{2}\.\d{2}\.?)/i);

      // Mannschaften auslesen (entweder über Links oder Text-Trennung)
      let home = '';
      let away = '';

      const links = $row.find('a');
      const teams = [];
      
      links.each((i, el) => {
        const text = $(el).text().trim();
        const href = $(el).attr('href') || '';
        if (text && (href.includes('/team') || href.includes('/verein') || href.includes('/mannschaft') || href.includes('/match'))) {
          teams.push(text);
        }
      });

      if (teams.length >= 2) {
        home = teams[0];
        away = teams[1];
      } else {
        // Fallback: Versuche Teams aus dem Textblöcken zu extrahieren
        const vsSplit = rowText.split(/\s+vs\.?\s+|\s+-\s+/i);
        if (vsSplit.length >= 2) {
          home = vsSplit[0].split('\n').pop().trim();
          away = vsSplit[1].split('\n')[0].trim();
        }
      }

      if (!home || !away) return;

      // Wettbewerb finden
      const compLink = $row.find('a[href*="/wettbewerb/"], a[href*="/liga/"]').first().text().trim();

      // Sender & Stream Kanäle auslesen
      const tvChannels = [];
      const hdChannels = [];
      const streams = [];

      $row.find('td, span, a').each((i, el) => {
        const txt = $(el).text().trim();
        const txtLower = txt.toLowerCase();

        if (txtLower.includes('rtl+') || txtLower.includes('stream') || txtLower.includes('dazn app')) {
          if (txt.length < 30 && !streams.some(s => s.name === txt)) streams.push({ name: txt });
        } else if (txtLower.includes('hd')) {
          if (txt.length < 30 && !hdChannels.some(h => h.name === txt)) hdChannels.push({ name: txt, free: txtLower.includes('free') });
        } else if (txtLower.includes('rtl') || txtLower.includes('sky') || txtLower.includes('zdf') || txtLower.includes('ard') || txtLower.includes('sat.1')) {
          if (txt.length < 30 && !tvChannels.some(t => t.name === txt)) tvChannels.push({ name: txt, free: txtLower.includes('free') });
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
