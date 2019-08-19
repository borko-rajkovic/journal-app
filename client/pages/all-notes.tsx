import React from 'react';

import AllNotes from '../components/AllNotes';
import Layout from '../components/Layout';
import checkLoggedIn from '../lib/checkLoggedIn';
import redirect from '../lib/redirect';

export default class Register extends React.Component {
  static async getInitialProps(context: any) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient);

    if (!loggedInUser.whoAmI) {
      // Throw them back to the main page
      redirect(context, '/');
    }

    return { loggedInUser };
  }

  render() {
    return (
      <Layout>
        <AllNotes />
      </Layout>
    );
  }
}
