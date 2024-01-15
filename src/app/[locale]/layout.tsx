import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import i18n from "i18next";
import { i18nextInitOptions } from "@/i18n/config";
import { I18nProvider } from "@/app/[locale]/i18nProvider";

i18n.init(i18nextInitOptions, (err) => {
  if (err) {
    console.error("i18next failed to initialize", err);
  }
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '紙マップ',
  description: 'Generated by Code for Japan',
};

export default function RootLayout({ children, params: { locale }, }: { children: React.ReactNode, params: { locale: string; }; }) {
  i18n.changeLanguage(locale);
  return (
    <html lang={locale}>
      <head />
      <body className={inter.className}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
