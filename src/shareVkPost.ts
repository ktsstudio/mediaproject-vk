import { api } from '@ktsstudio/mediaproject-utils';
import bridge, { ErrorData } from '@vkontakte/vk-bridge';

import { callVkApi } from './callVkApi';
import { checkVkUserDenied } from './checkVkUserDenied';
import {
  UploadFromApiToVkResponseType,
  ShareVkPostResponseType,
  ShareVkPostWithUploadParamsType,
  ShareVkPostWithUploadResponseType,
  ShareVkPostPropsType,
  SaveVkWallPhotoResponseType,
} from './types';

/**
 * Утилита для шеринга поста на стену.
 *
 * @function
 * @async
 * @param {ShareVkPostPropsType} props - Объект параметров, передаваемый в метод VKWebAppShowWallPostBox. Так же может принимать поля link_image, link_button и link_title, необходимые для шеринга в сниппет.
 * @returns {Promise<ShareVkPostResponseType | void>} Возвращает ответ, полученный на запрос VKWebAppShowWallPostBox с переданными параметрами.
 *
 * @see {@link https://dev.vk.com/bridge/VKWebAppShowWallPostBox}
 */
const shareVkPost = async (
  props: ShareVkPostPropsType
): Promise<ShareVkPostResponseType | void> => {
  try {
    return await bridge.send('VKWebAppShowWallPostBox', props);
  } catch (error) {
    const errorData = error as ErrorData;

    if (checkVkUserDenied(errorData)) {
      return undefined;
    }

    return errorData;
  }
};

/**
 * Утилита для шеринга поста на стену с загрузкой картинки в альбом стены пользователя.
 *
 * 1. Получает URL сервера ВКонтакте.
 *
 * 2. Передает полученный URL и файл картинки бэкенду KTS, который загружает картинку
 * на сервер ВКонтакте и возвращает ссылку на нее, а так же данные сервера.
 *
 * 3. Сохраняет загруженную на сервер ВКонтакте картинку в альбом стены пользователя.
 *
 * 4. Вызывает окно шеринга поста, где во вложениях будет загруженная в альбом картинка.
 *
 * @function
 * @async
 * @param {ShareVkPostWithUploadParamsType} props Параметры для шеринга поста с загрузкой картинки в альбом.
 * @param {ShareVkPostPropsType} props.postProps Параметры для шеринга поста, передаваемые в {@link shareVkPost}.
 * @param {File} props.file Картинка (в виде файла), которую нужно загрузить.
 * @param {UrlConfigType} props.apiUploadUrl Endpoint бэкенда KTS, на который нужно отправить запрос для загрузки картинки на сервер ВКонтакте.
 * @param {number} props.userId ID пользователя, на стену к которому нужно загрузить картинку и пошерить пост.
 * @param {string} props.accessToken Токен доступа для обращения к API ВКонтакте (передается в {@link callVkApi}). По умолчанию берется из window.access_token.
 * @param {VoidFunction} props.onUserDeniedAccess Коллбэк, вызываемый в случае, если пользователь не дал разрешение на получение прав доступа внутри {@link callVkApi}.
 * @param {VoidFunction} props.onErrorOccurred Коллбэк, вызываемый в случае, если произошла ошибка.
 * @returns {Promise<ShareVkPostWithUploadResponseType | void>} Возвращает ответ, полученный на запрос VKWebAppShowWallPostBox или VKWebAppCallAPIMethod с переданными параметрами.
 *
 * @see {@link https://dev.vk.com/api/upload} (см. раздел "Загрузка фотографии на стену")
 */
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
     * Получаем URL сервера для загрузки фото
     */
    const getWallUploadServerData = await callVkApi({
      method: 'photos.getWallUploadServer',
      accessToken,
      getAccessTokenParams: {
        scopes: ['photos'],
        onUserDeniedAll: onUserDeniedAccess,
        onUserDeniedSomeScopes: onUserDeniedAccess,
      },
      renewTokenIfExpired: true,
    });

    if (getWallUploadServerData.error_type) {
      onErrorOccurred?.(getWallUploadServerData);

      return getWallUploadServerData;
    }

    /**
     * Получили ссылку на сервер загрузки,
     * теперь отправляем картинку на бэк для загрузки
     */
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
     */
    if (!apiUploadResponse?.response || error) {
      onErrorOccurred?.(error, errorData);

      return;
    }

    const { hash, photo, server } = apiUploadResponse.response; // получили картинку, id сервера и хэш

    /**
     * Сохраняем фото к пользователю,
     * передавая все поученное на предыдущем шаге
     * в метод сохранения картинки в альбоме стены
     */
    const saveWallPhotoData: SaveVkWallPhotoResponseType = await callVkApi({
      method: 'photos.saveWallPhoto',
      accessToken,
      /**
       * Здесь устанавливаем false, чтобы запрос доступа не показывался дважды
       * (в начале этой функции уже есть запрос)
       */
      renewTokenIfExpired: false,
      params: {
        hash,
        photo,
        server: Number(server),
        user_id: userId,
      },
    });

    if (saveWallPhotoData.error_type || !saveWallPhotoData.response?.[0]) {
      onErrorOccurred?.(saveWallPhotoData);

      return;
    }

    /**
     * Получили id загруженной картинки и id пользователя
     */
    // eslint-disable-next-line prefer-destructuring
    const { id: mediaId, owner_id: ownerId } = saveWallPhotoData.response[0];
    const uploadedPhotoAttachment = `photo${ownerId}_${mediaId}`;

    /**
     * На этом моменте вылетает предложение зашерить пост
     */
    return await shareVkPost({
      ...postProps,
      attachments: postProps.attachments
        ? postProps.attachments.concat(`,${uploadedPhotoAttachment}`)
        : uploadedPhotoAttachment,
    });
  } catch (error) {
    const errorData = error as ErrorData;

    if (!checkVkUserDenied(errorData)) {
      onErrorOccurred?.(errorData);
    }

    return errorData;
  }
};

export { shareVkPost, shareVkPostWithUpload };
