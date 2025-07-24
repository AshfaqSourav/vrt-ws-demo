// /utils/HtmlReport/Webshop/capAuthLibrary/capAuthLibrary/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthLibraryMobile-expected.png',
  actualImage = 'capAuthLibraryMobile-actual.png',
  diffImage = 'capAuthLibraryMobile-diff.png',
  pageName = 'capAuthLibrary Mobile'
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
