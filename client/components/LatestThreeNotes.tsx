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
      <div className="col-4 d-flex align-items-stretch">
        <Note
          body={notes[1].body}
          title={notes[1].title}
          createdDate={notes[1].updatedDate}
          float={2}
        />
      </div>
      <div className="col-4 d-flex align-items-stretch">
        <Note
          body={notes[2].body}
          title={notes[2].title}
          createdDate={notes[2].updatedDate}
          float={3}
        />
      </div>
    </div>
  </React.Fragment>
);

const LatestThreeNotes = () => {
  return (
    <Query query={LATEST_THREE_NOTES}>
      {({ data, error, loading }: any) => {
        console.log('data', data);
        const { notes } = data;
        return loading ? (
          <div className="text-center my-4">
            <div className="spinner-border" role="status" />
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            Something went wrong!
          </div>
        ) : (
          <LatestThreeNotesLoaded notes={notes} error={error} />
        );
      }}
    </Query>
  );
};

export default withApollo(LatestThreeNotes);
