import bridge from '@vkontakte/vk-bridge';

import { BackgroundStoryEnum, StoryAttachmentType } from './types/sharing';

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
