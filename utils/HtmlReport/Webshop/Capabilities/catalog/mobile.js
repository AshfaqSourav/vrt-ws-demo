// /utils/HtmlReport/Webshop/Capabilities/catalog/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'catalogMobile-expected.png',
  actualImage = 'catalogMobile-actual.png',
  diffImage = 'catalogMobile-diff.png',
  pageName = 'Catalog Mobile'
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
