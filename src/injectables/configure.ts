// singleton injectable that handles configuration options
export class Configure {
  public static readonly url = "http://localhost:3000/";
  public static readonly CARD_WIDTH = 126;
  public static readonly CARD_WIDTH_PX = `${this.CARD_WIDTH}px`;
  public static readonly CARD_HEIGHT = 176;
  public static readonly CARD_HEIGHT_PX = `${this.CARD_HEIGHT}px`;
  public static readonly DECK_SIZE = 20;
  public static readonly STARTING_HAND_SIZE = 7;
  public static readonly ANIMATION_SMOOTHING = 0.999; // must be > 0 and < 1;
}
