import { Select } from '@mantine/core';
import {
  PLACEMENT_TYPE_OPTIONS,
  type PlacementTypeId,
} from '@/shared/model/placement-types';

type PlacementTypeSelectProps = {
  value: PlacementTypeId | null;
  onChange: (value: PlacementTypeId) => void;
  placeholder?: string;
};

const PlacementTypeSelect = ({
  value,
  onChange,
  placeholder = 'Выберите тип',
}: PlacementTypeSelectProps) => (
  <Select
    data={PLACEMENT_TYPE_OPTIONS}
    value={value}
    onChange={(nextValue) => {
      if (nextValue) {
        onChange(nextValue as PlacementTypeId);
      }
    }}
    placeholder={placeholder}
    allowDeselect={false}
  />
);

export { PlacementTypeSelect };
