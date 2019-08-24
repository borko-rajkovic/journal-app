import cookie from 'cookie';
import moment from 'moment';
import Link from 'next/link';
import * as React from 'react';

interface NoteCardProps {
  id: string;
  title: string;
  body: string;
  attachment: string;
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
  attachment,
  float,
  createdDate,
  setShowModal,
  setNoteIdForDelete,
  notePreview,
}) => {
  const linkRef = React.createRef();
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
        <div className="row">
          <div className="col-10">
            {moment(new Date(createdDate)).fromNow()}
          </div>
          <div className="col-2">
            {attachment ? (
              <React.Fragment>
                <a ref={linkRef as any} />
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
                      const parsedCookie = cookie.parse(document.cookie);

                      const token = parsedCookie.token;
                      const data = await fetch(path, {
                        headers: {
                          authorization: `Bearer ${token}`,
                        },
                      });
                      const blob = await data.blob();
                      const href = window.URL.createObjectURL(blob);
                      const a: any = linkRef.current;
                      a.download = attachment.split('./uploads/')[1];
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
              </React.Fragment>
            ) : null}
          </div>
        </div>
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
          {body.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              <span>{line}</span>
              <br />
            </React.Fragment>
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
