// /utils/HtmlReport/Webshop/capAuthFooter/capAuthFooter/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthFooterTablet-expected.png',
  actualImage = 'capAuthFooterTablet-actual.png',
  diffImage = 'capAuthFooterTablet-diff.png',
  pageName = 'capAuthFooter Tablet'
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
