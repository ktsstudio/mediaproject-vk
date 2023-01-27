import { CheckVkAvatarIsDefaultParamsType } from './types';

/**
 * Утилита для проверки, является ли аватаром пользователя ВКонтакте {@link https://vk.com/images/camera_400.png дефолтная картинка}.
 *

 * @param {CheckVkAvatarIsDefaultParamsType} props
 * @param {string} props.photo URL аватара пользователя, полученный от API ВКонтакте.
 * @param {50 | 100 | 200 | 400} [props.size=100] Размер картинки аватара пользователя, который был запрошен. По умолчанию 100.
 * @returns {boolean} Если аватар является дефолтной картинкой, возвращает true. Иначе возвращает false.
 */
const checkVkAvatarIsDefault = ({
  photo,
  size = 100,
}: CheckVkAvatarIsDefaultParamsType): boolean =>
  !photo || photo === `https://vk.com/images/camera_${size}.png`;

export { checkVkAvatarIsDefault };
