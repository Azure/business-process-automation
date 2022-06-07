import React from 'react'
import { Dropdown } from '@fluentui/react-northstar';

export const languages = [
    { key: 'af', text: 'Afrikaans' },
    { key: 'sq', text: 'Albanian' },
    { key: 'am', text: 'Amharic' },
    { key: 'ar', text: 'Arabic' },
    { key: 'hy', text: 'Armenian' },
    { key: 'as', text: 'Assamese' },
    { key: 'az', text: 'Azerbaijani' },
    { key: 'bn', text: 'Bangla' },
    { key: 'ba', text: 'Bashkir' },
    { key: 'eu', text: 'Basque' },
    { key: 'bs', text: 'Bosnian ' },
    { key: 'bg', text: 'Bulgarian' },
    { key: 'yue', text: 'Cantonese ' },
    { key: 'ca', text: 'Catalan' },
    { key: 'lzh', text: 'Chinese ' },
    { key: 'zh-Hans', text: 'Chinese Simplified' },
    { key: 'zh-Hant', text: 'Chinese Traditional' },
    { key: 'hr', text: 'Croatian' },
    { key: 'cs', text: 'Czech' },
    { key: 'da', text: 'Danish' },
    { key: 'prs', text: 'Dari' },
    { key: 'dv', text: 'Divehi' },
    { key: 'nl', text: 'Dutch' },
    { key: 'en', text: 'English' },
    { key: 'et', text: 'Estonian' },
    { key: 'fo', text: 'Faroese' },
    { key: 'fj', text: 'Fijian' },
    { key: 'fil', text: 'Filipino' },
    { key: 'fi', text: 'Finnish' },
    { key: 'fr', text: 'French' },
    { key: 'fr-ca', text: 'French (Canada)' },
    { key: 'gl', text: 'Galician' },
    { key: 'ka', text: 'Georgian' },
    { key: 'de', text: 'German' },
    { key: 'el', text: 'Greek' },
    { key: 'gu', text: 'Gujarati' },
    { key: 'ht', text: 'Haitian Creole' },
    { key: 'he', text: 'Hebrew' },
    { key: 'hi', text: 'Hindi' },
    { key: 'mww', text: 'Hmong Daw (Latin)' },
    { key: 'hu', text: 'Hungarian' },
    { key: 'is', text: 'Icelandic' },
    { key: 'id', text: 'Indonesian' },
    { key: 'ikt', text: 'Inuinnaqtun' },
    { key: 'iu', text: 'Inuktitut' },
    { key: 'iu-Latn', text: 'Inuktitut (Latin)' },
    { key: 'ga', text: 'Irish' },
    { key: 'it', text: 'Italian' },
    { key: 'ja', text: 'Japanese' },
    { key: 'kn', text: 'Kannada' },
    { key: 'kk', text: 'Kazakh' },
    { key: 'km', text: 'Khmer' },
    { key: 'tlh-Latn', text: 'Klingon' },
    { key: 'tlh-Piqd', text: 'Klingon (plqaD)' },
    { key: 'ko', text: 'Korean' },
    { key: 'ku', text: 'Kurdish (Central)' },
    { key: 'kmr', text: 'Kurdish (Northern)' },
    { key: 'ky', text: 'Kyrgyz (Cyrillic)' },
    { key: 'lo', text: 'Lao' },
    { key: 'lv', text: 'Latvian	' },
    { key: 'lt', text: 'Lithuanian' },
    { key: 'mk', text: 'Macedonian' },
    { key: 'mg', text: 'Malagasy' },
    { key: 'ms', text: 'Malay (Latin)' },
    { key: 'ml', text: 'Malayalam' },
    { key: 'mt', text: 'Maltese' },
    { key: 'mi', text: 'Maori' },
    { key: 'mr', text: 'Marathi' },
    { key: 'mn-Cyrl', text: 'Mongolian (Cyrillic)' },
    { key: 'mn-Mong', text: 'Mongolian (Traditional)' },
    { key: 'my', text: 'Myanmar' },
    { key: 'ne', text: 'Nepali' },
    { key: 'nb', text: 'Norwegian' },
    { key: 'or', text: 'Odia' },
    { key: 'ps', text: 'Pashto' },
    { key: 'fa', text: 'Persian' },
    { key: 'pl', text: 'Polish' },
    { key: 'pt', text: 'Portuguese (Brazil)' },
    { key: 'pt-pt', text: 'Portuguese (Portugal)' },
    { key: 'pa', text: 'Punjabi' },
    { key: 'otq', text: 'Queretaro Otomi' },
    { key: 'ro', text: 'Romanian' },
    { key: 'ru', text: 'Russian' },
    { key: 'sm', text: 'Samoan (Latin)' },
    { key: 'sr-Cyrl', text: 'Serbian (Cyrillic)' },
    { key: 'sr-Latn', text: 'Serbian (Latin)' },
    { key: 'sk', text: 'Slovak' },
    { key: 'sl', text: 'Slovenian' },
    { key: 'so', text: 'Somali (Arabic)' },
    { key: 'es', text: 'Spanish' },
    { key: 'sw', text: 'Swahili (Latin)' },
    { key: 'sv', text: 'Swedish' },
    { key: 'ty', text: 'Tahitian' },
    { key: 'ta', text: 'Tamil' },
    { key: 'tt', text: 'Tatar (Latin)' },
    { key: 'te', text: 'Telugu' },
    { key: 'th', text: 'Thai' },
    { key: 'bo', text: 'Tibetan' },
    { key: 'ti', text: 'Tigrinya' },
    { key: 'to', text: 'Tongan' },
    { key: 'tr', text: 'Turkish' },
    { key: 'tk', text: 'Turkmen (Latin)' },
    { key: 'uk', text: 'Ukrainian' },
    { key: 'hsb', text: 'Upper Sorbian' },
    { key: 'ur', text: 'Urdu' },
    { key: 'ug', text: 'Uyghur (Arabic)' },
    { key: 'uz', text: 'Uzbek (Latin)' },
    { key: 'vi', text: 'Vietnamese' },
    { key: 'cy', text: 'Welsh' },
    { key: 'yua', text: 'Yucatec Maya' },
    { key: 'zu', text: 'Zulu' }
];

export default function LanguageDialog(props) {

    

    const languagesToStrings = () => {
        const out = []
        for (const l of languages) {
            out.push(l.text)
        }
        return out
    }

    return (
        <Dropdown
            search
            placeholder="Select a language"
            label="Languages"
            items={languagesToStrings()}
            onChange={props.onDialogChange}
        />
    )
} 