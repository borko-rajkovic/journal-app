import { Mutation, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import cookie from 'cookie';
import redirect from '../lib/redirect';

const CREATE_USER = gql`
  mutation Create($name: String!, $email: String!, $password: String!) {
    createUser(
      name: $name
      authProvider: { email: { email: $email, password: $password } }
    ) {
      id
    }
    signinUser(email: { email: $email, password: $password }) {
      token
    }
  }
`;

const RegisterBox = ({ client }: any) => {
  let name: any;
  let email: any;
  let password: any;

  return (
    <Mutation
      mutation={CREATE_USER}
      onCompleted={(data: any) => {
        // Store the token in cookie
        document.cookie = cookie.serialize('token', data.signinUser.token, {
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
        console.log(error);
      }}
    >
      {(create: any, { error }: any) => (
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();

            create({
              variables: {
                name: name.value,
                email: email.value,
                password: password.value,
              },
            });

            name.value = email.value = password.value = '';
          }}
        >
          {error && <p>Issue occurred while registering :(</p>}
          <input
            name="name"
            placeholder="Name"
            ref={node => {
              name = node;
            }}
          />
          <br />
          <input
            name="email"
            placeholder="Email"
            ref={node => {
              email = node;
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
