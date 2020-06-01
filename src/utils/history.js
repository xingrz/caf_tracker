import { parse, stringify } from 'qs';

export function parseHistory(search) {
  let query = [];

  const params = parse(search.substr(1));
  for (const k in params) {
    if (k == 'q') {
      query = [ ...query, ...params[k].split(';') ];
    } else {
      // Backward compatible
      switch (k) {
        case 'tag':
          query.push(`q:${params[k]}`);
          break;
        case 'chipset':
          query.push(`soc:${params[k]}`);
          break;
        case 'version':
          query.push(`os:${params[k]}`);
          break;
        default:
          query.push(`${k}:${params[k]}`);
          break;
      }
    }
  }

  return query;
}

export function stringifyHistory(search) {
  const query = {};

  for (const q of search) {
    if (q.match(/^soc:(.+)$/)) {
      query.soc = RegExp.$1;
    } else if (q.match(/^os:(.+)$/)) {
      query.os = RegExp.$1;
    } else {
      if (!query.q) {
        query.q = [];
      }
      query.q.push(q);
    }
  }

  if (query.q) {
    query.q = query.q.join(';');
  }

  const params = stringify(query);
  return params ? `/?${params}` : '/';
}
