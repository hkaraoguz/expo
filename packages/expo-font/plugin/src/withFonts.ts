import { type ConfigPlugin, createRunOncePlugin } from 'expo/config-plugins';

import { withFontsAndroid } from './withFontsAndroid';
import { withFontsIos } from './withFontsIos';

const pkg = require('../../package.json');

/**
 * The tag of a variation axis: the four axes that OpenType registers and a font is most likely to
 * declare, or any other four-character tag. A font may declare custom axes of its own, whose tags
 * are four uppercase letters such as `GRAD`, so the type cannot be closed to the registered four.
 *
 * `wght` is missing on purpose. It comes from `weight`, which both selects the face and instances
 * the font, so setting it here as well would let the two drift apart.
 */
export type FontVariationAxisTag = 'ital' | 'opsz' | 'slnt' | 'wdth' | (string & {});

/**
 * Values for the variation axes of a variable font, keyed by their four-character OpenType tag,
 * such as `slnt`, `wdth` or `opsz`.
 */
export type FontVariationAxes = Partial<Record<FontVariationAxisTag, number>>;

export type FontDefinition = {
  path: string;
  weight: number;
  style?: 'normal' | 'italic' | undefined;
  /**
   * The variation axes to instance this font at, for a variable font backing the definition. `wght`
   * comes from `weight`, so this field is for the other axes the font declares.
   *
   * A file with a `slnt` axis backs an italic definition once you slant it, such as
   * `{ slnt: -10 }`. Without that, Android draws the file unchanged and the face renders upright.
   *
   * A static font declares no axes and ignores this field.
   *
   * @platform android
   */
  axes?: FontVariationAxes | undefined;
};

export type FontObject = {
  fontFamily: string;
  fontDefinitions: FontDefinition[];
};

export type Font = string | FontObject;

export type FontProps = {
  /**
   * An array of font file paths to link to the native project, relative to the project root.
   */
  fonts?: string[];
  android?: {
    /**
     * An array of font definitions to link on Android. Supports object syntax for xml fonts with custom family name.
     */
    fonts?: Font[];
  };
  ios?: {
    /**
     * An array of font file paths to link on iOS. The font family name is taken from the font file.
     */
    fonts?: string[];
  };
};

const withFonts: ConfigPlugin<FontProps> = (config, props) => {
  if (!props) {
    return config;
  }

  const iosFonts = [...(props.fonts ?? []), ...(props.ios?.fonts ?? [])];

  if (iosFonts.length > 0) {
    config = withFontsIos(config, iosFonts);
  }

  const androidFonts = [...(props.fonts ?? []), ...(props.android?.fonts ?? [])];

  if (androidFonts.length > 0) {
    config = withFontsAndroid(config, androidFonts);
  }

  return config;
};

export default createRunOncePlugin(withFonts, pkg.name, pkg.version);
