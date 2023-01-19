import { WindowType as CommonWindowType } from '@ktsstudio/mediaproject-utils';

import { PlatformType } from './common';

export interface WindowType extends Omit<CommonWindowType, 'user_id'> {
  user_id?: number;
  notifications_enabled?: boolean;
  language?: string;
  ref?: string;
  scope?: string;
  group_id?: string;
  viewer_group_role?: string;
  platform?: PlatformType;
  access_token?: string;
  is_odr?: boolean;
}
