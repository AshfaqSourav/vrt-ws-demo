// /utils/HtmlReport/Webshop/mainForm/mainForm/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'mainFormTablet-expected.png',
  actualImage = 'mainFormTablet-actual.png',
  diffImage = 'mainFormTablet-diff.png',
  pageName = 'Main Form Tablet'
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
