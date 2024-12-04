export function buildGradientColor(horizon: 'left' | 'right' | '' | undefined,
                                   vertical: 'top' | 'bottom' | '' | undefined,
                                   from: string,
                                   to: string): string {
  const style = `linear-gradient(to ${horizon} ${vertical}, ${from}, ${to})`;
  console.log('Set gradient color:', style);
  return style;
}