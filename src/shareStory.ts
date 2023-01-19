import bridge, { RequestProps } from '@vkontakte/vk-bridge';

import {
  BackgroundStoryEnum,
  ShareStoryParamsType,
  ShareStoryResponseType,
} from './types/shareStory';
import { checkUserDenied } from './checkUserDenied';

/*
 * Метод для шеринга истории
 */
const shareStory = async ({
  url,
  blob,
  attachment,
  locked = true,
  backgroundType = BackgroundStoryEnum.image,
}: ShareStoryParamsType): Promise<ShareStoryResponseType | void> => {
  try {
    const props: RequestProps<'VKWebAppShowStoryBox'> = {
      background_type: backgroundType,
      locked,
    };

    if (url) {
      props.url = url;
    } else if (blob) {
      props.blob = blob;
    }

    if (attachment) {
      props.attachment = attachment;
    }

    return await bridge.send('VKWebAppShowStoryBox', props);
  } catch (error) {
    if (checkUserDenied(error)) {
      return;
    }

    return error;
  }
};

export { shareStory };
