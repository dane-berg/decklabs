export class I18n {
  // TODO: support numerical interpolation, inline links, & other styling
  public static get(key: string): string {
    return (I18n.phrases[key] ?? "") as string;
  }

  private static phrases = {
    "card-preview-alt": "Card preview",
    "dark-mode-string": "Dark mode",
    "decklabs-title": "Decklabs",
    "file-upload-error": "There was an error while uploading the file.",
    "file-upload-success": "File uploaded successfully!",
    "library-error": "There was an error retrieving the cards library.",
    "loading-string": "loading ...",
    "quick-play": "Quick Play",
    "tab-about": "About",
    "tab-library": "Library",
    "tab-studio": "Card Studio",
    "upload-file": "Upload File",
  };
}
