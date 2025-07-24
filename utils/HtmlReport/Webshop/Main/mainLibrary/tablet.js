// /utils/HtmlReport/Webshop/mainLibrary/mainLibrary/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainLibraryTablet-expected.png',
  actualImage = 'mainLibraryTablet-actual.png',
  diffImage = 'mainLibraryTablet-diff.png',
  pageName = 'Main Library Tablet'
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
