import bridge from '@vkontakte/vk-bridge';

import { BackgroundStoryEnum, StoryAttachmentType } from './types/sharing';

/**
 * Метод для шеринга истории.
 * В случае успеха возвращает true
 * В случае ошибки возвращает false,
 * Возвращает null, если пользователь не дал разрешение (ошибка 'User denied')
 * @param {string} url Url картинки, которая шерится в историю
 * @param {string} blob Картинка для шеринга в base64
 * @param {StoryAttachmentType} attachment Аттач к истории - ссылка с кнопкой и т.д.
 * @param {boolean} locked Можно ли изменять размер и положение фоновой картинки
 * @param {BackgroundStoryEnum} background_type Тип фона - картинка, видео или фона нет
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
