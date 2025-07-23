// /utils/HtmlReport/Webshop/Capabilities/authentication/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'authenticationLaptop-expected.png',
  actualImage = 'authenticationLaptop-actual.png',
  diffImage = 'authenticationLaptop-diff.png',
  pageName = 'Authentication Laptop'
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
