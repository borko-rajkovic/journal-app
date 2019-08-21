import gql from 'graphql-tag';

export default async (apolloClient: any, id: string) => {
  try {
    const data = await apolloClient.mutate({
      mutation: gql`
        mutation removeNote($id: String!) {
          removeNote(id: $id)
        }
      `,
      variables: {
        id,
      },
    });
    return { loggedInUser: data };
  } catch (error) {
    return { loggedInUser: {} };
  }
};
