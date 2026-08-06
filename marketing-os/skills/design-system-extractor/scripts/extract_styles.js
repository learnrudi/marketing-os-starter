// Run this complete IIFE in a browser page context. It returns JSON text with
// frequency-ranked computed styles from visible elements. Run it once per
// representative page and save the result as extraction evidence.

(function () {
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

  function increment(counter, value) {
    if (!value) return;
    counter[value] = (counter[value] || 0) + 1;
  }

  function top(counter, count) {
    return Object.entries(counter)
      .sort((left, right) => right[1] - left[1])
      .slice(0, count);
  }

  const colors = {};
  const backgrounds = {};
  const fonts = {};
  const radii = {};
  const shadows = {};
  const typeStyles = {};
  let visibleElements = 0;

  document.querySelectorAll('body *').forEach((element) => {
    if (!isVisible(element)) return;
    visibleElements += 1;
    const style = getComputedStyle(element);
    increment(colors, style.color);
    if (style.backgroundColor !== 'rgba(0, 0, 0, 0)') increment(backgrounds, style.backgroundColor);
    increment(fonts, style.fontFamily);
    if (style.borderRadius !== '0px') increment(radii, style.borderRadius);
    if (style.boxShadow !== 'none') increment(shadows, style.boxShadow);

    const tag = element.tagName.toLowerCase();
    if (['h1', 'h2', 'h3', 'h4', 'p', 'a', 'button', 'label'].includes(tag)) {
      const key = [
        tag,
        style.fontFamily,
        style.fontSize,
        style.fontWeight,
        style.lineHeight,
        style.letterSpacing,
        style.textTransform,
        style.color,
      ].join(' | ');
      increment(typeStyles, key);
    }
  });

  const seenButtons = new Set();
  const buttons = Array.from(document.querySelectorAll('a, button, [role="button"]'))
    .filter(isVisible)
    .map((element) => {
      const style = getComputedStyle(element);
      return {
        text: String(element.innerText || element.getAttribute('aria-label') || '').trim().slice(0, 80),
        background: style.backgroundColor,
        color: style.color,
        border: style.border,
        borderRadius: style.borderRadius,
        padding: style.padding,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        textTransform: style.textTransform,
        letterSpacing: style.letterSpacing,
      };
    })
    .filter((button) => button.text)
    .filter((button) => {
      const key = [button.background, button.color, button.border, button.borderRadius, button.fontSize].join('|');
      if (seenButtons.has(key)) return false;
      seenButtons.add(key);
      return true;
    })
    .slice(0, 12);

  return JSON.stringify({
    url: window.location.href,
    capturedAt: new Date().toISOString(),
    viewport: { width: window.innerWidth, height: window.innerHeight },
    visibleElements,
    topColors: top(colors, 12),
    topBackgrounds: top(backgrounds, 12),
    topFonts: top(fonts, 8),
    topRadii: top(radii, 8),
    topShadows: top(shadows, 8),
    topTypeStyles: top(typeStyles, 16),
    buttons,
  }, null, 2)
})()
