import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Neucha } from 'next/font/google';
import './globals.css';

const siteOrigin = process.env.GITHUB_PAGES === 'true'
  ? 'https://starrytsv1.github.io'
  : 'https://switch-brewing-concept.starrytsv.chatgpt.site';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const switchDisplay = Neucha({
  variable: '--font-switch-display',
  weight: '400',
  subsets: ['cyrillic'],
});

export const metadata: Metadata = {
  referrer: 'no-referrer',
  metadataBase: new URL(siteOrigin),
  title: 'Switch Brewing — контрактная пивоварня из Санкт-Петербурга',
  description: 'Информация о Switch Brewing, истории пивоварни и ассортименте. Санкт-Петербург. 18+.',
  openGraph: {
    url: '/',
    siteName: 'Switch Brewing',
    locale: 'ru_RU',
    type: 'website',
    title: 'Switch Brewing — контрактная пивоварня из Санкт-Петербурга',
    description: 'Информация о пивоварне Switch Brewing и ассортименте. Санкт-Петербург. 18+.',
    images: [{ url: '/switch-original-logo-telegram-v351.png', width: 1448, height: 1086, type: 'image/png', alt: 'Оригинальный логотип Switch Brewing с птичкой' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Switch Brewing — контрактная пивоварня из Санкт-Петербурга',
    description: 'Информация о пивоварне Switch Brewing и ассортименте. Санкт-Петербург. 18+.',
    images: ['/switch-original-logo-telegram-v351.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#171818',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${switchDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
