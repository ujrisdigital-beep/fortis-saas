import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FortisOS Ombudsman Module',
  description: 'Office of the Ombudsman - The Gambia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
