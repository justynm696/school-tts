<script>
    let { currentCategory = $bindable('events') } = $props();

    const categories = [
        { id: 'events', label: 'Events', icon: '📅' },
        { id: 'history', label: 'History', icon: '🕰️' },
        { id: 'facilities', label: 'Facilities', icon: '📚' },
        { id: 'campus_guide', label: 'Campus Guide', icon: '🏢' },
        { id: 'interactive_maps', label: 'Interactive Maps', icon: '🗺️', url: '/navigation' }
    ];

    function select(cat) {
        if (cat.url) {
            window.location.href = cat.url;
            return;
        }
        currentCategory = cat.id;
    }
</script>

<div class="category-tabs">
    {#each categories as cat}
        <button 
            class="tab-btn" 
            class:active={currentCategory === cat.id} 
            onclick={() => select(cat)}
        >
            <span class="tab-icon">{cat.icon}</span>
            <span class="tab-label">{cat.label}</span>
        </button>
    {/each}
</div>
