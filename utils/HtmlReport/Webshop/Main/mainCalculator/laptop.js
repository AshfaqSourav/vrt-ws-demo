// /utils/HtmlReport/Webshop/mainCalculator/mainCalculator/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainCalculatorLaptop-expected.png',
  actualImage = 'mainCalculatorLaptop-actual.png',
  diffImage = 'mainCalculatorLaptop-diff.png',
  pageName = 'Main Calculator Laptop'
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
