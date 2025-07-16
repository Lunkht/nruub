document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('back');
    const forwardBtn = document.getElementById('forward');
    const reloadBtn = document.getElementById('reload');
    const homeBtn = document.getElementById('home');
    const urlBar = document.getElementById('url-bar');
    const newTabBtn = document.getElementById('new-tab-btn');
    const menuBtn = document.getElementById('menu-btn');
    const mainMenu = document.getElementById('main-menu');

    const tabsContainer = document.getElementById('tabs');
    const contentContainer = document.getElementById('content');

    let tabs = [];
    let activeTabId = null;
    let historyLog = [];
    let isPrivateMode = false; // Default to false

    // Check if in private mode
    eel.is_private_mode()().then(mode => {
        isPrivateMode = mode;
        if (isPrivateMode) {
            console.log("Private browsing mode active. History will not be recorded.");
        }
    });

    function createNewTab(url = 'new_tab.html', title = 'Nouvel onglet') {
        const tabId = `tab-${Date.now()}`;
        
        // Create the tab element
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.dataset.tabId = tabId;
        tab.innerHTML = `
        <span class="tab-title">${title}</span>
            <button class="tab-close">×</button>
        `;
        tabsContainer.appendChild(tab);

        // Create the browser view (iframe)
        const browserView = document.createElement('iframe');
        browserView.className = 'browser-view';
        browserView.dataset.tabId = tabId;
        browserView.src = url;
        contentContainer.appendChild(browserView);

        const newTabInfo = { id: tabId, tabEl: tab, viewEl: browserView, title: title, url: url, zoom: 1 };
        tabs.push(newTabInfo);

        activateTab(tabId);

        // Add event listeners for the new tab
        tab.addEventListener('click', () => activateTab(tabId));
        tab.querySelector('.tab-close').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent activating tab when closing
            closeTab(tabId);
        });

        browserView.addEventListener('load', () => {
            const newTitle = browserView.contentDocument.title || title;
            const newUrl = browserView.contentWindow.location.href;
            updateTabInfo(tabId, newTitle, newUrl);
        });
    }

    function activateTab(tabId) {
        activeTabId = tabId;
        tabs.forEach(tabInfo => {
            const isActive = tabInfo.id === tabId;
            tabInfo.tabEl.classList.toggle('active', isActive);
            tabInfo.viewEl.classList.toggle('active', isActive);
            if (isActive) {
                urlBar.value = tabInfo.url;
            }
        });
    }

    function closeTab(tabId) {
        const tabIndex = tabs.findIndex(t => t.id === tabId);
        if (tabIndex === -1) return;

        const tabInfo = tabs[tabIndex];
        tabInfo.tabEl.remove();
        tabInfo.viewEl.remove();
        tabs.splice(tabIndex, 1);

        // If the closed tab was active, activate another tab
        if (activeTabId === tabId && tabs.length > 0) {
            const newActiveIndex = Math.max(0, tabIndex - 1);
            activateTab(tabs[newActiveIndex].id);
        } else if (tabs.length === 0) {
            createNewTab(); // Always have at least one tab
        }
    }

    function updateTabInfo(tabId, newTitle, newUrl) {
        const tabInfo = tabs.find(t => t.id === tabId);
        if (tabInfo) {
            // Don't record internal pages in history
            if (!isPrivateMode && !newUrl.startsWith('about:') && !newUrl.includes('new_tab.html')) {
                historyLog.push({ title: newTitle, url: newUrl, timestamp: new Date() });
                // Optional: To prevent the history from getting too large in a single session
                if (historyLog.length > 1000) {
                    historyLog.shift();
                }
            }

            tabInfo.title = newTitle;
            tabInfo.url = newUrl;
            tabInfo.tabEl.querySelector('.tab-title').textContent = newTitle;
            if (tabInfo.id === activeTabId) {
                urlBar.value = newUrl;
            }
        }
    }

    function getActiveTab() {
        return tabs.find(t => t.id === activeTabId);
    }

    function handleZoom(increment) {
        const activeTab = getActiveTab();
        if (activeTab) {
            activeTab.zoom += increment;
            activeTab.viewEl.style.zoom = activeTab.zoom;
        }
    }

    // --- Menu Logic ---
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mainMenu.classList.toggle('hidden');
    });

    window.addEventListener('click', () => {
        if (!mainMenu.classList.contains('hidden')) {
            mainMenu.classList.add('hidden');
        }
    });

    const themeToggleBtn = document.getElementById('menu-theme-toggle'); // Updated ID

    function applyTheme(theme) {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        localStorage.setItem('theme', theme);
    }

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // Original search message listener (now consolidated)

    // --- Event Listeners ---
    newTabBtn.addEventListener('click', () => createNewTab());

    // Menu Items
    document.getElementById('menu-new-tab').addEventListener('click', () => {
        createNewTab();
        mainMenu.classList.add('hidden'); // Hide menu after action
    });
    document.getElementById('menu-print').addEventListener('click', () => {
        const activeTab = getActiveTab();
        if (activeTab) activeTab.viewEl.contentWindow.print();
        mainMenu.classList.add('hidden'); // Hide menu after action
    });

    // Placeholders for future functionality
    document.getElementById('menu-new-window').addEventListener('click', () => {
        eel.new_window()();
        mainMenu.classList.add('hidden'); // Hide menu after action
    });
    document.getElementById('menu-new-private').addEventListener('click', () => {
        eel.private_window()();
        mainMenu.classList.add('hidden'); // Hide menu after action
    });
    document.getElementById('menu-theme-toggle').addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
    document.getElementById('menu-history').addEventListener('click', () => {
        const activeTab = getActiveTab();
        if (activeTab) activeTab.viewEl.src = 'history.html';
        mainMenu.classList.add('hidden'); // Hide menu after action
    });
    document.getElementById('menu-downloads').addEventListener('click', () => {
        const activeTab = getActiveTab();
        if (activeTab) activeTab.viewEl.src = 'downloads.html';
        mainMenu.classList.add('hidden'); // Hide menu after action
    });
    document.getElementById('menu-save').addEventListener('click', async () => {
        const activeTab = getActiveTab();
        if (activeTab) {
            const content = await activeTab.viewEl.contentWindow.document.documentElement.outerHTML;
            eel.save_as(content)();
        }
        mainMenu.classList.add('hidden'); // Hide menu after action
    });
    document.getElementById('menu-settings').addEventListener('click', () => {
        const activeTab = getActiveTab();
        if (activeTab) activeTab.viewEl.src = 'settings.html';
        mainMenu.classList.add('hidden'); // Hide menu after action
    });
    document.getElementById('menu-help').addEventListener('click', () => {
        console.log('Action: Help');
        mainMenu.classList.add('hidden'); // Hide menu after action
    });

    document.getElementById('menu-zoom-in').addEventListener('click', () => {
        handleZoom(0.1);
        mainMenu.classList.add('hidden'); // Hide menu after action
    });
    document.getElementById('menu-zoom-out').addEventListener('click', () => {
        handleZoom(-0.1);
        mainMenu.classList.add('hidden'); // Hide menu after action
    });


    backBtn.addEventListener('click', () => {
        const activeTab = getActiveTab();
        if (activeTab) activeTab.viewEl.contentWindow.history.back();
    });

    forwardBtn.addEventListener('click', () => {
        const activeTab = getActiveTab();
        if (activeTab) activeTab.viewEl.contentWindow.history.forward();
    });

    reloadBtn.addEventListener('click', () => {
        const activeTab = getActiveTab();
        if (activeTab) activeTab.viewEl.contentWindow.location.reload();
    });

    homeBtn.addEventListener('click', () => {
        const activeTab = getActiveTab();
        if (activeTab) activeTab.viewEl.src = 'about:blank';
    });

    urlBar.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const activeTab = getActiveTab();
            if (activeTab) {
                let url = urlBar.value;
                if (!url.startsWith('http')) {
                    url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
                }
                activeTab.viewEl.src = url;
            }
        }
    });

    // --- Keyboard Shortcuts ---
    document.addEventListener('keydown', (e) => {
        // On Mac, metaKey is the Command key. On Windows, it's ctrlKey.
        const isCmdOrCtrl = e.metaKey || e.ctrlKey;

        if (isCmdOrCtrl && e.key === 't') {
            e.preventDefault();
            createNewTab();
        }

        if (isCmdOrCtrl && e.key === 'p') {
            e.preventDefault();
            const activeTab = getActiveTab();
            if (activeTab) activeTab.viewEl.contentWindow.print();
        }
        
        if (isCmdOrCtrl && e.key === 'n') {
            e.preventDefault();
            eel.new_window()();
        }

        if (e.shiftKey && isCmdOrCtrl && e.key === 'P') {
            e.preventDefault();
            eel.private_window()();
        }

        if (isCmdOrCtrl && e.key === 'j') {
            e.preventDefault();
            const activeTab = getActiveTab();
            if (activeTab) activeTab.viewEl.src = 'downloads.html';
        }

        if (isCmdOrCtrl && e.key === 's') {
            e.preventDefault();
            const activeTab = getActiveTab();
            if (activeTab) {
                activeTab.viewEl.contentWindow.document.documentElement.outerHTML.then(content => {
                    eel.save_as(content)();
                });
            }
        }

        if (isCmdOrCtrl && e.key === ',') {
            e.preventDefault();
            const activeTab = getActiveTab();
            if (activeTab) activeTab.viewEl.src = 'settings.html';
        }

        if (isCmdOrCtrl && (e.key === '=' || e.key === '+')) {
            e.preventDefault();
            handleZoom(0.1);
        }

        if (isCmdOrCtrl && e.key === '-') {
            e.preventDefault();
            handleZoom(-0.1);
        }
    });

    // --- Initial Tab ---
    createNewTab();

    const ideBtn = document.getElementById('ide-btn');
    ideBtn.addEventListener('click', () => {
        createNewTab('NruubIDE.html', 'IDE');
    });
});

eel.expose(get_history);
function get_history() {
    return historyLog;
}
