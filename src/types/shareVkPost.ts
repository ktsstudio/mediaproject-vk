import { RequestPropsMap } from '@vkontakte/vk-bridge';
import { ApiResponse } from '@ktsstudio/mediaproject-utils';
import { UrlConfigType } from '@ktsstudio/mediaproject-utils/dist/types/types/api';

import { VkResponseType } from './common';
import { CallVkApiResponseType } from './callVkApi';

type ShareVkPostPropsType = RequestPropsMap['VKWebAppShowWallPostBox'] & {
  link_image?: string;
  link_button?: string;
  link_title?: string;
};

type ShareVkPostResponseType = VkResponseType<'VKWebAppShowWallPostBox'>;

type ShareVkPostWithUploadParamsType = {
  postProps: ShareVkPostPropsType;
  file: File;
  apiUploadUrl: UrlConfigType;
  userId: number;
  accessToken?: string;
  onUserDeniedAccess?: VoidFunction;
  // eslint-disable-next-line
  onErrorOccurred?: (error?: any, errorData?: any) => void;
};

type ShareVkPostWithUploadResponseType =
  | VkResponseType<'VKWebAppShowWallPostBox'>
  | VkResponseType<'VKWebAppCallAPIMethod'>;

type UploadFromApiToVkResponseType = ApiResponse<{
  hash: string;
  photo: string;
  server: string;
}>;

type SaveVkWallPhotoResponseType = CallVkApiResponseType<
  {
    id: number;
    album_id: number;
    owner_id: number;
  }[]
>;

export type {
  ShareVkPostPropsType,
  ShareVkPostResponseType,
  ShareVkPostWithUploadParamsType,
  ShareVkPostWithUploadResponseType,
  UploadFromApiToVkResponseType,
  SaveVkWallPhotoResponseType,
};
