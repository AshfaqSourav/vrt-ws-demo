// /utils/HtmlReport/Webshop/capAuthForm/capAuthForm/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthFormLaptop-expected.png',
  actualImage = 'capAuthFormLaptop-actual.png',
  diffImage = 'capAuthFormLaptop-diff.png',
  pageName = 'capAuthForm Laptop'
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
