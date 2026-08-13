// Função principal de navegação baseada no fluxograma
function navegar(destino) {
    const container = document.querySelector('.container');

    if (destino === 'vistoria') {
        container.innerHTML = `
            <header>
                <h1>CONFORME OBRAS</h1>
                <p>Selecione o empreendimento</p>
            </header>
            <main class="menu-inicial">
                <button class="btn-primary" onclick="carregarFasesObra('ZOE')">
                    <h2>📁 ZOE</h2>
                </button>
                <button class="btn-primary" onclick="carregarFasesObra('NAOKI')">
                    <h2>📁 NAOKI</h2>
                </button>
                <button class="btn-primary" onclick="carregarFasesObra('ZEUS')">
                    <h2>📁 ZEUS</h2>
                </button>
                <button class="btn-primary" onclick="carregarFasesObra('GRAND GARDEN')">
                    <h2>📁 GRAND GARDEN</h2>
                </button>
                <button class="btn-primary" onclick="carregarFasesObra('ZEN LIFE')">
                    <h2>📁 ZEN LIFE</h2>
                </button>
                <button class="btn-primary btn-back" onclick="voltarInicio()" style="margin-top: 10px;">
                    <h2>⬅ Voltar ao Início</h2>
                </button>
            </main>
        `;
    } else if (destino === 'cadastros') {
        container.innerHTML = `
            <header>
                <h1>CONFORME OBRAS</h1>
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
                <button class="btn-primary btn-back" onclick="voltarInicio()" style="margin-top: 10px;">
                    <h2>⬅ Voltar ao Início</h2>
                </button>
            </main>
        `;
    }
}

// Tela intermediária do fluxo de Vistoria (Filtra o Estrutural apenas para Grand Garden e Zen Life)
function carregarFasesObra(nomeObra) {
    const container = document.querySelector('.container');
    
    let botoesFases = '';

    if (nomeObra === 'GRAND GARDEN' || nomeObra === 'ZEN LIFE') {
        botoesFases += `
            <button class="btn-primary" onclick="carregarEstrutural('${nomeObra}')">
                <h2>ESTRUTURAL</h2>
            </button>
        `;
    }

    botoesFases += `
        <button class="btn-primary" onclick="carregarListaPavimentos('${nomeObra}')">
            <h2>ARQUITETÔNICO</h2>
        </button>
        <button class="btn-primary btn-back" onclick="navegar('vistoria')" style="margin-top: 10px;">
            <h2>⬅ Voltar aos Empreendimentos</h2>
        </button>
    `;

    container.innerHTML = `
        <header>
            <h1>CONFORME OBRAS</h1>
            <p>${nomeObra} - Escolha a frente de serviço</p>
        </header>
        <main class="menu-inicial">
            ${botoesFases}
        </main>
    `;
}

// Fluxo Específico do Estrutural para Grand Garden e Zen Life
function carregarEstrutural(nomeObra) {
    const container = document.querySelector('.container');
    let botoesItens = '';

    if (nomeObra === 'ZEN LIFE') {
        botoesItens += `
            <button class="btn-primary" onclick="alert('Abrindo Fundações e Supraestrutura')">
                <h2>FUNDAÇÕES E SUPRAESTRUTURA</h2>
            </button>
        `;
    }

    botoesItens += `
        <button class="btn-primary" onclick="alert('Abrindo Subsolo')">
            <h2>SUBSOLO</h2>
        </button>
        <button class="btn-primary" onclick="alert('Abrindo Pilotis')">
            <h2>PILOTIS</h2>
        </button>
        <button class="btn-primary" onclick="alert('Abrindo 1º Pavimento')">
            <h2>1º PAVIMENTO</h2>
        </button>
        <button class="btn-primary" onclick="alert('Abrindo 2º Pavimento')">
            <h2>2º PAVIMENTO</h2>
        </button>
        <button class="btn-primary" onclick="alert('Abrindo 3º Pavimento')">
            <h2>3º PAVIMENTO</h2>
        </button>
        <button class="btn-primary" onclick="alert('Abrindo 4º Pavimento')">
            <h2>4º PAVIMENTO</h2>
        </button>
        <button class="btn-primary" onclick="alert('Abrindo 4º Pavimento Mezanino')">
            <h2>4º PAVIMENTO MEZANINO</h2>
        </button>
        <button class="btn-primary" onclick="alert('Abrindo Cobertura')">
            <h2>COBERTURA</h2>
        </button>
        <button class="btn-primary" onclick="alert('Abrindo Coberta')">
            <h2>COBERTA</h2>
        </button>
        <button class="btn-primary btn-back" onclick="carregarFasesObra('${nomeObra}')" style="margin-top: 10px;">
            <h2>⬅ Voltar às Fases</h2>
        </button>
    `;

    container.innerHTML = `
        <header>
            <h1>CONFORME OBRAS</h1>
            <p>${nomeObra} - Estrutural</p>
        </header>
        <main class="menu-inicial">
            ${botoesItens}
        </main>
    `;
}

// Fluxo Arquitetônico: Lista de Pavimentos
function carregarListaPavimentos(nomeObra) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>CONFORME OBRAS</h1>
            <p>${nomeObra} - Lista de Pavimentos</p>
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
            <button class="btn-primary btn-back" onclick="carregarFasesObra('${nomeObra}')" style="margin-top: 10px;">
                <h2>⬅ Voltar às Fases</h2>
            </button>
        </main>
    `;
}

// Escolha entre Área Comum e Área Privativa
function carregarTipoArea(nomeObra, pavimento) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>CONFORME OBRAS</h1>
            <p>${nomeObra} - ${pavimento} - Selecione a área</p>
        </header>
        <main class="menu-inicial">
            <button class="btn-primary" onclick="alert('Abrindo Checklist de Área Comum para ${pavimento}')">
                <h2>ÁREA COMUM</h2>
            </button>
            <button class="btn-primary" onclick="carregarListaApartamentos('${nomeObra}', '${pavimento}')">
                <h2>ÁREA PRIVATIVA</h2>
            </button>
            <button class="btn-primary btn-back" onclick="carregarListaPavimentos('${nomeObra}')" style="margin-top: 10px;">
                <h2>⬅ Voltar aos Pavimentos</h2>
            </button>
        </main>
    `;
}

// Lista de Apartamentos / Unidades na Área Privativa
function carregarListaApartamentos(nomeObra, pavimento) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>CONFORME OBRAS</h1>
            <p>${nomeObra} - ${pavimento} - Selecione a Unidade (Apto)</p>
        </header>
        <main class="menu-inicial">
            <button class="btn-primary" onclick="alert('Abrindo Vistoria/Checklist do Apartamento 101')">
                <h2>APTO 101</h2>
            </button>
            <button class="btn-primary" onclick="alert('Abrindo Vistoria/Checklist do Apartamento 102')">
                <h2>APTO 102</h2>
            </button>
            <button class="btn-primary btn-back" onclick="carregarTipoArea('${nomeObra}', '${pavimento}')" style="margin-top: 10px;">
                <h2>⬅ Voltar às Áreas</h2>
            </button>
        </main>
    `;
}

// Retorna para a tela inicial
function voltarInicio() {
    location.reload(); 
}
