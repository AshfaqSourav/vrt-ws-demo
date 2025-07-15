// /utils/HtmlReport/aboutXsolla/aboutUs/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'aboutUsTablet-expected.png',
  actualImage = 'aboutUsTablet-actual.png',
  diffImage = 'aboutUsTablet-diff.png',
  pageName = 'About Us Tablet'
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
