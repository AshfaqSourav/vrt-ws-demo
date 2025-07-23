// /utils/HtmlReport/Webshop/Capabilities/authentication/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'authenticationDesktop-expected.png',
  actualImage = 'authenticationDesktop-actual.png',
  diffImage = 'authenticationDesktop-diff.png',
  pageName = 'Authentication Desktop'
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
