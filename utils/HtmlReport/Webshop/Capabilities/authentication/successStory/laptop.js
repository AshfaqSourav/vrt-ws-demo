// /utils/HtmlReport/Webshop/capAuthSuccessStory/capAuthSuccessStory/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'capAuthSuccessStoryLaptop-expected.png',
  actualImage = 'capAuthSuccessStoryLaptop-actual.png',
  diffImage = 'capAuthSuccessStoryLaptop-diff.png',
  pageName = 'capAuthSuccessStory Laptop'
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
