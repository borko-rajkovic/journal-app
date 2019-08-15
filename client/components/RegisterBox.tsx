import cookie from 'cookie';
import gql from 'graphql-tag';
import { Mutation, withApollo } from 'react-apollo';

import redirect from '../lib/redirect';

const CREATE_USER = gql`
  mutation register($username: String!, $password: String!) {
    register(userData: { username: $username, password: $password }) {
      id
      username
      createdDate
    }
    login(userData: { username: $username, password: $password })
  }
`;

const RegisterBox = ({ client }: any) => {
  let username: any;
  let password: any;

  return (
    <Mutation
      mutation={CREATE_USER}
      onCompleted={(data: any) => {
        // Store the token in cookie
        console.log('Data', data);
        document.cookie = cookie.serialize('token', data.login, {
          maxAge: 2 * 24 * 60 * 60, // 2 days
        });
        // Force a reload of all the current queries now that the user is
        // logged in
        client.cache.reset().then(() => {
          redirect({}, '/');
        });
      }}
      onError={(error: any) => {
        // If you want to send error to external service?
        console.log(JSON.stringify(error.name));
      }}
    >
      {(create: any, { error }: any) => (
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();

            create({
              variables: {
                username: username.value,
                password: password.value,
              },
            });

            username.value = password.value = '';
          }}
        >
          {error && <p>Username not available</p>}
          <input
            name="username"
            placeholder="username"
            ref={node => {
              username = node;
            }}
          />
          <br />
          <input
            name="password"
            placeholder="Password"
            ref={node => {
              password = node;
            }}
            type="password"
          />
          <br />
          <button>Register</button>
        </form>
      )}
    </Mutation>
  );
};

export default withApollo(RegisterBox);
