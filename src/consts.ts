import { ErrorData } from '@vkontakte/vk-bridge';

const vkErrorTypes = new Set<ErrorData['error_type']>([
  'client_error',
  'api_error',
  'auth_error',
]);

export { vkErrorTypes };
