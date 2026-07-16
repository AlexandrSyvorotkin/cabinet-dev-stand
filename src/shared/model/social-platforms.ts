import maxIcon from '@/shared/assets/social-icons/Max colored.svg';
import odnoklassnikiIcon from '@/shared/assets/social-icons/OK.svg';
import telegramIcon from '@/shared/assets/social-icons/telegram.svg';
import vkIcon from '@/shared/assets/social-icons/vk.svg';
import dzenIcon from '@/shared/assets/social-icons/ya-zen-logo.svg';

export type SocialPlatformId = 'telegram' | 'vk' | 'odnoklassniki' | 'max' | 'dzen';

export type SocialPlatform = {
  id: SocialPlatformId;
  label: string;
  icon: string;
};

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: 'telegram', label: 'ТГ', icon: telegramIcon },
  { id: 'vk', label: 'VK', icon: vkIcon },
  { id: 'odnoklassniki', label: 'OK', icon: odnoklassnikiIcon },
  { id: 'max', label: 'MAX', icon: maxIcon },
  { id: 'dzen', label: 'Дзен', icon: dzenIcon },
];

export const SOCIAL_PLATFORM_IDS = SOCIAL_PLATFORMS.map((platform) => platform.id);

export const getSocialPlatformById = (id: SocialPlatformId): SocialPlatform => {
  const platform = SOCIAL_PLATFORMS.find((entry) => entry.id === id);

  if (!platform) {
    throw new Error(`Unknown social platform: ${id}`);
  }

  return platform;
};

export const isSocialPlatformId = (value: string): value is SocialPlatformId =>
  SOCIAL_PLATFORM_IDS.includes(value as SocialPlatformId);
