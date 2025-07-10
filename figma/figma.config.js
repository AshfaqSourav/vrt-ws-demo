// /figma/figma.config.js

import dotenv from 'dotenv';
dotenv.config();

export const figmaConfig = {
  token: process.env.FIGMA_TOKEN,
  fileKey: process.env.FIGMA_FILE_KEY,
  nodes: {
    paystationDesktop: '2400:25513',
    paystationLaptop: '2400:30437',
    paystationTablet: '2400:35013',
    paystationMobile: '2400:39496',
    heroDesktop: { node: '2400:25513', within: 'CNw2f1y3iylXkFuU-0' } 
  },
  outputDir: './expected_screenshots'
};
