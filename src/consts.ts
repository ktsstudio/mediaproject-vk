import { ErrorData } from '@vkontakte/vk-bridge';

const vkErrorTypes = new Set<ErrorData['error_type']>([
  'client_error',
  'api_error',
  'auth_error',
]);

const userDeniedErrorReasons = new Set([
  'User denied',
  'Operation denied by user',
]);

export { vkErrorTypes, userDeniedErrorReasons };
