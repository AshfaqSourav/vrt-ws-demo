// /utils/HtmlReport/Demo/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../baseTemplate';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'demoHeroLaptop-expected.png',
  actualImage = 'demoHeroLaptop-actual.png',
  diffImage = 'demoHeroLaptop-diff.png',
  pageName = 'Demo Hero Laptop'
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
