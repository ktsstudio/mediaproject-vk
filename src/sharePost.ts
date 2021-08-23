import bridge, { WallPostRequestOptions } from '@vkontakte/vk-bridge';

import { PostAttachmentType } from './types/sharing';

/*
 * Method for post sharing.
 * Returns true, if success.
 * Returns false for non user caused errors,
 * returns null for error 'User denied'.
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

    console.log(e);
    return false;
  }
};
