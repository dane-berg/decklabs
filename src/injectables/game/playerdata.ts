import { CardInPlay } from "./cardinplay";
import { FingerprintValue, getCardsFp, getManaFp } from "./gameaction";
import { Hand } from "./hand";
import { LandArea } from "./landarea";
import { ManaDisplay } from "./manadisplay";
import { PlayArea } from "./playarea";

export class PlayerData {
  constructor(
    public deck: CardInPlay[] = [],
    public hand: Hand = new Hand(),
    public playArea: PlayArea = new PlayArea(),
    public landArea: LandArea = new LandArea(),
    public mana: ManaDisplay = new ManaDisplay(),
    public hasPlayedLand: boolean = false
  ) {}

  public getFingerprint(): FingerprintValue {
    const deckFp = getCardsFp(this.deck, 1);
    const handFp = getCardsFp(this.hand.children, 2);
    const landAreaFp = getCardsFp(this.landArea.children, 3);
    const playAreaFp = getCardsFp(this.playArea.children, 4);
    const manaFp = getManaFp(this.mana.mana, 5);

    return deckFp ^ handFp ^ landAreaFp ^ playAreaFp ^ manaFp;
  }
}
