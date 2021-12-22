export enum PostAttachmentMediaEnum {
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
  type: PostAttachmentMediaEnum; // тип медиа-приложения
  owner_id: number | string; // идентификатор владельца медиа-приложения
  media_id: number | string; // идентификатор медиа-приложения
};

export enum BackgroundStoryEnum {
  image = 'image',
  video = 'video',
  none = 'none',
}

export type StoryAttachmentType = {
  text: string; // ключ для текста кнопки
  type: 'url' | 'audio' | 'video' | 'photo'; // тип аттача
  url?: string; // ссылка на контент
  owner_id?: number; // идентификатор владельца объекта
  id?: number; // идентификатор объекта
  access_key?: string; // ключ доступа для вложения
};
