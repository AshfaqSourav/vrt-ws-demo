// /utils/HtmlReport/Webshop/mainLibrary/mainLibrary/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainLibraryLaptop-expected.png',
  actualImage = 'mainLibraryLaptop-actual.png',
  diffImage = 'mainLibraryLaptop-diff.png',
  pageName = 'Main Library Laptop'
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
