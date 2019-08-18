import Link from 'next/link';
import moment from 'moment';
import gql from 'graphql-tag';
import React from 'react';
import { Query, withApollo } from 'react-apollo';

const ALL_NOTES = gql`
  {
    notes {
      id
      title
      createdDate
      updatedDate
      body
    }
  }
`;

//

const NotesLoaded = ({ notes }: any) => (
  <table className="table table-striped">
    <thead>
      <tr>
        <th scope="col">Title</th>
        <th scope="col">Body</th>
        <th scope="col">Created</th>
        <th scope="col">Updated</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      {notes.map(({ id, title, createdDate, updatedDate, body }: any) => (
        <tr key={id}>
          <td>{title}</td>
          <td>{body}</td>
          <td>{moment(new Date(createdDate)).format('DD.MM.YYYY HH:mm:ss')}</td>
          <td>{moment(new Date(updatedDate)).format('DD.MM.YYYY HH:mm:ss')}</td>
          <td>
            <div className="row">
              <div className="col-6">
                <Link href="/">
                  <a>
                    <i className="fas fa-edit" />
                  </a>
                </Link>
              </div>
              <div className="col-6">
                <Link href="/">
                  <a className="text-danger">
                    <i className="fas fa-trash-alt" />
                  </a>
                </Link>
              </div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const AllNotes = () => {
  return (
    <Query query={ALL_NOTES}>
      {({ data, error, loading }: any) => {
        const { notes } = data;
        return loading ? (
          <div className="text-center my-4">
            <div className="spinner-border" role="status" />
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            Something went wrong!
          </div>
        ) : notes.length > 0 ? (
          <NotesLoaded notes={notes} error={error} />
        ) : null;
      }}
    </Query>
  );
};

export default withApollo(AllNotes);
