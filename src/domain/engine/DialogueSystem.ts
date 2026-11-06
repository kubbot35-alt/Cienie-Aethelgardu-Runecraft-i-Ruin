import { DialogueChoice, DialogueNode } from '../types/dialogue.types';
import { MoralKarma } from '../types/game.types';
import { DialogueSelectResult, IDialogueSystem } from '../interfaces/IDialogueSystem';

export class DialogueSystem implements IDialogueSystem {
  private currentNode: DialogueNode | null = null;
  private readonly nodes: Map<string, DialogueNode> = new Map();

  constructor() {
    this.registerNodes();
    this.currentNode = this.nodes.get('node_intro') || null;
  }

  private registerNodes(): void {
    const list: DialogueNode[] = [
      {
        id: 'node_intro',
        speaker: 'Straznik Popiolow',
        portrait: 'ancient_guardian',
        text: 'Kto smie budzic uspione echa Aethelgard? Twoj dotyk budzi starozytne runy... Jakie intencje kryje Twoje serce?',
        choices: [
          { id: 'c1', text: 'Pragne ocalic niewinnych przed skaza.', nextNodeId: 'node_light', moralImpact: { righteousness: 2 } },
          { id: 'c2', text: 'Potrzebuje surowcow i mocy, by przetrwac.', nextNodeId: 'node_pragmatic', moralImpact: { pragmatism: 2 } },
          { id: 'c3', text: 'Zniszcze kazdego, kto stanie mi na drodze.', nextNodeId: 'node_entropy', moralImpact: { entropy: 2 } },
        ],
      },
      {
        id: 'node_light',
        speaker: 'Straznik Popiolow',
        portrait: 'ancient_guardian',
        text: 'Twoje slowa pala jak promyk slonca. Lecz swiatlo wymaga ofiary krwi lub wolnosci. Czy poswiecisz wlasna esencje?',
        choices: [
          { id: 'c_light_end', text: 'Oddam wszystko za odrodzenie Swiatla.', nextNodeId: 'ending_light', moralImpact: { righteousness: 3 } },
          { id: 'c_light_back', text: 'Musze jeszcze przemyslec swoja droge.', nextNodeId: 'node_intro' },
        ],
      },
      {
        id: 'node_pragmatic',
        speaker: 'Straznik Popiolow',
        portrait: 'ancient_guardian',
        text: 'Spokojny realizm. Zmierzch nie ocenia, zmierzch po prostu trwa. Utrzymasz kraine w chwiejnej rownowadze?',
        choices: [
          { id: 'c_prag_end', text: 'Podpiszmy pakt rownowagi.', nextNodeId: 'ending_dusk', moralImpact: { pragmatism: 3 } },
        ],
      },
      {
        id: 'node_entropy',
        speaker: 'Glos Pustki',
        portrait: 'ancient_guardian',
        text: 'Ciemnosc wita swojego mistrza. Popioly zlacza sie w tron, z ktorego bedziesz rzadzil pustka.',
        choices: [
          { id: 'c_entropy_end', text: 'Niechaj wszystko pochlonie nicosc!', nextNodeId: 'ending_void', moralImpact: { entropy: 3 } },
        ],
      },
      {
        id: 'ending_light',
        speaker: 'Narrator',
        portrait: 'ancient_guardian',
        text: 'ZAKONCZENIE I: SWIT SPRAWIEDLIWOSCI. Poswiecenie runomisty rozswietlilo mroki Aethelgard. Cienie odeszly na zawsze.',
        choices: [],
        isEnding: true,
        endingType: 'light_dawn',
      },
      {
        id: 'ending_dusk',
        speaker: 'Narrator',
        portrait: 'ancient_guardian',
        text: 'ZAKONCZENIE II: PAKT ZMIERZCHU. Utrzymano kruchy pokoj. Ruiny spowil zmierzch, chroniac swiat przed wojna.',
        choices: [],
        isEnding: true,
        endingType: 'dusk_balance',
      },
      {
        id: 'ending_void',
        speaker: 'Narrator',
        portrait: 'ancient_guardian',
        text: 'ZAKONCZENIE III: POCHLONIECIE PRZEZ PUSTKE. Ruiny runely w bezdenna otchlan nicosci.',
        choices: [],
        isEnding: true,
        endingType: 'entropy_void',
      },
    ];
    list.forEach((n) => this.nodes.set(n.id, n));
  }

  public getCurrentNode(): DialogueNode | null {
    return this.currentNode;
  }

  public startDialogue(startNodeId = 'node_intro'): DialogueNode {
    const node = this.nodes.get(startNodeId) || this.nodes.get('node_intro')!;
    this.currentNode = node;
    return node;
  }

  public isChoiceAvailable(choice: DialogueChoice, currentKarma: MoralKarma): boolean {
    if (choice.requiredRighteousness && currentKarma.righteousness < choice.requiredRighteousness) return false;
    if (choice.requiredPragmatism && currentKarma.pragmatism < choice.requiredPragmatism) return false;
    if (choice.requiredEntropy && currentKarma.entropy < choice.requiredEntropy) return false;
    return true;
  }

  public chooseOption(choice: DialogueChoice, currentKarma: MoralKarma): DialogueSelectResult {
    if (!this.isChoiceAvailable(choice, currentKarma)) {
      return { nextNode: this.currentNode, isEnding: false };
    }
    const nextNode = choice.nextNodeId ? this.nodes.get(choice.nextNodeId) || null : null;
    this.currentNode = nextNode;
    return {
      nextNode,
      moralReward: choice.moralImpact,
      itemRewardId: choice.itemRewardId,
      isEnding: Boolean(nextNode?.isEnding),
    };
  }
}
