<script>
    import { onMount } from 'svelte';
    import { logTTS } from '$lib/db';

    let { activeItem = $bindable(null), currentCategory } = $props();
    
    let isPlaying = $state(false);
    let voices = $state([]);
    let selectedVoiceIdx = $state(0);
    let speed = $state(1.0);
    let progress = $state(0);
    let utterance = null;
    let startTime = 0;

    onMount(() => {
        const load = () => {
            voices = window.speechSynthesis.getVoices();
            // Default to first english voice or index 0
            const defIdx = voices.findIndex(v => v.lang.startsWith('en'));
            selectedVoiceIdx = defIdx >= 0 ? defIdx : 0;
        };
        load();
        window.speechSynthesis.onvoiceschanged = load;
    });

    $effect(() => {
        if (activeItem) {
            stopSpeech();
            isPlaying = false;
            progress = 0;
        }
    });

    function togglePlay() {
        if (isPlaying) {
            pauseSpeech();
        } else {
            playSpeech();
        }
    }

    function playSpeech() {
        if (!activeItem) return;
        window.speechSynthesis.cancel();
        
        const text = `${activeItem.title}. ${activeItem.content}`;
        utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voices[selectedVoiceIdx];
        utterance.rate = speed;
        
        startTime = Date.now();
        utterance.onstart = () => isPlaying = true;
        utterance.onend = () => {
            isPlaying = false;
            progress = 0;
            const duration = Math.round((Date.now() - startTime) / 1000);
            logTTS(currentCategory, activeItem.id, voices[selectedVoiceIdx]?.name, speed, duration);
        };
        utterance.onerror = () => isPlaying = false;
        
        window.speechSynthesis.speak(utterance);
    }

    function pauseSpeech() {
        window.speechSynthesis.pause();
        isPlaying = false;
    }

    function stopSpeech() {
        window.speechSynthesis.cancel();
        isPlaying = false;
        progress = 0;
    }

    function close() {
        stopSpeech();
        activeItem = null;
    }
</script>

{#if activeItem}
    <div class="tts-panel active">
        <div class="tts-content">
            <div class="tts-header">
                <h2 class="tts-title">{activeItem.title}</h2>
                <button class="close-btn" onclick={close}>×</button>
            </div>
            
            <div class="tts-text">
                <p>{activeItem.content}</p>
            </div>

            <div class="tts-controls">
                <div class="progress-bar">
                    <div class="progress-fill" style:width="{progress}%"></div>
                </div>

                <div class="control-buttons">
                    <button class="control-btn" onclick={togglePlay} class:playing={isPlaying}>
                        {#if isPlaying}
                            ⏸️
                        {:else}
                            ▶️
                        {/if}
                    </button>
                    <button class="control-btn" onclick={stopSpeech}>⏹️</button>
                </div>

                <div class="settings-grid">
                    <div class="speed-control">
                        <label>Speed: {speed}x</label>
                        <input type="range" min="0.5" max="2" step="0.1" bind:value={speed}>
                    </div>
                    
                    <div class="voice-select">
                        <label>Voice</label>
                        <select bind:value={selectedVoiceIdx}>
                            {#each voices as voice, i}
                                <option value={i}>{voice.name} ({voice.lang})</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .settings-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-top: 1rem;
    }
</style>
