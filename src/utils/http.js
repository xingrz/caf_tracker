import { parse, format } from 'url'
import { assign } from 'lodash'

export class HttpStatusError extends Error {
  constructor(res, body = {}) {
    super(`HTTP ${res.status} ${res.statusText}: ${res.url}`);

    this.name = 'HttpStatusError';

    this.response = res;
    this.body = body;

    this.status = res.status;
    this.url = res.url;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this);
    }
  }
}

export async function request(url, options = {}) {
  options.method = options.method || 'GET';

  if (options.method.toUpperCase() === 'GET') {
    const obj = parse(url, true);
    delete obj.search;
    assign(obj.query, options.body || {});
    assign(obj.query, options.qs || {});
    url = format(obj);
  } else if (typeof options.body === 'object'
    && !(options.body instanceof FormData)) {
    options.body = JSON.stringify(options.body);
  }

  options.headers = options.headers || {};
  options.headers['Accept'] = 'application/json';

  if (!(options.body instanceof FormData)) {
    options.headers['Content-Type'] = 'application/json';
  }

  options.credentials = 'same-origin';

  const res = await fetch(url, options);

  if (res.status == 204) {
    return null;
  }

  const body = await parseBody(res);

  if (res.status >= 200 && res.status < 300) {
    return body;
  } else {
    throw new HttpStatusError(res, body);
  }
}

function parseBody(res) {
  const type = res.headers.get('Content-Type');
  if (/^application\/json/i.test(type)) {
    return res.json();
  } else if (/^text\//i.test(type)) {
    return res.text();
  } else {
    return res.blob();
  }
}

export function get(url, options = {}) {
  return request(url, { ...options, method: 'GET' });
}

export function post(url, options = {}) {
  return request(url, { ...options, method: 'POST' });
}

export function put(url, options = {}) {
  return request(url, { ...options, method: 'PUT' });
}

export function patch(url, options = {}) {
  return request(url, { ...options, method: 'PATCH' });
}

export function del(url, options = {}) {
  return request(url, { ...options, method: 'DELETE' });
}
