import addToFavorites from './addToFavorites';
import allowMessagesFromGroup from './allowMessagesFromGroup';
import allowNotifications from './allowNotifications';
import getAuthToken from './getAuthToken';
import getUserInfo from './getUserInfo';
import setSwipeSettings from './setSwipeSettings';
import setViewSettings from './setViewSettings';
import shareLink from './shareLink';
import sharePost from './sharePost';
import shareStory from './shareStory';
import {
  vibrateAsImpact,
  vibrateAsNotification,
  vibrateAsSelection,
} from './vibrate';
import vkApi from './vkApi';
import initializeVkApp from './initializeVkApp';
import checkIOS from './checkIOS';
import checkMobile from './checkMobile';

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
  initializeVkApp,
  checkMobile,
  checkIOS,
};

import {
  PostAttachmentMediaEnum,
  PostAttachmentType,
  BackgroundStoryEnum,
  StoryAttachmentType,
} from './types/sharing';
import { ScopesEnum, AuthTokenResponseType } from './types/token';
import {
  VibrationImpactEnum,
  VibrationNotificationEnum,
} from './types/vabrations';
import { ViewSettingsType } from './types/viewSettings';
import { WindowType } from './types/window';

export {
  PostAttachmentMediaEnum,
  PostAttachmentType,
  BackgroundStoryEnum,
  StoryAttachmentType,
  ScopesEnum,
  AuthTokenResponseType,
  VibrationImpactEnum,
  VibrationNotificationEnum,
  ViewSettingsType,
  WindowType,
};
