// Dados padrão iniciais (sem o empreendimento Residencial)
let empreendimentosPadrao = [
    { 
        nome: 'ZEN LIFE', 
        pavimentos: ['1º Pavimento', '2º Pavimento', '3º Pavimento', '4º Pavimento (c/ piscina)'],
        detalhesPavimentos: {
            '1º Pavimento': [
                { unidade: '101', tipologia: '3 Quartos', banheiros: '2 Banheiros', piscina: 'Sem piscina' },
                { unidade: '102', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '103', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '104', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '105', tipologia: '2 Quartos', banheiros: '2 Banheiros', piscina: 'Sem piscina' },
                { unidade: '106', tipologia: '3 Quartos', banheiros: '2 Banheiros', piscina: 'Sem piscina' },
                { unidade: '108', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '109', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '110', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '111', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '112', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '113', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '114', tipologia: '2 Quartos', banheiros: '2 Banheiros', piscina: 'Sem piscina' }
            ],
            '2º Pavimento': [
                { unidade: '201', tipologia: '3 Quartos', banheiros: '2 Banheiros', piscina: 'Sem piscina' },
                { unidade: '202', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '203', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '204', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '205', tipologia: '2 Quartos', banheiros: '2 Banheiros', piscina: 'Sem piscina' },
                { unidade: '206', tipologia: '3 Quartos', banheiros: '2 Banheiros', piscina: 'Sem piscina' },
                { unidade: '208', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '209', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '210', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '211', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '212', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '213', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '214', tipologia: '2 Quartos', banheiros: '2 Banheiros', piscina: 'Sem piscina' }
            ],
            '3º Pavimento': [
                { unidade: '301', tipologia: '3 Quartos', banheiros: '2 Banheiros', piscina: 'Sem piscina' },
                { unidade: '302', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '303', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '304', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '305', tipologia: '2 Quartos', banheiros: '2 Banheiros', piscina: 'Sem piscina' },
                { unidade: '306', tipologia: '3 Quartos', banheiros: '2 Banheiros', piscina: 'Sem piscina' },
                { unidade: '308', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '309', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '310', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '311', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '312', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '313', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Sem piscina' },
                { unidade: '314', tipologia: '2 Quartos', banheiros: '2 Banheiros', piscina: 'Sem piscina' }
            ],
            '4º Pavimento (c/ piscina)': [
                { unidade: '401', tipologia: '3 Quartos', banheiros: '2 Banheiros', piscina: 'Com piscina' },
                { unidade: '402', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Com piscina' },
                { unidade: '403', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Com piscina' },
                { unidade: '404', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Com piscina' },
                { unidade: '405', tipologia: '2 Quartos', banheiros: '2 Banheiros', piscina: 'Com piscina' },
                { unidade: '406', tipologia: '2 Quartos', banheiros: '2 Banheiros', piscina: 'Com piscina' },
                { unidade: '407', tipologia: '3 Quartos', banheiros: '2 Banheiros', piscina: 'Com piscina' },
                { unidade: '408', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Com piscina' },
                { unidade: '409', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Com piscina' },
                { unidade: '410', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Com piscina' },
                { unidade: '411', tipologia: 'Quarto/Sala', banheiros: '1 Banheiro', piscina: 'Com piscina' },
                { unidade: '412', tipologia: '3 Quartos', banheiros: '2 Banheiros', piscina: 'Com piscina' }
            ]
        },
        unidadesPorPavimento: 14,
        tipologia: { tipo: 'Misto', banheiros: 'Variável', piscina: 'Variável' },
        fechamentoInterno: 'Drywall'
    },
    { nome: 'ZOE', pavimentos: ['Térreo', '1º Pavimento Tipo', 'Cobertura'], unidadesPorPavimento: 2, tipologia: { tipo: '2 Quartos' }, fechamentoInterno: 'Drywall' },
    { nome: 'NAOKI', pavimentos: ['Térreo', '1º Pavimento Tipo', 'Cobertura'], unidadesPorPavimento: 2, tipologia: { tipo: 'Studio' }, fechamentoInterno: 'Drywall' },
    { nome: 'ZEUS', pavimentos: ['Térreo', '1º Pavimento Tipo', 'Cobertura'], unidadesPorPavimento: 2, tipologia: { tipo: '3 Quartos' }, fechamentoInterno: 'Alvenaria' },
    { nome: 'GRAND GARDEN', pavimentos: ['Térreo', '1º Pavimento Tipo', 'Cobertura'], unidadesPorPavimento: 4, tipologia: { tipo: '2 Quartos' }, fechamentoInterno: 'Drywall' }
];

// Funções de Gerenciamento de Estado (LocalStorage)
function obterEmpreendimentos() {
    const salvo = localStorage.getItem('conformeObra_empreendimentos');
    if (salvo) {
        let lista = JSON.parse(salvo);
        // Garante que 'RESIDENCIAL' seja removido caso esteja no cache
        lista = lista.filter(e => e.nome !== 'RESIDENCIAL');
        return lista;
    }
    localStorage.setItem('conformeObra_empreendimentos', JSON.stringify(empreendimentosPadrao));
    return empreendimentosPadrao;
}

function salvarEmpreendimentos(lista) {
    localStorage.setItem('conformeObra_empreendimentos', JSON.stringify(lista));
}

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
    const lista = obterEmpreendimentos();
    const obraObj = lista.find(e => e.nome === nomeObra);

    let pavimentosHtml = '';
    if (obraObj && obraObj.pavimentos) {
        obraObj.pavimentos.forEach(pav => {
            pavimentosHtml += `<li style="padding: 6px 0; border-bottom: 1px solid #334155; color: #cbd5e1; font-size: 0.9rem;">📌 ${pav}</li>`;
        });
    }

    container.innerHTML = `
        <header>
            <img src="logo.png" alt="Conforme Obra" class="logo-img">
            <h1>CONFORME OBRA</h1>
            <p>Gerenciando: ${nomeObra}</p>
        </header>
        <main class="menu-inicial">
            <div style="text-align: left; background: #1e293b; padding: 15px 20px; border-radius: 12px; border: 2px solid #334155; margin-bottom: 15px;">
                <h3 style="color: #38bdf8; margin-bottom: 8px; font-size: 1rem;">Detalhes Cadastrados</h3>
                <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 4px;"><strong>Fechamento:</strong> ${obraObj ? obraObj.fechamentoInterno : 'N/A'}</p>
                <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 6px;"><strong>Pavimentos:</strong></p>
                <ul style="list-style: none; padding-left: 0; max-height: 130px; overflow-y: auto;">
                    ${pavimentosHtml}
                </ul>
            </div>
            <button class="btn-primary" onclick="alert('Configurações detalhadas de ${nomeObra}')">
                <h2>⚙ EDITAR CONFIGURAÇÕES</h2>
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
                    <input type="text" id="inputPavimentos" placeholder="Ex: Térreo, 1º Pavimento, Cobertura" style="width: 100%; padding: 12px; margin: 8px 0 10px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
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
                <p>Tipologia e Características</p>
            </header>
            <main class="menu-inicial">
                <div style="text-align: left; background: #1e293b; padding: 20px; border-radius: 12px; border: 2px solid #334155;">
                    <label style="color: #94a3b8; font-size: 0.9rem;">Escolha a Tipologia:</label>
                    <select id="selectTipologia" onchange="atualizarCamposTipologia()" style="width: 100%; padding: 12px; margin: 8px 0 15px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                        <option value="Studio">Studio</option>
                        <option value="Quarto/Sala">Quarto/Sala</option>
                        <option value="2 Quartos">2 Quartos</option>
                        <option value="3 Quartos">3 Quartos</option>
                    </select>

                    <div id="containerCamposExtras"></div>

                    <label style="color: #94a3b8; font-size: 0.9rem; display: block; margin-top: 5px;">Piscina Privativa:</label>
                    <select id="selectPiscina" style="width: 100%; padding: 12px; margin: 8px 0 10px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                        <option value="Sem piscina">Sem piscina</option>
                        <option value="Com piscina">Com piscina</option>
                    </select>
                </div>
                <button class="btn-primary" onclick="salvarPasso3()" style="text-align: center; margin-top: 15px;">
                    <h2>Avançar ➡</h2>
                </button>
                <button class="btn-primary btn-back" onclick="carregarPassoWizard(2)" style="margin-top: 10px;">
                    <h2>⬅ Voltar</h2>
                </button>
            </main>
        `;
        setTimeout(atualizarCamposTipologia, 50);
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

function atualizarCamposTipologia() {
    const tipo = document.getElementById('selectTipologia').value;
    const containerExtras = document.getElementById('containerCamposExtras');
    
    if (!containerExtras) return;

    if (tipo === 'Studio') {
        containerExtras.innerHTML = `
            <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px dashed #475569; margin-bottom: 15px; color: #94a3b8; font-size: 0.85rem;">
                ℹ Studio configurado com <strong>1 Banheiro</strong> (sem suíte, lavabo, área de serviço ou varanda obrigatórios).
            </div>
        `;
    } else {
        containerExtras.innerHTML = `
            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; gap: 10px; color: white; cursor: pointer; font-size: 0.95rem;">
                    <input type="checkbox" id="checkSuite" style="width: 18px; height: 18px; accent-color: #3b82f6;">
                    Possui Suíte?
                </label>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="color: #94a3b8; font-size: 0.9rem;">Qtd. de Banheiros (fora suítes):</label>
                <select id="selectBanheiros" style="width: 100%; padding: 12px; margin-top: 8px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                    <option value="1 Banheiro">1 Banheiro</option>
                    <option value="2 Banheiros">2 Banheiros</option>
                    <option value="3 Banheiros">3 Banheiros</option>
                    <option value="4+ Banheiros">4+ Banheiros</option>
                </select>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="color: #94a3b8; font-size: 0.9rem;">Lavabo:</label>
                <select id="selectLavabo" style="width: 100%; padding: 12px; margin-top: 8px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                </select>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="color: #94a3b8; font-size: 0.9rem;">Área de Serviço:</label>
                <select id="selectAreaServico" style="width: 100%; padding: 12px; margin-top: 8px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                </select>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="color: #94a3b8; font-size: 0.9rem;">Varanda:</label>
                <select id="selectVaranda" style="width: 100%; padding: 12px; margin-top: 8px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                </select>
            </div>
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
    const tipo = document.getElementById('selectTipologia').value;
    const piscina = document.getElementById('selectPiscina').value;

    if (tipo === 'Studio') {
        novoEmpreendimentoTemp.tipologia = {
            tipo: 'Studio',
            suite: 'Não',
            banheiros: '1 Banheiro',
            lavabo: 'Não',
            areaServico: 'Não',
            varanda: 'Não',
            piscina: piscina
        };
    } else {
        novoEmpreendimentoTemp.tipologia = {
            tipo: tipo,
            suite: document.getElementById('checkSuite').checked ? 'Sim' : 'Não',
            banheiros: document.getElementById('selectBanheiros').value,
            lavabo: document.getElementById('selectLavabo').value,
            areaServico: document.getElementById('selectAreaServico').value,
            varanda: document.getElementById('selectVaranda').value,
            piscina: piscina
        };
    }
    carregarPassoWizard(4);
}

function concluirCadastro() {
    novoEmpreendimentoTemp.fechamentoInterno = document.getElementById('selectFechamento').value;
    
    let lista = obterEmpreendimentos();
    let index = lista.findIndex(e => e.nome === novoEmpreendimentoTemp.nome);
    
    if (index >= 0) {
        lista[index] = novoEmpreendimentoTemp;
    } else {
        lista.push(novoEmpreendimentoTemp);
    }
    
    salvarEmpreendimentos(lista);

    alert(`Empreendimento "${novoEmpreendimentoTemp.nome}" cadastrado e salvo com sucesso!`);
    voltarInicio();
}

// ================= FLUXO DE VISTORIA E PAVIMENTOS =================

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
            <button class="btn-primary" onclick="alert('Abrindo Fundações')">
                <h2>FUNDAÇÕES</h2>
            </button>
            <button class="btn-primary" onclick="alert('Abrindo Estrutura Geral')">
                <h2>ESTRUTURA GERAL</h2>
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
    
    let botoesUnidades = '';

    if (obraObj && obraObj.detalhesPavimentos && obraObj.detalhesPavimentos[pavimento]) {
        const unidadesDoPav = obraObj.detalhesPavimentos[pavimento];
        unidadesDoPav.forEach(item => {
            botoesUnidades += `
                <button class="btn-primary" onclick="alert('Abrindo Vistoria do Apto ${item.unidade} - ${pavimento} | Tipologia: ${item.tipologia} | ${item.banheiros} | ${item.piscina}')">
                    <h2>APTO ${item.unidade}</h2>
                </button>
            `;
        });
    } else {
        let qtdUnidades = obraObj ? obraObj.unidadesPorPavimento : 2;
        for (let i = 1; i <= qtdUnidades; i++) {
            let numeroApto = i < 10 ? `0${i}` : `${i}`;
            botoesUnidades += `
                <button class="btn-primary" onclick="alert('Abrindo Vistoria do Apartamento 1${numeroApto}')">
                    <h2>APTO 1${numeroApto}</h2>
                </button>
            `;
        }
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
