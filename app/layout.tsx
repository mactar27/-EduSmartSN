import type { Metadata } from 'next'
import { Geist, Geist_Mono, Caveat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CookieConsent } from "@/components/cookie-consent"
import { SplashScreen } from "@/components/splash-screen"

const _geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: 'EduSmart SN | Souveraineté Numérique pour l\'Éducation au Sénégal',
  description: 'Plateforme SaaS de gestion universitaire souveraine. Gérez vos établissements, étudiants, paiements et cursus académiques.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="bg-background">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </head>
      <body className={`${_geist.variable} ${_geistMono.variable} ${caveat.variable} font-sans antialiased`}>
        <SplashScreen />
        {children}
        <CookieConsent />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
