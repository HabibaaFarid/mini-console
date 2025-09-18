import "../styles/globals.css";

export const metadata = {
  title: "XPay Mini Console",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <h1>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/">XPay Mini Console</a>
            </h1>
            <nav>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/">Home</a>
              <a href="/new">New Payment</a>
            </nav>
          </div>
        </header>
        <main className="container" role="main">
          {children}
        </main>
      </body>
    </html>
  );
}
