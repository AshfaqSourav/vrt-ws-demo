// /utils/HtmlReport/Webshop/Capabilities/global/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'globalTablet-expected.png',
  actualImage = 'globalTablet-actual.png',
  diffImage = 'globalTablet-diff.png',
  pageName = 'Global Tablet'
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
