import type { Metadata } from "next";
import "./globals.css";

const title = "ニョキニョキカンパニー｜あそびが、ニョキニョキ。";
const description = "ゲーム実況とLINEスタンプで、毎日にちいさな『おもしろい』を届けるニョキニョキカンパニーの公式サイトです。";
const siteUrl = "https://nyokinyokicompany.github.io/company-site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: `${siteUrl}/og.png`, width: 1536, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
