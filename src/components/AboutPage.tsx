import { I18n } from "../injectables/i18n";

const AboutPage = () => {
  return (
    <div>
      <h2>{I18n.get("tab-about")}</h2>
      <p>
        Thanks to Tek Eye for their{" "}
        <a href="https://www.tekeye.uk/playing_cards/svg-playing-cards">
          public domain playing card svgs.
        </a>
      </p>
    </div>
  );
};

export default AboutPage;
