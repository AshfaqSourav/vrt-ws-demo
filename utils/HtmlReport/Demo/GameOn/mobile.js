// /utils/HtmlReport/Demo/demoGameOn/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../baseTemplate';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'demoGameOnMobile-expected.png',
  actualImage = 'demoGameOnMobile-actual.png',
  diffImage = 'demoGameOnMobile-diff.png',
  pageName = ' Demo Game On Mobile'
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
