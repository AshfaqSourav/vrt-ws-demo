// /utils/HtmlReport/Webshop/Main/main/desktop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainCalculatorDesktop-expected.png',
  actualImage = 'mainCalculatorDesktop-actual.png',
  diffImage = 'mainCalculatorDesktop-diff.png',
  pageName = 'Main Calculator Desktop'
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
