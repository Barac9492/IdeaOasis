import './globals.css';
import Nav from "../components/Nav";
import Providers from "./providers";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const pretendard = localFont({
  src: [
    { path: "../public/fonts/PretendardVariable.woff2", weight: "45 920", style: "normal" },
  ],
  variable: "--font-pretendard",
});

export const metadata = {
  title: 'IdeaOasis',
  description: 'Curated startup ideas for Korea',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} ${pretendard.variable} font-sans bg-gray-50 dark:bg-neutral-950`}>
        <Providers>
          <Nav />
          <main className="max-w-6xl mx-auto px-4 py-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
