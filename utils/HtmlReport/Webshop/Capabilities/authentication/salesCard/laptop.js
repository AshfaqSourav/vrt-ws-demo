// /utils/HtmlReport/Webshop/capAuthSalesCard/capAuthSalesCard/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthSalesCardLaptop-expected.png',
  actualImage = 'capAuthSalesCardLaptop-actual.png',
  diffImage = 'capAuthSalesCardLaptop-diff.png',
  pageName = 'capAuthSalesCard Laptop'
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
