// /utils/HtmlReport/Webshop/Capabilities/authentication/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'authenticationMobile-expected.png',
  actualImage = 'authenticationMobile-actual.png',
  diffImage = 'authenticationMobile-diff.png',
  pageName = 'Authentication Mobile'
}) {
  const html = createHtmlTemplate({
    pageName,
    diffPixels,
    expectedImage,
    actualImage,
    diffImage
  });

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(reportPath, html);
}
