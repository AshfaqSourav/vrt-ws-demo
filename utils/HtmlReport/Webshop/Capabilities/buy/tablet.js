// /utils/HtmlReport/Webshop/Capabilities/buy/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'buyTablet-expected.png',
  actualImage = 'buyTablet-actual.png',
  diffImage = 'buyTablet-diff.png',
  pageName = 'Buy Tablet'
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
