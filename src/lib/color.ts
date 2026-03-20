const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{6})$/;

export function normalizeHexColor(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const prefixed = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;

  if (!HEX_COLOR_REGEX.test(prefixed)) {
    return null;
  }

  return prefixed.toUpperCase();
}

export function getReadableTextColor(backgroundColor: string) {
  const hex = normalizeHexColor(backgroundColor);

  if (!hex) {
    return "#FFFFFF";
  }

  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness >= 160 ? "#111827" : "#FFFFFF";
}
