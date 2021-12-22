/**
 * Проверяет, является ли фотография пользователя дефолтной аватаркой.
 * @param {string} photo Фотография
 * @param {50 | 100 | 200 | 400} size Размер фотографии. Например, для поля photo_100 размер равен 100. По умолчанию равен 100
 * @return {boolean} Результат проверки
 */
export default (photo: string, size: 50 | 100 | 200 | 400 = 100): boolean =>
  photo === `https://vk.com/images/camera_${size}.png`;
