// /utils/HtmlReport/Webshop/Capabilities/catalog/desktop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'lobalDesktop-expected.png',
  actualImage = 'catalogDesktop-actual.png',
  diffImage = 'catalogDesktop-diff.png',
  pageName = 'Catalog Desktop'
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
