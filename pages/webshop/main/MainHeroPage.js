// /path/to/AuthenticationPage.js

import dotenv from 'dotenv';
import { getEnabledViewports } from '../../../utils/viewPorts.js';
import { scrollPage } from '../../../utils/scrollUtils.js';
import { maskEverythingExcept ,  cropWhiteMargins } from '../../../utils/domUtils.js';

dotenv.config();

const viewportSizes = getEnabledViewports(4); // 👈 Update count or keys as needed
const selector = 'div.sc-GjvTv.hqdpVL';

export class MainHeroPage {
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
 
   const diffDir = './diff_output';
   const maskedFullPagePath = `${diffDir}/mainHero${this.viewport}-masked-full.png`;
   const croppedElementPath = `${diffDir}/mainHero${this.viewport}.png`;
   await this.page.waitForTimeout(3000);
   await this.page.waitForSelector(selector, { timeout: 20000, state: 'attached' });
  
   await this.page.$eval(selector, el =>
   el.scrollIntoView({ behavior: 'instant', block: 'end' })
 );
 await this.page.waitForTimeout(2000);
   await maskEverythingExcept(this.page, selector);
  await this.page.$eval(selector, el =>
    el.scrollIntoView({ behavior: 'instant', block: 'end' }) );
   await this.page.waitForTimeout(2000); 
 
   const elementHandle = await this.page.$(selector);
     await elementHandle.screenshot({
     path: maskedFullPagePath
 });
   await cropWhiteMargins(maskedFullPagePath, croppedElementPath);
 
 
   return {
     cropped: croppedElementPath,
     full: maskedFullPagePath
   };
}
}
