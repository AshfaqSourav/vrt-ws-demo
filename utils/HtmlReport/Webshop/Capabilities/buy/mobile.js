// /utils/HtmlReport/Webshop/Capabilities/buy/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'buyMobile-expected.png',
  actualImage = 'buyMobile-actual.png',
  diffImage = 'buyMobile-diff.png',
  pageName = 'Buy Mobile'
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
