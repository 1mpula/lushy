import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lushy - Book your best look',
  description: 'The easiest way to book high-quality beauty and wellness professionals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}
