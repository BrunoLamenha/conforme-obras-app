// js/router.js

export class Router {
    constructor() {
        this.menuScreen = document.getElementById('screen-menu');
        this.wizardScreen = document.getElementById('screen-wizard');
        this.init();
    }

    init() {
        const menuCards = document.querySelectorAll('.card-menu');
        
        menuCards.forEach(card => {
            card.addEventListener('click', () => {
                const target = card.getAttribute('data-target');
                this.navegar(target);
            });
        });
    }

    navegar(tela) {
        // Oculta todas as telas primeiro
        this.menuScreen.classList.add('hidden');
        this.wizardScreen.classList.add('hidden');

        // Exibe a tela selecionada
        if (tela === 'vistoria') {
            this.wizardScreen.classList.remove('hidden');
        } else if (tela === 'cadastros') {
            // Se você criar uma tela de cadastro no futuro, trate-a aqui
            console.log('Abrindo tela de cadastros...');
        } else {
            // Voltar para o menu principal caso passe um valor vazio ou 'menu'
            this.menuScreen.classList.remove('hidden');
        }
    }
}
