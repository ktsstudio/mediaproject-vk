import bridge from '@vkontakte/vk-bridge';

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

export default async (
  url?: string,
  blob?: string,
  attachment?: StoryAttachmentType,
  locked = true,
  background_type = BackgroundStoryEnum.image
): Promise<boolean> => {
  const { result } = await bridge.send('VKWebAppShowStoryBox', {
    background_type,
    url,
    blob,
    locked,
    attachment,
  });

  return Boolean(result);
};
