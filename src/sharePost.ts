import bridge, { WallPostRequestOptions } from '@vkontakte/vk-bridge';

export enum AttachmentMediaEnum {
  photo = 'photo', // фотография
  video = 'video', // видеозапись
  audio = 'audio', // аудиозапись
  doc = 'doc', // документ
  page = 'page', // wiki-страница
  note = 'note', // заметка
  poll = 'poll', // опрос
  album = 'album', // альбом
  market = 'market', // товар
  market_album = 'market_album', // подборка товаров
  audio_playlist = 'audio_playlist', // плейлист с аудио
}

export type PostAttachmentType = {
  type: AttachmentMediaEnum; // тип медиа-приложения
  owner_id: number | string; // идентификатор владельца медиа-приложения
  media_id: number | string; // идентификатор медиа-приложения
};

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
