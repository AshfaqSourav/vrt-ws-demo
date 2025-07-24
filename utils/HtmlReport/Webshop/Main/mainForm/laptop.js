// /utils/HtmlReport/Webshop/mainForm/mainForm/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainFormLaptop-expected.png',
  actualImage = 'mainFormLaptop-actual.png',
  diffImage = 'mainFormLaptop-diff.png',
  pageName = 'Main Form Laptop'
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
