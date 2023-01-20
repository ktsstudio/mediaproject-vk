/*
 * Проверяет, является ли фотография пользователя дефолтной аватаркой.
 */
const checkAvatarDefault = (
  photo: string,
  size: 50 | 100 | 200 | 400 = 100
): boolean => !photo || photo === `https://vk.com/images/camera_${size}.png`;

export { checkAvatarDefault };
