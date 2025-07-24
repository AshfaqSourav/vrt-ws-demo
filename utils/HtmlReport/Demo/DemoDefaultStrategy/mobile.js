// /utils/HtmlReport/Demo/Demo Default Strategy/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../baseTemplate';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'demoDefaultStrategyMobile-expected.png',
  actualImage = 'demoDefaultStrategyMobile-actual.png',
  diffImage = 'demoDefaultStrategyMobile-diff.png',
  pageName = 'Demo Default Strategy Mobile'
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
