import { WindowType } from '../types/window';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends WindowType {}
}
