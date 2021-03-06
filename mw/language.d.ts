import { ApiSetPageLanguageParams } from "../api_params";

type Language = NonNullable<ApiSetPageLanguageParams["lang"]>;
interface LanguageData {
    bcp47Map: Record<string, string>;
    digitGroupingPattern: string;
    digitTransformTable?: Record<string, string>;
    fallbackLanguages: string[];
    grammarForms: Record<string, Record<string, string>>;
    grammarTransformations: Record<string, string | Array<[string, string]>>;
    minimumGroupingDigits?: number;
    pluralRules: string[];
    separatorTransformTable?: Record<string, string>;
}

declare global {
    namespace mw {
        namespace language {
            /**
             * Language-related data (keyed by language, contains instances of `mw.Map`).
             *
             * Exported dynamically by the `ResourceLoaderLanguageDataModule` class in PHP.
             *
             * To set data:
             * ```js
             * // Override, extend or create the language data object of 'nl'
             * mw.language.setData( 'nl', 'myKey', 'My value' );
             *
             * // Set multiple key/values pairs at once
             * mw.language.setData( 'nl', { foo: 'X', bar: 'Y' } );
             * ```
             *
             * To get GrammarForms data for language `nl`:
             * ```js
             * var grammarForms = mw.language.getData( 'nl', 'grammarForms' );
             * ```
             *
             * @type {{ [language: string]: mw.Map<LanguageData> }}
             */
            const data: Record<Language, mw.Map<LanguageData>>;

            /**
             * Information about month names in current UI language.
             *
             * @type {{ names: string[], genitive: string[], abbrev: string[], keys: { names: string[], genitive: string[], abbrev: string[] } }}
             */
            const months: {
                /**
                 * Array of month names (in nominative case in languages which have the distinction).
                 */
                names: string[];
                /**
                 * Array of month names in genitive case.
                 */
                genitive: string[];
                /**
                 * Array of three-letter-long abbreviated month names.
                 */
                abbrev: string[];
                /**
                 * Object with three keys like the above, containing arrays of message keys for appropriate messages which can be passed to `mw.msg`.
                 */
                keys: { names: string[]; genitive: string[]; abbrev: string[] };
            };

            /**
             * Formats language tags according the BCP 47 standard. See `LanguageCode::bcp47` for the PHP implementation.
             *
             * @param {string} languageTag Well-formed language tag
             * @returns {string}
             */
            function bcp47(languageTag: string): string;

            /**
             * Grammatical transformations, needed for inflected languages. Invoked by putting `{{grammar:case|word}}` in a message.
             *
             * The rules can be defined in $wgGrammarForms global or computed dynamically by overriding this method per language.
             *
             * @param {string} word
             * @param {string} form
             * @returns {string}
             */
            function convertGrammar(word: string, form: string): string;

            /**
             * Converts a number using `getDigitTransformTable`.
             *
             * @param {number} num Value to be converted
             * @param {boolean?} integer Whether to convert the return value to an integer
             * @returns {number | string} Formatted number
             */
            function convertNumber(num: number, integer?: boolean): number | string;

            /**
             * Plural form transformations, needed for some languages.
             *
             * @param {number} count Non-localized quantifier
             * @param {string[]} forms List of plural forms
             * @param {{ [key: string]: string }?} explicitPluralForms List of explicit plural forms
             * @returns {string} Correct form for quantifier in this language
             */
            function convertPlural(
                count: number,
                forms: string[],
                explicitPluralForms?: Record<number, string>
            ): string;

            /**
             * Helper function to flip transformation tables.
             *
             * @param {...{ [key: string]: string }} tables Transformation tables
             * @returns {{ [key: string]: string }}
             */
            function flipTransform(
                ...tables: Array<Record<string, string>>
            ): Record<string, string>;

            /**
             * Provides an alternative text depending on specified gender.
             *
             * Usage in message text: `{{gender:[gender|user object]|masculine|feminine|neutral}}`. If second or third parameter are not specified, masculine is used.
             *
             * These details may be overridden per language.
             *
             * @param {string} gender `male`, `female`, or anything else for neutral
             * @param {string[]} forms List of gender forms
             * @returns {string}
             */
            function gender(gender: "male" | "female" | string, forms: string[]): string;

            /**
             * Convenience method for retrieving language data.
             *
             * Structured by language code and data key, covering for the potential inexistence of a data object for this language.
             *
             * @param {string} langCode
             * @param {string} dataKey
             * @returns {*} Value stored in the `mw.Map` (or `undefined` if there is no map for the specified langCode)
             */
            function getData<K extends keyof LanguageData>(
                langCode: Language,
                dataKey: K
            ): LanguageData[K];

            /**
             * Get the digit transform table for current UI language.
             *
             * @returns {{ [key: string]: string }}
             */
            function getDigitTransformTable(): LanguageData["digitTransformTable"];

            /**
             * Get the language fallback chain for current UI language, including the language itself.
             *
             * @returns {string[]} List of language keys, e.g. `['pfl', de', 'en']`
             */
            function getFallbackLanguageChain(): LanguageData["fallbackLanguages"];

            /**
             * Get the language fallback chain for current UI language (not including the language itself).
             *
             * @returns {string[]} List of language keys, e.g. `['de', 'en']`
             */
            function getFallbackLanguages(): LanguageData["fallbackLanguages"];

            /**
             * Get the separator transform table for current UI language.
             *
             * @returns {{ [key: string]: string }}
             */
            function getSeparatorTransformTable(): LanguageData["separatorTransformTable"];

            /**
             * Turn a list of string into a simple list using commas and 'and'.
             *
             * See `Language::listToText` in `languages/Language.php`
             *
             * @param {string[]} list
             * @returns {string}
             */
            function listToText(list: string[]): string;

            /**
             * Convenience method for setting language data.
             *
             * Creates the data `mw.Map` if there isn't one for the specified language already.
             *
             * @param {string} langCode
             * @param {string} dataKey Key or object of key/values
             * @param {*?} value Value for dataKey, omit if dataKey is an object
             * @returns {void}
             */
            function setData(langCode: Language, dataKey: Partial<LanguageData>): void;
            function setData<K extends keyof LanguageData>(
                langCode: Language,
                dataKey: K,
                value: LanguageData[K]
            ): void;
        }
    }
}

export {};
