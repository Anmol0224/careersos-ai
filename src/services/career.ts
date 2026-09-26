import {
  mockUserProfile,
  mockSkills,
  mockPriorityGaps,
  mockRoadmapSteps,
  mockOpportunities,
  mockChallengeData,
  mockChallengeResult,
} from '../data/mockData';
import type {
  UserProfile,
  SkillItem,
  PriorityGap,
  RoadmapStep,
  OpportunityItem,
  ChallengeData,
  ChallengeResultData,
} from '../data/mockData';

/**
 * Career Service: Central abstraction for career intelligence data.
 * Ready for easy future integration with Supabase.
 */
export const careerService = {
  getUserProfile: async (): Promise<UserProfile> => {
    return Promise.resolve({ ...mockUserProfile });
  },

  getSkills: async (): Promise<SkillItem[]> => {
    return Promise.resolve([...mockSkills]);
  },

  getPriorityGaps: async (): Promise<PriorityGap[]> => {
    return Promise.resolve([...mockPriorityGaps]);
  },

  getRoadmap: async (): Promise<RoadmapStep[]> => {
    return Promise.resolve([...mockRoadmapSteps]);
  },

  getOpportunities: async (filters?: {
    role?: string;
    location?: string;
    type?: string;
    remoteOnly?: boolean;
  }): Promise<OpportunityItem[]> => {
    let list = [...mockOpportunities];
    if (!filters) return Promise.resolve(list);

    if (filters.remoteOnly) {
      list = list.filter((item) => item.workplaceType === 'Remote');
    }
    if (filters.location && filters.location !== 'All Locations') {
      list = list.filter((item) => item.location.toLowerCase() === filters.location?.toLowerCase());
    }
    if (filters.type && filters.type !== 'All Types') {
      list = list.filter((item) => item.employmentType.toLowerCase() === filters.type?.toLowerCase());
    }
    return Promise.resolve(list);
  },

  getChallenge: async (challengeId: string): Promise<ChallengeData> => {
    void challengeId;
    return Promise.resolve({ ...mockChallengeData });
  },

  submitChallenge: async (
    challengeId: string,
    submission: { responseText: string; fileName?: string }
  ): Promise<ChallengeResultData> => {
    void challengeId;
    void submission;
    // In future this will evaluate via Gemini and store in Supabase
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...mockChallengeResult });
      }, 800);
    });
  },
};
