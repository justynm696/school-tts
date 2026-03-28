<script>
    import Navbar from '$lib/components/Navbar.svelte';
    import CategoryTabs from '$lib/components/CategoryTabs.svelte';
    import ContentCard from '$lib/components/ContentCard.svelte';
    import TTSPanel from '$lib/components/TTSPanel.svelte';
    import { viraData, isReady } from '$lib/db';

    let currentCategory = $state('events');
    let searchQuery = $state('');
    let activeItem = $state(null);

    // Reactive filter based on category and search
    let filteredContent = $derived.by(() => {
        const data = $viraData;
        const categoryData = data[currentCategory] || [];
        
        if (!searchQuery.trim()) return categoryData;
        
        const q = searchQuery.toLowerCase();
        return categoryData.filter(item => 
            item.title.toLowerCase().includes(q) ||
            item.content.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
        );
    });

    function openTTS(item) {
        activeItem = item;
    }
</script>

<svelte:head>
    <title>V.I.R.A. — Celtech College</title>
</svelte:head>

<Navbar bind:searchQuery {currentCategory} />

<main class="container">
    <CategoryTabs bind:currentCategory />

    <section id="contentSection" class="content-section">
        {#if !$isReady}
            <div class="loading-state">
                <div class="loader"></div>
                <p>Connecting to V.I.R.A. Core...</p>
            </div>
        {:else if filteredContent.length === 0}
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>No results found</h3>
                <p>Try different keywords or check another category.</p>
            </div>
        {:else}
            <div class="grid-layout">
                {#each filteredContent as item (item.id)}
                    <ContentCard {item} onListen={openTTS} />
                {/each}
            </div>
        {/if}
    </section>

    <TTSPanel bind:activeItem {currentCategory} />
</main>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }
    
    .grid-layout {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
    }

    .loading-state, .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        background: var(--color-surface);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        margin-top: 2rem;
    }

    .loader {
        width: 48px;
        height: 48px;
        border: 4px solid var(--color-hover);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1.5rem;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
</style>
