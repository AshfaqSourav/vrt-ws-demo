// /utils/HtmlReport/Demo/Footer/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../baseTemplate';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'demoFooterMobile-expected.png',
  actualImage = 'emoFooterMobile-actual.png',
  diffImage = 'emoFooterMobile-diff.png',
  pageName = 'Demo Footer Mobile'
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
