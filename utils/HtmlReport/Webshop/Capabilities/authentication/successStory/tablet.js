// /utils/HtmlReport/Webshop/capAuthSuccessStory/capAuthSuccessStory/tablet.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthSuccessStoryTablet-expected.png',
  actualImage = 'capAuthSuccessStoryTablet-actual.png',
  diffImage = 'capAuthSuccessStoryTablet-diff.png',
  pageName = 'capAuthSuccessStory Tablet'
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
