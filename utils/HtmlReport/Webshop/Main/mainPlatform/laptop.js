// /utils/HtmlReport/Webshop/mainPlatform/mainPlatform/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainPlatformLaptop-expected.png',
  actualImage = 'mainPlatformLaptop-actual.png',
  diffImage = 'mainPlatformLaptop-diff.png',
  pageName = 'Main Platform Laptop'
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
