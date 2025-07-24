// /utils/HtmlReport/Webshop/capAuth/capAuth/desktop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthDocCardDesktop-expected.png',
  actualImage = 'capAuthDocCardDesktop-actual.png',
  diffImage = 'capAuthDocCardDesktop-diff.png',
  pageName = 'capAuth DocCard Desktop'
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
