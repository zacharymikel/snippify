import {Headers, RequestOptions, Response} from '@angular/http';

export function getApiEnvironment(): string {
    const host = window.location.href;
    let env;

    if (host.indexOf('localhost') !== -1 || host.indexOf('127.0.0.1') !== -1) {
      env = 'http://localhost:3000/api';
    } else {
      env = 'https://watyougot.com/api';
    }

    return env;
}

export function getFileUploadRequestOptions(): RequestOptions {
  const headers = new Headers();
  const token = localStorage.getItem('token');
  headers.append('Authorization', 'Bearer ' + token);
  return new RequestOptions({ headers: headers });
}

export function getRequestOptions(): RequestOptions {
  const headers = new Headers({'Content-Type': 'application/json'});
  const token = localStorage.getItem('token');
  headers.append('Authorization', 'Bearer ' + token);
  return new RequestOptions({ headers: headers });
}
