const SHORT_RUSSIAN_WORD = /(^|[\s(«„“"—–-])(а|без|в|во|для|до|за|и|из|к|ко|на|над|не|но|о|об|обо|от|по|под|при|с|со|у) (?=\S)/giu;

export function keepRussianShortWords(text: string) {
  let formatted = text;
  let previous: string;
  do {
    previous = formatted;
    formatted = formatted.replace(SHORT_RUSSIAN_WORD, '$1$2\u00a0');
  } while (formatted !== previous);
  return formatted;
}

