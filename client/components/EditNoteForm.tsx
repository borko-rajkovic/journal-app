import cookie from 'cookie';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Mutation, withApollo } from 'react-apollo';

import redirect from '../lib/redirect';

const EDIT_NOTE = gql`
  mutation editNote(
    $title: String
    $body: String
    $id: String!
    $file: Upload
  ) {
    editNote(
      updatedNoteData: { id: $id, title: $title, body: $body, file: $file }
    ) {
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

const EditNoteForm = (props: any) => {
  const { note } = props;
  const { id } = note;

  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);

  let file: any;
  const linkRef = React.createRef();

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

                    const variables: any = {
                      id,
                      title,
                      body,
                    };

                    if (file.files[0]) {
                      variables.file = file.files[0];
                    }

                    edit({
                      variables,
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

                    {note.attachment ? (
                      <React.Fragment>
                        <a ref={linkRef as any} />
                        <div className="alert alert-dismissible alert-warning">
                          <a
                            className="close"
                            href="#"
                            onClick={async e => {
                              e.preventDefault();
                              // const port = process.env.PORT || 3000;
                              // const host =
                              //   process.env.NODE_ENV === 'production'
                              //     ? 'https://journal-mern.herokuapp.com'
                              //     : `http://localhost:${port}`;
                              const path = `/download?path=${note.attachment}`;
                              try {
                                const parsedCookie = cookie.parse(
                                  document.cookie,
                                );

                                const token = parsedCookie.token;
                                const data = await fetch(path, {
                                  headers: {
                                    authorization: `Bearer ${token}`,
                                  },
                                });
                                const blob = await data.blob();
                                const href = window.URL.createObjectURL(blob);
                                const a: any = linkRef.current;
                                a.download = note.attachment.split(
                                  './uploads/',
                                )[1];
                                a.href = href;
                                a.click();
                                a.href = '';
                              } catch (error) {
                                return;
                              }

                              // href={`/download?path=${attachment}`}
                            }}
                          >
                            <i className="far fa-file-alt" />
                          </a>
                          <h4 className="alert-heading">Warning!</h4>
                          <p className="mb-0">
                            There is attachment for this note already. If you
                            upload new file you will lose existing attachment.
                          </p>
                        </div>
                      </React.Fragment>
                    ) : null}

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
                        Provide file attachment to your note. Take note that if
                        there was an existing file it will be overriden.
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

export default withApollo<any, any>(EditNoteForm);
