// /utils/HtmlReport/aboutXsolla/aboutUs/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'aboutUsLaptop-expected.png',
  actualImage = 'aboutUsLaptop-actual.png',
  diffImage = 'aboutUsLaptop-diff.png',
  pageName = 'About Us Laptop'
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
