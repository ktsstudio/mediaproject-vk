import { shuffle } from './shuffle';

export const getRandomElements = <T>(array: T[], count: number): T[] =>
  shuffle(array).slice(0, Math.min(array.length, count));
