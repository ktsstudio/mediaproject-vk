import addToFavorites from './addToFavorites';
import allowMessagesFromGroup from './allowMessagesFromGroup';
import allowNotifications from './allowNotifications';
import getAuthToken, {
  ScopesEnum,
  AuthTokenResponseType,
} from './getAuthToken';
import getUserInfo from './getUserInfo';
import setSwipeSettings from './setSwipeSettings';
import setViewSettings, { ViewSettingsType } from './setViewSettings';
import shareLink from './shareLink';
import sharePost, {
  AttachmentMediaEnum,
  PostAttachmentType,
} from './sharePost';
import shareStory, {
  BackgroundStoryEnum,
  StoryAttachmentType,
} from './shareStory';
import {
  vibrateAsImpact,
  vibrateAsNotification,
  vibrateAsSelection,
  VibrationImpactEnum,
  VibrationNotificationEnum,
} from './vibrate';
import vkApi from './vkApi';

export {
  addToFavorites,
  allowMessagesFromGroup,
  allowNotifications,
  getAuthToken,
  getUserInfo,
  setSwipeSettings,
  setViewSettings,
  shareLink,
  sharePost,
  shareStory,
  vibrateAsImpact,
  vibrateAsNotification,
  vibrateAsSelection,
  vkApi,
};

export {
  ScopesEnum,
  AuthTokenResponseType,
  ViewSettingsType,
  AttachmentMediaEnum,
  PostAttachmentType,
  BackgroundStoryEnum,
  StoryAttachmentType,
  VibrationImpactEnum,
  VibrationNotificationEnum,
};
