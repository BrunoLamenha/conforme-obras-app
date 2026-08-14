// js/app.js

import { Router } from './router.js';
import { Wizard } from './components/wizard.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o roteador do sistema
    const router = new Router();

    // Inicializa os componentes do Wizard de Vistoria
    const wizard = new Wizard();

    console.log('Sistema "Conforme Obras" inicializado com sucesso modularmente.');
});
