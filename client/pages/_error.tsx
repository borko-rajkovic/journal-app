import Link from 'next/link';
import { withRouter } from 'next/router';
import React from 'react';
import Layout from '../components/Layout';
import App from 'next/app';

class ErrorPage extends App {
  static getInitialProps = async ({ res, xhr }: any): Promise<any> => {
    const errorCode = res ? res.statusCode : xhr ? xhr.status : null;
    return { errorCode };
  };

  render() {
    let response: any;
    switch ((this.props as any).errorCode) {
      case 200: // Also display a 404 if someone requests /_error explicitly
      case 404:
        response = (
          <div>
            <Layout>
              <h1 className="display-4">Page Not Found</h1>
              <p>
                The page <strong>{(this.props as any).router.asPath}</strong>{' '}
                does not exist.
              </p>
              <p>
                <Link href="/">
                  <a>Home</a>
                </Link>
              </p>
            </Layout>
          </div>
        );
        break;
      case 500:
        response = (
          <div>
            <Layout>
              <h1 className="display-4">Internal Server Error</h1>
              <p>An internal server error occurred.</p>
            </Layout>
          </div>
        );
        break;
      default:
        response = (
          <div>
            <Layout>
              <h1 className="display-4">
                HTTP {(this.props as any).errorCode} Error
              </h1>
              <p>
                An <strong>HTTP {(this.props as any).errorCode}</strong> error
                occurred while trying to access{' '}
                <strong>{(this.props as any).router.pathname}</strong>
              </p>
            </Layout>
          </div>
        );
    }

    return response;
  }
}

export default withRouter(ErrorPage);
