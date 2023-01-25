import { WindowType as CommonWindowType } from '@ktsstudio/mediaproject-utils';

import { VkPlatformType } from './common';

export interface WindowType
  extends Omit<CommonWindowType, 'user_id' | 'is_ios'> {
  user_id?: number;
  notifications_enabled?: boolean;
  language?: string;
  ref?: string;
  scope?: string;
  group_id?: string;
  viewer_group_role?: string;
  platform?: VkPlatformType;
  access_token?: string;
  is_odr?: boolean;

  is_ios?: boolean;
  is_android?: boolean;
  is_mvk?: boolean;
}
