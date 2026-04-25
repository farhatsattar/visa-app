export const JWT_STRATEGY_NAME = 'jwt';

export const REFERRAL_LEVEL_POINTS: Record<number, number> = {
  1: 5,
  2: 2,
  3: 1,
  4: 1,
};

export const REWARD_THRESHOLDS = [
  { points: 20, name: 'Domestic Tour' },
  { points: 52, name: 'International Tour' },
  { points: 116, name: 'Business Tour' },
  { points: 200, name: 'Business Opportunity' },
];

export const RANK_RULES = [
  { name: 'Super Platinum', minPoints: 200, minDirectReferrals: 20 },
  { name: 'Platinum', minPoints: 116, minDirectReferrals: 10 },
  { name: 'Gold', minPoints: 52, minDirectReferrals: 5 },
  { name: 'Classic', minPoints: 0, minDirectReferrals: 0 },
];
