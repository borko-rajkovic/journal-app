import gql from 'graphql-tag';
import React from 'react';
import { Mutation, withApollo } from 'react-apollo';

import redirect from '../lib/redirect';

const CREATE_NOTE = gql`
  mutation addNote($title: String!, $body: String!, $file: Upload) {
    addNote(newNoteData: { title: $title, body: $body, file: $file }) {
      id
      userId
      title
      body
    }
  }
`;

const NewNoteForm = () => {
  let title: any;
  let body: any;
  let file: any;

  return (
    <Mutation
      mutation={CREATE_NOTE}
      onCompleted={() => redirect({}, '/')}
      // onError={(error: ApolloError) => {}}
    >
      {(create: any, { error, loading }: any) =>
        loading ? (
          <div className="text-center my-4">
            <div className="spinner-border" role="status" />
          </div>
        ) : (
          <React.Fragment>
            <legend>Create new note</legend>

            <div className="row">
              <div className="col-6">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    e.stopPropagation();

                    const variables: any = {
                      title: title.value,
                      body: body.value,
                    };

                    if (file.files[0]) {
                      variables.file = file.files[0];
                    }

                    return (
                      file.validity.valid &&
                      create({
                        variables,
                      })
                    );
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
                        ref={node => {
                          title = node;
                        }}
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
                        ref={node => {
                          body = node;
                        }}
                      />
                      <div className="invalid-feedback">
                        Body should be at least 10 characters long
                      </div>
                    </div>

                    <div className="form-group">
                      <label>File (optional)</label>
                      <input
                        type="file"
                        className="form-control-file"
                        aria-describedby="fileHelp"
                        ref={node => {
                          file = node;
                        }}
                      />
                      <small id="fileHelp" className="form-text text-muted">
                        Provide file attachment to your note. This is optional
                        and later on you can add file if you want by editing
                        this note.
                      </small>
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

export default withApollo(NewNoteForm);
