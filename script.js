// Função principal de navegação baseada no fluxograma
function navegar(destino) {
    const container = document.querySelector('.container');

    if (destino === 'vistoria') {
        container.innerHTML = `
            <header>
                <h1>VISTORIA</h1>
                <p>Selecione o empreendimento</p>
            </header>
            <main class="menu-inicial">
                <button class="btn-primary" onclick="carregarFasesObra('Empreendimento Exemplo A')">
                    <h2>📁 Empreendimento Exemplo A</h2>
                </button>
                <button class="btn-primary" onclick="carregarFasesObra('Empreendimento Exemplo B')">
                    <h2>📁 Empreendimento Exemplo B</h2>
                </button>
                <button class="btn-secondary" onclick="voltarInicio()" style="margin-top: 20px; text-align: center;">
                    ⬅ Voltar ao Início
                </button>
            </main>
        `;
    } else if (destino === 'cadastros') {
        container.innerHTML = `
            <header>
                <h1>CADASTROS</h1>
                <p>Gerenciamento de Obras</p>
            </header>
            <main class="menu-inicial">
                <button class="btn-primary" onclick="alert('Abrir lista para gerenciar pavimentos, tipologias e checklists')">
                    <h2>ESCOLHER DA LISTA</h2>
                </button>
                <button class="btn-secondary" onclick="alert('Iniciar Wizard de Cadastro de Novo Empreendimento')">
                    <h2>CADASTRAR UM NOVO EMPREENDIMENTO</h2>
                    <span>Passo a passo: pavimentos, unidades e regras</span>
                </button>
                <button class="btn-secondary" onclick="voltarInicio()" style="margin-top: 20px; text-align: center;">
                    ⬅ Voltar ao Início
                </button>
            </main>
        `;
    }
}

// Tela intermediária do fluxo de Vistoria (Estrutural vs Arquitetônico)
function carregarFasesObra(nomeObra) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>${nomeObra}</h1>
            <p>Escolha a frente de serviço</p>
        </header>
        <main class="menu-inicial">
            <button class="btn-primary" onclick="alert('Abrindo módulo Estrutural: Concreto, Estacas, Insumos e XML')">
                <h2>ESTRUTURAL</h2>
            </button>
            <button class="btn-primary" onclick="carregarListaPavimentos('${nomeObra}')">
                <h2>ARQUITETÔNICO</h2>
            </button>
            <button class="btn-secondary" onclick="navegar('vistoria')" style="margin-top: 20px; text-align: center;">
                ⬅ Voltar aos Empreendimentos
            </button>
        </main>
    `;
}

// Fluxo Arquitetônico: Lista de Pavimentos
function carregarListaPavimentos(nomeObra) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>${nomeObra}</h1>
            <p>Lista de Pavimentos</p>
        </header>
        <main class="menu-inicial">
            <button class="btn-primary" onclick="carregarTipoArea('${nomeObra}', 'Térreo')">
                <h2>TÉRREO</h2>
            </button>
            <button class="btn-primary" onclick="carregarTipoArea('${nomeObra}', '1º Pavimento Tipo')">
                <h2>1º PAVIMENTO TIPO</h2>
            </button>
            <button class="btn-primary" onclick="carregarTipoArea('${nomeObra}', 'Cobertura')">
                <h2>COBERTURA</h2>
            </button>
            <button class="btn-secondary" onclick="carregarFasesObra('${nomeObra}')" style="margin-top: 20px; text-align: center;">
                ⬅ Voltar às Fases
            </button>
        </main>
    `;
}

// Escolha entre Área Comum e Área Privativa
function carregarTipoArea(nomeObra, pavimento) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>${nomeObra} - ${pavimento}</h1>
            <p>Selecione a área</p>
        </header>
        <main class="menu-inicial">
            <button class="btn-primary" onclick="alert('Abrindo Checklist de Área Comum para ${pavimento}')">
                <h2>ÁREA COMUM</h2>
            </button>
            <button class="btn-primary" onclick="carregarListaApartamentos('${nomeObra}', '${pavimento}')">
                <h2>ÁREA PRIVATIVA</h2>
            </button>
            <button class="btn-secondary" onclick="carregarListaPavimentos('${nomeObra}')" style="margin-top: 20px; text-align: center;">
                ⬅ Voltar aos Pavimentos
            </button>
        </main>
    `;
}

// Lista de Apartamentos / Unidades na Área Privativa
function carregarListaApartamentos(nomeObra, pavimento) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>${nomeObra} - ${pavimento}</h1>
            <p>Selecione a Unidade (Apto)</p>
        </header>
        <main class="menu-inicial">
            <button class="btn-primary" onclick="alert('Abrindo Vistoria/Checklist do Apartamento 101')">
                <h2>APTO 101</h2>
            </button>
            <button class="btn-primary" onclick="alert('Abrindo Vistoria/Checklist do Apartamento 102')">
                <h2>APTO 102</h2>
            </button>
            <button class="btn-secondary" onclick="carregarTipoArea('${nomeObra}', '${pavimento}')" style="margin-top: 20px; text-align: center;">
                ⬅ Voltar às Áreas
            </button>
        </main>
    `;
}

// Retorna para a tela inicial
function voltarInicio() {
    location.reload(); 
}
