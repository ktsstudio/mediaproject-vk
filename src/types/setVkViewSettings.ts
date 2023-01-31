import { RequestPropsMap } from '@vkontakte/vk-bridge';

import { VkResponseType } from './common';

type SetViewSettingsPropsType = RequestPropsMap['VKWebAppSetViewSettings'];

type SetViewSettingsResponseType = VkResponseType<'VKWebAppSetViewSettings'>;

export { SetViewSettingsPropsType, SetViewSettingsResponseType };
