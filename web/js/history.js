document.addEventListener('DOMContentLoaded', () => {
    const historyList = document.getElementById('history-list');

    // Request the history log from the main script
    window.parent.postMessage({ type: 'getHistory' }, '*');

    // Listen for the history log from the main script
    window.addEventListener('message', (e) => {
        if (e.data.type === 'historyLog') {
            const log = e.data.log;
            historyList.innerHTML = ''; // Clear existing list

            if (log.length === 0) {
                historyList.innerHTML = '<li>Votre historique de navigation est vide.</li>';
                return;
            }

            // Display in reverse chronological order
            log.reverse().forEach(item => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = item.url;
                a.textContent = `${item.title} - ${item.url}`;
                a.target = '_blank'; // This will be handled by the main script to open in a new tab
                li.appendChild(a);
                historyList.appendChild(li);
            });
        }
    });
});