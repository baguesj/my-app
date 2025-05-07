    // JavaScript (sama seperti sebelumnya, pastikan tidak ada error di console)
    document.addEventListener('DOMContentLoaded', function() {
        const sidebarElement = document.querySelector(".sidebar");
        const mainContentPusher = document.querySelector('.content-pusher');
        const floatingHeader = document.querySelector('.floating-header');
        const sidebarTogglerHeader = document.querySelector('.sidebar-toggler-header');
        const sidebarMenuButtonMobile = document.querySelector('.sidebar-menu-button');
        const sidebarCloseButton = document.querySelector('.sidebar-close-button');
        const searchInput = document.getElementById('header-ycari'); 

        // Optional: Basic check for required elements
        if (!sidebarElement) console.error("Sidebar element (.sidebar) not found!");
        if (!mainContentPusher) console.error("Content pusher (.content-pusher) not found!");
        if (!floatingHeader) console.error("Floating header (.floating-header) not found!");
        if (!sidebarTogglerHeader) console.error("Desktop sidebar toggler (.sidebar-toggler-header) not found!");
        if (!sidebarMenuButtonMobile) console.error("Mobile sidebar menu button (.sidebar-menu-button) not found!");
        if (!sidebarCloseButton) console.error("Sidebar close button (.sidebar-close-button) not found!");
        if (!searchInput) console.error("Search input (#header-ycari) not found!");


        const toggleDropdown = (dropdown, menu, isOpen) => {
            if (!dropdown || !menu) { return; }
            const isDesktopMode = window.innerWidth > 768;
            const isSidebarCurrentlyCollapsed = sidebarElement.classList.contains("collapsed");
            
            dropdown.classList.toggle("open", isOpen);
            
            // Desktop collapsed mode uses popover, no height animation
            if (isDesktopMode && isSidebarCurrentlyCollapsed) {
                 menu.style.height = 'auto'; // Or remove style if previously set by JS
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

                // Only close other dropdowns if not in desktop collapsed mode
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
            if (!sidebarElement || !mainContentPusher || !floatingHeader) return;
            const isMobile = window.innerWidth <= 768;

            if (isMobile) {
                // Toggle mobile open state
                sidebarElement.classList.toggle("open-mobile");
                if (sidebarElement.classList.contains("open-mobile")) {
                    // Ensure it's not collapsed when mobile open
                    sidebarElement.classList.remove("collapsed"); 
                     // Reset dropdowns for mobile view if needed
                    document.querySelectorAll(".sidebar .dropdown-menu").forEach(menu => menu.style.height = '0px');
                     closeAllDropdowns(); 

                } else {
                     // When closing mobile sidebar, ensure margin is 0
                    mainContentPusher.style.marginLeft = '0px';
                    floatingHeader.style.marginLeft = '0px';
                }
            } else { 
                // Toggle desktop collapsed state
                sidebarElement.classList.toggle("collapsed");
                 // When collapsing on desktop, close dropdowns that are not popovers
                 if(sidebarElement.classList.contains("collapsed")){
                     closeAllDropdowns(); // Close all when collapsing on desktop
                 } else {
                     // When expanding on desktop, reset inline height styles
                     document.querySelectorAll(".sidebar .dropdown-menu").forEach(menu => menu.style.height = '0px');
                     closeAllDropdowns(); // Close all when expanding
                 }


                const newMarginLeft = sidebarElement.classList.contains('collapsed') ? '85px' : '270px';
                mainContentPusher.style.marginLeft = newMarginLeft;
                floatingHeader.style.marginLeft = newMarginLeft;

                // Ensure mobile open class is removed in desktop mode
                 sidebarElement.classList.remove("open-mobile"); 
            }

             // Always reset dropdown heights when sidebar state changes (except for collapsed desktop popovers)
             const isDesktopMode = window.innerWidth > 768;
             const isSidebarCurrentlyCollapsed = sidebarElement.classList.contains("collapsed");

             if (!isDesktopMode || !isSidebarCurrentlyCollapsed) {
                 document.querySelectorAll(".sidebar .dropdown-container.open").forEach(dropdown => {
                     const menu = dropdown.querySelector(".dropdown-menu");
                     if (menu) {
                          menu.style.height = `${menu.scrollHeight}px`;
                     }
                 });
             }
        }


        if(sidebarTogglerHeader) sidebarTogglerHeader.addEventListener("click", handleSidebarToggle);
        if(sidebarMenuButtonMobile) sidebarMenuButtonMobile.addEventListener("click", handleSidebarToggle);
        if(sidebarCloseButton) sidebarCloseButton.addEventListener("click", handleSidebarToggle);

        function setInitialLayout() {
            if (!sidebarElement || !mainContentPusher || !floatingHeader || !sidebarTogglerHeader || !sidebarMenuButtonMobile || !searchInput) {
                return;
            }
            const isMobile = window.innerWidth <= 768;
            const isVerySmallMobile = window.innerWidth <= 480;

            if (isMobile) {
                // Mobile state: sidebar initially hidden, no margin on content
                sidebarElement.classList.remove("collapsed"); 
                sidebarElement.classList.remove("open-mobile"); // Start closed
                mainContentPusher.style.marginLeft = '0px';
                floatingHeader.style.marginLeft = '0px';
                sidebarTogglerHeader.style.display = 'none'; // Hide desktop toggler
                sidebarMenuButtonMobile.style.display = 'flex'; // Show mobile menu button

                // Reset dropdown heights on mobile
                 document.querySelectorAll(".sidebar .dropdown-menu").forEach(menu => menu.style.height = '0px');
                 closeAllDropdowns(); 

                 if (isVerySmallMobile) {
                    searchInput.placeholder = "Cari Matrial Bangunan"; 
                } else {
                    searchInput.placeholder = "Cari Kebutuhan kamu..."; 
                }
            } else { 
                // Desktop state: sidebar visible, set margin on content
                sidebarElement.classList.remove("open-mobile"); 
                // Check if it should start collapsed or expanded (e.g., based on screen size or preference)
                // For this code, let's default to expanded on larger screens >= 769px
                sidebarElement.classList.remove('collapsed'); // Default to expanded on desktop

                const currentMarginLeft = '270px'; // Expanded default margin
                mainContentPusher.style.marginLeft = currentMarginLeft;
                floatingHeader.style.marginLeft = currentMarginLeft;
                
                sidebarTogglerHeader.style.display = 'block'; // Show desktop toggler
                sidebarMenuButtonMobile.style.display = 'none'; // Hide mobile menu button
                
                searchInput.placeholder = "Cari Kebutuhan kamu di sini..."; 

                // Reset dropdown heights on desktop initial load
                document.querySelectorAll(".sidebar .dropdown-menu").forEach(menu => menu.style.height = '0px');
                 closeAllDropdowns(); 

            }
        }

        // Set initial layout on load and resize
        setInitialLayout();
        window.addEventListener('resize', setInitialLayout); 

        // Slideshow functionality
        var slideIndex = 0; // Start from 0 internally, will adjust to 1-based for slides/dots
        let slideTimeout; // To hold the timeout ID

        function showSlides() {
            let i;
            let slides = document.getElementsByClassName("mySlides");
            let dots = document.getElementsByClassName("dot");
            if (slides.length === 0) return;

            // Hide all slides
            for (i = 0; i < slides.length; i++) { slides[i].style.display = "none"; }

            // Increment slide index, loop back if needed
            slideIndex++;
            if (slideIndex > slides.length) { slideIndex = 1; }

            // Update dots (only if dots exist and match slide count)
            if (dots.length === slides.length) {
                for (i = 0; i < dots.length; i++) { dots[i].className = dots[i].className.replace(" active", ""); }
                if (dots[slideIndex - 1]) dots[slideIndex - 1].className += " active";
            }

            // Display the current slide
            if (slides[slideIndex - 1]) slides[slideIndex - 1].style.display = "block";

            // Set timeout for the next slide
            slideTimeout = setTimeout(showSlides, 3000); // Change image every 3 seconds
        }
        // Start the slideshow when the page loads
        showSlides();

        // Optional: Pause slideshow on hover (not implemented in original code but common)
        // You could add event listeners to .slideshow-container to pause/resume timeout


        // Header search functionality
        const headerSearchForm = document.getElementById("header-search-form");
        
        function performHeaderSearch() {
            if (!searchInput) { return; }
            var searchQuery = searchInput.value;
            // Trim whitespace from search query
            if (searchQuery.trim() !== "") {
                // Assuming 'action://' protocol is handled by the app for navigation
                var lokasi = "action://act/search/" + encodeURIComponent(searchQuery.trim());
                window.location.href = lokasi;
            } else {
                // Optionally provide feedback if search query is empty
                console.log("Search query is empty.");
                // You could also trigger a UI feedback like shaking the input or showing a message
            }
        }

        if (headerSearchForm) {
            headerSearchForm.addEventListener("submit", function(e){
                e.preventDefault(); // Prevent default form submission
                performHeaderSearch();
            });
        }

        // Close sidebar on click outside when open on mobile
        document.addEventListener('click', function(event) {
            if (!sidebarElement || !sidebarMenuButtonMobile || !sidebarTogglerHeader) return;

            const isMobile = window.innerWidth <= 768;
            // Only apply this logic if the sidebar is open in mobile mode
            if (sidebarElement.classList.contains('open-mobile') && isMobile) {
                const clickedInsideSidebar = sidebarElement.contains(event.target);
                const clickedOnMobileToggler = sidebarMenuButtonMobile.contains(event.target);
                
                // If the click was outside the sidebar AND not on the button that opens it...
                if (!clickedInsideSidebar && !clickedOnMobileToggler) {
                    handleSidebarToggle(); // This will close the mobile sidebar
                }
            }
             // Also close dropdowns if clicking outside them when sidebar is collapsed desktop (popover mode)
             const isDesktop = window.innerWidth > 768;
             const isCollapsed = sidebarElement.classList.contains('collapsed');
             if (isDesktop && isCollapsed) {
                 const clickedInsideSidebar = sidebarElement.contains(event.target);
                 // Close dropdowns if click is outside sidebar AND outside any dropdown menu itself
                 if (!clickedInsideSidebar) {
                    closeAllDropdowns();
                 }
             }
        });

         // Prevent content clicks from closing the mobile sidebar if sidebar is open
         if (mainContentPusher && sidebarElement) {
            mainContentPusher.addEventListener('click', function(event) {
                 const isMobile = window.innerWidth <= 768;
                 if (sidebarElement.classList.contains('open-mobile') && isMobile) {
                    // The click is within the content area, and the sidebar is open mobile.
                    // The document click listener above will catch this and close the sidebar.
                    // We don't need to do anything specific *here* unless we wanted to stop
                    // propagation, but letting the document listener handle it is fine.
                 }
            });
         }

    });
