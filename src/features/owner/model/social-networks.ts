export const RKN_SUBSCRIBER_THRESHOLD = 10_000;

export type SocialNetworkRowValues = {
  reachOrSubscribers: string;
  link: string;
  rknRegistered: boolean;
  rknApplicationSubmitted: boolean;
  rknNotSubmitted: boolean;
  rknNumber: string;
};

export type SocialNetworksValues = {
  photo: boolean;
  video: boolean;
  platforms: Record<string, SocialNetworkRowValues>;
};

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

export const hasNonCompliantRknPlatforms = (
  platforms: Record<string, SocialNetworkRowValues>,
): boolean => Object.values(platforms).some(hasPendingRknCompliance);

const createSocialNetworkRow = (): SocialNetworkRowValues => ({
  reachOrSubscribers: '',
  link: '',
  rknRegistered: false,
  rknApplicationSubmitted: false,
  rknNotSubmitted: false,
  rknNumber: '',
});

export const createEmptySocialNetworks = (): SocialNetworksValues => ({
  photo: false,
  video: false,
  platforms: {},
});

export const syncSocialNetworksWithBasicServices = (
  socialIds: string[],
  socialNetworks: SocialNetworksValues,
): SocialNetworksValues => {
  const platforms = socialIds.reduce(
    (acc, id) => {
      acc[id] = socialNetworks.platforms[id] ?? createSocialNetworkRow();
      return acc;
    },
    {} as Record<string, SocialNetworkRowValues>,
  );

  return {
    ...socialNetworks,
    platforms,
  };
};
