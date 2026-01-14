export const COLOR_PALETTES = {
  vibrant: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  ],
  pastel: [
    '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9',
    '#BAE1FF', '#E0BBE4', '#957DAD', '#D4A5A5',
  ],
  ocean: [
    '#1A535C', '#4ECDC4', '#F7FFF7', '#FFE66D',
    '#FF6B6B', '#2EC4B6', '#011627', '#FDFFFC',
  ],
  sunset: [
    '#F72585', '#B5179E', '#7209B7', '#560BAD',
    '#480CA8', '#3A0CA3', '#3F37C9', '#4361EE',
  ],
  forest: [
    '#2D5A27', '#4A7C59', '#82B366', '#A9D08E',
    '#C5E0B4', '#E2EFD9', '#F0F7EC', '#B7D7A8',
  ],
  monochrome: [
    '#1F2937', '#374151', '#4B5563', '#6B7280',
    '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6',
  ],
};

export const DEFAULT_COLORS = COLOR_PALETTES.vibrant;

export function getRandomColor(): string {
  const allColors = Object.values(COLOR_PALETTES).flat();
  return allColors[Math.floor(Math.random() * allColors.length)];
}

export function getNextColor(existingColors: string[]): string {
  const allColors = DEFAULT_COLORS;
  for (const color of allColors) {
    if (!existingColors.includes(color)) {
      return color;
    }
  }
  return getRandomColor();
}
