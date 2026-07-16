import type { AddMediaFormValues } from './add-media-form';

export type OwnerMediaTabValue = 'created' | 'moderation' | 'active' | 'rejected';

export type OwnerMediaItem = {
  id: number;
  tab: OwnerMediaTabValue;
  statusLabel: string;
  data: AddMediaFormValues;
};

export const OWNER_MEDIA_TABS: {
  value: OwnerMediaTabValue;
  label: string;
  color: string;
  emptyText: string;
}[] = [
  {
    value: 'created',
    label: 'Созданные',
    color: 'blue',
    emptyText: 'Созданные СМИ появятся здесь после нажатия «Создать».',
  },
  {
    value: 'moderation',
    label: 'На модерации',
    color: 'gray',
    emptyText: 'СМИ на модерации появятся здесь.',
  },
  {
    value: 'active',
    label: 'Активные',
    color: 'green',
    emptyText: 'У вас пока нет активных СМИ.',
  },
  {
    value: 'rejected',
    label: 'Отклонённые',
    color: 'red',
    emptyText: 'Отклонённые СМИ появятся здесь.',
  },
];

export type { AddMediaFormValues } from './add-media-form';
export { EMPTY_ADD_MEDIA_FORM } from './add-media-form';

const createMediaItem = (data: AddMediaFormValues): OwnerMediaItem => ({
  id: Date.now(),
  tab: 'created',
  statusLabel: 'Создано',
  data,
});

export { createMediaItem };
