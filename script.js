// Dados padrão iniciais
let empreendimentosPadrao = [
    { nome: 'ZOE', pavimentos: ['Térreo', '1º Pavimento Tipo', 'Cobertura'], unidadesPorPavimento: 2, tipologia: { tipo: '2 Quartos' }, fechamentoInterno: 'Drywall' },
    { nome: 'NAOKI', pavimentos: ['Térreo', '1º Pavimento Tipo', 'Cobertura'], unidadesPorPavimento: 2, tipologia: { tipo: 'Studio' }, fechamentoInterno: 'Drywall' },
    { nome: 'ZEUS', pavimentos: ['Térreo', '1º Pavimento Tipo', 'Cobertura'], unidadesPorPavimento: 2, tipologia: { tipo: '3 Quartos' }, fechamentoInterno: 'Alvenaria' },
    { nome: 'GRAND GARDEN', pavimentos: ['Térreo', '1º Pavimento Tipo', 'Cobertura'], unidadesPorPavimento: 4, tipologia: { tipo: '2 Quartos' }, fechamentoInterno: 'Drywall' },
    { nome: 'ZEN LIFE', pavimentos: ['Térreo', '1º Pavimento Tipo', 'Cobertura'], unidadesPorPavimento: 4, tipologia: { tipo: 'Quarto e Sala' }, fechamentoInterno: 'Drywall' }
];

// Funções de Gerenciamento de Estado (LocalStorage)
function obterEmpreendimentos() {
    const salvo = localStorage.getItem('conformeObra_empreendimentos');
    if (salvo) {
        return JSON.parse(salvo);
    }
    localStorage.setItem('conformeObra_empreendimentos', JSON.stringify(empreendimentosPadrao));
    return empreendimentosPadrao;
}

function salvarEmpreendimentos(lista) {
    localStorage.setItem('conformeObra_empreendimentos', JSON.stringify(lista));
}

// Objeto temporário para armazenar os dados do cadastro em andamento
let novoEmpreendimentoTemp = {
    nome: '',
    pavimentos: [],
    unidadesPorPavimento: 2,
    tipologia: {},
    fechamentoInterno: ''
};

