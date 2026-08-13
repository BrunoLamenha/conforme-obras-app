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

// Tela intermediária do fluxo de Vistoria (Estrutural vs Arquitetônico) sem descrições
function carregarFasesObra(nomeObra) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>${nomeObra}</h1>
            <p>Escolha a frente de serviço</p>
        </header>
        <main class="menu-inicial">
            <button class="btn-primary" onclick="alert('Abrindo módulo Estrutural')">
                <h2>ESTRUTURAL</h2>
            </button>
            <button class="btn-primary" onclick="alert('Abrindo módulo Arquitetônico')">
                <h2>ARQUITETÔNICO</h2>
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
