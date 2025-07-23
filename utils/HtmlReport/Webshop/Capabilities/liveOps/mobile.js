// /utils/HtmlReport/Webshop/Capabilities/liveOps/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'liveOpsMobile-expected.png',
  actualImage = 'liveOpsMobile-actual.png',
  diffImage = 'liveOpsMobile-diff.png',
  pageName = 'LiveOps Mobile'
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
