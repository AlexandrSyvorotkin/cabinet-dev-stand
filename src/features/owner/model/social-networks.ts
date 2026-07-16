export type SocialNetworkRowValues = {
  reachOrSubscribers: string;
  link: string;
};

export type SocialNetworksValues = {
  photo: boolean;
  video: boolean;
  platforms: Record<string, SocialNetworkRowValues>;
};

const createSocialNetworkRow = (): SocialNetworkRowValues => ({
  reachOrSubscribers: '',
  link: '',
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
