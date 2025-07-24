// /utils/HtmlReport/Webshop/Main/main/desktop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainFormDesktop-expected.png',
  actualImage = 'mainFormDesktop-actual.png',
  diffImage = 'mainFormDesktop-diff.png',
  pageName = 'Main Form Desktop'
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
