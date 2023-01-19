import { api } from '@ktsstudio/mediaproject-utils';
import bridge from '@vkontakte/vk-bridge';

import { callApi } from './callApi';
import { checkUserDenied } from './checkUserDenied';
import {
  ApiUploadResponseType,
  SharePostParamsType,
  SharePostResponseType,
  SharePostWithUploadParamsType,
  SharePostWithUploadResponseType,
} from './types/sharePost';

/*
 * Метод для шеринга поста на стену
 */
const sharePost = async ({
  message,
  mediaAttachments = [],
  linksAttachments = [],
  extra = {},
}: SharePostParamsType): Promise<SharePostResponseType | undefined> => {
  try {
    const attachments = mediaAttachments
      .map(({ type, owner_id, media_id }) => `${type}${owner_id}_${media_id}`)
      .concat(linksAttachments)
      .join(',');

    return await bridge.send('VKWebAppShowWallPostBox', {
      message,
      attachments,
      ...extra,
    });
  } catch (error) {
    if (checkUserDenied(error)) {
      return undefined;
    }

    return error;
  }
};

/*
 * Метод для шеринга поста на стену с загрузкой фото в альбом
 */
const sharePostWithUpload = async ({
  apiUploadUrl,
  image,
  text,
  userId,
  accessToken = window.access_token,
  onUserDeniedAccess,
  onErrorOccurred,
}: SharePostWithUploadParamsType): Promise<SharePostWithUploadResponseType | void> => {
  try {
    /*
     * Получаем url сервера для загрузки фото
     */
    const getWallUploadServerData = await callApi({
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

    /*
     * Получили ссылку на сервер загрузки,
     * теперь отправляем картинку на бэк для загрузки
     */
    const {
      response: apiUploadResponse,
      error,
      errorData,
    }: ApiUploadResponseType = await api(
      apiUploadUrl,
      {
        image,
        server_url: getWallUploadServerData.response.upload_url,
      },
      {},
      true
    );

    /*
     * Если загрузить картинку на сервер не получилось,
     * обрабатываем ошибку и дальше не идем
     */
    if (!apiUploadResponse?.response || error) {
      onErrorOccurred?.(error, errorData);

      return;
    }

    const { hash, photo, server } = apiUploadResponse.response; // получили картинку, id сервера и хэш

    /*
     * Сохраняем фото к пользователю,
     * передавая все поученное на предыдущем шаге
     * в метод сохранения картинки в альбоме стены
     */
    const saveWallPhotoData = await callApi({
      method: 'VKWebAppCallAPIMethod',
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

    /*
     * Получили id загруженной картинки и id пользователя
     */
    const { id: mediaId, owner_id: ownerId } = saveWallPhotoData[0];

    /*
     * На этом моменте вылетает предложение зашерить пост
     */
    return await sharePost({
      message: text,
      mediaAttachments: [
        {
          type: 'photo',
          owner_id: ownerId,
          media_id: mediaId,
        },
      ],
    });
  } catch (error) {
    if (!checkUserDenied(error)) {
      onErrorOccurred?.(error);
    }

    return error;
  }
};

export { sharePost, sharePostWithUpload };
