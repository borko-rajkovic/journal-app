import * as React from 'react';
import moment from 'moment';
import Link from 'next/link';

interface NoteProps {
  id: string;
  title: string;
  body: string;
  createdDate: number;
  float: number;
  setShowModal: any;
  setNoteIdForDelete: any;
}

export const Note: React.SFC<NoteProps> = ({
  id,
  title,
  body,
  float,
  createdDate,
  setShowModal,
  setNoteIdForDelete,
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
      style={{
        maxWidth: '20rem',
        width: '100%',
      }}
    >
      <div className="card-header">
        {moment(new Date(createdDate)).fromNow()}
      </div>
      <div className="card-body">
        <h4 className="card-title">{title}</h4>
        <p
          className="card-text"
          style={{ maxHeight: '200px', overflowY: 'auto' }}
        >
          {body}
        </p>
      </div>
      <div className="card-footer bg-transparent">
        <div className="row">
          <div className="col-6">
            <Link href="/">
              <a className="card-link">Edit</a>
            </Link>
          </div>
          <div className="col-6">
            <Link href="/">
              <a
                className="card-link float-right text-danger"
                onClick={() => {
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
