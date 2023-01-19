import { WallPostRequestOptions } from '@vkontakte/vk-bridge';
import { ApiResponse } from '@ktsstudio/mediaproject-utils';
import { UrlConfigType } from '@ktsstudio/mediaproject-utils/dist/types/types/api';

import { ResponseType } from './common';

type PostAttachmentMediaType =
  | 'photo'
  | 'video'
  | 'audio'
  | 'doc'
  | 'page'
  | 'note'
  | 'poll'
  | 'album'
  | 'market'
  | 'market_album'
  | 'audio_playlist';

type PostAttachmentType = {
  type: PostAttachmentMediaType; // тип медиа-приложения
  owner_id: number | string; // идентификатор владельца медиа-приложения
  media_id: number | string; // идентификатор медиа-приложения
};

type SharePostParamsType = {
  message: string;
  mediaAttachments?: PostAttachmentType[];
  linksAttachments?: string[];
  extra?: Partial<WallPostRequestOptions>;
};

type SharePostResponseType = ResponseType<'VKWebAppShowWallPostBox'>;

type SharePostWithUploadParamsType = {
  apiUploadUrl: UrlConfigType;
  image: File;
  text: string;
  userId: number;
  accessToken?: string;
  onUserDeniedAccess?: () => void;
  // eslint-disable-next-line
  onErrorOccurred?: (error?: any, errorData?: any) => void;
};

type SharePostWithUploadResponseType =
  | ResponseType<'VKWebAppShowWallPostBox'>
  | ResponseType<'VKWebAppCallAPIMethod'>;

type ApiUploadResponseType = ApiResponse<{
  response: {
    hash: string;
    photo: string;
    server: string;
  };
}>;

export type {
  PostAttachmentMediaType,
  PostAttachmentType,
  SharePostParamsType,
  SharePostWithUploadParamsType,
  SharePostResponseType,
  SharePostWithUploadResponseType,
  ApiUploadResponseType,
};
