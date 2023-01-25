import bridge, { RequestProps } from '@vkontakte/vk-bridge';

import { checkVkUserDenied } from './checkVkUserDenied';
import { ShareVkStoryPropsType, ShareVkStoryResponseType } from './types';

/**
 * Метод для шеринга истории
 **/
const shareVkStory = async ({
  url,
  blob,
  attachment,
  locked = true,
  background_type = 'image',
}: ShareVkStoryPropsType): Promise<ShareVkStoryResponseType | void> => {
  try {
    const props: RequestProps<'VKWebAppShowStoryBox'> = {
      background_type,
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
    if (checkVkUserDenied(error)) {
      return;
    }

    return error;
  }
};

export { shareVkStory };
