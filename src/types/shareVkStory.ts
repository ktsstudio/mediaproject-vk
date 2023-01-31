import { RequestPropsMap } from '@vkontakte/vk-bridge';

import { VkResponseType } from './common';

type ShareVkStoryPropsType = RequestPropsMap['VKWebAppShowStoryBox'];

type ShareVkStoryResponseType = VkResponseType<'VKWebAppShowStoryBox'>;

export { ShareVkStoryPropsType, ShareVkStoryResponseType };
