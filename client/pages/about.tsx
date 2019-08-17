import * as React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

const AboutPage: React.FunctionComponent = () => (
  <Layout title="About Journal App">
    <h1>About</h1>
    <p>Hello</p>
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

export default AboutPage;
