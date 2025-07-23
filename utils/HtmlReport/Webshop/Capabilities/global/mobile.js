// /utils/HtmlReport/Webshop/Capabilities/global/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'globalMobile-expected.png',
  actualImage = 'globalMobile-actual.png',
  diffImage = 'globalMobile-diff.png',
  pageName = 'Global Mobile'
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
