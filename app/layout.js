import './globals.css';
import Nav from "@/components/Nav";
import AuthGuard from "@/components/AuthGuard";

export const metadata = {
  title: 'IdeaOasis',
  description: 'Curated startup ideas for Korea',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="bg-white min-h-screen">
        <AuthGuard>
          <Nav />
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}
