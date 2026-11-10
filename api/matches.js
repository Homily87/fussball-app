export default async function handler(req, res) {
  // CORS-Header setzen, damit deine GitHub-Pages-App die Daten abrufen darf
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 1. HTML der Quellseite laden
    const response = await fetch('https://fussballgucken.info/fussball-heute', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const htmlText = await response.text();

    // 2. Daten extrahieren (Hier werden die HTML-Elemente geparst)
    // Hinweis: Sobald die Function steht, passen wir den Parser exakt an die DOM-Struktur von fussballgucken.info an
    
    // Beispielhafte Struktur der bereinigten Daten:
    const scrapedMatches = [
      // Hier landen automatisiert nur Männer-Spiele, exakt getrennt nach TV, HD und Streams
    ];

    res.status(200).json({ success: true, updated: new Date(), matches: scrapedMatches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

