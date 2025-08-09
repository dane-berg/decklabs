// singleton injectable that handles configuration options
export class Configure {
  public static readonly url = "http://localhost:3000/";
  public static readonly CARD_WIDTH = 126;
  public static readonly CARD_WIDTH_PX = `${this.CARD_WIDTH}px`;
  public static readonly CARD_HEIGHT = 176;
  public static readonly CARD_HEIGHT_PX = `${this.CARD_HEIGHT}px`;
  public static readonly CONDENSED_CARD_HEIGHT = (this.CARD_WIDTH * 78) / 108;
  public static readonly CONDENSED_CARD_HEIGHT_PX = `${this.CONDENSED_CARD_HEIGHT}px`;
  public static readonly HOVERED_SCALE = 2;
  public static readonly DECK_SIZE = 20;
  public static readonly STARTING_HAND_SIZE = 7;
  public static readonly ANIMATION_SMOOTHING = 0.9; // must be > 0 and < 1;
  public static readonly NONOVERLAP_RATIO = 0.8;
  public static readonly SPACING_RATIO = 1.1;
  public static readonly card_font = "Arial"; // TODO: pick a better font
  public static readonly card_font_size = 7;
  public static readonly card_font_str = `${this.card_font_size}px ${this.card_font}`;
  public static readonly card_secondary_font_size = 5;
  public static readonly card_secondary_font_str = `${this.card_secondary_font_size}px ${this.card_font}`;
  public static readonly max_mana_value = 9;
  public static readonly max_pt_value = 9;
  public static readonly min_pt_value = -9;
  public static readonly default_card_art_src = "colorless_mana.png";
  public static readonly guarantee_land_drop = true; // useful for debugging
  public static readonly file_size_limit = 1000; // Kilobytes (KB)
}
