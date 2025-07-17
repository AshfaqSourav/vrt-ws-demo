// /utils/HtmlReport/Demo/demoHero/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'demoHeroMobile-expected.png',
  actualImage = 'demoHeroMobile-actual.png',
  diffImage = 'demoHeroMobile-diff.png',
  pageName = ' Demo Hero Mobile'
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
