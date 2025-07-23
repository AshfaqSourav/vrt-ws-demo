// /utils/HtmlReport/Webshop/Capabilities/liveOps/desktop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'liveOpsDesktop-expected.png',
  actualImage = 'liveOpsDesktop-actual.png',
  diffImage = 'liveOpsDesktop-diff.png',
  pageName = 'LiveOps Desktop'
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
