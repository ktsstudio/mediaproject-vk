import bridge, { WallPostRequestOptions } from '@vkontakte/vk-bridge';

import { PostAttachmentType } from './types/sharing';

/**
 * Метод для шеринга поста на стену.
 * В случае успеха возвращает true
 * В случае ошибки возвращает false,
 * Возвращает null, если пользователь не дал разрешение (ошибка 'User denied')
 * @param {string} message Текст поста
 * @param {PostAttachmentType[]} mediaAttachments Медиа аттачи к посту (фотки, видосы и т.д., но не ссылки)
 * @param {string[]} linksAttachments Аттачи-ссылки
 * @param {Partial<WallPostRequestOptions>} extra Дополнительные параметры для шеринга поста
 */
export default async (
  message: string,
  mediaAttachments: PostAttachmentType[] = [],
  linksAttachments: string[] = [],
  extra: Partial<WallPostRequestOptions> = {}
): Promise<boolean | null> => {
  const attachments = mediaAttachments
    .map(({ type, owner_id, media_id }) => `${type}${owner_id}_${media_id}`)
    .concat(linksAttachments)
    .join(',');

  try {
    const response: { post_id: number | string } = await bridge.send(
      'VKWebAppShowWallPostBox',
      {
        message,
        attachments,
        ...extra,
      }
    );

    return Boolean(response?.post_id);
  } catch (e) {
    if (
      e.error_type === 'client_error' &&
      e.error_data?.error_reason === 'User denied'
    ) {
      return null;
    }

    // eslint-disable-next-line no-console
    console.log(e);
    return false;
  }
};
