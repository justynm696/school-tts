<script>
    import { onMount } from 'svelte';
    import TTSPanel from '$lib/components/TTSPanel.svelte';

    let currentFloor = $state(1);
    let searchQuery = $state('');
    let searchResults = $derived.by(() => {
        if (!searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase();
        let results = [];
        for (let floor in floorData) {
            const matches = floorData[floor].filter(r => 
                r.room.toLowerCase().includes(q) || 
                r.description.toLowerCase().includes(q)
            );
            if (matches.length > 0) {
                results.push(...matches.map(m => ({ ...m, floor: parseInt(floor) })));
            }
        }
        return results;
    });

    let activeItem = $state(null);
    let modalImage = $state(null);

    const floorData = {
        1: [
            { room: "Lobby", description: "Main entrance and waiting area" },
            { room: "Registrar Office", description: "Student enrollment, records, and transcripts" },
            { room: "Finance Office", description: "Tuition payments and financial services" },
            { room: "Canteen", description: "Student and faculty dining area" },
            { room: "Clinic", description: "Medical services and first aid" }
        ],
        2: [
            { room: "School Library", description: "Main library with books, journals, and study areas" },
            { room: "Computer Lab", description: "Modern computers and software for IT courses" },
            { room: "Speech Lab", description: "Communication and public speaking training" }
        ],
        3: [
            { room: "Skills Lab", description: "Hands-on technical training facility" },
            { room: "Room 301", description: "General classroom for technical courses" },
            { room: "Room 310", description: "General classroom for academic programs" }
        ],
        4: [
            { room: "MOLA Auditorium", description: "Large multipurpose auditorium for events" },
            { room: "Mock Bridge", description: "Ship bridge simulations and maritime training" },
            { room: "GMDSS Room", description: "Global Maritime Distress and Safety System training" }
        ]
    };

    function selectFloor(f) {
        currentFloor = f;
    }

    function quickFind(q) {
        searchQuery = q;
    }

    function openTTS(room) {
        activeItem = { title: room.room, content: room.description, id: 'nav_' + room.room };
    }

    function openModal(src) {
        modalImage = src;
    }
</script>

<div class="nav-container">
    <header class="nav-header">
        <a href="/" class="back-link">← Back to V.I.R.A.</a>
        <h1>🗺️ Campus Navigation</h1>
        <p>Find your way around Celtech College Olongapo</p>
    </header>

    <div class="room-finder">
        <h2>🔍 Room Finder</h2>
        <div class="search-box">
            <input type="text" placeholder="Search for a room, office, or facility..." bind:value={searchQuery}>
            <button class="voice-search-btn">🎤</button>
        </div>

        {#if searchQuery}
            <div class="search-results active">
                {#each searchResults as res}
                    <div class="search-item">
                        <strong>{res.room}</strong>
                        <p>{res.description}</p>
                        <button onclick={() => { selectFloor(res.floor); searchQuery = ''; }}>📍 View on Floor {res.floor}</button>
                    </div>
                {:else}
                    <p>No rooms found matching "{searchQuery}"</p>
                {/each}
            </div>
        {/if}

        <div class="quick-find-section">
            <h3>🚀 Quick Find</h3>
            <div class="quick-find-buttons">
                <button class="quick-find-btn" onclick={() => quickFind('registrar')}>📋 Registrar</button>
                <button class="quick-find-btn" onclick={() => quickFind('library')}>📚 Library</button>
                <button class="quick-find-btn" onclick={() => quickFind('canteen')}>🍽️ Canteen</button>
                <button class="quick-find-btn" onclick={() => quickFind('clinic')}>🏥 Clinic</button>
            </div>
        </div>
    </div>

    <div class="floor-selector">
        {#each [1,2,3,4] as f}
            <button class="floor-btn" class:active={currentFloor === f} onclick={() => selectFloor(f)}>
                {f === 1 ? '1st' : f === 2 ? '2nd' : f === 3 ? '3rd' : '4th'} Floor
            </button>
        {/each}
    </div>

    <div class="floor-map active">
        <h3>Floor {currentFloor} Map</h3>
        <img 
            src="/floor_{currentFloor === 1 ? '1st' : currentFloor === 2 ? '2nd' : currentFloor === 3 ? '3rd' : '4th'}.jpg" 
            alt="Floor Map" 
            class="map-image" 
            onclick={() => openModal(`/floor_${currentFloor === 1 ? '1st' : currentFloor === 2 ? '2nd' : currentFloor === 3 ? '3rd' : '4th'}.jpg`)}
        >
        
        <div class="room-list">
            {#each floorData[currentFloor] as room}
                <div class="room-item">
                    <strong>{room.room}</strong>
                    <span>{room.description}</span>
                    <button class="listen-btn" onclick={() => openTTS(room)}>🔊 Listen</button>
                </div>
            {/each}
        </div>
    </div>
</div>

{#if modalImage}
    <div class="modal active" onclick={() => modalImage = null}>
        <img src={modalImage} alt="Floor Map Expanded">
    </div>
{/if}

<TTSPanel bind:activeItem currentCategory="campus_guide" />

<style>
    .nav-container { max-width: 1000px; margin: 0 auto; padding: 2rem 1rem; }
    .nav-header { text-align: center; margin-bottom: 2rem; }
    .back-link { color: var(--color-primary); text-decoration: none; font-weight: 600; display: block; margin-bottom: 1rem; }
    .room-finder { background: var(--color-surface); padding: 1.5rem; border-radius: 1rem; box-shadow: var(--shadow-md); margin-bottom: 2rem; }
    .search-box { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .search-box input { flex: 1; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 0.5rem; }
    .floor-selector { display: flex; gap: 1rem; margin-bottom: 2rem; }
    .floor-btn { flex: 1; padding: 1rem; border: 1px solid var(--color-border); border-radius: 0.5rem; cursor: pointer; background: white; font-weight: 600; }
    .floor-btn.active { background: var(--color-primary); color: white; }
    .map-image { width: 100%; border-radius: 0.5rem; cursor: pointer; transition: transform 0.3s; }
    .map-image:hover { transform: scale(1.02); }
    .room-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
    .room-item { padding: 1rem; background: var(--color-background); border-radius: 0.5rem; border-left: 4px solid var(--color-accent); }
    .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal img { max-width: 90%; max-height: 90%; }
    .quick-find-buttons { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .quick-find-btn { padding: 0.5rem 1rem; border: 1px solid var(--color-border); border-radius: 2rem; background: white; cursor: pointer; }
    .search-item { padding: 1rem; border-bottom: 1px solid var(--color-border); }
</style>
