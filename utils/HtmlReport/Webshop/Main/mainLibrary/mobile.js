// /utils/HtmlReport/Webshop/mainLibrary/mainLibrary/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainLibraryMobile-expected.png',
  actualImage = 'mainLibraryMobile-actual.png',
  diffImage = 'mainLibraryMobile-diff.png',
  pageName = 'Main Library Mobile'
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
