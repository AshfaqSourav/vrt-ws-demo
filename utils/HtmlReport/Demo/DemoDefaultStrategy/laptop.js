// /utils/HtmlReport/Demo/Demo Default Strategy/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../baseTemplate';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'demoDefaultStrategyLaptop-expected.png',
  actualImage = 'demoFooterLaptop-actual.png',
  diffImage = 'demoDefaultStrategyLaptop-diff.png',
  pageName = 'Demo Default Strategy Laptop'
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
