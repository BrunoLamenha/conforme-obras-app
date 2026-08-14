// js/components/wizard.js

export class Wizard {
    constructor() {
        this.selectedCategory = null;
        this.selectedStage = null;

        // Elementos DOM
        this.categoryButtons = document.querySelectorAll('#category-selection-container [data-category]');
        this.stageButtons = document.querySelectorAll('#stage-selection-container [data-stage]');
        this.btnRevistoria = document.getElementById('btn-stage-rev');
        this.infoText = document.getElementById('stage-info-text');

        this.init();
    }

    init() {
        // Ouvintes para botões de Tipo de Vistoria
        this.categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                this.setCategory(category, btn);
            });
        });

        // Ouvintes para botões de Etapa da Vistoria
        this.stageButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const stage = btn.getAttribute('data-stage');
                this.setStage(stage, btn);
            });
        });
    }

    setCategory(category, buttonElement) {
        this.selectedCategory = category;

        // Remove classe ativa dos outros botões de categoria
        this.categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Adiciona classe ativa no botão clicado
        buttonElement.classList.add('active');

        // Regra de Negócio: Exemplo de exibição do botão de Revistoria condicional
        if (category === 'Reforma / Aditivo') {
            this.btnRevistoria.classList.remove('hidden');
        } else {
            this.btnRevistoria.classList.add('hidden');
            // Se o usuário já tinha selecionado revistoria e mudou a categoria, reseta a etapa
            if (this.selectedStage === 'Revistoria') {
                this.resetStage();
            }
        }

        this.updateInfo();
    }

    setStage(stage, buttonElement) {
        this.selectedStage = stage;

        // Remove classe ativa dos outros botões de etapa
        this.stageButtons.forEach(btn => btn.classList.remove('active'));
        // Adiciona classe ativa no botão clicado
        buttonElement.classList.add('active');

        this.updateInfo();
    }

    resetStage() {
        this.selectedStage = null;
        this.stageButtons.forEach(btn => btn.classList.remove('active'));
    }

    updateInfo() {
        if (this.selectedCategory && this.selectedStage) {
            this.infoText.textContent = `Configurado: ${this.selectedCategory} ➔ ${this.selectedStage}`;
        } else if (this.selectedCategory) {
            this.infoText.textContent = `Selecionado: ${this.selectedCategory} (Aguardando Etapa)`;
        } else {
            this.infoText.textContent = '';
        }
    }
}

