<script>
    import { onMount } from 'svelte';
    import { viraData, saveData, removeData, isReady } from '$lib/db';
    import '../../admin.css';

    let loggedIn = $state(false);
    let currentUser = $state(null);
    let username = $state('');
    let password = $state('');
    let loginError = $state('');

    const ADMIN_ACCOUNTS = [
        { user: 'admin', pass: 'Admin@2026', name: 'Super Admin', role: 'Super Admin', dept: 'general' },
        { user: 'registrar_admin', pass: 'Registrar@2026', name: 'Registrar Admin', role: 'Registrar', dept: 'registrar' },
    ];

    function handleLogin() {
        const acc = ADMIN_ACCOUNTS.find(a => a.user === username && a.pass === password);
        if (acc) {
            loggedIn = true;
            currentUser = acc;
            loginError = '';
        } else {
            loginError = 'Invalid credentials';
        }
    }

    function logout() {
        loggedIn = false;
        currentUser = null;
    }

    // CRUD logic
    let activeSection = $state('events');
    let editingItem = $state(null);

    async function handleSave(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const item = Object.fromEntries(formData.entries());
        if (!item.id) item.id = 'new_' + Date.now();
        item.dept_id = currentUser.dept;
        
        try {
            await saveData(activeSection, item);
            editingItem = null;
        } catch (err) {
            alert('Save failed: ' + err.message);
        }
    }

    async function handleDelete(id) {
        if (confirm('Are you sure?')) {
            await removeData(activeSection, id);
        }
    }
</script>

<svelte:head>
    <title>V.I.R.A. Admin Panel</title>
</svelte:head>

<div class="admin-page">
    {#if !loggedIn}
        <div class="login-container">
            <div class="login-card">
                <h1>V.I.R.A. Admin</h1>
                <p>Sign in to manage campus content</p>
                {#if loginError}
                    <div class="error-box">{loginError}</div>
                {/if}
                <form onsubmit={handleLogin}>
                    <input type="text" placeholder="Username" bind:value={username} required>
                    <input type="password" placeholder="Password" bind:value={password} required>
                    <button type="submit">Sign In</button>
                </form>
            </div>
        </div>
    {:else}
        <nav class="admin-nav">
            <div class="brand">🛡️ VIRA CMS</div>
            <div class="user-info">
                <span>{currentUser.name} ({currentUser.role})</span>
                <button onclick={logout}>Logout</button>
            </div>
        </nav>

        <div class="admin-layout">
            <aside class="sidebar">
                <button class:active={activeSection === 'events'} onclick={() => activeSection = 'events'}>Events</button>
                <button class:active={activeSection === 'facilities'} onclick={() => activeSection = 'facilities'}>Facilities</button>
                <button class:active={activeSection === 'campus_guide'} onclick={() => activeSection = 'campus_guide'}>Guide</button>
                <button class:active={activeSection === 'history'} onclick={() => activeSection = 'history'}>History</button>
            </aside>

            <main class="admin-content">
                <header class="content-header">
                    <h2>{activeSection.toUpperCase()}</h2>
                    <button onclick={() => editingItem = {}}>+ Add New</button>
                </header>

                {#if editingItem}
                    <div class="editor-overlay">
                        <div class="editor-card">
                            <h3>{editingItem.id ? 'Edit' : 'New'} {activeSection}</h3>
                            <form onsubmit={handleSave}>
                                <input type="hidden" name="id" value={editingItem.id || ''}>
                                <div class="form-group">
                                    <label>Title</label>
                                    <input type="text" name="title" value={editingItem.title || ''} required>
                                </div>
                                <div class="form-group">
                                    <label>Category</label>
                                    <input type="text" name="category" value={editingItem.category || ''} required>
                                </div>
                                <div class="form-group">
                                    <label>Content</label>
                                    <textarea name="content" required>{editingItem.content || ''}</textarea>
                                </div>
                                <div class="actions">
                                    <button type="button" onclick={() => editingItem = null}>Cancel</button>
                                    <button type="submit" class="primary">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                {/if}

                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Icon</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each $viraData[activeSection] || [] as item}
                                <tr>
                                    <td>{item.icon}</td>
                                    <td>{item.title}</td>
                                    <td>{item.category}</td>
                                    <td>
                                        <button onclick={() => editingItem = item}>Edit</button>
                                        <button class="danger" onclick={() => handleDelete(item.id)}>Del</button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    {/if}
</div>

<style>
    .admin-page {
        min-height: 100vh;
        background: var(--color-background);
        font-family: 'Inter', sans-serif;
    }
    .login-container { display: flex; align-items: center; justify-content: center; height: 100vh; }
    .login-card { background: white; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
    .admin-nav { display: flex; justify-content: space-between; padding: 1rem 2rem; background: #1e293b; color: white; }
    .admin-layout { display: flex; height: calc(100vh - 64px); }
    .sidebar { width: 240px; background: #f8fafc; border-right: 1px solid #e2e8f0; padding: 1rem; }
    .sidebar button { display: block; width: 100%; padding: 0.75rem 1rem; text-align: left; border: none; background: none; border-radius: 0.5rem; margin-bottom: 0.5rem; cursor: pointer; }
    .sidebar button.active { background: #3b82f6; color: white; }
    .admin-content { flex: 1; padding: 2rem; overflow-y: auto; }
    .content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .editor-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .editor-card { background: white; padding: 2rem; border-radius: 1rem; width: 100%; max-width: 600px; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
    .form-group input, .form-group textarea { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; }
    .data-table table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
</style>
