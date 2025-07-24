// /utils/HtmlReport/Webshop/capAuthDocCard/capAuthDocCard/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthDocCardTablet-expected.png',
  actualImage = 'capAuthDocCardTablet-actual.png',
  diffImage = 'capAuthDocCardTablet-diff.png',
  pageName = 'capAuthDocCard Tablet'
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
