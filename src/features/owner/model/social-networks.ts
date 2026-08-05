export const RKN_SUBSCRIBER_THRESHOLD = 10_000;

export type SocialNetworkItem = {
  id: string;
  reachOrSubscribers: string;
  link: string;
  rknRegistered: boolean;
  rknApplicationSubmitted: boolean;
  rknNotSubmitted: boolean;
  rknNumber: string;
};

/** @deprecated Используйте SocialNetworkItem */
export type SocialNetworkRowValues = Omit<SocialNetworkItem, 'id'>;

export type SocialNetworksValues = SocialNetworkItem[];

export const parseSubscriberCount = (value: string): number => {
  const normalized = value.replace(/\s/g, '');
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const requiresRknCompliance = (reachOrSubscribers: string): boolean =>
  parseSubscriberCount(reachOrSubscribers) > RKN_SUBSCRIBER_THRESHOLD;

export const isSocialPlatformActive = (row: SocialNetworkRowValues): boolean => {
  if (!requiresRknCompliance(row.reachOrSubscribers)) {
    return true;
  }

  if (!row.rknRegistered) {
    return false;
  }

  return row.rknNumber.trim().length > 0;
};

export const hasPendingRknCompliance = (row: SocialNetworkRowValues): boolean =>
  requiresRknCompliance(row.reachOrSubscribers) && !isSocialPlatformActive(row);

export const hasNonCompliantRknPlatforms = (items: SocialNetworksValues): boolean =>
  items.some(hasPendingRknCompliance);

const createSocialNetworkItem = (id: string): SocialNetworkItem => ({
  id,
  reachOrSubscribers: '',
  link: '',
  rknRegistered: false,
  rknApplicationSubmitted: false,
  rknNotSubmitted: false,
  rknNumber: '',
});

export const createEmptySocialNetworks = (): SocialNetworksValues => [];

export const getSocialNetworkById = (
  items: SocialNetworksValues,
  id: string,
): SocialNetworkItem | undefined => items.find((item) => item.id === id);

export const updateSocialNetworkItem = (
  items: SocialNetworksValues,
  id: string,
  patch: Partial<SocialNetworkRowValues>,
): SocialNetworksValues =>
  items.map((item) => (item.id === id ? { ...item, ...patch } : item));

export const syncSocialNetworksWithBasicServices = (
  socialIds: string[],
  socialNetworks: SocialNetworksValues,
): SocialNetworksValues => {
  const byId = Object.fromEntries(socialNetworks.map((item) => [item.id, item]));

  return socialIds.map((id) => byId[id] ?? createSocialNetworkItem(id));
};
