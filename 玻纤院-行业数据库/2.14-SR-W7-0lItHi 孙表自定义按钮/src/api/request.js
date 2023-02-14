import axios from 'axios';
import qs from 'querystringify';

if (process.env.NODE_ENV === 'development') {
  document.cookie =
    'token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2MTI0Mjc3NjIxNSwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.sjune-SuLcKMR-Z1Fij0ColkRTJY3IsAjCp-D55FLak';
  document.cookie =
    'refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2MTI0Mjc3NjIxN30.21pmw9mah1joLNogsiBpkSUUDIikP2bMDr93y7rpCLs';
  document.cookie = 'username=admin';
  document.cookie = 'windowOnline=true';
}

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API}/sdata/rest`,
  timeout: 60000,
  validateStatus: function(status) {
    return status >= 200 && status < 300; // default
  },
  headers:
    (window.location.search && qs.parse(window.location.search).token) ||
    window.token
      ? { token: qs.parse(window.location.search).token || window.token }
      : {},
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

instance.interceptors.response.use(
  response => {
    let { data } = response;
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    if (data && data.status !== 200 && !(data instanceof Blob)) {
      return Promise.reject(response);
    }
    if (data instanceof Blob) {
      response.data = data;
      return response;
    }

    response.data = data && data.result;
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      return;
    }

    return Promise.reject(error.response);
  }
);

export default instance;
