// Named exports: whoever imports picks what they need by name.
export const slug = (s) =>
  s.toLowerCase().trim().replace(/\s+/g, '-')
