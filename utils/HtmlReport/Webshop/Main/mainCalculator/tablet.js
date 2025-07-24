// /utils/HtmlReport/Webshop/mainCalculator/mainCalculator/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainCalculatorTablet-expected.png',
  actualImage = 'mainCalculatorTablet-actual.png',
  diffImage = 'mainCalculatorTablet-diff.png',
  pageName = 'Main Calculator Tablet'
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
