import { get } from 'request-promise';
import { promisify } from 'bluebird';
import xml2js from 'xml2js';
import { pick } from 'lodash';

const parseString = promisify(xml2js.parseString);

const MANIFEST_URL = 'https://source.codeaurora.org/quic/la/platform/manifest';

export default async function manifest(tag) {
  const xml = await get(`${MANIFEST_URL}/plain/${tag}.xml?h=release`);
  const json = await parseString(xml);
  const projects = json.manifest.project.map(({ $ }) => pick($, ['name', 'path']));
  return projects;
}
