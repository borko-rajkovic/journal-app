import Link from 'next/link';
import moment from 'moment';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Query, withApollo } from 'react-apollo';

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
}: any) => {
  const numberOfPages = Math.ceil(count / size);
  const [queryLocal, setQueryLocal] = useState(query);
  return (
    <React.Fragment>
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
                onClick={e => {
                  e.preventDefault();
                  setPage(1);
                  setSize(5);
                }}
              >
                5
              </a>
              <a
                className="dropdown-item"
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setPage(1);
                  setSize(10);
                }}
              >
                10
              </a>
              <a
                className="dropdown-item"
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setPage(1);
                  setSize(25);
                }}
              >
                25
              </a>
              <a
                className="dropdown-item"
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setPage(1);
                  setSize(50);
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
            onKeyDown={e => {
              if (e.keyCode === 13) {
                setQuery((e.target as any).value);
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
            <th scope="col">Created</th>
            <th scope="col">Updated</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.length > 0 ? (
            notes.map(({ id, title, createdDate, updatedDate, body }: any) => (
              <tr key={id}>
                <td>{title}</td>
                <td>{body}</td>
                <td>
                  {moment(new Date(createdDate)).format('DD.MM.YYYY HH:mm:ss')}
                </td>
                <td>
                  {moment(new Date(updatedDate)).format('DD.MM.YYYY HH:mm:ss')}
                </td>
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
            ))
          ) : (
            <tr>
              <td colSpan={5}>There are no data</td>
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
                onClick={e => {
                  e.preventDefault();
                  setPage(1);
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
                  onClick={e => {
                    e.preventDefault();
                    setPage(i + 1);
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
                page === numberOfPages ? 'page-item disabled' : 'page-item'
              }
            >
              <a
                className="page-link"
                onClick={e => {
                  e.preventDefault();
                  setPage(numberOfPages);
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

const NotesWrapped = ({ count, query, setQuery }: any) => {
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
    >
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
          />
        );
      }}
    </Query>
  );
};

const AllNotes = () => {
  const [query, setQuery] = useState('');
  return (
    <Query query={NOTES_COUNT} variables={{ query }}>
      {({ data: count, loading: loadingCount }: any) =>
        loadingCount ? (
          <div className="text-center my-4">
            <div className="spinner-border" role="status" />
          </div>
        ) : (
          <NotesWrapped count={count} query={query} setQuery={setQuery} />
        )
      }
    </Query>
  );
};

export default withApollo(AllNotes);
