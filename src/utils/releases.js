import { get } from 'request-promise';
import { transform } from 'lodash';
import moment from 'moment';

const RELEASE_URL = 'https://wiki.codeaurora.org/xwiki/rest/wikis/xwiki/spaces/QAEP/pages/release';

export default async function releases() {
  const { content } = await get(RELEASE_URL, { json: true });
  return transform(content.split('\n'), (result, line) => {
    const fields = line.split('|');
    if (fields.length != 6) {
      return;
    }

    const date = moment.utc(fields[1].trim(), 'MMMM DD, YYYY');
    if (!date.isValid()) {
      return;
    }

    result.push({
      date: date.toDate(),
      tag: fields[2].trim(),
      chipset: fields[3].trim(),
      version: fields[5].trim().split('.').map(Number).join('.')
    });
  });
}
