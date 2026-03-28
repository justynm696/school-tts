<script>
    import { viraData, logSearch } from '$lib/db';
    
    let { searchQuery = $bindable(''), currentCategory } = $props();
    let isListening = $state(false);

    function toggleTheme() {
        const theme = document.documentElement.getAttribute('data-theme');
        const next = theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    }

    function clearSearch() {
        searchQuery = '';
    }

    let searchTimer;
    $effect(() => {
        if (searchQuery.length >= 3) {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                logSearch(searchQuery, 0, isListening ? 'voice' : 'text');
            }, 1500);
        }
    });
</script>

<nav class="navbar">
    <div class="nav-brand">
        <img src="/celtech_logo.png" alt="Celtech Logo" class="nav-logo">
        <div class="nav-title-group">
            <span class="nav-title">V.I.R.A.</span>
            <span class="nav-subtitle">Celtech Virtual Assistant</span>
        </div>
    </div>

    <div class="search-container">
        <div class="search-bar">
            <input 
                type="text" 
                id="searchInput" 
                placeholder="Search events, facilities, rooms..."
                bind:value={searchQuery}
            >
            {#if searchQuery}
                <button class="clear-search" onclick={clearSearch}>×</button>
            {/if}
            <button class="voice-search-btn" class:listening={isListening}>
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path fill="currentColor" d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
            </button>
        </div>
    </div>

    <button class="theme-toggle" onclick={toggleTheme}>
        <span class="sun-icon">☀️</span>
        <span class="moon-icon">🌙</span>
    </button>
</nav>

<style>
    /* Add local overrides if needed, but app.css handles most */
</style>
