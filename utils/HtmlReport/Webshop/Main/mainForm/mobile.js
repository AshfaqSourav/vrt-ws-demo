// /utils/HtmlReport/Webshop/mainForm/mainForm/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainFormMobile-expected.png',
  actualImage = 'mainFormMobile-actual.png',
  diffImage = 'mainFormMobile-diff.png',
  pageName = 'Main Form Mobile'
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
