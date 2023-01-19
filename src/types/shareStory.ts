import { ResponseType } from './common';

enum BackgroundStoryEnum {
  image = 'image',
  video = 'video',
  none = 'none',
}

type StoryAttachmentTypeType = 'url' | 'audio' | 'video' | 'photo';

type StoryAttachmentType = {
  text: string;
  type: StoryAttachmentTypeType;
  url?: string;
  owner_id?: number;
  id?: number;
  access_key?: string;
};

export type ShareStoryParamsType = {
  url?: string;
  blob?: string;
  attachment?: StoryAttachmentType;
  locked?: boolean;
  backgroundType?: BackgroundStoryEnum;
};

export type ShareStoryResponseType = ResponseType<'VKWebAppShowStoryBox'>;

export { BackgroundStoryEnum, StoryAttachmentTypeType, StoryAttachmentType };
