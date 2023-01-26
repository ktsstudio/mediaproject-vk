import bridge, { ErrorData, RequestProps } from '@vkontakte/vk-bridge';

import { checkVkUserDenied } from './checkVkUserDenied';
import { ShareVkStoryPropsType, ShareVkStoryResponseType } from './types';

/**
 * Утилита для шеринга истории.
 *
 * @function
 * @async
 * @param {ShareVkStoryPropsType} props - Объект параметров, передаваемый в метод VKWebAppShowStoryBox. Если указан url, использует его. Иначе использует blob, если указан.
 * @returns {Promise<ShareVkStoryResponseType | void>} Возвращает ответ, полученный на запрос VKWebAppShowStoryBox с переданными параметрами.
 *
 * @see {@link https://dev.vk.com/bridge/VKWebAppShowStoryBox}
 */
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
    const errorData = error as ErrorData;

    if (checkVkUserDenied(errorData)) {
      return;
    }

    return errorData;
  }
};

export { shareVkStory };
