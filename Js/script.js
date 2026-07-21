function abrirProjeto(url) {
    window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', function () {
    var track    = document.getElementById('carouselTrack');
    var prevBtn  = document.getElementById('prevBtn');
    var nextBtn  = document.getElementById('nextBtn');

    if (!track) return;

    var wrapper = track.parentElement; // .carousel-wrapper (overflow:hidden)
    var cards   = Array.from(track.querySelectorAll('.project-card'));
    var GAP     = 24;
    var current = 0;
    var cardW   = 0;

    function getVisible() {
        var w = wrapper.offsetWidth;
        if (w < 600) return 1;
        if (w < 900) return 2;
        return 3;
    }

    function setup() {
        var visible = getVisible();
        // Largura de cada card = (wrapper - gaps entre cards visíveis) / nº de cards visíveis
        cardW = (wrapper.offsetWidth - GAP * (visible - 1)) / visible;

        // Aplica largura diretamente em cada card via inline style
        cards.forEach(function(c) {
            c.style.flexBasis = cardW + 'px';
            c.style.width     = cardW + 'px';
            c.style.minWidth  = cardW + 'px'; // garante que não encolhe
            c.style.maxWidth  = cardW + 'px';
        });

        current = 0;
        updateButtons();
        applyTransform();
    }

    function applyTransform() {
        // offset = índice do primeiro card visível × (largura do card + gap)
        var offset = current * (cardW + GAP);
        track.style.transform = 'translateX(-' + offset + 'px)';
    }

    function updateButtons() {
        var visible = getVisible();
        prevBtn.disabled = (current === 0);
        nextBtn.disabled = (current >= cards.length - visible);
    }

    function goTo(page) {
        var visible = getVisible();
        current = page * visible;
        current = Math.max(0, Math.min(current, cards.length - visible));
        applyTransform();
        updateButtons();
    }

    prevBtn.addEventListener('click', function () {
        var visible = getVisible();
        if (current > 0) {
            current = Math.max(0, current - visible);
            applyTransform();
            updateButtons();
        }
    });

    nextBtn.addEventListener('click', function () {
        var visible = getVisible();
        if (current < cards.length - visible) {
            current = Math.min(cards.length - visible, current + visible);
            applyTransform();
            updateButtons();
        }
    });

    // Swipe mobile
    var startX = 0;
    track.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextBtn.click();
            else prevBtn.click();
        }
    }, { passive: true });

    // Resize: recalcula tudo
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setup, 200);
    });

    // Init: dois frames para o browser renderizar fontes e layout
    requestAnimationFrame(function () {
        requestAnimationFrame(setup);
    });
});