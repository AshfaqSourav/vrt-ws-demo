// /utils/HtmlReport/Webshop/capAuth/capAuth/desktop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthHeroDesktop-expected.png',
  actualImage = 'capAuthHeroDesktop-actual.png',
  diffImage = 'capAuthHeroDesktop-diff.png',
  pageName = 'capAuth Hero Desktop'
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
