// Função principal de navegação baseada no fluxograma
function navegar(destino) {
    const container = document.querySelector('.container');

    if (destino === 'vistoria') {
        container.innerHTML = `
            <header>
                <h1>VISTORIA</h1>
                <p>Selecione o empreendimento e a fase</p>
            </header>
            <main class="menu-inicial">
                <button class="btn-primary" onclick="carregarFasesObra('Empreendimento Exemplo A')">
                    <h2>📁 Empreendimento Exemplo A</h2>
                    <span>Clique para escolher a frente de serviço</span>
                </button>
                <button class="btn-primary" onclick="carregarFasesObra('Empreendimento Exemplo B')">
                    <h2>📁 Empreendimento Exemplo B</h2>
                    <span>Clique para escolher a frente de serviço</span>
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
                <button class="btn-primary" onclick="alert('Abrir lista para editar obras existentes')">
                    <h2>ESCOLHER DA LISTA</h2>
                    <span>Gerenciar pavimentos, tipologias e checklists</span>
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
            <p>Escolha o módulo de inspeção</p>
        </header>
        <main class="menu-inicial">
            <button class="btn-primary" onclick="alert('Abrindo módulo Estrutural: Concreto, Estacas, Insumos e XML')">
                <h2>ESTRUTURAL</h2>
                <span>Controle de estacas, concretagem e notas fiscais</span>
            </button>
            <button class="btn-primary" onclick="alert('Abrindo módulo Arquitetônico: Pavimentos e Áreas')">
                <h2>ARQUITETÔNICO</h2>
                <span>Lista de pavimentos, área comum e privativa (Apto)</span>
            </button>
            <button class="btn-secondary" onclick="navegar('vistoria')" style="margin-top: 20px; text-align: center;">
                ⬅ Voltar aos Empreendimentos
            </button>
        </main>
    `;
}

// Retorna para a tela inicial
function voltarInicio() {
    location.reload(); 
}
