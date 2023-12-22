import bridge from '@vkontakte/vk-bridge';

import { InitializeVkAppResponseType } from './types';

/**
 * Утилита для инициализации mini-app ВКонтакте.
 * Отправляет событие {@link https://dev.vk.com/bridge/VKWebAppInit VKWebAppInit} в vk-bridge.
 *
 * @returns {Promise<SetViewSettingsResponseType>} Возвращает ответ, полученный на запрос VKWebAppInit.
 */
const initializeVkApp = async (): Promise<InitializeVkAppResponseType> => {
  return await bridge.send('VKWebAppInit', {});
};

export { initializeVkApp };
