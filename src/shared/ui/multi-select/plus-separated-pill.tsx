import { Group, Pill, Text, type ComboboxRenderPillInput } from '@mantine/core';

const createPlusSeparatedRenderPill =
  (selectedValues: string[]) =>
  ({ option, onRemove, disabled }: ComboboxRenderPillInput) => {
    const value = option?.value.toString() ?? '';
    const label = option?.label ?? value;
    const index = selectedValues.indexOf(value);
    const showPlus = index >= 0 && index < selectedValues.length - 1;

    return (
      <Group gap={4} wrap="nowrap" display="inline-flex" align="center">
        <Pill withRemoveButton onRemove={onRemove} disabled={disabled}>
          {label}
        </Pill>
        {showPlus ? (
          <Text size="sm" c="dimmed" fw={500} lh={1} aria-hidden="true">
            +
          </Text>
        ) : null}
      </Group>
    );
  };

export { createPlusSeparatedRenderPill };
