// Run this complete IIFE in a browser page context. It returns a bounded,
// deduplicated sample of visible marketing language and image metadata.

(function () {
  function normalize(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function isVisible(element) {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return (
      rect.width > 2 &&
      rect.height > 2 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      Number(style.opacity || 1) > 0 &&
      element.getAttribute('aria-hidden') !== 'true'
    );
  }

  function unique(items, key, limit) {
    const seen = new Set();
    const output = [];
    for (const item of items) {
      const value = key(item);
      if (!value || seen.has(value)) continue;
      seen.add(value);
      output.push(item);
      if (output.length >= limit) break;
    }
    return output;
  }

  function textItems(selector, limit) {
    return unique(
      Array.from(document.querySelectorAll(selector))
        .filter(isVisible)
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          text: normalize(element.innerText || element.textContent).slice(0, 500),
        }))
        .filter((item) => item.text.length >= 2),
      (item) => item.text.toLowerCase(),
      limit
    );
  }

  const callsToAction = unique(
    Array.from(document.querySelectorAll('a, button, [role="button"]'))
      .filter(isVisible)
      .map((element) => ({
        text: normalize(element.innerText || element.getAttribute('aria-label')).slice(0, 120),
        href: element.tagName.toLowerCase() === 'a' ? element.href : null,
      }))
      .filter((item) => item.text),
    (item) => `${item.text.toLowerCase()}|${item.href || ''}`,
    30
  );

  const images = unique(
    Array.from(document.images)
      .filter(isVisible)
      .map((image) => ({
        src: image.currentSrc || image.src,
        alt: normalize(image.alt).slice(0, 300),
        width: Math.round(image.getBoundingClientRect().width),
        height: Math.round(image.getBoundingClientRect().height),
        objectFit: getComputedStyle(image).objectFit,
      })),
    (item) => item.src,
    24
  );

  const meta = (selector) => normalize(document.querySelector(selector)?.getAttribute('content'));
  return JSON.stringify({
    url: window.location.href,
    capturedAt: new Date().toISOString(),
    title: normalize(document.title),
    metadata: {
      description: meta('meta[name="description"]'),
      openGraphTitle: meta('meta[property="og:title"]'),
      openGraphDescription: meta('meta[property="og:description"]'),
    },
    headings: textItems('h1, h2, h3, h4', 40),
    paragraphs: textItems('main p, article p, section p', 60),
    callsToAction,
    navigation: textItems('nav a, header a, footer a', 40),
    images,
  }, null, 2)
})()
