// /utils/HtmlReport/Webshop/capAuthSuccessStory/capAuthSuccessStory/mobile.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthSuccessStoryMobile-expected.png',
  actualImage = 'capAuthSuccessStoryMobile-actual.png',
  diffImage = 'capAuthSuccessStoryMobile-diff.png',
  pageName = 'capAuthSuccessStory Mobile'
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
