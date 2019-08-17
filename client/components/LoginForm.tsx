import { Mutation, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import cookie from 'cookie';
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
      onError={(error: any) => {
        // If you want to send error to external service?
        console.log(error);
      }}
    >
      {(signinUser: any, { error }: any) => (
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
          {error && <p>No user found with that information.</p>}
          <input
            name="email"
            placeholder="Email"
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
          <button>Sign in</button>
        </form>
      )}
    </Mutation>
  );
};

export default withApollo(LoginForm);
