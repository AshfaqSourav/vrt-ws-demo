// /utils/HtmlReport/Webshop/Main/main/desktop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainLibraryDesktop-expected.png',
  actualImage = 'mainLibraryDesktop-actual.png',
  diffImage = 'mainLibraryDesktop-diff.png',
  pageName = 'Main Library Desktop'
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
