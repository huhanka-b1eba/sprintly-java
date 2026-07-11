import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import { AppProviders } from '@/app/providers';
import { siteConfig } from '@/shared/config';
import { THEME_STORAGE_KEY } from '@/shared/lib/theme-storage';
import './globals.css';

export const metadata: Metadata = {
    title: siteConfig.title,
    description: siteConfig.description,
    icons: {
        icon: '/img/favicon.webp',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const themeInitScript = `(function(){try{var storedTheme=localStorage.getItem('${THEME_STORAGE_KEY}');var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var theme=storedTheme==='light'||storedTheme==='dark'?storedTheme:(prefersDark?'dark':'light');document.documentElement.classList.toggle('dark',theme==='dark');}catch(e){}})();`;

    return (
        <html lang="ru" suppressHydrationWarning>
            <body className="min-h-full antialiased">
                <Script
                    id="theme-init"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{ __html: themeInitScript }}
                />
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
