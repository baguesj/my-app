// JavaScript (sama seperti sebelumnya, pastikan tidak ada error di console)
document.addEventListener('DOMContentLoaded', function() {
    const sidebarElement = document.querySelector(".sidebar");
    const mainContentPusher = document.querySelector('.content-pusher');
    const floatingHeader = document.querySelector('.floating-header');
    const sidebarTogglerHeader = document.querySelector('.sidebar-toggler-header');
    const sidebarMenuButtonMobile = document.querySelector('.sidebar-menu-button');
    const sidebarCloseButton = document.querySelector('.sidebar-close-button');
    const searchInput = document.getElementById('header-ycari');

    if (!sidebarElement || !mainContentPusher || !floatingHeader || !sidebarTogglerHeader || !sidebarMenuButtonMobile || !sidebarCloseButton || !searchInput) {
        console.error("Satu atau lebih elemen UI penting tidak ditemukan. Fungsi mungkin terganggu.");
        return;
    }

    const toggleDropdown = (dropdown, menu, isOpen) => {
        if (!dropdown || !menu) { return; }
        const isDesktopMode = window.innerWidth > 768;
        const isSidebarCurrentlyCollapsed = sidebarElement.classList.contains("collapsed");

        dropdown.classList.toggle("open", isOpen);

        if (isDesktopMode && isSidebarCurrentlyCollapsed) {
             menu.style.height = 'auto';
        } else {
            menu.style.height = isOpen ? `${menu.scrollHeight}px` : "0px";
        }
    };

    const closeAllDropdowns = (exceptThisDropdown = null) => {
        document.querySelectorAll(".sidebar .dropdown-container.open").forEach((openDropdown) => {
            if (openDropdown === exceptThisDropdown) return;
            const menu = openDropdown.querySelector(".dropdown-menu");
            if (menu) toggleDropdown(openDropdown, menu, false);
        });
    };

    document.querySelectorAll(".sidebar .dropdown-toggle").forEach((dropdownToggle) => {
        dropdownToggle.addEventListener("click", (e) => {
            e.preventDefault();
            const currentDropdown = dropdownToggle.closest(".dropdown-container");
            const currentMenu = currentDropdown.querySelector(".dropdown-menu");
            if (!currentDropdown || !currentMenu) { return; }
            const isCurrentlyOpen = currentDropdown.classList.contains("open");

            const isDesktopMode = window.innerWidth > 768;
            const isSidebarCurrentlyCollapsed = sidebarElement.classList.contains("collapsed");
            if (!isDesktopMode || !isSidebarCurrentlyCollapsed) {
                if (!isCurrentlyOpen) {
                    closeAllDropdowns(currentDropdown);
                }
            }
            toggleDropdown(currentDropdown, currentMenu, !isCurrentlyOpen);
        });
    });

    function handleSidebarToggle() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            sidebarElement.classList.toggle("open-mobile");
            if (sidebarElement.classList.contains("open-mobile")) {
                sidebarElement.classList.remove("collapsed");
                document.querySelectorAll(".sidebar .dropdown-menu").forEach(menu => menu.style.height = '0px');
                closeAllDropdowns();
            } else {
                mainContentPusher.style.marginLeft = '0px';
                floatingHeader.style.marginLeft = '0px';
            }
        } else {
            sidebarElement.classList.toggle("collapsed");
             if(sidebarElement.classList.contains("collapsed")){
                 closeAllDropdowns();
             } else {
                 document.querySelectorAll(".sidebar .dropdown-menu").forEach(menu => menu.style.height = '0px');
                 closeAllDropdowns();
             }
            const newMarginLeft = sidebarElement.classList.contains('collapsed') ? '85px' : '270px';
            mainContentPusher.style.marginLeft = newMarginLeft;
            floatingHeader.style.marginLeft = newMarginLeft;
            sidebarElement.classList.remove("open-mobile");
        }

         const isDesktopMode = window.innerWidth > 768;
         const isSidebarCurrentlyCollapsed = sidebarElement.classList.contains("collapsed");
         if (!isDesktopMode || !isSidebarCurrentlyCollapsed) {
             document.querySelectorAll(".sidebar .dropdown-container.open").forEach(dropdown => {
                 const menu = dropdown.querySelector(".dropdown-menu");
                 if (menu && dropdown.classList.contains('open')) { // Pastikan hanya yang 'open'
                      menu.style.height = `${menu.scrollHeight}px`;
                 }
             });
         }
    }

    sidebarTogglerHeader.addEventListener("click", handleSidebarToggle);
    sidebarMenuButtonMobile.addEventListener("click", handleSidebarToggle);
    sidebarCloseButton.addEventListener("click", handleSidebarToggle);

    function setInitialLayout() {
        const isMobile = window.innerWidth <= 768;
        const isVerySmallMobile = window.innerWidth <= 480;

        if (isMobile) {
            sidebarElement.classList.remove("collapsed", "open-mobile");
            mainContentPusher.style.marginLeft = '0px';
            floatingHeader.style.marginLeft = '0px';
            sidebarTogglerHeader.style.display = 'none';
            sidebarMenuButtonMobile.style.display = 'flex';
            document.querySelectorAll(".sidebar .dropdown-menu").forEach(menu => menu.style.height = '0px');
            closeAllDropdowns();
            searchInput.placeholder = isVerySmallMobile ? "Cari Material" : "Cari kebutuhanmu...";
        } else {
            sidebarElement.classList.remove("open-mobile");
            // Default ke expanded di desktop, kecuali jika ada preferensi lain (misal dari localStorage)
            sidebarElement.classList.remove('collapsed');
            const currentMarginLeft = sidebarElement.classList.contains('collapsed') ? '85px' : '270px';
            mainContentPusher.style.marginLeft = currentMarginLeft;
            floatingHeader.style.marginLeft = currentMarginLeft;
            sidebarTogglerHeader.style.display = 'flex';
            sidebarMenuButtonMobile.style.display = 'none';
            searchInput.placeholder = "Cari kebutuhanmu di sini...";
            document.querySelectorAll(".sidebar .dropdown-menu").forEach(menu => menu.style.height = '0px');
            closeAllDropdowns();
        }
    }

    setInitialLayout();
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setInitialLayout, 250); // Debounce resize
    });

    // Slideshow
    var slideIndex = 0;
    let slideTimeout;

    function showSlides() {
        let slides = document.getElementsByClassName("mySlides");
        let dots = document.getElementsByClassName("dot");
        if (slides.length === 0) return;

        for (let i = 0; i < slides.length; i++) { slides[i].style.display = "none"; }
        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1; }
        if (dots.length === slides.length) {
            for (let i = 0; i < dots.length; i++) { dots[i].className = dots[i].className.replace(" active", ""); }
            if (dots[slideIndex - 1]) dots[slideIndex - 1].className += " active";
        }
        if (slides[slideIndex - 1]) slides[slideIndex - 1].style.display = "block";
        slideTimeout = setTimeout(showSlides, 3000);
    }
    showSlides();

    // Header search
    const headerSearchForm = document.getElementById("header-search-form");
    function performHeaderSearch() {
        var searchQuery = searchInput.value;
        if (searchQuery.trim() !== "") {
            var lokasi = "action://act/search/" + encodeURIComponent(searchQuery.trim());
            window.location.href = lokasi; // <<< BARIS INI TELAH DIPERBAIKI (UNCOMMENTED)
            // console.log("Mencari:", lokasi); // Anda bisa tetap menyalakan ini untuk debug, atau matikan
        } else {
            console.log("Query pencarian kosong.");
        }
    }
    if (headerSearchForm) {
        headerSearchForm.addEventListener("submit", function(e){
            e.preventDefault();
            performHeaderSearch();
        });
    }

    // Close sidebar on click outside
    document.addEventListener('click', function(event) {
        const isMobile = window.innerWidth <= 768;
        if (sidebarElement.classList.contains('open-mobile') && isMobile) {
            const clickedInsideSidebar = sidebarElement.contains(event.target);
            const clickedOnMobileToggler = sidebarMenuButtonMobile.contains(event.target);
            if (!clickedInsideSidebar && !clickedOnMobileToggler) {
                handleSidebarToggle();
            }
        }
         const isDesktop = window.innerWidth > 768;
         const isCollapsed = sidebarElement.classList.contains('collapsed');
         if (isDesktop && isCollapsed) {
             const clickedInsideSidebar = sidebarElement.contains(event.target);
             if (!clickedInsideSidebar) {
                closeAllDropdowns();
             }
         }
    });
});