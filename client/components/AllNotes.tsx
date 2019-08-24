import cookie from 'cookie';
import gql from 'graphql-tag';
import moment from 'moment';
import Link from 'next/link';
import React, { useState } from 'react';
import { Query, withApollo } from 'react-apollo';
import ReactModal from 'react-modal';

import deleteNote from '../lib/deleteNote';

const NOTES_COUNT = gql`
  query notesCount($query: String) {
    notesCount(query: $query)
  }
`;

const ALL_NOTES = gql`
  query notes($skip: Int, $take: Int, $query: String) {
    notes(skip: $skip, take: $take, query: $query) {
      id
      title
      attachment
      createdDate
      updatedDate
      body
    }
  }
`;

const NotesLoaded = ({
  notes,
  count,
  page,
  setPage,
  size,
  setSize,
  setQuery,
  query,
  apolloClient,
  refetchCount,
  refetchNotes,
}: any) => {
  const numberOfPages = Math.ceil(count / size);
  const [queryLocal, setQueryLocal] = useState(query);
  const [showModal, setShowModal] = useState(false);
  const [noteId, setNoteId] = useState('');

  ReactModal.setAppElement('#__next');

  const linkRef = React.createRef();

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
                await deleteNote(apolloClient, noteId);
                setShowModal(false);
                await refetchCount();
                await refetchNotes();
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
        <div className="col-8">
          <div className="dropdown">
            Show{' '}
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-toggle="dropdown"
            >
              {size}
            </button>{' '}
            entries
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a
                className="dropdown-item"
                href="#"
                onClick={async e => {
                  e.preventDefault();
                  setPage(1);
                  setSize(5);
                  await refetchCount();
                  await refetchNotes();
                }}
              >
                5
              </a>
              <a
                className="dropdown-item"
                href="#"
                onClick={async e => {
                  e.preventDefault();
                  setPage(1);
                  setSize(10);
                  await refetchCount();
                  await refetchNotes();
                }}
              >
                10
              </a>
              <a
                className="dropdown-item"
                href="#"
                onClick={async e => {
                  e.preventDefault();
                  setPage(1);
                  setSize(25);
                  await refetchCount();
                  await refetchNotes();
                }}
              >
                25
              </a>
              <a
                className="dropdown-item"
                href="#"
                onClick={async e => {
                  e.preventDefault();
                  setPage(1);
                  setSize(50);
                  await refetchCount();
                  await refetchNotes();
                }}
              >
                50
              </a>
            </div>
          </div>
        </div>
        <div className="col-4">
          <input
            className="form-control"
            placeholder="Search"
            value={queryLocal}
            onKeyDown={async e => {
              if (e.keyCode === 13) {
                setQuery((e.target as any).value);
                await refetchCount();
                await refetchNotes();
              }
            }}
            onChange={e => setQueryLocal((e.target as any).value)}
          />
        </div>
      </div>
      <table className="table table-striped my-3">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Body</th>
            <th scope="col">Attachment</th>
            <th scope="col">Created</th>
            <th scope="col">Updated</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.length > 0 ? (
            notes.map(
              ({
                id,
                title,
                createdDate,
                updatedDate,
                body,
                attachment,
              }: any) => (
                <tr key={id}>
                  <td>
                    <Link href={`/note?id=${id}&edit=false`}>
                      <a>{title}</a>
                    </Link>
                  </td>
                  <td>{body}</td>
                  <td>
                    {attachment ? (
                      <React.Fragment>
                        <a ref={linkRef as any} />
                        <div className="row">
                          <div className="col-12">
                            <a
                              className="float-right"
                              href="#"
                              onClick={async e => {
                                e.preventDefault();
                                // const port = process.env.PORT || 3000;
                                // const host =
                                //   process.env.NODE_ENV === 'production'
                                //     ? 'https://journal-mern.herokuapp.com'
                                //     : `http://localhost:${port}`;
                                const path = `/download?path=${attachment}`;
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
                                  a.download = attachment.split(
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
                          </div>
                        </div>
                      </React.Fragment>
                    ) : null}
                  </td>
                  <td>
                    {moment(new Date(createdDate)).format(
                      'DD.MM.YYYY HH:mm:ss',
                    )}
                  </td>
                  <td>
                    {moment(new Date(updatedDate)).format(
                      'DD.MM.YYYY HH:mm:ss',
                    )}
                  </td>
                  <td>
                    <div className="row">
                      <div className="col-6">
                        <Link href={`/note?id=${id}&edit=true`}>
                          <a>
                            <i className="fas fa-edit" />
                          </a>
                        </Link>
                      </div>
                      <div className="col-6">
                        <Link href="/">
                          <a
                            className="text-danger"
                            onClick={(e: any) => {
                              e.preventDefault();
                              setNoteId(id);
                              setShowModal(true);
                            }}
                          >
                            <i className="fas fa-trash-alt" />
                          </a>
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ),
            )
          ) : (
            <tr>
              <td colSpan={6}>There are no data</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="row">
        <div className="col-6">
          <p className="text-muted">
            Showing {size * (page - 1) + 1} to {Math.min(size * page, count)} of{' '}
            {count} entries
          </p>
        </div>
        <div className="col-6 float-right">
          <ul className="pagination float-right">
            <li className={page === 1 ? 'page-item disabled' : 'page-item'}>
              <a
                className="page-link"
                onClick={async e => {
                  e.preventDefault();
                  setPage(1);
                  await refetchCount();
                  await refetchNotes();
                }}
                style={{ cursor: 'pointer' }}
                href="#"
              >
                &laquo;
              </a>
            </li>
            {[...Array(numberOfPages).keys()].map(i => (
              <li
                key={i}
                className={page === i + 1 ? 'page-item active' : 'page-item'}
              >
                <a
                  className="page-link"
                  onClick={async e => {
                    e.preventDefault();
                    setPage(i + 1);
                    await refetchCount();
                    await refetchNotes();
                  }}
                  style={{ cursor: 'pointer' }}
                  href="#"
                >
                  {i + 1}
                </a>
              </li>
            ))}
            <li
              className={
                page === numberOfPages || numberOfPages === 0
                  ? 'page-item disabled'
                  : 'page-item'
              }
            >
              <a
                className="page-link"
                onClick={async e => {
                  e.preventDefault();
                  setPage(numberOfPages);
                  await refetchCount();
                  await refetchNotes();
                }}
                style={{ cursor: 'pointer' }}
                href="#"
              >
                &raquo;
              </a>
            </li>
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

const NotesWrapped = ({
  count,
  query,
  setQuery,
  apolloClient,
  refetchCount,
}: any) => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const skip = (page - 1) * size;
  const take = size;

  return (
    <Query
      query={ALL_NOTES}
      variables={{
        skip,
        take,
        query,
      }}
      fetchPolicy="network-only"
    >
      {({ data, error, loading, refetch: refetchNotes }: any) => {
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
          <NotesLoaded
            notes={notes}
            error={error}
            count={count.notesCount}
            page={page}
            size={size}
            setPage={setPage}
            setSize={setSize}
            setQuery={setQuery}
            query={query}
            apolloClient={apolloClient}
            refetchCount={refetchCount}
            refetchNotes={refetchNotes}
          />
        );
      }}
    </Query>
  );
};

const AllNotes = ({ client }: any) => {
  const [query, setQuery] = useState('');
  return (
    <Query query={NOTES_COUNT} variables={{ query }} fetchPolicy="network-only">
      {({ data: count, loading: loadingCount, refetch: refetchCount }: any) =>
        loadingCount ? (
          <div className="text-center my-4">
            <div className="spinner-border" role="status" />
          </div>
        ) : (
          <NotesWrapped
            count={count}
            query={query}
            setQuery={setQuery}
            apolloClient={client}
            refetchCount={refetchCount}
          />
        )
      }
    </Query>
  );
};

export default withApollo(AllNotes);
