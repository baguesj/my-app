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
        // Tetap lanjutkan untuk memungkinkan bagian lain skrip berjalan
    }

    const toggleDropdown = (dropdown, menu, isOpen) => {
        if (!dropdown || !menu) { return; }
        const isDesktopMode = window.innerWidth > 768;
        const isSidebarCurrentlyCollapsed = sidebarElement.classList.contains("collapsed");

        dropdown.classList.toggle("open", isOpen);

        if (isDesktopMode && isSidebarCurrentlyCollapsed) {
             // Di desktop dalam mode collapsed, dropdown menu muncul di samping
             // Tinggi diatur otomatis oleh CSS untuk popup di samping
             // Tidak perlu atur tinggi di sini
             menu.style.height = ''; // Kosongkan style height jika sebelumnya diatur
        } else {
            // Mode expanded desktop atau mode mobile
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
                 // Hanya tutup dropdown lain di mode expanded desktop atau mobile
                 if (!isCurrentlyOpen) {
                     closeAllDropdowns(currentDropdown);
                 }
            }
             // Toggle dropdown yang diklik
            toggleDropdown(currentDropdown, currentMenu, !isCurrentlyOpen);

            // Di mode desktop collapsed, kita tidak ingin dropdown terbuka di bawah item
            // CSS menangani tampilan sebagai popup di samping, jadi tinggi 0 tetap relevan di sini
            if (isDesktopMode && isSidebarCurrentlyCollapsed) {
                currentMenu.style.height = '0px'; // Pastikan tinggi 0 saat toggling di sini
            }
        });
    });

     // Menambahkan event listener untuk sub-menu di mode collapsed desktop
     document.querySelectorAll(".sidebar.collapsed .dropdown-container").forEach(dropdown => {
         dropdown.addEventListener("mouseenter", () => {
             if (window.innerWidth > 768) { // Hanya di desktop
                 const menu = dropdown.querySelector(".dropdown-menu");
                 if (menu) {
                     // Tidak perlu atur tinggi, CSS yang handle display/opacity
                     // Pastikan dropdown-container punya class open saat hover
                     dropdown.classList.add("open");
                 }
             }
         });
         dropdown.addEventListener("mouseleave", () => {
              if (window.innerWidth > 768) { // Hanya di desktop
                  const menu = dropdown.querySelector(".dropdown-menu");
                  if (menu) {
                      // Hapus class open saat mouseleave
                      dropdown.classList.remove("open");
                  }
              }
         });
     });


    function handleSidebarToggle() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            sidebarElement.classList.toggle("open-mobile");
            if (sidebarElement.classList.contains("open-mobile")) {
                sidebarElement.classList.remove("collapsed");
                // Di mobile saat membuka, tutup semua dropdown dan set tinggi ke 0
                document.querySelectorAll(".sidebar .dropdown-menu").forEach(menu => menu.style.height = '0px');
                closeAllDropdowns();
                 // Hapus style margin yang mungkin diatur oleh desktop
                mainContentPusher.style.marginLeft = '0px';
                floatingHeader.style.marginLeft = '0px';
            } else {
                // Di mobile saat menutup, pastikan margin 0
                mainContentPusher.style.marginLeft = '0px';
                floatingHeader.style.marginLeft = '0px';
            }
        } else { // Desktop
            sidebarElement.classList.toggle("collapsed");
             if(sidebarElement.classList.contains("collapsed")){
                 // Jika menjadi collapsed, tutup semua dropdown dan pastikan tinggi 0
                 closeAllDropdowns();
                 document.querySelectorAll(".sidebar .dropdown-menu").forEach(menu => menu.style.height = '0px');
             } else {
                  // Jika menjadi expanded, tutup semua dropdown dan pastikan tinggi 0
                 closeAllDropdowns();
                 document.querySelectorAll(".sidebar .dropdown-menu").forEach(menu => menu.style.height = '0px');
             }
            const newMarginLeft = sidebarElement.classList.contains('collapsed') ? '85px' : '270px';
            mainContentPusher.style.marginLeft = newMarginLeft;
            floatingHeader.style.marginLeft = newMarginLeft;
            sidebarElement.classList.remove("open-mobile"); // Pastikan kelas mobile dihapus di desktop
        }

         // Setelah toggle, perbaiki tinggi dropdown yang terbuka (jika ada)
         const isDesktopMode = window.innerWidth > 768;
         const isSidebarCurrentlyCollapsed = sidebarElement.classList.contains("collapsed");
         if (!isDesktopMode || !isSidebarCurrentlyCollapsed) {
             // Di mode expanded desktop atau mobile, hitung kembali tinggi dropdown yang terbuka
             document.querySelectorAll(".sidebar .dropdown-container.open").forEach(dropdown => {
                 const menu = dropdown.querySelector(".dropdown-menu");
                 if (menu) { // Pastikan hanya yang 'open' yang diperbaiki tingginya
                      menu.style.height = `${menu.scrollHeight}px`;
                 }
             });
         } else {
              // Di mode collapsed desktop, pastikan tinggi dropdown yang terbuka diatur ke 0
              document.querySelectorAll(".sidebar .dropdown-container.open .dropdown-menu").forEach(menu => {
                   menu.style.height = '0px';
              });
         }
    }


    // Periksa keberadaan elemen sebelum menambahkan event listener
    if (sidebarTogglerHeader) {
        sidebarTogglerHeader.addEventListener("click", handleSidebarToggle);
    }
    if (sidebarMenuButtonMobile) {
        sidebarMenuButtonMobile.addEventListener("click", handleSidebarToggle);
    }
     if (sidebarCloseButton) {
        sidebarCloseButton.addEventListener("click", handleSidebarToggle);
    }


    function setInitialLayout() {
        const isMobile = window.innerWidth <= 768;
        const isVerySmallMobile = window.innerWidth <= 480;

        if (isMobile) {
            // Mode mobile: sidebar tertutup secara default, margin konten 0
            sidebarElement.classList.remove("collapsed", "open-mobile");
            mainContentPusher.style.marginLeft = '0px';
            floatingHeader.style.marginLeft = '0px';
            // Tampilkan tombol menu mobile, sembunyikan toggler desktop
            if (sidebarTogglerHeader) sidebarTogglerHeader.style.display = 'none';
            if (sidebarMenuButtonMobile) sidebarMenuButtonMobile.style.display = 'flex';
            // Pastikan semua dropdown tertutup dan tingginya 0
            document.querySelectorAll(".sidebar .dropdown-menu").forEach(menu => menu.style.height = '0px');
            closeAllDropdowns();
            // Atur placeholder pencarian sesuai ukuran mobile
            if (searchInput) searchInput.placeholder = isVerySmallMobile ? "Cari Produk Bangunan" : "Cari kebutuhanmu...";
        } else {
            // Mode desktop: sidebar expanded secara default, margin konten sesuai sidebar width
            sidebarElement.classList.remove("open-mobile"); // Pastikan kelas mobile dihapus
             // Default ke expanded di desktop (atau bisa diubah ke collapsed jika diinginkan)
            sidebarElement.classList.remove('collapsed'); // Hapus collapsed untuk expanded default
            const currentMarginLeft = sidebarElement.classList.contains('collapsed') ? '85px' : '270px'; // Hitung margin berdasarkan state
            mainContentPusher.style.marginLeft = currentMarginLeft;
            floatingHeader.style.marginLeft = currentMarginLeft;
            // Tampilkan toggler desktop, sembunyikan tombol menu mobile
            if (sidebarTogglerHeader) sidebarTogglerHeader.style.display = 'flex';
            if (sidebarMenuButtonMobile) sidebarMenuButtonMobile.style.display = 'none';
            // Pastikan semua dropdown tertutup dan tingginya 0
            document.querySelectorAll(".sidebar .dropdown-menu").forEach(menu => menu.style.height = '0px');
            closeAllDropdowns();
            // Atur placeholder pencarian desktop
             if (searchInput) searchInput.placeholder = "Cari kebutuhanmu di sini...";
        }
    }

    setInitialLayout(); // Panggil saat halaman pertama kali dimuat
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

        // Reset animation for all slides
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
            slides[i].classList.remove("fade"); // Remove fade class before showing
        }
        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1; }
        if (dots.length === slides.length) {
            for (let i = 0; i < dots.length; i++) { dots[i].className = dots[i].className.replace(" active", ""); }
            if (dots[slideIndex - 1]) dots[slideIndex - 1].className += " active";
        }
        if (slides[slideIndex - 1]) {
             slides[slideIndex - 1].style.display = "block";
             slides[slideIndex - 1].classList.add("fade"); // Add fade class to the current slide
        }
        slideTimeout = setTimeout(showSlides, 3000);
    }

    // Panggil showSlides hanya jika ada slides di DOM
    if (document.getElementsByClassName("mySlides").length > 0) {
        showSlides();
    }


    // Header search
    const headerSearchForm = document.getElementById("header-search-form");
    function performHeaderSearch() {
        var searchQuery = searchInput.value;
        if (searchQuery.trim() !== "") {
            // Menggunakan skema action://act/search/ untuk komunikasi dengan native
            var lokasi = "action://act/search/" + encodeURIComponent(searchQuery.trim());
            // console.log("Mencari:", lokasi); // Debugging
            window.location.href = lokasi; // Lakukan navigasi
        } else {
            console.log("Query pencarian kosong.");
             // Opsional: beri tahu pengguna bahwa input kosong atau tampilkan pesan
        }
    }
    if (headerSearchForm) {
        headerSearchForm.addEventListener("submit", function(e){
            e.preventDefault(); // Cegah submit form HTML default
            performHeaderSearch(); // Panggil fungsi pencarian kustom
        });
    }


    // --- KODE BARU UNTUK MODAL KONFIRMASI KUSTOM ---

    // Temukan elemen modal
    const customConfirmModal = document.getElementById('customConfirmModal');
    const modalTitle = customConfirmModal ? customConfirmModal.querySelector('.modal-title') : null;
    const modalMessage = customConfirmModal ? customConfirmModal.querySelector('.modal-message') : null;
    const modalOkButton = customConfirmModal ? customConfirmModal.querySelector('.modal-ok') : null;
    const modalCancelButton = customConfirmModal ? customConfirmModal.querySelector('.modal-cancel') : null;
    const modalCloseButton = customConfirmModal ? customConfirmModal.querySelector('.modal-close-button') : null;

    let currentTargetUrl = ''; // Variabel untuk menyimpan URL sementara

    // Fungsi untuk menampilkan modal
    function showCustomConfirm(title, message, url) {
        // Pastikan semua elemen modal yang diperlukan ada
        if (!customConfirmModal || !modalTitle || !modalMessage || !modalOkButton) {
            console.error("Elemen modal tidak ditemukan. Melakukan navigasi langsung.");
            // Fallback ke navigasi langsung jika modal gagal
            window.location.href = url;
            return;
        }
        modalTitle.textContent = title; // Set judul
        modalMessage.innerHTML = message; // Set pesan
        currentTargetUrl = url; // Simpan URL target

        customConfirmModal.classList.add('show'); // Gunakan kelas untuk tampilan dan transisi
        customConfirmModal.style.display = 'flex'; // Pastikan display diatur untuk perataan tengah flexbox
         // Nonaktifkan scroll body saat modal terbuka (opsional, tergantung kebutuhan)
        // document.body.style.overflow = 'hidden';
    }

    // Fungsi untuk menyembunyikan modal
    function hideCustomConfirm() {
        if (customConfirmModal) {
            customConfirmModal.classList.remove('show');
            // Tunda pengaturan display: none untuk memungkinkan transisi opacity selesai
            setTimeout(() => {
                customConfirmModal.style.display = 'none';
                currentTargetUrl = ''; // Hapus URL yang disimpan
                 // Aktifkan kembali scroll body (opsional)
                // document.body.style.overflow = '';
            }, 300); // Cocokkan delay ini dengan durasi transisi opacity CSS Anda
        }
    }

    // Add event listeners to the "Kategori Populer" links
    // Pilih link di dalam .category-scroll-wrapper dengan class card-link-wrapper
    const categoryLinks = document.querySelectorAll('.category-scroll-wrapper a.card-link-wrapper');

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const modalTitleText = this.dataset.modalTitle; // Ambil judul dari data attribute
            const modalMessageText = this.dataset.modalMessage; // Ambil pesan dari data attribute
            const targetUrl = this.href; // Ambil URL tujuan dari href link

            // Periksa apakah atribut data dan href ada
            if (modalTitleText && modalMessageText && targetUrl) {
                event.preventDefault(); // Cegah navigasi link default
                showCustomConfirm(modalTitleText, modalMessageText, targetUrl); // Tampilkan modal kustom
            }
            // Jika atribut/href hilang, navigasi default akan terjadi (karena preventDefault tidak dipanggil)
        });
    });

    // Event listeners untuk tombol modal (OK, Batal, Tutup, Backdrop)
    // Kode ini tetap sama dan diposisikan di bawah definisi fungsi show/hide
    // dan di atas penutup DOMContentLoaded listener.
    if (modalOkButton) {
        modalOkButton.addEventListener('click', function() {
            if (currentTargetUrl) {
                window.location.href = currentTargetUrl; // Navigasi ke URL yang disimpan
            }
            hideCustomConfirm(); // Sembunyikan modal
        });
    }

    if (modalCancelButton) {
        modalCancelButton.addEventListener('click', hideCustomConfirm);
    }
    if (modalCloseButton) {
        modalCloseButton.addEventListener('click', hideCustomConfirm);
    }

    if (customConfirmModal) {
        customConfirmModal.addEventListener('click', function(event) {
            if (event.target === customConfirmModal) {
                hideCustomConfirm();
            }
        });
    }

    // --- AKHIR KODE MODAL KONFIRMASI KUSTOM ---


    // Close sidebar on click outside (logic yang sudah ada)
    document.addEventListener('click', function(event) {
        const isMobile = window.innerWidth <= 768;
        if (sidebarElement && sidebarMenuButtonMobile) { // Periksa keberadaan elemen sebelum menggunakan
            if (sidebarElement.classList.contains('open-mobile') && isMobile) {
                const clickedInsideSidebar = sidebarElement.contains(event.target);
                const clickedOnMobileToggler = sidebarMenuButtonMobile.contains(event.target);
                if (!clickedInsideSidebar && !clickedOnMobileToggler) {
                    handleSidebarToggle(); // Tutup sidebar mobile jika klik di luar
                }
            }
        }
         // Logika menutup dropdown di desktop collapsed saat klik di luar sidebar
         const isDesktop = window.innerWidth > 768;
         if (sidebarElement && isDesktop && sidebarElement.classList.contains('collapsed')) {
             const clickedInsideSidebar = sidebarElement.contains(event.target);
             // Jika klik di luar sidebar dan bukan di dalam menu dropdown popup (CSS handle hover state)
             // Logic ini mungkin sedikit berlebihan jika CSS hover sudah menangani,
             // tapi bisa berguna sebagai fallback atau untuk menutup saat klik
             if (!clickedInsideSidebar) {
                closeAllDropdowns(); // Tutup semua dropdown
             }
         }
    });
});