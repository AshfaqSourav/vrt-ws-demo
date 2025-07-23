// /utils/HtmlReport/Webshop/Capabilities/catalog/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'catalogTablet-expected.png',
  actualImage = 'catalogTablet-actual.png',
  diffImage = 'catalogTablet-diff.png',
  pageName = 'Catalog Tablet'
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
