import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

import redirect from '../lib/redirect';
import checkLoggedIn from '../lib/checkLoggedIn';

import SigninBox from '../components/SigninBox';

export default class Signin extends React.Component {
  static async getInitialProps(context: any) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient);

    if (loggedInUser.whoAmI) {
      // Already signed in? No need to continue.
      // Throw them back to the main page
      redirect(context, '/');
    }

    return {};
  }

  render() {
    return (
      <Layout>
        {/* SigninBox handles all login logic. */}
        <SigninBox />
        <hr />
        New?{' '}
        <Link prefetch href="/create-account">
          <a>Create account</a>
        </Link>
      </Layout>
    );
  }
}
