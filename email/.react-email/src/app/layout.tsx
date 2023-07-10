import '../styles/globals.css';
import classnames from 'classnames';
import { Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black font-sans text-slate-12">
        <div className={classnames(inter.variable, 'font-sans')}>
          {children}
        </div>
      </body>
    </html>
  );
}
