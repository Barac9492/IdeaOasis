import './globals.css';
import Nav from "@/components/Nav";

export const metadata = {
  title: 'IdeaOasis',
  description: 'Korean Regulatory Intelligence & AI-Powered Business Insights',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="bg-white min-h-screen">
        <Nav />
        {children}
      </body>
    </html>
  );
}
