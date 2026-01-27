// Language Configuration for V.I.R.A. CeltechVoice
// This file contains language metadata and UI translations

const languageConfig = {
    // Supported TTS Languages (based on browser's Speech Synthesis API)
    supportedLanguages: [
        { code: 'en-US', name: 'English (United States)', flag: '🇺🇸', native: 'English' },
        { code: 'en-GB', name: 'English (United Kingdom)', flag: '🇬🇧', native: 'English' },
        { code: 'fil-PH', name: 'Filipino (Philippines)', flag: '🇵🇭', native: 'Filipino', comingSoon: true },
        { code: 'de-DE', name: 'German (Germany)', flag: '🇩🇪', native: 'Deutsch' },
        { code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸', native: 'Español' },
        { code: 'es-US', name: 'Spanish (United States)', flag: '🇺🇸', native: 'Español' },
        { code: 'fr-FR', name: 'French (France)', flag: '🇫🇷', native: 'Français' },
        { code: 'hi-IN', name: 'Hindi (India)', flag: '🇮🇳', native: 'हिन्दी' },
        { code: 'id-ID', name: 'Indonesian (Indonesia)', flag: '🇮🇩', native: 'Bahasa Indonesia' },
        { code: 'it-IT', name: 'Italian (Italy)', flag: '🇮🇹', native: 'Italiano' },
        { code: 'ja-JP', name: 'Japanese (Japan)', flag: '🇯🇵', native: '日本語' },
        { code: 'ko-KR', name: 'Korean (South Korea)', flag: '🇰🇷', native: '한국어' },
        { code: 'nl-NL', name: 'Dutch (Netherlands)', flag: '🇳🇱', native: 'Nederlands' },
        { code: 'pl-PL', name: 'Polish (Poland)', flag: '🇵🇱', native: 'Polski' },
        { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷', native: 'Português' },
        { code: 'ru-RU', name: 'Russian (Russia)', flag: '🇷🇺', native: 'Русский' },
        { code: 'zh-CN', name: 'Chinese Simplified (China)', flag: '🇨🇳', native: '中文简体' },
        { code: 'zh-HK', name: 'Chinese Cantonese (Hong Kong)', flag: '🇭🇰', native: '粵語' },
        { code: 'zh-TW', name: 'Chinese Traditional (Taiwan)', flag: '🇹🇼', native: '國語' }
    ],

    // UI Translations (for future multilingual interface)
    translations: {
        'en-US': {
            appName: 'V.I.R.A. - Virtual Interactive Resource Assistant',
            tagline: 'Celtech College Olongapo',
            tabs: {
                news: 'News',
                events: 'Events',
                history: 'History',
                facilities: 'Facilities',
                campusGuide: 'Campus Guide',
                interactiveMaps: 'Interactive Maps'
            },
            search: {
                placeholder: 'Search news, events, history, facilities...',
                listening: 'Listening...',
                noResults: 'No results found'
            },
            tts: {
                selectItem: 'Select an item to listen',
                welcome: 'Welcome to V.I.R.A.! Select any announcement, event, or schedule to have it read aloud to you.',
                play: 'Play',
                pause: 'Pause',
                stop: 'Stop',
                speed: 'Speed',
                voice: 'Voice'
            },
            buttons: {
                listen: 'Listen',
                openPage: 'Open Page',
                viewOnMap: 'View on Map'
            }
        },
        'fil-PH': {
            appName: 'V.I.R.A. - Virtual na Interactive na Resource Assistant',
            tagline: 'Celtech College Olongapo',
            tabs: {
                news: 'Balita',
                events: 'Mga Kaganapan',
                history: 'Kasaysayan',
                facilities: 'Mga Pasilidad',
                campusGuide: 'Gabay sa Kampus',
                interactiveMaps: 'Interactive na Mapa'
            },
            search: {
                placeholder: 'Maghanap ng balita, kaganapan, kasaysayan, pasilidad...',
                listening: 'Nakikinig...',
                noResults: 'Walang nahanap na resulta'
            },
            tts: {
                selectItem: 'Pumili ng item para pakinggan',
                welcome: 'Maligayang pagdating sa V.I.R.A.! Pumili ng anumang anunsyo, kaganapan, o iskedyul upang basahin ito nang malakas.',
                play: 'I-play',
                pause: 'I-pause',
                stop: 'Ihinto',
                speed: 'Bilis',
                voice: 'Boses'
            },
            buttons: {
                listen: 'Pakinggan',
                openPage: 'Buksan ang Pahina',
                viewOnMap: 'Tingnan sa Mapa'
            }
        },
        'es-ES': {
            appName: 'V.I.R.A. - Asistente de Recursos Interactivo Virtual',
            tagline: 'Celtech College Olongapo',
            tabs: {
                news: 'Noticias',
                events: 'Eventos',
                history: 'Historia',
                facilities: 'Instalaciones',
                campusGuide: 'Guía del Campus',
                interactiveMaps: 'Mapas Interactivos'
            },
            search: {
                placeholder: 'Buscar noticias, eventos, historia, instalaciones...',
                listening: 'Escuchando...',
                noResults: 'No se encontraron resultados'
            },
            tts: {
                selectItem: 'Seleccione un elemento para escuchar',
                welcome: '¡Bienvenido a V.I.R.A.! Seleccione cualquier anuncio, evento o horario para que se lea en voz alta.',
                play: 'Reproducir',
                pause: 'Pausar',
                stop: 'Detener',
                speed: 'Velocidad',
                voice: 'Voz'
            },
            buttons: {
                listen: 'Escuchar',
                openPage: 'Abrir Página',
                viewOnMap: 'Ver en el Mapa'
            }
        }
    },

    // Get language info by code
    getLanguageInfo: function (code) {
        return this.supportedLanguages.find(lang => lang.code === code) || this.supportedLanguages[0];
    },

    // Get UI translation
    getTranslation: function (languageCode, key) {
        const lang = this.translations[languageCode] || this.translations['en-US'];
        const keys = key.split('.');
        let value = lang;
        for (const k of keys) {
            value = value[k];
            if (!value) return key; // Return key if translation not found
        }
        return value;
    },

    // Check if language is available in browser
    isLanguageAvailable: function (code) {
        const voices = window.speechSynthesis.getVoices();
        return voices.some(voice => voice.lang.startsWith(code.split('-')[0]));
    },

    // Get recommended voice for language
    getRecommendedVoice: function (code) {
        const voices = window.speechSynthesis.getVoices();
        // Prefer Google voices, then Microsoft, then any
        const googleVoice = voices.find(v => v.lang === code && v.name.includes('Google'));
        const microsoftVoice = voices.find(v => v.lang === code && v.name.includes('Microsoft'));
        const anyVoice = voices.find(v => v.lang === code);
        return googleVoice || microsoftVoice || anyVoice || voices[0];
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = languageConfig;
}
