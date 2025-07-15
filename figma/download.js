// // Implementation of node ref

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { figmaConfig } from './figma.config.js';

const { token, fileKey, nodes, outputDir } = figmaConfig;
const delay = (ms) => new Promise(res => setTimeout(res, ms));

function chunkEntries(entries, size) {
  const chunks = [];
  for (let i = 0; i < entries.length; i += size) {
    chunks.push(entries.slice(i, i + size));
  }
  return chunks;
}

function getNodeId(entry) {
  const value = entry[1];
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.within) return value.within;
  if (typeof value === 'object' && value.node) return value.node;
  throw new Error(`❌ Invalid node format for ${entry[0]}`);
}

function getDirAndFilename(name, nodeRef) {
  const section = name.replace(/(Desktop|Laptop|Tablet|Mobile)$/, '');
  const dir = path.resolve(outputDir, section);
  const suffix = nodeRef.within ? `-${nodeRef.within}` : '';
  const filename = `${name}Figma.png`;
  return { dir, filename };
}

async function downloadBatch(batch) {
  const ids = batch.map(([name, nodeRef]) => getNodeId([name, nodeRef])).join(',');
  const url = `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(ids)}&format=png&scale=1`;

  const res = await fetch(url, {
    headers: { 'X-Figma-Token': token }
  });

  const json = await res.json();

  if (!json.images) {
    console.error(`❌ API returned no images. Raw: ${JSON.stringify(json)}`);
    return;
  }

  for (const [name, nodeRef] of batch) {
    const nodeId = getNodeId([name, nodeRef]);
    const imageUrl = json.images[nodeId];

    if (!imageUrl) {
      console.warn(`⚠️ No image URL found for ${name} (${nodeId})`);
      continue;
    }

    try {
      const imageRes = await fetch(imageUrl);
      const buffer = await imageRes.buffer();

      const { dir, filename } = getDirAndFilename(name, nodeRef);
      fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(path.join(dir, filename), buffer);
      console.log(`✅ Saved: ${path.join(path.basename(dir), filename)}`);
    } catch (err) {
      console.error(`❌ Failed to download image for ${name}: ${err.message}`);
    }
  }
}

// Main
(async () => {
  const entries = Object.entries(nodes);
  const batches = chunkEntries(entries, 8);

  for (const batch of batches) {
    await downloadBatch(batch);
    await delay(800);
  }
})();
