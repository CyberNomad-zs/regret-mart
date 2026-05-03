import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/ToastProvider";
import { WalletProvider } from "@/components/WalletProvider";

export const metadata: Metadata = {
  title: "后悔药交易所 · RegretMart",
  description:
    "把后悔变成药丸挂上市集，AI 配药、虚拟币交易，2 分钟体验情绪互助经济。",
  openGraph: {
    title: "后悔药交易所",
    description: "把无形的后悔做成药丸，挂出来卖给愿意理解你的人。",
    type: "website"
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%23f1839f'/%3E%3Cstop offset='1' stop-color='%2388aed6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='10' y='30' width='80' height='40' rx='20' fill='url(%23g)'/%3E%3Cpath d='M50 30 L50 70' stroke='%23ffffff' stroke-width='3' opacity='0.7'/%3E%3C/svg%3E"
  }
};

export const viewport: Viewport = {
  themeColor: "#fdf9f3",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <ToastProvider>
          <WalletProvider>
            <Header />
            <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-4 md:px-6">{children}</main>
            <Footer />
          </WalletProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
