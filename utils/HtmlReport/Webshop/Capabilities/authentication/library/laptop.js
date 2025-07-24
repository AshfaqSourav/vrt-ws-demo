// /utils/HtmlReport/Webshop/capAuthLibrary/capAuthLibrary/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthLibraryLaptop-expected.png',
  actualImage = 'capAuthLibraryLaptop-actual.png',
  diffImage = 'capAuthLibraryLaptop-diff.png',
  pageName = 'capAuthLibrary Laptop'
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
