import { MoralKarma } from './game.types';

export interface DialogueChoice {
  readonly id: string;
  readonly text: string;
  readonly nextNodeId: string | null;
  readonly moralImpact?: Partial<MoralKarma>;
  readonly itemRewardId?: string;
  readonly requiredRighteousness?: number;
  readonly requiredPragmatism?: number;
  readonly requiredEntropy?: number;
}

export interface DialogueNode {
  readonly id: string;
  readonly speaker: string;
  readonly portrait: string;
  readonly text: string;
  readonly choices: readonly DialogueChoice[];
  readonly isEnding?: boolean;
  readonly endingType?: 'light_dawn' | 'dusk_balance' | 'entropy_void' | 'fallen_ascendant';
}

export interface StoryEnding {
  readonly id: string;
  readonly title: string;
  readonly epilogue: string;
  readonly moralOutcome: string;
}
