// Lista global de empreendimentos (inclui os padrões e os novos cadastrados)
let listaEmpreendimentos = ['ZOE', 'NAOKI', 'ZEUS', 'GRAND GARDEN', 'ZEN LIFE'];

// Objeto temporário para armazenar os dados do cadastro em andamento
let novoEmpreendimentoTemp = {
    nome: '',
    pavimentos: [],
    unidadesPorPavimento: 0,
    tipologia: {},
    fechamentoInterno: ''
};

// Função principal de navegação baseada no fluxograma
function navegar(destino) {
    const container = document.querySelector('.container');

    if (destino === 'vistoria') {
        let botoesObras = '';
        listaEmpreendimentos.forEach(obra => {
            botoesObras += `
                <button class="btn-primary" onclick="carregarFasesObra('${obra}')">
                    <h2>📁 ${obra}</h2>
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
                <button class="btn-primary" onclick="alert('Funcionalidade de escolha e edição rápida da lista existente')">
                    <h2>ESCOLHER DA LISTA</h2>
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

// ================= WIZARD DE CADASTRO DE NOVO EMPREENDIMENTO =================

function iniciarWizardCadastro() {
    novoEmpreendimentoTemp = { nome: '', pavimentos: [], unidadesPorPavimento: 0, tipologia: {}, fechamentoInterno: '' };
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
                    <input type="text" id="inputPavimentos" placeholder="Ex: Térreo, 1º Pavimento Tipo, Cobertura" style="width: 100%; padding: 12px; margin: 8px 0 10px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
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
                    <input type="number" id="inputQtdUnidades" placeholder="Ex: 4" style="width: 100%; padding: 12px; margin: 8px 0 10px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
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
    novoEmpreendimentoTemp.pavimentos = pavimentosStr ? pavimentosStr.split(',').map(p => p.trim()) : ['Térreo', 'Pavimento Tipo', 'Cobertura'];
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
    
    // Adiciona o novo empreendimento na lista global
    if (!listaEmpreendimentos.includes(novoEmpreendimentoTemp.nome)) {
        listaEmpreendimentos.push(novoEmpreendimentoTemp.nome);
    }

    alert(`Empreendimento "${novoEmpreendimentoTemp.nome}" cadastrado e integrado com sucesso!`);
    voltarInicio();
}

// ================= FLUXO DE VISTORIA E PAVIMENTOS =================

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
            <img src="logo.png" alt="Conforme Obra" class="logo-img">
            <h1>CONFORME OBRA</h1>
            <p>${nomeObra} - Estrutural</p>
        </header>
        <main class="menu-inicial">
            ${botoesItens}
        </main>
    `;
}

function carregarListaPavimentos(nomeObra) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <img src="logo.png" alt="Conforme Obra" class="logo-img">
            <h1>CONFORME OBRA</h1>
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
    container.innerHTML = `
        <header>
            <img src="logo.png" alt="Conforme Obra" class="logo-img">
            <h1>CONFORME OBRA</h1>
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

function voltarInicio() {
    location.reload(); 
}
