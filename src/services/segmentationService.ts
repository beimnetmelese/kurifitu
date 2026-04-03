export type GuestProfile = {
  segment?: string;
};

export type SegmentProfile = {
  name: string;
  avgSpend: number;
  description: string;
  recommendedStrategy: string;
};

export type SegmentSummary = SegmentProfile & {
  behaviorSummary: string;
  strategy: string;
  guestCount: number;
};

export function segmentGuest(guest: GuestProfile): string {
  return guest?.segment || 'Budget';
}

export function getSegmentInsights(segment: Partial<SegmentProfile> | undefined): SegmentProfile {
  return {
    name: segment?.name || 'Unknown',
    avgSpend: Number(segment?.avgSpend) || 0,
    description: segment?.description || 'No description available.',
    recommendedStrategy: segment?.recommendedStrategy || 'No strategy defined.',
  };
}

export function getMarketingStrategy(segment: Partial<SegmentProfile> | undefined): string {
  return getSegmentInsights(segment).recommendedStrategy;
}

export function getHighValueSegments(
  segmentList: Array<Partial<SegmentProfile>> = [],
  minSpend = 280,
): SegmentProfile[] {
  return segmentList
    .filter((segment) => (Number(segment?.avgSpend) || 0) >= minSpend)
    .map((segment) => getSegmentInsights(segment));
}

export function buildSegmentSummaries(
  guestList: GuestProfile[] = [],
  segmentList: Array<Partial<SegmentProfile>> = [],
): SegmentSummary[] {
  return segmentList.map((segment) => {
    const normalizedSegment = getSegmentInsights(segment);
    const members = guestList.filter((guest) => guest.segment === segment.name);

    return {
      ...normalizedSegment,
      behaviorSummary: normalizedSegment.description,
      strategy: getMarketingStrategy(segment),
      guestCount: members.length,
    };
  });
}
