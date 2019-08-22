import * as React from 'react';

import Layout from '../components/Layout';
import Note from '../components/Note';
import checkLoggedIn from '../lib/checkLoggedIn';
import redirect from '../lib/redirect';
import { ApolloConsumer } from 'react-apollo';

class InitialPropsDetail extends React.Component<any> {
  static getInitialProps = async (context: any) => {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient);

    if (!loggedInUser.whoAmI) {
      // Throw them back to the main page
      redirect(context, '/');
    }

    return { loggedInUser, query: context.query };
  };

  render() {
    if (!(this.props as any).query.id) {
      return (
        <Layout>
          <div className="alert alert-danger" role="alert">
            Something went wrong!
          </div>
        </Layout>
      );
    }

    const { id, edit } = (this.props as any).query;

    return (
      <ApolloConsumer>
        {() => (
          <Layout>
            <Note id={id} edit={edit} />
          </Layout>
        )}
      </ApolloConsumer>
    );
  }
}

export default InitialPropsDetail;
