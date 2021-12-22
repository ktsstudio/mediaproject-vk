import bridge from '@vkontakte/vk-bridge';
import {
  findGetParameter,
  initializeAppParams,
} from '@ktsstudio/mediaproject-utils';

import checkIOS from './checkIOS';
import checkMobile from './checkMobile';

/**
 * Утилита для инициализации параметров vk-mini-app. Берет параметры из строки с квери-параметрами.
 * Сначала инициализирует общие параметры через initializeAppParams из @ktsstudio/mediaproject-utils.
 * Параметры, которые устанавливаются: search, location_hash, is_production, is_dev,
 * app_id, scope, user_id, group_id, platform, is_mobile, page, is_odr, is_ios.
 * Добавляет классы на document.body:
 * - 'mobile' или 'desktop' в зависимости от устройства;
 * - 'ios' или 'android' в зависимости от платформы.
 * Отправляет событие VKWebAppInit в vk-bridge.
 */
export default (): void => {
  initializeAppParams();

  window.app_id = Number(findGetParameter('vk_app_id'));
  window.scope = findGetParameter('vk_access_token_settings');
  window.user_id = Number(findGetParameter('vk_user_id'));
  window.group_id = findGetParameter('group_id');
  window.platform = findGetParameter('vk_platform') || 'desktop_web';
  window.page = findGetParameter('page', window.location_hash);
  window.is_odr = findGetParameter('odr_enabled') === '1';

  checkMobile();
  checkIOS();

  bridge.send('VKWebAppInit', {});

  // eslint-disable-next-line no-console
  console.log(`VK, ${window.is_mobile ? 'mobile, ' : ''}${window.platform}`);
};
