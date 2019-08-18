import Link from 'next/link';
import React from 'react';
import { ApolloConsumer } from 'react-apollo';

import LatestThreeNotes from '../components/LatestThreeNotes';
import Layout from '../components/Layout';
import checkLoggedIn from '../lib/checkLoggedIn';
import AllNotes from '../components/AllNotes';

const PleaseLogIn = () => (
  <div className="jumbotron">
    <h1 className="display-3">Welcome to Journal App!</h1>
    <p className="lead">
      This is a simple journal application for storing your personal notes.
    </p>
    <hr className="my-4" />
    <p>Please login to see your notes or register to make your free account.</p>
    <div className="row">
      <div className="col-6">
        <p className="lead">
          <Link href="/login">
            <a className="btn btn-primary btn-lg" role="button">
              Login
            </a>
          </Link>
        </p>
      </div>
      <div className="col-6">
        <p className="lead float-right">
          <Link href="/register">
            <a className="btn btn-primary btn-lg" role="button">
              Register
            </a>
          </Link>
        </p>
      </div>
    </div>
  </div>
);

const MainView = ({ loggedInUser }: any) => (
  <React.Fragment>
    <div className="jumbotron">
      <h1 className="display-3">
        Hello <strong>{loggedInUser.whoAmI.username}</strong>!
      </h1>
      <p className="lead">Here you can check your latest notes</p>
      <hr className="my-4" />
      <p>
        Latest three notes will be shown bellow, for other notes check list
        bellow for more details
      </p>
    </div>
    <hr className="my-4" />
    <LatestThreeNotes />
    <AllNotes />
  </React.Fragment>
);

export default class Index extends React.Component {
  static async getInitialProps(context: any) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient);

    return { loggedInUser };
  }

  render() {
    const { loggedInUser } = this.props as any;
    return (
      <ApolloConsumer>
        {() => (
          <Layout title="Welcome to Journal App">
            {loggedInUser.whoAmI ? (
              <MainView loggedInUser={loggedInUser} />
            ) : (
              <PleaseLogIn />
            )}
          </Layout>
        )}
      </ApolloConsumer>
    );
  }
}
