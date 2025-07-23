// /utils/HtmlReport/Webshop/Capabilities/liveOps/laptop.js

import fs from 'fs';
import { createHtmlTemplate } from '../../../baseTemplate.js';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'liveOpsLaptop-expected.png',
  actualImage = 'liveOpsLaptop-actual.png',
  diffImage = 'liveOpsLaptop-diff.png',
  pageName = 'LiveOps Laptop'
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
