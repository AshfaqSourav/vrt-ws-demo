// /utils/HtmlReport/Webshop/Capabilities/authentication/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'authenticationTablet-expected.png',
  actualImage = 'authenticationTablet-actual.png',
  diffImage = 'authenticationTablet-diff.png',
  pageName = 'Authentication Tablet'
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
