import { Group, Select } from '@mantine/core';
import {
  getSocialPlatformById,
  SOCIAL_PLATFORMS,
  type SocialPlatformId,
} from '@/shared/model/social-platforms';

type SocialPlatformIconProps = {
  platformId: SocialPlatformId;
  size?: number;
};

const SocialPlatformIcon = ({ platformId, size = 20 }: SocialPlatformIconProps) => {
  const platform = getSocialPlatformById(platformId);

  return (
    <img
      src={platform.icon}
      alt=""
      width={size}
      height={size}
      style={{ display: 'block', flexShrink: 0 }}
    />
  );
};

type SocialPlatformSelectProps = {
  value: SocialPlatformId | null;
  onChange: (value: SocialPlatformId) => void;
  excludeIds?: SocialPlatformId[];
  placeholder?: string;
};

const SocialPlatformSelect = ({
  value,
  onChange,
  excludeIds = [],
  placeholder = 'Выберите соцсеть',
}: SocialPlatformSelectProps) => {
  const data = SOCIAL_PLATFORMS.filter(
    (platform) => !excludeIds.includes(platform.id) || platform.id === value,
  ).map((platform) => ({
    value: platform.id,
    label: platform.label,
  }));

  return (
    <Select
      data={data}
      value={value}
      onChange={(nextValue) => {
        if (nextValue) {
          onChange(nextValue as SocialPlatformId);
        }
      }}
      placeholder={placeholder}
      allowDeselect={false}
      leftSection={value ? <SocialPlatformIcon platformId={value} /> : undefined}
      leftSectionPointerEvents="none"
      renderOption={({ option }) => {
        const platform = getSocialPlatformById(option.value as SocialPlatformId);

        return (
          <Group gap="xs" wrap="nowrap">
            <SocialPlatformIcon platformId={platform.id} />
            <span>{platform.label}</span>
          </Group>
        );
      }}
    />
  );
};

export { SocialPlatformIcon, SocialPlatformSelect };
