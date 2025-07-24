// /path/to/LiveOpsPage.js

import dotenv from 'dotenv';
import { getEnabledViewports } from '../../utils/viewPorts.js';
import { scrollPage } from '../../utils/scrollUtils.js';

dotenv.config();

const viewportSizes = getEnabledViewports(4); // 👈 Update count or keys as needed

export class LiveOpsPage {
  constructor(page, viewport) {
    this.page = page;
    this.viewport = viewport;
  }

  async goto() {
    await this.page.goto(`${process.env.BASE_URL}/home`, {
      waitUntil: 'networkidle'
    });
    await this.page.waitForTimeout(1000);
    // await scrollPage(this.page);
  }

async takeScreenshot() {
  const size = viewportSizes[this.viewport];
  await this.page.setViewportSize(size);
  await this.page.waitForTimeout(2000);
  await scrollPage(this.page);

  const diffDir = './diff_output';
  const maskedFullPagePath = `${diffDir}/main${this.viewport}-actual.png`;

  const elementHandle = await this.page.$(selector);
    await elementHandle.screenshot({
    path: maskedFullPagePath
});
  return {
    cropped: maskedFullPagePath
  };
}
}
