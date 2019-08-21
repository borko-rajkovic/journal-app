import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Query, withApollo } from 'react-apollo';
import ReactModal from 'react-modal';

import { Note } from './Note';
import deleteNote from '../lib/deleteNote';

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

const LatestThreeNotesLoaded = ({ notes, apolloClient, refetch }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [noteIdForDelete, setNoteIdForDelete] = useState('');

  return (
    <React.Fragment>
      <ReactModal
        isOpen={showModal}
        style={{
          content: {
            border: 0,
            padding: 0,
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <div className="modal-content" style={{ zIndex: 10 }}>
          <div className="modal-header">
            <h5 className="modal-title">Are you sure?</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Please confirm if you are sure you want to do this action</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                await deleteNote(apolloClient, noteIdForDelete);
                await refetch();
                setShowModal(false);
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => setShowModal(false)}
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </ReactModal>
      <div className="row">
        <div className="col-4 d-flex align-items-stretch">
          <Note
            id={notes[0].id}
            body={notes[0].body}
            title={notes[0].title}
            createdDate={notes[0].updatedDate}
            setShowModal={setShowModal}
            float={1}
            setNoteIdForDelete={setNoteIdForDelete}
          />
        </div>
        {notes.length > 1 ? (
          <div className="col-4 d-flex align-items-stretch">
            <Note
              id={notes[1].id}
              body={notes[1].body}
              setShowModal={setShowModal}
              title={notes[1].title}
              createdDate={notes[1].updatedDate}
              float={2}
              setNoteIdForDelete={setNoteIdForDelete}
            />
          </div>
        ) : null}
        {notes.length > 2 ? (
          <div className="col-4 d-flex align-items-stretch">
            <Note
              id={notes[2].id}
              body={notes[2].body}
              setShowModal={setShowModal}
              title={notes[2].title}
              createdDate={notes[2].updatedDate}
              float={3}
              setNoteIdForDelete={setNoteIdForDelete}
            />
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
};

const LatestThreeNotes = ({ client }: any) => {
  ReactModal.setAppElement('#__next');
  return (
    <Query query={LATEST_THREE_NOTES} fetchPolicy="network-only">
      {({ data, error, loading, refetch }: any) => {
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
          <LatestThreeNotesLoaded
            notes={notes}
            error={error}
            apolloClient={client}
            refetch={refetch}
          />
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
