<script>
    let { item, onListen } = $props();
    
    function handleListen() {
        onListen(item);
    }
</script>

<div class="content-card" style:animation-delay="0s" onclick={handleListen}>
    <div class="card-header">
        <div class="card-icon">{item.icon || '📄'}</div>
        <div class="card-meta">
            <span class="card-category">{item.category}</span>
            <span class="card-date">{item.date || ''}</span>
        </div>
        {#if item.priority === 'high'}
            <span class="priority-badge high">Urgent</span>
        {/if}
    </div>
    <div class="card-body">
        <h3 class="card-title">{item.title}</h3>
        <p class="card-content">{item.content}</p>
    </div>
    <div class="card-footer">
        <button class="listen-btn" onclick|stopPropagation={handleListen}>
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            Click to Listen
        </button>
    </div>
</div>
