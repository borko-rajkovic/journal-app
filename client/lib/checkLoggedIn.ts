import gql from 'graphql-tag';

export default (apolloClient: any) =>
  apolloClient
    .query({
      query: gql`
        query whoAmI {
          whoAmI {
            id
            username
          }
        }
      `,
    })
    .then(({ data }: any) => {
      return { loggedInUser: data };
    })
    .catch(() => {
      // Fail gracefully
      return { loggedInUser: {} };
    });
