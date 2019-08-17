import React from 'react';
import Link from 'next/link';

import redirect from '../lib/redirect';
import checkLoggedIn from '../lib/checkLoggedIn';

import RegisterForm from '../components/RegisterForm';

export default class Register extends React.Component {
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
      <React.Fragment>
        {/* RegisterBox handles all register logic. */}
        <RegisterForm />
        <hr />
        Already have an account?{' '}
        <Link prefetch href="/login">
          <a>Sign in</a>
        </Link>
      </React.Fragment>
    );
  }
}
