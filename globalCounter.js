class GlobalViewCounter {
    constructor() {
        this.storageKey = 'globalPageViews';
        this.initializeCounter();
        this.setupAutoRefresh(); // Agregar actualización automática
    }

    initializeCounter() {
        // Obtener las vistas globales almacenadas
        let views = localStorage.getItem(this.storageKey);
        
        if (!views) {
            views = 0;
        } else {
            views = parseInt(views);
        }

        // Incrementar el contador global
        views++;
        
        // Guardar el nuevo valor
        localStorage.setItem(this.storageKey, views);
        
        // Actualizar el display
        this.updateDisplay(views);
    }

    updateDisplay(count) {
        const viewCountElement = document.getElementById('viewCount');
        if (viewCountElement) {
            // Formatear el número para mejor lectura
            viewCountElement.textContent = new Intl.NumberFormat('es-MX').format(count);
        }
    }

    setupAutoRefresh() {
        // Actualizar cada 30 segundos
        this.refreshInterval = setInterval(() => {
            this.updateCounter();
        }, 30000);

        // Agregar listener para cuando la página pierde el foco
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pausar la actualización cuando la página no está visible
                clearInterval(this.refreshInterval);
            } else {
                // Reanudar la actualización y actualizar inmediatamente
                this.updateCounter();
                this.setupAutoRefresh();
            }
        });
    }

    updateCounter() {
        // Obtener el valor actual
        let views = localStorage.getItem(this.storageKey);
        views = views ? parseInt(views) : 0;
        
        // Actualizar el display
        this.updateDisplay(views);
    }

    // Limpiar el intervalo cuando se destruye la instancia
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

// Inicializar el contador cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new GlobalViewCounter();
    
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    let isMenuVisible = true;

    document.addEventListener('click', (e) => {
        // Lista de selectores a ignorar
        const ignoreElements = [
            '.component-card',
            '.info-btn',
            '.modal-overlay',
            '.modal-content',
            '.comments-section',
            '.comment-form',
            'button',
            'input',
            'textarea'
        ];

        // Verificar si el clic fue en un elemento que debemos ignorar
        const shouldIgnore = ignoreElements.some(selector => 
            e.target.closest(selector) !== null
        );

        // Si no debemos ignorar el clic y no fue dentro del sidebar
        if (!shouldIgnore && !sidebar.contains(e.target)) {
            toggleMenu();
        }
    });

    // Evitar que los clics dentro del sidebar cierren el menú
    sidebar.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    function toggleMenu() {
        isMenuVisible = !isMenuVisible;
        sidebar.classList.toggle('hidden', !isMenuVisible);
        content.classList.toggle('expanded', !isMenuVisible);
    }
});