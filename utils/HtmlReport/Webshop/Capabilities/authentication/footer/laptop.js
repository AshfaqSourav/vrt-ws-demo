// /utils/HtmlReport/Webshop/capAuthFooter/capAuthFooter/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthFooterLaptop-expected.png',
  actualImage = 'capAuthFooterLaptop-actual.png',
  diffImage = 'capAuthFooterLaptop-diff.png',
  pageName = 'capAuthFooter Laptop'
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
