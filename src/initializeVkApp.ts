import bridge from '@vkontakte/vk-bridge';
import {
  findGetParameter,
  initializeAppParams,
} from '@ktsstudio/mediaproject-utils';

import checkIOS from './checkIOS';

/*
 * Утилита для инициализации параметров vk-mini-app. Берет параметры из строки с квери-параметрами.
 * Сначала инициализирует общие параметры через initializeAppParams из @ktsstudio/mediaproject-utils.
 * Отправляет событие VKWebAppInit в vk-bridge
 */
export default () => {
  initializeAppParams();

  window.app_id = Number(findGetParameter('vk_app_id'));
  window.scope = findGetParameter('vk_access_token_settings');
  window.user_id = Number(findGetParameter('vk_user_id'));
  window.group_id = findGetParameter('group_id');
  window.platform = findGetParameter('vk_platform') || 'desktop_web';
  window.is_mobile = window.platform !== 'desktop_web';
  window.page = findGetParameter('page', window.location_hash);
  window.is_odr = findGetParameter('odr_enabled') === '1';

  window.is_mobile
    ? document.body.classList.add('mobile')
    : document.body.classList.remove('mobile');

  checkIOS();

  bridge.send('VKWebAppInit', {});

  console.log(`VK, ${window.is_mobile ? 'mobile, ' : ''}${window.platform}`);
};
