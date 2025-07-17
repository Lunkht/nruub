document.addEventListener('DOMContentLoaded', () => {
    const searchEngineSelect = document.getElementById('searchEngine');

    // Load saved preference
    const savedSearchEngine = localStorage.getItem('defaultSearchEngine');
    if (savedSearchEngine) {
        searchEngineSelect.value = savedSearchEngine;
    }

    // Save preference on change
    searchEngineSelect.addEventListener('change', () => {
        localStorage.setItem('defaultSearchEngine', searchEngineSelect.value);
    });
});