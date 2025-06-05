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
