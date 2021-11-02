import bridge from '@vkontakte/vk-bridge';

import { AuthTokenResponseType, ScopesEnum } from './types/token';

/**
 * Gets token with passed access scope.
 * Returns token string, if success.
 * Returns false for non user caused errors,
 * returns true for error 'User denied'.
 */
export default async (
  app_id: number,
  accessScope: ScopesEnum | ScopesEnum[]
): Promise<string | boolean> => {
  const scope = Array.isArray(accessScope)
    ? accessScope.join(', ')
    : accessScope;

  try {
    const response: AuthTokenResponseType = await bridge.send(
      'VKWebAppGetAuthToken',
      {
        app_id,
        scope,
      }
    );

    return response?.access_token || false;
  } catch (e) {
    if (
      e.error_type === 'client_error' &&
      e.error_data?.error_reason === 'User denied'
    ) {
      return true;
    }

    console.log(e);
    return false;
  }
};
