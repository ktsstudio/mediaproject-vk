import { ErrorData } from '@vkontakte/vk-bridge';

const checkUserDenied = (error: ErrorData): boolean =>
  error?.error_type === 'client_error' &&
  error?.error_data?.error_reason === 'User denied';

export { checkUserDenied };
