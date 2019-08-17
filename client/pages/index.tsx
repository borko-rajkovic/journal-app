import Link from 'next/link';
import React from 'react';
import { ApolloConsumer } from 'react-apollo';

import Layout from '../components/Layout';
import checkLoggedIn from '../lib/checkLoggedIn';
import redirect from '../lib/redirect';

export default class Index extends React.Component {
  static async getInitialProps(context: any) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient);

    if (!loggedInUser.whoAmI) {
      // If not signed in, send them somewhere more useful
      redirect(context, '/login');
    }

    return { loggedInUser };
  }

  render() {
    return (
      <ApolloConsumer>
        {() => (
          <Layout title="Welcome to Journal App">
            <h1> Hello {(this.props as any).loggedInUser.whoAmI.username}!</h1>
            <p>
              <Link href="/about">
                <a>About</a>
              </Link>
            </p>
          </Layout>
        )}
      </ApolloConsumer>
    );
  }
}
