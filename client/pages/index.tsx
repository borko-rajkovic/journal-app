import cookie from 'cookie';
import Link from 'next/link';
import React from 'react';
import { ApolloConsumer } from 'react-apollo';

import Layout from '../components/Layout';
import checkLoggedIn from '../lib/checkLoggedIn';
import redirect from '../lib/redirect';

export default class Index extends React.Component {
  static async getInitialProps(context: any) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient);

    if (!loggedInUser.user) {
      // If not signed in, send them somewhere more useful
      redirect(context, '/signin');
    }

    return { loggedInUser };
  }

  signout = (apolloClient: any) => () => {
    document.cookie = cookie.serialize('token', '', {
      maxAge: -1, // Expire the cookie immediately
    });

    // Force a reload of all the current queries now that the user is
    // logged in, so we don't accidentally leave any state around.
    apolloClient.cache.reset().then(() => {
      // Redirect to a more useful page when signed out
      redirect({}, '/signin');
    });
  };

  render() {
    return (
      <ApolloConsumer>
        {client => (
          <Layout title="Welcome to Journal App">
            <h1> Hello {(this.props as any).loggedInUser.user.name}!</h1>
            <p>
              <Link href="/about">
                <a>About</a>
              </Link>
            </p>
            <div>
              <button onClick={this.signout(client)}>Sign out</button>
            </div>
          </Layout>
        )}
      </ApolloConsumer>
    );
  }
}
