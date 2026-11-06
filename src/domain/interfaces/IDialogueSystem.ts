import { DialogueChoice, DialogueNode } from '../types/dialogue.types';
import { MoralKarma } from '../types/game.types';

export interface DialogueSelectResult {
  readonly nextNode: DialogueNode | null;
  readonly moralReward?: Partial<MoralKarma>;
  readonly itemRewardId?: string;
  readonly isEnding: boolean;
}

export interface IDialogueSystem {
  getCurrentNode(): DialogueNode | null;
  startDialogue(startNodeId: string): DialogueNode;
  chooseOption(choice: DialogueChoice, currentKarma: MoralKarma): DialogueSelectResult;
  isChoiceAvailable(choice: DialogueChoice, currentKarma: MoralKarma): boolean;
}
