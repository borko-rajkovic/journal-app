import Head from 'next/head';
import * as React from 'react';

import Navbar from './Navbar';

interface Props {
  title?: string;
}

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = 'Journal app',
}) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="stylesheet"
          href="https://bootswatch.com/4/cerulean/bootstrap.min.css"
        />
      </Head>
      <Navbar />
      <div className="container">{children}</div>

      <footer className="badge-primary mt-3">
        <div className="footer-copyright text-center py-3">
          © {new Date().getFullYear()} Copyright: Borko Rajković
        </div>
      </footer>
    </div>
  );
};

export default Layout;
