// /utils/HtmlReport/Webshop/Capabilities/liveOps/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'liveOpsTablet-expected.png',
  actualImage = 'liveOpsTablet-actual.png',
  diffImage = 'liveOpsTablet-diff.png',
  pageName = 'LiveOps Tablet'
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
