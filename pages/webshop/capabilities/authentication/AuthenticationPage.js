// /path/to/AuthenticationPage.js

import dotenv from 'dotenv';
import { getEnabledViewports } from '../../../../utils/viewPorts.js';
import { scrollPage } from '../../../../utils/scrollUtils.js';

dotenv.config();

const viewportSizes = getEnabledViewports(4); // 👈 Update count or keys as needed
const selector = '.sc-hQQqCA.lnHQMG';
export class AuthenticationPage {
  constructor(page, viewport) {
    this.page = page;
    this.viewport = viewport;
  }

  async goto() {
    await this.page.goto(`${process.env.BASE_URL}/capabilities/authentication`, {
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
  const maskedFullPagePath = `${diffDir}/authentication${this.viewport}-actual.png`;

  const elementHandle = await this.page.$(selector);
    await elementHandle.screenshot({
    path: maskedFullPagePath
});
  return {
    cropped: maskedFullPagePath
  };
}
}