// Função principal de navegação baseada no fluxograma
function navegar(destino) {
    const container = document.querySelector('.container');
    const lista = obterEmpreendimentos();

    if (destino === 'vistoria') {
        let botoesObras = '';
        lista.forEach(obra => {
            botoesObras += `
                <button class="btn-primary" onclick="carregarFasesObra('${obra.nome}')">
                    <h2>📁 ${obra.nome}</h2>
                </button>
            `;
        });

        container.innerHTML = `
            <header>
                <img src="logo.png" alt="Conforme Obra" class="logo-img">
                <h1>CONFORME OBRA</h1>
                <p>Selecione o empreendimento</p>
            </header>
            <main class="menu-inicial">
                ${botoesObras}
                <button class="btn-primary btn-back" onclick="voltarInicio()" style="margin-top: 10px;">
                    <h2>⬅ Voltar ao Início</h2>
                </button>
            </main>
        `;
    } else if (destino === 'cadastros') {
        container.innerHTML = `
            <header>
                <img src="logo.png" alt="Conforme Obra" class="logo-img">
                <h1>CONFORME OBRA</h1>
                <p>Gerenciamento de Obras</p>
            </header>
            <main class="menu-inicial">
                <button class="btn-primary" onclick="carregarListaCadastro()">
                    <h2>ESCOLHER DA LISTA</h2>
                    <span>Gerenciar empreendimentos já cadastrados</span>
                </button>
                <button class="btn-secondary" onclick="iniciarWizardCadastro()">
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

// ================= GERENCIAR ESCOLHA DA LISTA =================

function carregarListaCadastro() {
    const container = document.querySelector('.container');
    const lista = obterEmpreendimentos();
    let botoesObras = '';
    
    lista.forEach(obra => {
        botoesObras += `
            <button class="btn-primary" onclick="gerenciarEmpreendimento('${obra.nome}')">
                <h2>📁 ${obra.nome}</h2>
                <span>Tipologia: ${obra.tipologia?.tipo || 'Padrão'} | Unidades/Pav: ${obra.unidadesPorPavimento}</span>
            </button>
        `;
    });

    container.innerHTML = `
        <header>
            <img src="logo.png" alt="Conforme Obra" class="logo-img">
            <h1>CONFORME OBRA</h1>
            <p>Selecione o empreendimento para gerenciar</p>
        </header>
        <main class="menu-inicial">
            ${botoesObras}
            <button class="btn-primary btn-back" onclick="navegar('cadastros')" style="margin-top: 10px;">
                <h2>⬅ Voltar aos Cadastros</h2>
            </button>
        </main>
    `;
}

function gerenciarEmpreendimento(nomeObra) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <img src="logo.png" alt="Conforme Obra" class="logo-img">
            <h1>CONFORME OBRA</h1>
            <p>Gerenciando: ${nomeObra}</p>
        </header>
        <main class="menu-inicial">
            <button class="btn-primary" onclick="alert('Configurações detalhadas de ${nomeObra}')">
                <h2>⚙ EDITAR CONFIGURAÇÕES</h2>
            </button>
            <button class="btn-primary" onclick="alert('Visualizar checklist e tipologias de ${nomeObra}')">
                <h2>📋 VER TIPOLOGIAS E CHECKLISTS</h2>
            </button>
            <button class="btn-primary btn-back" onclick="carregarListaCadastro()" style="margin-top: 10px;">
                <h2>⬅ Voltar à Lista</h2>
            </button>
        </main>
    `;
}

// ================= WIZARD DE CADASTRO DE NOVO EMPREENDIMENTO =================

function iniciarWizardCadastro() {
    novoEmpreendimentoTemp = { nome: '', pavimentos: [], unidadesPorPavimento: 2, tipologia: {}, fechamentoInterno: '' };
    carregarPassoWizard(1);
}

function carregarPassoWizard(passo) {
    const container = document.querySelector('.container');

    if (passo === 1) {
        container.innerHTML = `
            <header>
                <img src="logo.png" alt="Conforme Obra" class="logo-img">
                <h1>CADASTRO - PASSO 1/4</h1>
                <p>Identificação e Pavimentos</p>
            </header>
            <main class="menu-inicial">
                <div style="text-align: left; background: #1e293b; padding: 20px; border-radius: 12px; border: 2px solid #334155;">
                    <label style="color: #94a3b8; font-size: 0.9rem;">Nome do Empreendimento:</label>
                    <input type="text" id="inputNomeObra" placeholder="Ex: Horizon Tower" style="width: 100%; padding: 12px; margin: 8px 0 20px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                    
                    <label style="color: #94a3b8; font-size: 0.9rem;">Descrição dos Pavimentos (separados por vírgula):</label>
                    <input type="text" id="inputPavimentos" placeholder="Ex: Térreo, 1º Pavimento Tipo, 2º Pavimento Tipo, Cobertura" style="width: 100%; padding: 12px; margin: 8px 0 10px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                </div>
                <button class="btn-primary" onclick="salvarPasso1()" style="text-align: center; margin-top: 15px;">
                    <h2>Avançar ➡</h2>
                </button>
                <button class="btn-primary btn-back" onclick="navegar('cadastros')" style="margin-top: 10px;">
                    <h2>⬅ Cancelar</h2>
                </button>
            </main>
        `;
    } else if (passo === 2) {
        container.innerHTML = `
            <header>
                <img src="logo.png" alt="Conforme Obra" class="logo-img">
                <h1>CADASTRO - PASSO 2/4</h1>
                <p>Unidades Privativas por Pavimento</p>
            </header>
            <main class="menu-inicial">
                <div style="text-align: left; background: #1e293b; padding: 20px; border-radius: 12px; border: 2px solid #334155;">
                    <label style="color: #94a3b8; font-size: 0.9rem;">Quantidade de unidades por pavimento tipo:</label>
                    <input type="number" id="inputQtdUnidades" placeholder="Ex: 4" value="4" style="width: 100%; padding: 12px; margin: 8px 0 10px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                </div>
                <button class="btn-primary" onclick="salvarPasso2()" style="text-align: center; margin-top: 15px;">
                    <h2>Avançar ➡</h2>
                </button>
                <button class="btn-primary btn-back" onclick="carregarPassoWizard(1)" style="margin-top: 10px;">
                    <h2>⬅ Voltar</h2>
                </button>
            </main>
        `;
    } else if (passo === 3) {
        container.innerHTML = `
            <header>
                <img src="logo.png" alt="Conforme Obra" class="logo-img">
                <h1>CADASTRO - PASSO 3/4</h1>
                <p>Tipologia e Composição</p>
            </header>
            <main class="menu-inicial">
                <div style="text-align: left; background: #1e293b; padding: 20px; border-radius: 12px; border: 2px solid #334155;">
                    <label style="color: #94a3b8; font-size: 0.9rem;">Escolha a Tipologia:</label>
                    <select id="selectTipologia" style="width: 100%; padding: 12px; margin: 8px 0 15px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                        <option value="Studio">Studio</option>
                        <option value="Quarto e Sala">Quarto e Sala</option>
                        <option value="2 Quartos">2 Quartos</option>
                        <option value="3 Quartos">3 Quartos</option>
                    </select>

                    <label style="color: #94a3b8; font-size: 0.9rem;">Possui Suíte?</label>
                    <select id="selectSuite" style="width: 100%; padding: 12px; margin: 8px 0 15px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                    </select>

                    <label style="color: #94a3b8; font-size: 0.9rem;">Áreas de Lazer / Extras na Unidade:</label>
                    <div style="color: white; margin-top: 5px; display: flex; flex-direction: column; gap: 8px;">
                        <label><input type="checkbox" id="checkVaranda" value="Varanda"> Varanda</label>
                        <label><input type="checkbox" id="checkPiscina" value="Piscina"> Piscina privativa</label>
                    </div>
                </div>
                <button class="btn-primary" onclick="salvarPasso3()" style="text-align: center; margin-top: 15px;">
                    <h2>Avançar ➡</h2>
                </button>
                <button class="btn-primary btn-back" onclick="carregarPassoWizard(2)" style="margin-top: 10px;">
                    <h2>⬅ Voltar</h2>
                </button>
            </main>
        `;
    } else if (passo === 4) {
        container.innerHTML = `
            <header>
                <img src="logo.png" alt="Conforme Obra" class="logo-img">
                <h1>CADASTRO - PASSO 4/4</h1>
                <p>Fechamento Interno e Conclusão</p>
            </header>
            <main class="menu-inicial">
                <div style="text-align: left; background: #1e293b; padding: 20px; border-radius: 12px; border: 2px solid #334155;">
                    <label style="color: #94a3b8; font-size: 0.9rem;">Tipo de Fechamento Interno:</label>
                    <select id="selectFechamento" style="width: 100%; padding: 12px; margin: 8px 0 15px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                        <option value="Drywall">Drywall</option>
                        <option value="Alvenaria de Bloco Cerâmico">Alvenaria de Bloco Cerâmico</option>
                        <option value="Bloco de Concreto">Bloco de Concreto</option>
                    </select>
                </div>
                <button class="btn-primary" onclick="concluirCadastro()" style="text-align: center; margin-top: 15px; background-color: #16a34a;">
                    <h2>Salvar e Inserir na Lista ✅</h2>
                </button>
                <button class="btn-primary btn-back" onclick="carregarPassoWizard(3)" style="margin-top: 10px;">
                    <h2>⬅ Voltar</h2>
                </button>
            </main>
        `;
    }
}

function salvarPasso1() {
    const nome = document.getElementById('inputNomeObra').value.trim();
    const pavimentosStr = document.getElementById('inputPavimentos').value.trim();
    if (!nome) {
        alert('Por favor, informe o nome do empreendimento.');
        return;
    }
    novoEmpreendimentoTemp.nome = nome.toUpperCase();
    novoEmpreendimentoTemp.pavimentos = pavimentosStr ? pavimentosStr.split(',').map(p => p.trim()) : ['Térreo', '1º Pavimento Tipo', 'Cobertura'];
    carregarPassoWizard(2);
}

function salvarPasso2() {
    const qtd = document.getElementById('inputQtdUnidades').value;
    novoEmpreendimentoTemp.unidadesPorPavimento = parseInt(qtd) || 2;
    carregarPassoWizard(3);
}

function salvarPasso3() {
    novoEmpreendimentoTemp.tipologia = {
        tipo: document.getElementById('selectTipologia').value,
        suite: document.getElementById('selectSuite').value,
        varanda: document.getElementById('checkVaranda').checked,
        piscina: document.getElementById('checkPiscina').checked
    };
    carregarPassoWizard(4);
}

function concluirCadastro() {
    novoEmpreendimentoTemp.fechamentoInterno = document.getElementById('selectFechamento').value;
    
    let lista = obterEmpreendimentos();
    let index = lista.findIndex(e => e.nome === novoEmpreendimentoTemp.nome);
    
    if (index >= 0) {
        lista[index] = novoEmpreendimentoTemp; // Atualiza se já existir
    } else {
        lista.push(novoEmpreendimentoTemp); // Adiciona novo
    }
    
    salvarEmpreendimentos(lista);

    alert(`Empreendimento "${novoEmpreendimentoTemp.nome}" cadastrado e salvo com sucesso!`);
    voltarInicio();
}

// ================= FLUXO DE VISTORIA E PAVIMENTOS DINÂMICOS =================

function carregarFasesObra(nomeObra) {
    const container = document.querySelector('.container');
    let botoesFases = '';

    if (nomeObra === 'GRAND GARDEN' || nomeObra === 'ZEN LIFE' || nomeObra.includes('GARDEN')) {
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
            <img src="logo.png" alt="Conforme Obra" class="logo-img">
            <h1>CONFORME OBRA</h1>
            <p>${nomeObra} - Escolha a frente de serviço</p>
        </header>
        <main class="menu-inicial">
            ${botoesFases}
        </main>
    `;
}

function carregarEstrutural(nomeObra) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <img src="logo.png" alt="Conforme Obra" class="logo-img">
            <h1>CONFORME OBRA</h1>
            <p>${nomeObra} - Estrutural</p>
        </header>
        <main class="menu-inicial">
            <button class="btn-primary" onclick="alert('Abrindo Subsolo')">
                <h2>SUBSOLO</h2>
            </button>
            <button class="btn-primary" onclick="alert('Abrindo Pilotis')">
                <h2>PILOTIS</h2>
            </button>
            <button class="btn-primary" onclick="alert('Abrindo Cobertura')">
                <h2>COBERTURA</h2>
            </button>
            <button class="btn-primary btn-back" onclick="carregarFasesObra('${nomeObra}')" style="margin-top: 10px;">
                <h2>⬅ Voltar às Fases</h2>
            </button>
        </main>
    `;
}

function carregarListaPavimentos(nomeObra) {
    const container = document.querySelector('.container');
    const lista = obterEmpreendimentos();
    const obraObj = lista.find(e => e.nome === nomeObra);
    
    let botoesPavimentos = '';
    const pavimentos = obraObj ? obraObj.pavimentos : ['Térreo', '1º Pavimento Tipo', 'Cobertura'];

    pavimentos.forEach(pav => {
        botoesPavimentos += `
            <button class="btn-primary" onclick="carregarTipoArea('${nomeObra}', '${pav}')">
                <h2>${pav.toUpperCase()}</h2>
            </button>
        `;
    });

    container.innerHTML = `
        <header>
            <img src="logo.png" alt="Conforme Obra" class="logo-img">
            <h1>CONFORME OBRA</h1>
            <p>${nomeObra} - Lista de Pavimentos</p>
        </header>
        <main class="menu-inicial">
            ${botoesPavimentos}
            <button class="btn-primary btn-back" onclick="carregarFasesObra('${nomeObra}')" style="margin-top: 10px;">
                <h2>⬅ Voltar às Fases</h2>
            </button>
        </main>
    `;
}

function carregarTipoArea(nomeObra, pavimento) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <img src="logo.png" alt="Conforme Obra" class="logo-img">
            <h1>CONFORME OBRA</h1>
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

function carregarListaApartamentos(nomeObra, pavimento) {
    const container = document.querySelector('.container');
    const lista = obterEmpreendimentos();
    const obraObj = lista.find(e => e.nome === nomeObra);
    
    let qtdUnidades = obraObj ? obraObj.unidadesPorPavimento : 2;
    let botoesUnidades = '';

    // Gera dinamicamente as unidades baseadas na quantidade cadastrada
    for (let i = 1; i <= qtdUnidades; i++) {
        // Exemplo de numeração: 101, 102... ou baseada no andar
        let numeroApto = i < 10 ? `0${i}` : `${i}`;
        let idUnidade = `1${numeroApto}`; // Ex: 101, 102, 103, 104
        
        botoesUnidades += `
            <button class="btn-primary" onclick="alert('Abrindo Vistoria/Checklist do Apartamento ${idUnidade} - ${pavimento}')">
                <h2>APTO ${idUnidade}</h2>
            </button>
        `;
    }

    container.innerHTML = `
        <header>
            <img src="logo.png" alt="Conforme Obra" class="logo-img">
            <h1>CONFORME OBRA</h1>
            <p>${nomeObra} - ${pavimento} - Selecione a Unidade</p>
        </header>
        <main class="menu-inicial">
            ${botoesUnidades}
            <button class="btn-primary btn-back" onclick="carregarTipoArea('${nomeObra}', '${pavimento}')" style="margin-top: 10px;">
                <h2>⬅ Voltar às Áreas</h2>
            </button>
        </main>
    `;
}

function voltarInicio() {
    location.reload(); 
}
