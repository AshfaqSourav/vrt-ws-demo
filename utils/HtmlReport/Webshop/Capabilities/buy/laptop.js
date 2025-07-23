// /utils/HtmlReport/Webshop/Capabilities/buy/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'buyLaptop-expected.png',
  actualImage = 'buyLaptop-actual.png',
  diffImage = 'buyLaptop-diff.png',
  pageName = 'Buy Laptop'
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
