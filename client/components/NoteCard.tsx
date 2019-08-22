import * as React from 'react';
import moment from 'moment';
import Link from 'next/link';

interface NoteCardProps {
  id: string;
  title: string;
  body: string;
  createdDate: number;
  float: number;
  setShowModal: any;
  setNoteIdForDelete: any;
  notePreview?: boolean;
}

export const NoteCard: React.SFC<NoteCardProps> = ({
  id,
  title,
  body,
  float,
  createdDate,
  setShowModal,
  setNoteIdForDelete,
  notePreview,
}) => {
  let className = 'card border-secondary mb-3';
  switch (float) {
    case 2:
      className = 'card border-secondary mb-3 mx-auto';
      break;
    case 3:
      className = 'card border-secondary mb-3 float-right';
      break;
  }
  return (
    <div
      className={className}
      style={
        notePreview
          ? {
              minHeight: '400px',
            }
          : {
              maxWidth: '20rem',
              width: '100%',
            }
      }
    >
      <div className="card-header">
        {moment(new Date(createdDate)).fromNow()}
      </div>
      <div className="card-body">
        <h4 className="card-title">
          {notePreview ? (
            title
          ) : (
            <Link href={`/note?id=${id}&edit=false`}>
              <a>{title}</a>
            </Link>
          )}
        </h4>
        <p
          className="card-text"
          style={
            notePreview
              ? { maxHeight: '400px', overflowY: 'auto' }
              : { maxHeight: '200px', overflowY: 'auto' }
          }
        >
          {body.split('\n').map(line => (
            <p>{line}</p>
          ))}
        </p>
      </div>
      <div className="card-footer bg-transparent">
        <div className="row">
          <div className="col-6">
            <Link href={`/note?id=${id}&edit=true`}>
              <a className="card-link">Edit</a>
            </Link>
          </div>
          <div className="col-6">
            <Link href="/">
              <a
                className="card-link float-right text-danger"
                onClick={e => {
                  e.preventDefault();
                  setNoteIdForDelete(id);
                  setShowModal(true);
                }}
              >
                Delete
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
