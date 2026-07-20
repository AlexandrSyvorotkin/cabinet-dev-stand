import { ActionIcon, Tooltip } from '@mantine/core';
import { InfoIcon } from '@phosphor-icons/react';

type InfoHintIconProps = {
  label: string;
  tooltipWidth?: number;
  iconSize?: number;
};

const InfoHintIcon = ({ label, tooltipWidth = 280, iconSize = 14 }: InfoHintIconProps) => (
  <Tooltip label={label} multiline w={tooltipWidth} withArrow>
    <ActionIcon
      variant="subtle"
      color="gray"
      size="xs"
      radius="xl"
      aria-label="Справка"
      style={{ flexShrink: 0 }}
    >
      <InfoIcon size={iconSize} />
    </ActionIcon>
  </Tooltip>
);

export { InfoHintIcon };
