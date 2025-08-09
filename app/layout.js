import './globals.css';
import Nav from "@/shared/ui/components/Nav";

export const metadata = {
  title: 'IdeaOasis',
  description: 'Curated startup ideas for Korea',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Nav />
        <main className="max-w-3xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
