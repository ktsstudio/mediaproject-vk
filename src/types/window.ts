import { WindowType as CommonWindowType } from '@ktsstudio/mediaproject-utils';

import { VkPlatformType } from './common';

export interface WindowType
  extends Omit<CommonWindowType, 'user_id' | 'is_ios'> {
  /** Параметры запуска */
  user_id?: number;
  notifications_enabled?: boolean;
  language?: string;
  ref?: string;
  group_id?: string;
  viewer_group_role?: string;
  platform?: VkPlatformType;
  is_odr?: boolean;

  /** Параметры текущей платформы */
  is_ios?: boolean;
  is_android?: boolean;
  is_mvk?: boolean;

  /** Токен доступа и его права */
  access_token?: string;
  scope?: string;
}
