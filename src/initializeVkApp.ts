import bridge from '@vkontakte/vk-bridge';
import { checkIOS, findGetParameter } from '@ktsstudio/mediaproject-utils';

export default () => {
  window.search = location.search;
  window.app_id = Number(findGetParameter('vk_app_id'));
  window.scope = findGetParameter('vk_access_token_settings');
  window.user_id = findGetParameter('vk_user_id');
  window.group_id = findGetParameter('group_id');

  window.PLATFORM = findGetParameter('vk_platform') || 'desktop_web';
  window.IS_MOBILE = window.PLATFORM !== 'desktop_web';
  window.IS_PRODUCTION = process.env.NODE_ENV === 'production';
  window.LOCATION_HASH = location.hash;
  window.page = findGetParameter('page', window.LOCATION_HASH);

  checkIOS(window.PLATFORM);

  bridge.send('VKWebAppInit', {});
};
