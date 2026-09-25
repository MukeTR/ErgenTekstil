<?xml version="1.0" encoding="UTF-8"?>
<!-- sitemap.xml'in tarayıcıda okunur görünümü. Arama motorları bu dosyayı kullanmaz. -->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="s xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="tr">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>Site haritası · Ergen Tekstil</title>
        <style>
          body{margin:0;padding:32px 16px;font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#151e32;background:#f3f4f7}
          main{max-width:1100px;margin:0 auto}
          h1{font-size:22px;margin:0 0 4px}
          p{margin:0 0 20px;color:#586277}
          .wrap{overflow-x:auto;background:#fff;border:1px solid #dde1e9;border-radius:10px}
          table{border-collapse:collapse;width:100%;min-width:640px}
          th,td{text-align:left;padding:8px 12px;border-bottom:1px solid #eceff4;vertical-align:top}
          th{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#586277;background:#e6eaf3}
          td.n{font-variant-numeric:tabular-nums;white-space:nowrap;color:#586277}
          a{color:#2b3f6b;text-decoration:none;word-break:break-all}
          a:hover{text-decoration:underline}
          .lang{display:inline-block;font-size:11px;padding:1px 6px;margin:1px 2px 1px 0;border-radius:999px;background:#e6eaf3;color:#2b3f6b}
        </style>
      </head>
      <body>
        <main>
          <h1>Ergen Tekstil site haritası</h1>
          <p><xsl:value-of select="count(s:urlset/s:url)"/> adres. Arama motorları için hazırlanmış XML dosyasının okunur görünümüdür.</p>
          <div class="wrap">
            <table>
              <thead><tr><th>Adres</th><th>Diller</th><th>Güncelleme</th><th>Öncelik</th></tr></thead>
              <tbody>
                <xsl:for-each select="s:urlset/s:url">
                  <tr>
                    <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                    <td>
                      <xsl:for-each select="xhtml:link[@hreflang!='x-default']">
                        <span class="lang"><xsl:value-of select="@hreflang"/></span>
                      </xsl:for-each>
                    </td>
                    <td class="n"><xsl:value-of select="s:lastmod"/></td>
                    <td class="n"><xsl:value-of select="s:priority"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
