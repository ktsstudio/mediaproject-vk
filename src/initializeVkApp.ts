import bridge from '@vkontakte/vk-bridge';
import {
  findGetParameter,
  initializeAppParams,
} from '@ktsstudio/mediaproject-utils';

import { checkVkPlatform } from './checkVkPlatform';
import { InitializeVkAppResponseType, VkPlatformType } from './types';

/**
 * Утилита для инициализации параметров mini-app ВКонтакте.
 * Сначала инициализирует общие параметры через initializeAppParams
 * из {@link https://github.com/ktsstudio/mediaproject-utils @ktsstudio/mediaproject-utils}.
 * Затем получает {@link https://dev.vk.com/mini-apps/development/launch-params параметры запуска}
 * из query-параметров и сохраняет их в window ({@link WindowType}).
 * После этого вызывает утилиту {@link checkVkPlatform}.
 * В конце отправляет событие {@link https://dev.vk.com/bridge/VKWebAppInit VKWebAppInit} в vk-bridge.
 *
 * @returns {Promise<SetViewSettingsResponseType>} Возвращает ответ, полученный на запрос VKWebAppInit.
 */
const initializeVkApp = async (): Promise<InitializeVkAppResponseType> => {
  initializeAppParams();

  window.user_id = Number(findGetParameter('vk_user_id'));
  window.app_id = Number(findGetParameter('vk_app_id'));
  window.notifications_enabled =
    findGetParameter('vk_are_notifications_enabled') === '1';
  window.language = findGetParameter('vk_language') || undefined;
  window.ref = findGetParameter('vk_ref') || undefined;
  window.scope = findGetParameter('vk_access_token_settings') || undefined;
  window.group_id = findGetParameter('group_id') || undefined;
  window.viewer_group_role =
    findGetParameter('vk_viewer_group_role') || undefined;
  window.platform = (findGetParameter('vk_platform') ||
    'desktop_web') as VkPlatformType;
  window.is_odr = findGetParameter('odr_enabled') === '1';

  checkVkPlatform();

  // eslint-disable-next-line no-console
  console.log(`VK, ${window.is_mobile ? 'mobile, ' : ''}${window.platform}`);

  return await bridge.send('VKWebAppInit', {});
};

export { initializeVkApp };
