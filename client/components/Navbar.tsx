import cookie from 'cookie';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { withApollo } from 'react-apollo';
import checkLoggedIn from '../lib/checkLoggedIn';
import redirect from '../lib/redirect';

const Navbar = ({ client }: any) => {
  const [user, setUser]: any[] = useState({});

  async function checkUser() {
    const { loggedInUser } = await checkLoggedIn(client);

    setUser(loggedInUser);
  }

  async function signout(apolloClient: any) {
    document.cookie = cookie.serialize('token', '', {
      maxAge: -1, // Expire the cookie immediately
    });

    // Force a reload of all the current queries now that the user is
    // logged in, so we don't accidentally leave any state around.
    apolloClient.cache.reset().then(() => {
      // Redirect to a more useful page when signed out
      redirect({}, '/');
    });
  }

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <nav className="navbar navbar-expand navbar-dark bg-primary mb-4">
      <div className="container">
        <Link href="/">
          <a className="navbar-brand">JournalApp</a>
        </Link>
        <div className="collapse navbar-collapse">
          {user.whoAmI ? (
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link href="/">
                  <a className="nav-link">Home</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/about">
                  <a className="nav-link">About</a>
                </Link>
              </li>
              <li>
                <button onClick={() => signout(client)}>Sign out</button>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link href="/login">
                  <a className="nav-link">Login</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/register">
                  <a className="nav-link">Register</a>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default withApollo(Navbar);
