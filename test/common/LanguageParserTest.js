/*******************************************************************************
 *
 *    Copyright 2018 Adobe. All rights reserved.
 *    This file is licensed to you under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License. You may obtain a copy
 *    of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software distributed under
 *    the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 *    OF ANY KIND, either express or implied. See the License for the specific language
 *    governing permissions and limitations under the License.
 *
 ******************************************************************************/

'use strict';

const assert = require('chai').assert;
const LanguageParser = require('../../src/common/LanguageParser');


describe('commercetools LanguageParser', () => {

    describe('Unit tests', () => {

        it('picks a value for a localized string', () => {
            let args = {
                __ow_headers: {
                    'accept-language': 'de-DE'
                }
            };
            let localizedString = {
                de: "Blume",
                fr: "Fleur"
            };
            let languageParser = new LanguageParser(args);
            assert.equal(languageParser.pickLanguage(localizedString), "Blume");
        });

        it('returns undefined for an empty localized string', () => {
            let args = {
                __ow_headers: {
                    'accept-language': 'de-DE'
                }
            };
            let languageParser = new LanguageParser(args);
            assert.isUndefined(languageParser.pickLanguage({}));
        });

        it('returns undefined for an undefined localized string', () => {
            let args = {
                __ow_headers: {
                    'accept-language': 'de-DE'
                }
            };
            let languageParser = new LanguageParser(args);
            assert.isUndefined(languageParser.pickLanguage(undefined));
        });

        it('returns the language and tag with the highest quality', () => {
            let args = {
                __ow_headers: {
                    'accept-language': 'en-US;q=0.9,fr-FR;q=0.7,de-DE;q=0.8'
                }
            };
            let languageParser = new LanguageParser(args);
            assert.equal(languageParser.getFirstLanguage(), "en");
            assert.equal(languageParser.getFirstLanguageTag(), "en-US");
        });

        it('returns undefined for an empty accept-language string', () => {
            let args = {
                __ow_headers: {
                    'accept-language': ''
                }
            };
            let languageParser = new LanguageParser(args);
            assert.isUndefined(languageParser.getFirstLanguage());
            assert.isUndefined(languageParser.getFirstLanguageTag());
        });

        it('returns a fallback value for an accept-language string with wildcard', () => {
            let args = {
                __ow_headers: {
                    'accept-language': 'en-US,*'
                }
            };
            let localizedString = {
                de: "Blume",
                fr: "Fleur"
            };
            let languageParser = new LanguageParser(args);
            assert.equal(languageParser.pickLanguage(localizedString), "Blume");
        });

        it('returns null for a missing requested language', () => {
            let args = {
                __ow_headers: {
                    'accept-language': 'en-US'
                }
            };
            let localizedString = {
                de: "Blume",
                fr: "Fleur"
            };
            let languageParser = new LanguageParser(args);
            assert.isUndefined(languageParser.pickLanguage(localizedString));
        });

        it('uses the default accept language in case the header is missing from the request', () => {
            const args = {
                DEFAULT_ACCEPT_LANGUAGE_HEADER: 'en-US',
                __ow_headers: {}
            };

            const localizedString = {
                de: "Blume",
                fr: "Fleur",
                en: "Flower"
            }

            const languageParser = new LanguageParser(args);
            assert.strictEqual(languageParser.pickLanguage(localizedString), "Flower");
        });

        it('successfully extracts a string based on a BCP47 language tag', () => {
            const args = {
                DEFAULT_ACCEPT_LANGUAGE_HEADER: 'en-US',
                __ow_headers: {}
            };

            const localizedString = {
                "de-DE": "Blume",
                "fr-FR": "Fleur",
                "en-US": "Flower"
            }

            const languageParser = new LanguageParser(args);
            assert.strictEqual(languageParser.pickLanguage(localizedString), "Flower");
        });
    });
});
