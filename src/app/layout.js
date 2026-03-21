import './globals.css';

export const metadata = {
  title: 'LAPSLAPS — Design Your Laptop Cover',
  description: 'An immersive sticker customization experience. Design your dream laptop cover with digital stickers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
