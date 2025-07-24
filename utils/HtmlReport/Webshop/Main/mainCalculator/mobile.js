// /utils/HtmlReport/Webshop/mainCalculator/mainCalculator/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainCalculatorMobile-expected.png',
  actualImage = 'mainCalculatorMobile-actual.png',
  diffImage = 'mainCalculatorMobile-diff.png',
  pageName = 'Main Calculator Mobile'
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
