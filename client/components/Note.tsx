import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Query, withApollo } from 'react-apollo';
import ReactModal from 'react-modal';

import deleteNote from '../lib/deleteNote';
import { NoteCard } from './NoteCard';
import redirect from '../lib/redirect';
import EditNoteForm from './EditNoteForm';

const GET_NOTE = gql`
  query note($id: String!) {
    note(id: $id) {
      id
      userId
      title
      body
      attachment
      createdDate
      updatedDate
    }
  }
`;

const Note = (props: any) => {
  const [showModal, setShowModal] = useState(false);
  const [noteIdForDelete, setNoteIdForDelete] = useState('');

  const { id, edit, client } = props;

  return (
    <Query
      query={GET_NOTE}
      variables={{
        id,
      }}
      fetchPolicy="network-only"
    >
      {({ data, error, loading }: any) => {
        ReactModal.setAppElement('#__next');
        const { note } = data;
        return loading ? (
          <div className="text-center my-4">
            <div className="spinner-border" role="status" />
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            Something went wrong!
          </div>
        ) : edit !== 'true' ? (
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
                  <p>
                    Please confirm if you are sure you want to do this action
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={async () => {
                      await deleteNote(client, noteIdForDelete);
                      setShowModal(false);
                      redirect({}, '/');
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
            <NoteCard
              body={note.body}
              attachment={note.attachment}
              createdDate={note.createdDate}
              id={note.id}
              setNoteIdForDelete={setNoteIdForDelete}
              setShowModal={setShowModal}
              title={note.title}
              notePreview={true}
              float={2}
            />
          </React.Fragment>
        ) : (
          <EditNoteForm note={note} />
        );
      }}
    </Query>
  );
};

export default withApollo<any, any>(Note);
