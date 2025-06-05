const toggleBtn = document.querySelector('.toggle_btn'); // Sélecteur de classe
		const toggleBtnIcon = document.querySelector('.toggle_btn i'); // Sélecteur de classe + élément i pour l'icône
		const dropdownMenu = document.querySelector('.dropdown_menu'); // Sélecteur de classe

		toggleBtn.onclick = function () {
			dropdownMenu.classList.toggle('open');
			const isOpen = dropdownMenu.classList.contains('open');

			// Changer l'icône en fonction de l'état du menu
			if (isOpen) {
				toggleBtnIcon.classList.remove('fa-bars');
				toggleBtnIcon.classList.add('fa-xmark');
			} else {
				toggleBtnIcon.classList.remove('fa-xmark');
				toggleBtnIcon.classList.add('fa-bars');
			}
		}

		document.addEventListener('DOMContentLoaded', () => {
			const container = document.querySelector('.activities-container');
			const scrollLeftBtn = document.querySelector('.scroll-left');
			const scrollRightBtn = document.querySelector('.scroll-right');

			scrollLeftBtn.addEventListener('click', () => {
				container.scrollBy({
					left: -200, // Ajuste la valeur pour changer la distance de défilement
					behavior: 'smooth'
				});
			});

			scrollRightBtn.addEventListener('click', () => {
				container.scrollBy({
					left: 200, // Ajuste la valeur pour changer la distance de défilement
					behavior: 'smooth'
				});
			});
			// Sidebar logic for search and assistant
			const searchSidebarBtn = document.getElementById('searchSidebarBtn');
			const assistantSidebarBtn = document.getElementById('assistantSidebarBtn');
			const searchSidebar = document.getElementById('searchSidebar');
			const assistantSidebar = document.getElementById('assistantSidebar');
			const closeSidebarBtns = document.querySelectorAll('.close-sidebar');
			
			searchSidebarBtn.addEventListener('click', () => {
			    searchSidebar.classList.add('open');
			});
			assistantSidebarBtn.addEventListener('click', () => {
			    assistantSidebar.classList.add('open');
			});
			closeSidebarBtns.forEach(btn => {
			    btn.addEventListener('click', (e) => {
			        const target = e.target.getAttribute('data-target');
			        document.getElementById(target).classList.remove('open');
			    });
			});
		});

// HERO SEARCH LOGIC
const heroSearchInput = document.getElementById('search');
const heroSearchBtn = document.getElementById('heroSearchBtn');

function handleHeroSearch() {
    const query = heroSearchInput.value.trim();
    if (query.length === 0) {
        alert('Veuillez entrer un terme de recherche.');
        return;
    }
    // Ici, vous pouvez ajouter la logique de recherche réelle
    alert('Résultat de la recherche pour : ' + query);
}

if (heroSearchBtn && heroSearchInput) {
    heroSearchBtn.addEventListener('click', handleHeroSearch);
    heroSearchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            handleHeroSearch();
        }
    });
}

// --- Browser-like Navigation Logic (basic demo) ---
const browserTabs = document.querySelector('.browser-tabs');
if (browserTabs) {
    browserTabs.addEventListener('click', function(e) {
        if (e.target.classList.contains('close-tab')) {
            e.target.parentElement.remove();
        } else if (e.target.classList.contains('add-tab')) {
            const newTab = document.createElement('div');
            newTab.className = 'browser-tab';
            newTab.innerHTML = 'Nouvel onglet <span class="close-tab">×</span>';
            browserTabs.insertBefore(newTab, browserTabs.querySelector('.add-tab'));
        } else if (e.target.classList.contains('browser-tab')) {
            browserTabs.querySelectorAll('.browser-tab').forEach(tab => tab.classList.remove('active'));
            e.target.classList.add('active');
        }
    });
}

const backBtn = document.querySelector('.browser-btn[title="Back"]');
const forwardBtn = document.querySelector('.browser-btn[title="Forward"]');
const refreshBtn = document.querySelector('.browser-btn[title="Refresh"]');

if (backBtn) backBtn.onclick = () => alert('Back navigation demo');
if (forwardBtn) forwardBtn.onclick = () => alert('Forward navigation demo');
if (refreshBtn) refreshBtn.onclick = () => location.reload();
// --- End Browser Navigation Logic ---
