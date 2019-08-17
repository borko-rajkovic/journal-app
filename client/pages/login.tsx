import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

import redirect from '../lib/redirect';
import checkLoggedIn from '../lib/checkLoggedIn';

import LoginForm from '../components/LoginForm';

export default class Login extends React.Component {
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
        <LoginForm />
        <hr />
        New?{' '}
        <Link prefetch href="/register">
          <a>Create account</a>
        </Link>
      </Layout>
    );
  }
}
