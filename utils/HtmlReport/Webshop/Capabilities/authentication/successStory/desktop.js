// /utils/HtmlReport/Webshop/capAuth/capAuth/desktop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthSuccessStoryDesktop-expected.png',
  actualImage = 'capAuthSuccessStoryDesktop-actual.png',
  diffImage = 'capAuthSuccessStoryDesktop-diff.png',
  pageName = 'capAuth SuccessStory Desktop'
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
