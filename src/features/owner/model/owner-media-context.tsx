import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { MOCK_ACTIVE_MEDIA } from '../mock/media';
import {
  createMediaItem,
  OWNER_MEDIA_TABS,
  type OwnerMediaItem,
  type OwnerMediaTabValue,
} from './media';
import type { AddMediaFormValues } from './add-media-form';

type OwnerMediaContextValue = {
  mediaItems: OwnerMediaItem[];
  countsByTab: Record<OwnerMediaTabValue, number>;
  addMediaItem: (values: AddMediaFormValues) => void;
  updateMediaItem: (id: number, values: AddMediaFormValues) => void;
  sendToModeration: (item: OwnerMediaItem) => void;
  deleteMediaItem: (id: number) => void;
};

const OwnerMediaContext = createContext<OwnerMediaContextValue | null>(null);

const OwnerMediaProvider = ({ children }: { children: ReactNode }) => {
  const [mediaItems, setMediaItems] = useState<OwnerMediaItem[]>(() => [...MOCK_ACTIVE_MEDIA]);

  const countsByTab = useMemo(() => {
    return OWNER_MEDIA_TABS.reduce(
      (acc, tab) => {
        acc[tab.value] = mediaItems.filter((item) => item.tab === tab.value).length;
        return acc;
      },
      {} as Record<OwnerMediaTabValue, number>,
    );
  }, [mediaItems]);

  const addMediaItem = (values: AddMediaFormValues) => {
    setMediaItems((current) => [...current, createMediaItem(values)]);
  };

  const updateMediaItem = (id: number, values: AddMediaFormValues) => {
    setMediaItems((current) =>
      current.map((media) => (media.id === id ? { ...media, data: values } : media)),
    );
  };

  const sendToModeration = (item: OwnerMediaItem) => {
    setMediaItems((current) =>
      current.map((media) =>
        media.id === item.id
          ? {
              ...media,
              tab: 'moderation',
              statusLabel: 'На модерации',
            }
          : media,
      ),
    );
  };

  const deleteMediaItem = (id: number) => {
    setMediaItems((current) => current.filter((media) => media.id !== id));
  };

  const value = useMemo(
    () => ({
      mediaItems,
      countsByTab,
      addMediaItem,
      updateMediaItem,
      sendToModeration,
      deleteMediaItem,
    }),
    [mediaItems, countsByTab],
  );

  return (
    <OwnerMediaContext.Provider value={value}>{children}</OwnerMediaContext.Provider>
  );
};

const useOwnerMedia = (): OwnerMediaContextValue => {
  const context = useContext(OwnerMediaContext);

  if (!context) {
    throw new Error('useOwnerMedia must be used within OwnerMediaProvider');
  }

  return context;
};

export { OwnerMediaProvider, useOwnerMedia };
