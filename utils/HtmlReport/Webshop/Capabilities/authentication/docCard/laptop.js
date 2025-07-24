// /utils/HtmlReport/Webshop/capAuthDocCard/capAuthDocCard/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthDocCardLaptop-expected.png',
  actualImage = 'capAuthDocCardLaptop-actual.png',
  diffImage = 'capAuthDocCardLaptop-diff.png',
  pageName = 'capAuthDocCard Laptop'
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
