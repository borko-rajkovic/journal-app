import React from 'react';

import Layout from '../components/Layout';
import NewNoteForm from '../components/NewNoteForm';
import checkLoggedIn from '../lib/checkLoggedIn';
import redirect from '../lib/redirect';

export default class NewNotePage extends React.Component {
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
        <NewNoteForm />
      </Layout>
    );
  }
}
