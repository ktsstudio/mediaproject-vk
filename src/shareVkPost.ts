import { api } from '@ktsstudio/mediaproject-utils';
import bridge from '@vkontakte/vk-bridge';

import { callVkApi } from './callVkApi';
import { checkVkUserDenied } from './checkVkUserDenied';
import {
  UploadFromApiToVkResponseType,
  ShareVkPostResponseType,
  ShareVkPostWithUploadParamsType,
  ShareVkPostWithUploadResponseType,
  ShareVkPostPropsType,
} from './types';

/**
 * Метод для шеринга поста на стену
 **/
const shareVkPost = async (
  props: ShareVkPostPropsType
): Promise<ShareVkPostResponseType | undefined> => {
  try {
    return await bridge.send('VKWebAppShowWallPostBox', props);
  } catch (error) {
    if (checkVkUserDenied(error)) {
      return undefined;
    }

    return error;
  }
};

/**
 * Метод для шеринга поста на стену с загрузкой фото в альбом
 **/
const shareVkPostWithUpload = async ({
  postProps,
  file,
  apiUploadUrl,
  userId,
  accessToken = window.access_token,
  onUserDeniedAccess,
  onErrorOccurred,
}: ShareVkPostWithUploadParamsType): Promise<ShareVkPostWithUploadResponseType | void> => {
  try {
    /**
     * Получаем url сервера для загрузки фото
     **/
    const getWallUploadServerData = await callVkApi({
      method: 'photos.getWallUploadServer',
      accessToken,
      getAccessTokenParams: {
        scopes: ['photos'],
        onUserDeniedAll: onUserDeniedAccess,
        onUserDeniedSomeScopes: onUserDeniedAccess,
      },
      renewTokenIfNoneProvided: true,
      renewTokenIfExpired: true,
    });

    if (getWallUploadServerData.error_type) {
      onErrorOccurred?.(getWallUploadServerData);

      return getWallUploadServerData;
    }

    /**
     * Получили ссылку на сервер загрузки,
     * теперь отправляем картинку на бэк для загрузки
     **/
    const {
      response: apiUploadResponse,
      error,
      errorData,
    }: UploadFromApiToVkResponseType = await api(
      apiUploadUrl,
      {
        image: file,
        server_url: getWallUploadServerData.response.upload_url,
      },
      {},
      true
    );

    /**
     * Если загрузить картинку на сервер не получилось,
     * обрабатываем ошибку и дальше не идем
     **/
    if (!apiUploadResponse?.response || error) {
      onErrorOccurred?.(error, errorData);

      return;
    }

    const { hash, photo, server } = apiUploadResponse.response; // получили картинку, id сервера и хэш

    /**
     * Сохраняем фото к пользователю,
     * передавая все поученное на предыдущем шаге
     * в метод сохранения картинки в альбоме стены
     **/
    const saveWallPhotoData = await callVkApi({
      method: 'photos.saveWallPhoto',
      accessToken,
      /**
       * Здесь устанавливаем false, чтобы запрос доступа не показывался дважды
       * (в начале этой функции уже есть запрос)
       **/
      renewTokenIfExpired: false,
      params: {
        hash,
        photo,
        server: Number(server),
        user_id: userId,
      },
    });

    if (saveWallPhotoData.error_type) {
      onErrorOccurred?.(saveWallPhotoData);

      return;
    }

    /**
     * Получили id загруженной картинки и id пользователя
     **/
    // eslint-disable-next-line prefer-destructuring
    const { id: mediaId, owner_id: ownerId } = saveWallPhotoData[0];
    const uploadedPhotoAttachment = `photo${ownerId}_${mediaId}`;

    /**
     * На этом моменте вылетает предложение зашерить пост
     **/
    return await shareVkPost({
      ...postProps,
      attachments: postProps.attachments
        ? postProps.attachments.concat(`,${uploadedPhotoAttachment}`)
        : uploadedPhotoAttachment,
    });
  } catch (error) {
    if (!checkVkUserDenied(error)) {
      onErrorOccurred?.(error);
    }

    return error;
  }
};

export { shareVkPost, shareVkPostWithUpload };
