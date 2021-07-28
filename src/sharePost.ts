import bridge, { WallPostRequestOptions } from '@vkontakte/vk-bridge';

import { PostAttachmentType } from './types/sharing';

export default async (
  message: string,
  mediaAttachments: PostAttachmentType[] = [],
  linksAttachments: string[] = [],
  extra: Partial<WallPostRequestOptions> = {}
): Promise<boolean> => {
  const attachments = mediaAttachments
    .map(({ type, owner_id, media_id }) => `${type}${owner_id}_${media_id}`)
    .concat(linksAttachments)
    .join(',');

  const response: { post_id: number | string } = await bridge.send(
    'VKWebAppShowWallPostBox',
    {
      message,
      attachments,
      ...extra,
    }
  );

  return Boolean(response?.post_id);
};
