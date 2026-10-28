import '../styles/globals.css';

export const metadata = {
  title: 'AgroTrader Pro SaaS - Agriculture Store ERP, POS & Ledger',
  description: 'Enterprise Multi-tenant Agriculture Store Management, Ledgers, Inventory, Sales & Amanat Custody',
  manifest: '/manifest.json'
};

export const viewport = {
  themeColor: '#1d4ed8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="theme-sapphire">
        {children}
      </body>
    </html>
  );
}
