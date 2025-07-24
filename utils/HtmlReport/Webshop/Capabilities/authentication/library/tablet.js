// /utils/HtmlReport/Webshop/capAuthLibrary/capAuthLibrary/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthLibraryTablet-expected.png',
  actualImage = 'capAuthLibraryTablet-actual.png',
  diffImage = 'capAuthLibraryTablet-diff.png',
  pageName = 'capAuthLibrary Tablet'
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
