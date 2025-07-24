// /utils/viewports.js

const allViewports = {
  Desktop: { width: 1800, height: 1000 },
  Laptop: { width: 1440, height: 1000 },
  Tablet: { width: 768, height: 1000 },
  Mobile: { width: 375, height: 1000 }
};

export function getEnabledViewports(countOrKeys) {
  if (Array.isArray(countOrKeys)) {
    return Object.fromEntries(countOrKeys.map(k => [k, allViewports[k]]));
  }

  const ordered = ['Desktop', 'Laptop', 'Tablet', 'Mobile'];
  const selected = ordered.slice(0, countOrKeys);
  return Object.fromEntries(selected.map(k => [k, allViewports[k]]));
}
