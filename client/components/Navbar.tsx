import cookie from 'cookie';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { withApollo } from 'react-apollo';
import checkLoggedIn from '../lib/checkLoggedIn';
import redirect from '../lib/redirect';

const NavbarGuest = () => (
  <nav className="navbar navbar-expand navbar-dark bg-primary mb-4">
    <div className="container">
      <Link href="/">
        <a className="navbar-brand">JournalApp</a>
      </Link>
      <div className="collapse navbar-collapse">
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
      </div>
    </div>
  </nav>
);

const NavbarUser = ({ signout, client }: any) => (
  <nav className="navbar navbar-expand navbar-dark bg-primary mb-4">
    <div className="container">
      <Link href="/">
        <a className="navbar-brand">JournalApp</a>
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto nav-flex-icons">
          <li className="nav-item">
            <Link href="/new-note">
              <a className="nav-link waves-effect waves-light">
                <i className="fas fa-plus-circle" /> New note
              </a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/all-notes">
              <a className="nav-link waves-effect waves-light">
                <i className="far fa-copy" /> All notes
              </a>
            </Link>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              data-toggle="dropdown"
              href=""
            >
              <i className="fas fa-user" />
            </a>
            <div className="dropdown-menu dropdown-menu-right dropdown-default">
              <Link href="/">
                <a className="dropdown-item" onClick={() => signout(client)}>
                  Sign out
                </a>
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

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

    setUser({});

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

  return user.whoAmI ? (
    <NavbarUser signout={signout} client={client} />
  ) : (
    <NavbarGuest />
  );
};

export default withApollo(Navbar);
