import { WindowType as CommonWindowType } from '@ktsstudio/mediaproject-utils';

export interface WindowType extends CommonWindowType {
  /** Токен доступа и его права */
  access_token?: string;
  scope?: string;
}
