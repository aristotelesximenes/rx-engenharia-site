import { siteConfig, withBase, absoluteUrl } from "../data/site-config.js";

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function linkTo(path) {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return withBase(path);
}

export function whatsappUrl(message) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function metaTags({ title, description, path = "/", image = "" }) {
  const fullTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;
  const canonical = absoluteUrl(path);
  const socialImage = image || siteConfig.socialImage;
  const absoluteImage = socialImage ? absoluteUrl(socialImage) : "";

  return `
    <title>${escapeHtml(fullTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index, follow">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="${siteConfig.locale}">
    <meta property="og:site_name" content="${escapeHtml(siteConfig.name)}">
    <meta property="og:title" content="${escapeHtml(fullTitle)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    ${canonical ? `<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}">` : ""}
    ${absoluteImage ? `<meta property="og:image" content="${absoluteImage}">` : ""}
  `;
}

export function jsonLd(data) {
  const serialized = JSON.stringify(data).replaceAll("<", "\\u003c");
  return `<script type="application/ld+json">${serialized}</script>`;
}

export function icon(name, className = "icon") {
  const icons = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    bolt: '<path d="m13 2-9 12h8l-1 8 9-12h-8l1-8Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    compass:
      '<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5 5-3Z"/>',
    document:
      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
    hardhat:
      '<path d="M2 18h20M4 18v-2a8 8 0 0 1 16 0v2M9 4v5M15 4v5"/>',
    instagram:
      '<rect width="18" height="18" x="3" y="3" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
    layers:
      '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
    leaf: '<path d="M20 4C10 4 4 9 4 16c0 2 1 4 3 5 1-5 4-9 10-12-4 3-7 7-8 12 8 0 11-7 11-17Z"/>',
    mail:
      '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 7L2 7"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    pencil:
      '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
    pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    rain: '<path d="M16 13a5 5 0 0 0-9.5-2A4 4 0 0 0 7 19h9a3 3 0 0 0 0-6Z"/><path d="m8 21-1 2M13 21l-1 2M18 21l-1 2"/>',
    search:
      '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    structure:
      '<path d="M4 21V9l8-6 8 6v12M2 21h20M8 21v-6h8v6M8 9h8"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    water: '<path d="M12 2s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12Z"/><path d="M9 16c1 1 2 1 3 1"/>',
    whatsapp:
      '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.9L3 20.5l1.5-5a8.4 8.4 0 1 1 16.5-4Z"/><path d="M8.3 8.2c.4 2.8 2.4 4.8 5.2 5.5l1.3-1.3 2.2 1v2c0 .8-.7 1.5-1.5 1.5-5.2 0-9.4-4.2-9.4-9.4C6.1 6.7 6.8 6 7.6 6h2l1 2.2-1.3 1.3"/>',
    warning:
      '<path d="M10.3 3.7 2.5 18a2 2 0 0 0 1.8 3h15.4a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  };
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.compass}</svg>`;
}
