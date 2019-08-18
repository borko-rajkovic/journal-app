import gql from 'graphql-tag';
import React from 'react';
import { Query, withApollo } from 'react-apollo';
import { Note } from './Note';

const LATEST_THREE_NOTES = gql`
  {
    notes(asc: false, take: 3) {
      id
      title
      createdDate
      updatedDate
      body
    }
  }
`;

const LatestThreeNotesLoaded = ({ notes }: any) => (
  <React.Fragment>
    <div className="row">
      <div className="col-4 d-flex align-items-stretch">
        <Note
          body={notes[0].body}
          title={notes[0].title}
          createdDate={notes[0].updatedDate}
          float={1}
        />
      </div>
      {notes.length > 1 ? (
        <div className="col-4 d-flex align-items-stretch">
          <Note
            body={notes[1].body}
            title={notes[1].title}
            createdDate={notes[1].updatedDate}
            float={2}
          />
        </div>
      ) : null}
      {notes.length > 2 ? (
        <div className="col-4 d-flex align-items-stretch">
          <Note
            body={notes[2].body}
            title={notes[2].title}
            createdDate={notes[2].updatedDate}
            float={3}
          />
        </div>
      ) : null}
    </div>
  </React.Fragment>
);

const LatestThreeNotes = () => {
  return (
    <Query query={LATEST_THREE_NOTES}>
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
          <LatestThreeNotesLoaded notes={notes} error={error} />
        ) : (
          <div className="alert alert-info" role="alert">
            <h4 className="alert-heading">Make some notes!</h4>
            <p>
              You don't have any notes yet. We encourage you to try create some
              new notes and play around with the application. Thank you for your
              trust and time you spend to check out this application.
            </p>
            <hr />
            <p className="mb-0">
              This alert will be removed once you have at least one note.
            </p>
          </div>
        );
      }}
    </Query>
  );
};

export default withApollo(LatestThreeNotes);
