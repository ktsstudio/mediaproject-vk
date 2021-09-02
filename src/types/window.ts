import { WindowType as CommonWindowType } from '@ktsstudio/mediaproject-utils';

export interface WindowType extends CommonWindowType {
  scope: string | null;
  group_id: string | null;
  page: string | null;
  platform: string;
  is_odr: boolean;
}
