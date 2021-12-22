import addToFavorites from './addToFavorites';
import allowMessagesFromGroup from './allowMessagesFromGroup';
import allowNotifications from './allowNotifications';
import getAuthToken from './getAuthToken';
import getUserInfo from './getUserInfo';
import isAvatarDefault from './isAvatarDefault';
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
// eslint-disable-next-line import/order
import { useEventSubscribe, usePolling } from './hooks';

export {
  addToFavorites,
  allowMessagesFromGroup,
  allowNotifications,
  getAuthToken,
  getUserInfo,
  isAvatarDefault,
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
  useEventSubscribe,
  usePolling,
};

import {
  PostAttachmentMediaEnum,
  PostAttachmentType,
  BackgroundStoryEnum,
  StoryAttachmentType,
} from './types/sharing';
import {
  VibrationImpactEnum,
  VibrationNotificationEnum,
} from './types/vibrations';
import { ViewSettingsType } from './types/viewSettings';
import { WindowType } from './types/window';

export {
  PostAttachmentMediaEnum,
  PostAttachmentType,
  BackgroundStoryEnum,
  StoryAttachmentType,
  VibrationImpactEnum,
  VibrationNotificationEnum,
  ViewSettingsType,
  WindowType,
};
