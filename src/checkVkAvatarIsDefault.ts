import { CheckVkAvatarIsDefaultParamsType } from './types';

/**
 * Проверяет, является ли фотография пользователя дефолтной аватаркой.
 **/
const checkVkAvatarIsDefault = ({
  photo,
  size = 100,
}: CheckVkAvatarIsDefaultParamsType): boolean =>
  !photo || photo === `https://vk.com/images/camera_${size}.png`;

export { checkVkAvatarIsDefault };
