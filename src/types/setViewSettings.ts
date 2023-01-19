import { AppearanceType } from '@vkontakte/vk-bridge';

export type ViewSettingsType = {
  status_bar_style: AppearanceType;
  /* Только для Android */
  action_bar_color?: 'none' | string;
  /* Только для Android */
  navigation_bar_color?: string;
};
