import cookie from 'cookie';
import gql from 'graphql-tag';
import React from 'react';
import { Mutation, withApollo } from 'react-apollo';

import redirect from '../lib/redirect';

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(userData: { username: $username, password: $password })
  }
`;

const LoginForm = ({ client }: any) => {
  let username: any;
  let password: any;

  return (
    <Mutation
      mutation={LOGIN}
      onCompleted={(data: any) => {
        // Store the token in cookie
        document.cookie = cookie.serialize('token', data.login, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });
        // Force a reload of all the current queries now that the user is
        // logged in
        client.cache.reset().then(() => {
          redirect({}, '/');
        });
      }}
      // onError={(error: any) => {
      //   // If you want to send error to external service?
      // }}
    >
      {(signinUser: any, { error }: any) => (
        <React.Fragment>
          <legend>Login</legend>
          {error && (
            <div className="alert alert-danger" role="alert">
              Username or password invalid!
            </div>
          )}

          <div className="row">
            <div className="col-6">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  e.stopPropagation();

                  signinUser({
                    variables: {
                      username: username.value,
                      password: password.value,
                    },
                  });

                  username.value = password.value = '';
                }}
              >
                <fieldset>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      className="form-control"
                      placeholder="Enter username"
                      name="username"
                      ref={node => {
                        username = node;
                      }}
                    />
                    <small className="form-text text-muted">
                      We'll never share your data with anyone else.
                    </small>
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      className="form-control"
                      name="password"
                      placeholder="Password"
                      ref={node => {
                        password = node;
                      }}
                      type="password"
                    />
                  </div>
                  <button className="btn btn-primary">Submit</button>
                </fieldset>
              </form>
            </div>
          </div>
        </React.Fragment>
      )}
    </Mutation>
  );
};

export default withApollo(LoginForm);
