import bridge from '@vkontakte/vk-bridge';
import {
  findGetParameter,
  initializeAppParams,
} from '@ktsstudio/mediaproject-utils';

import { checkVkPlatform } from './checkVkPlatform';
import { InitializeVkAppResponseType, VkPlatformType } from './types';

/***
 * Утилита для инициализации параметров vk-mini-app. Берет параметры из строки с квери-параметрами.
 * Сначала инициализирует общие параметры через initializeAppParams из @ktsstudio/mediaproject-utils.
 * Параметры, которые устанавливаются: search, location_hash, is_production, is_dev,
 * app_id, scope, user_id, group_id, platform, is_mobile, page, is_odr, is_ios.
 * Добавляет классы на document.body:
 * - 'mobile' или 'desktop' в зависимости от устройства;
 * - 'ios' или 'android' в зависимости от платформы.
 * Отправляет событие VKWebAppInit в vk-bridge.
 **/
const initializeVkApp = async (): Promise<InitializeVkAppResponseType> => {
  initializeAppParams();

  window.user_id = Number(findGetParameter('vk_user_id'));
  window.app_id = Number(findGetParameter('vk_app_id'));
  window.notifications_enabled = Boolean(
    findGetParameter('vk_are_notifications_enabled')
  );
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
