import bridge from '@vkontakte/vk-bridge';

import { BackgroundStoryEnum, StoryAttachmentType } from './types/sharing';

/**
 * Method for story sharing.
 * Returns true, if success.
 * Returns false for non user caused errors,
 * returns null for error 'User denied'.
 */
export default async (
  url?: string,
  blob?: string,
  attachment?: StoryAttachmentType,
  locked = true,
  background_type = BackgroundStoryEnum.image
): Promise<boolean | null> => {
  try {
    const props: any = {};

    if (url) {
      props.url = url;
    } else if (blob) {
      props.blob = blob;
    }

    if (attachment) {
      props.attachment = attachment;
    }

    const { result } = await bridge.send('VKWebAppShowStoryBox', {
      background_type,
      locked,
      ...props,
    });

    return Boolean(result);
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
