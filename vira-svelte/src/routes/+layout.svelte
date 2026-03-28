<script>
    import '../app.css';
    import { onMount } from 'svelte';
    import { loadData } from '$lib/db';

    let { children } = $props();

    onMount(async () => {
        await loadData();
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    });
</script>

{@render children()}
