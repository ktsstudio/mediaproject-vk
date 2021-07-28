import { AppearanceType } from '@vkontakte/vk-bridge';

export type ViewSettingsType = {
  status_bar_style: AppearanceType;
  /** Android only */
  action_bar_color?: 'none' | string;
  /** Android only */
  navigation_bar_color?: string;
};
