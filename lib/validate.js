// lib/validate.js
export function isValidCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

export function isValidUrl(url) {
  // simple validator using WHATWG URL
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (e) {
    return false;
  }
}
