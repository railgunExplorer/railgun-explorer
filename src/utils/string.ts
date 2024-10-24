export function truncateMiddle(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  const sideLength = Math.floor((maxLength - 3) / 2);
  return `${str.slice(0, sideLength)}...${str.slice(-sideLength)}`;
}
