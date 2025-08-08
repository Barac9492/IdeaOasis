// app/layout.js
import './globals.css';

export const metadata = {
  title: 'IdeaOasis',
  description: 'Curated startup ideas for Korea',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
