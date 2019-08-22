import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Mutation, withApollo } from 'react-apollo';

import redirect from '../lib/redirect';

const EDIT_NOTE = gql`
  mutation editNote($title: String, $body: String, $id: String!) {
    editNote(updatedNoteData: { id: $id, title: $title, body: $body }) {
      id
      userId
      title
      body
      createdDate
      updatedDate
    }
  }
`;

const EditNoteForm = (props: any) => {
  const { note } = props;
  const { id } = note;

  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);

  return (
    <Mutation
      mutation={EDIT_NOTE}
      onCompleted={(data: any) =>
        redirect({}, `/note?id=${data.editNote.id}&edit=false`)
      }
      // onError={(error: ApolloError) => {}}
    >
      {(edit: any, { error, loading }: any) =>
        loading ? (
          <div className="text-center my-4">
            <div className="spinner-border" role="status" />
          </div>
        ) : (
          <React.Fragment>
            <legend>Edit note</legend>

            <div className="row">
              <div className="col-6">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    e.stopPropagation();

                    edit({
                      variables: {
                        id,
                        title,
                        body,
                      },
                    });
                  }}
                >
                  <fieldset>
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        className={
                          error ? 'form-control is-invalid' : 'form-control'
                        }
                        placeholder="Enter title"
                        name="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                      />
                      {error ? null : (
                        <small className="form-text text-muted">
                          This should be short summary of your note
                        </small>
                      )}
                      <div className="invalid-feedback">
                        Title must not be empty
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Body</label>
                      <textarea
                        className={
                          error ? 'form-control is-invalid' : 'form-control'
                        }
                        name="body"
                        rows={5}
                        value={body}
                        onChange={e => setBody(e.target.value)}
                      />
                      <div className="invalid-feedback">
                        Body should be at least 10 characters long
                      </div>
                    </div>
                    <button className="btn btn-primary">Submit</button>
                  </fieldset>
                </form>
              </div>
            </div>
          </React.Fragment>
        )
      }
    </Mutation>
  );
};

export default withApollo<any, any>(EditNoteForm);
