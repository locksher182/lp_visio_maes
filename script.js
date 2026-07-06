/**
 * LANDING PAGE "TESTE 360° VISIONÁRIOS" - COMPORTAMENTO E INTERATIVIDADE (MÃES)
 */

document.addEventListener("DOMContentLoaded", () => {
    // === 1. COMPORTAMENTO DO HEADER NO SCROLL ===
    const mainHeader = document.getElementById("mainHeader");
    const handleScroll = () => {
        mainHeader.classList.toggle("scrolled", window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // === 2. MENU MOBILE COM SUPORTE A ESCAPE E ARIA-EXPANDED (a11y) ===
    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.getElementById("mobileNav");
    const mobileLinks = document.querySelectorAll(".mobile-nav-item");

    const toggleMenu = () => {
        const isOpen = mobileNav.classList.toggle("active");
        menuToggle.classList.toggle("open", isOpen);
        menuToggle.setAttribute("aria-expanded", isOpen);
        if (isOpen) {
            // Foca no primeiro item do menu mobile para navegação via teclado
            mobileLinks[0]?.focus();
        }
    };

    menuToggle.addEventListener("click", toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (mobileNav.classList.contains("active")) {
                toggleMenu();
            }
        });
    });

    // Fechar menu mobile ao pressionar Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobileNav.classList.contains("active")) {
            toggleMenu();
            menuToggle.focus();
        }
    });

    // === 3. CARROSSEL DE DEPOIMENTOS EM 3D COM TECLADO E ARMAZENAMENTO ===
    const depoimentosGrid = document.getElementById("depoimentosGrid");
    const cards = document.querySelectorAll(".testimonial-card");
    const dots = document.querySelectorAll(".carousel-indicators .dot");
    const prevBtn = document.getElementById("carouselPrevBtn");
    const nextBtn = document.getElementById("carouselNextBtn");
    const viewportWrapper = document.querySelector(".carousel-viewport-wrapper");
    
    let currentSlide = 0;
    const totalSlides = cards.length;
    let touchStartX = 0;
    let touchEndX = 0;
    let autoplayTimer = null;

    // Atualiza a posição e efeitos 3D dos cards de depoimento
    const updateCarousel = () => {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            depoimentosGrid.style.transform = `translateX(-${currentSlide * 100}%)`;
            cards.forEach(card => {
                card.classList.remove("active", "prev-card", "next-card", "hidden-card");
            });
        } else {
            depoimentosGrid.style.transform = "none";
            cards.forEach((card, idx) => {
                card.classList.remove("active", "prev-card", "next-card", "hidden-card");

                if (idx === currentSlide) {
                    card.classList.add("active");
                } else if (idx === (currentSlide + 1) % totalSlides) {
                    card.classList.add("next-card");
                } else if (idx === (currentSlide - 1 + totalSlides) % totalSlides) {
                    card.classList.add("prev-card");
                } else {
                    card.classList.add("hidden-card");
                }
            });
        }

        // Atualiza a classe ativa nos indicadores (dots) e atributos aria-selected
        dots.forEach((dot, idx) => {
            dot.classList.toggle("active", idx === currentSlide);
            dot.setAttribute("aria-selected", idx === currentSlide);
        });
    };

    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        resetAutoplay();
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
        resetAutoplay();
    };

    const startAutoplay = () => {
        if (!autoplayTimer) {
            autoplayTimer = setInterval(nextSlide, 5000);
        }
    };

    const stopAutoplay = () => {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    };

    const resetAutoplay = () => {
        stopAutoplay();
        startAutoplay();
    };

    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);

    cards.forEach((card, index) => {
        card.addEventListener("click", () => {
            if (window.innerWidth > 768 && index !== currentSlide) {
                currentSlide = index;
                updateCarousel();
                resetAutoplay();
            }
        });
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            currentSlide = index;
            updateCarousel();
            resetAutoplay();
        });
    });

    if (viewportWrapper) {
        viewportWrapper.addEventListener("mouseenter", stopAutoplay);
        viewportWrapper.addEventListener("mouseleave", startAutoplay);
        
        // Suporte para navegação via teclado usando as setas esquerda e direita
        viewportWrapper.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") {
                prevSlide();
            } else if (e.key === "ArrowRight") {
                nextSlide();
            }
        });
    }

    depoimentosGrid.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    depoimentosGrid.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            nextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            prevSlide();
        }
    };

    updateCarousel();
    startAutoplay();

    // Redimensionamento com debounce
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateCarousel, 150);
    });

    // === 4. MÁSCARA DINÂMICA DE WHATSAPP COM PRESERVAÇÃO DE CARET/DELEÇÃO ===
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener("input", (e) => {
            let cursorPosition = e.target.selectionStart;
            let originalValue = e.target.value;
            let cleanValue = originalValue.replace(/\D/g, "");
            
            if (cleanValue.startsWith("55") && cleanValue.length > 10) {
                cleanValue = cleanValue.slice(2);
            }
            
            if (cleanValue.length > 11) cleanValue = cleanValue.slice(0, 11);
            
            let formattedValue = "";
            if (cleanValue.length > 0) {
                formattedValue += `(${cleanValue.slice(0, 2)}`;
            }
            if (cleanValue.length > 2) {
                formattedValue += `) ${cleanValue.slice(2, 7)}`;
            }
            if (cleanValue.length > 7) {
                formattedValue += `-${cleanValue.slice(7, 11)}`;
            }
            
            e.target.value = formattedValue;
            
            // Corrige cursor para não pular para o fim em deleções do meio
            if (originalValue.length > formattedValue.length && cursorPosition < originalValue.length) {
                e.target.setSelectionRange(cursorPosition, cursorPosition);
            }
        });
    }

    // === 5. FORMULÁRIO COM FEEDBACK DE ACESSIBILIDADE ===
    const leadForm = document.getElementById("leadForm");
    const formFeedback = document.getElementById("formFeedback");
    const formSubmitBtn = document.getElementById("formSubmitBtn");

    if (leadForm && formFeedback && formSubmitBtn) {
        leadForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            formSubmitBtn.disabled = true;
            const originalText = formSubmitBtn.innerText;
            formSubmitBtn.innerHTML = '<span class="spinner-loader"></span> Processando...';
            
            setTimeout(() => {
                formFeedback.style.display = "block";
                formFeedback.className = "form-feedback-message success";
                formFeedback.setAttribute("role", "alert"); // Leitor de tela anuncia sucesso na hora
                formFeedback.innerHTML = "<strong>Cadastro Realizado!</strong> Mapeamento iniciado. Redirecionando para o questionário...";
                
                formSubmitBtn.innerText = "Sucesso!";
                
                setTimeout(() => {
                    formFeedback.innerHTML = "Redirecionando...";
                    leadForm.reset();
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerText = originalText;
                }, 2500);
                
            }, 1500);
        });
    }

    // === 6. LIGHTBOX MODAL PARA IMAGENS DA GALERIA ===
    const doresImages = document.querySelectorAll(".dores-gallery-item img");
    const imageLightbox = document.getElementById("imageLightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");

    if (doresImages.length > 0 && imageLightbox && lightboxImage && lightboxClose) {
        doresImages.forEach(img => {
            img.addEventListener("click", () => {
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
                imageLightbox.classList.add("active");
                imageLightbox.setAttribute("aria-hidden", "false");
                document.body.style.overflow = "hidden"; // Desativa scroll da página
            });
        });

        const closeLightbox = () => {
            imageLightbox.classList.remove("active");
            imageLightbox.setAttribute("aria-hidden", "true");
            document.body.style.overflow = ""; // Reativa scroll da página
            setTimeout(() => { lightboxImage.src = ""; }, 300); // Limpa src após transição
        };

        lightboxClose.addEventListener("click", closeLightbox);
        
        // Fechar ao clicar fora da imagem (no fundo escuro do modal)
        imageLightbox.addEventListener("click", (e) => {
            if (e.target === imageLightbox) {
                closeLightbox();
            }
        });

        // Fechar ao pressionar tecla ESC
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && imageLightbox.classList.contains("active")) {
                closeLightbox();
            }
        });
    }
});
