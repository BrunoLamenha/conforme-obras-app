import { db } from './firebaseConfig.js';
import { collection, doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; 

let empreendimentosPadrao = [
    { 
        nome: 'ZEN LIFE', 
        pavimentos: ['1º Pavimento', '2º Pavimento', '3º Pavimento', '4º Pavimento (c/ piscina)'],
        detalhesPavimentos: {
            'PRIVATIVA - 1º Pavimento': [
                { unidade: '101', tipologia: '3 Quartos', banheiros: '2', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '102', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '103', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '104', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '105', tipologia: '2 Quartos', banheiros: '1', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '106', tipologia: '3 Quartos', banheiros: '2', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '108', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '109', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '110', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '111', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '112', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '113', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '114', tipologia: '2 Quartos', banheiros: '1', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' }
            ],
            'PRIVATIVA - 2º Pavimento': [
                { unidade: '201', tipologia: '3 Quartos', banheiros: '2', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '202', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '203', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '204', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '205', tipologia: '2 Quartos', banheiros: '1', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '206', tipologia: '3 Quartos', banheiros: '2', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '208', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '209', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '210', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '211', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '212', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '213', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '214', tipologia: '2 Quartos', banheiros: '1', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' }
            ],
            'PRIVATIVA - 3º Pavimento': [
                { unidade: '301', tipologia: '3 Quartos', banheiros: '2', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '302', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '303', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '304', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '305', tipologia: '2 Quartos', banheiros: '1', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '306', tipologia: '3 Quartos', banheiros: '2', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '308', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '309', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '310', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '311', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '312', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '313', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' },
                { unidade: '314', tipologia: '2 Quartos', banheiros: '1', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' }
            ],
            'PRIVATIVA - 4º Pavimento (c/ piscina)': [
                { unidade: '401', tipologia: '3 Quartos', banheiros: '2', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Com piscina' },
                { unidade: '402', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Com piscina' },
                { unidade: '403', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Com piscina' },
                { unidade: '404', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Com piscina' },
                { unidade: '405', tipologia: '2 Quartos', banheiros: '1', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Com piscina' },
                { unidade: '406', tipologia: '2 Quartos', banheiros: '1', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Com piscina' },
                { unidade: '407', tipologia: '3 Quartos', banheiros: '2', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Com piscina' },
                { unidade: '408', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Com piscina' },
                { unidade: '409', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Com piscina' },
                { unidade: '410', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Com piscina' },
                { unidade: '411', tipologia: 'Quarto/Sala', banheiros: '1', suite: 'Não', lavabo: 'Não', areaServico: 'Não', varanda: 'Sim', reforma: 'Padrão', piscina: 'Com piscina' },
                { unidade: '412', tipologia: '3 Quartos', banheiros: '2', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Com piscina' }
            ]
        },
        unidadesPorPavimento: 14,
        tipologia: { tipo: 'Misto' },
        fechamentoInterno: 'Drywall'
    },
    { nome: 'ZOE', pavimentos: ['Térreo', '1º Pavimento Tipo', 'Cobertura'], detalhesPavimentos: {}, unidadesPorPavimento: 2, tipologia: { tipo: '2 Quartos' }, fechamentoInterno: 'Drywall' },
    { nome: 'NAOKI', pavimentos: ['Térreo', '1º Pavimento Tipo', 'Cobertura'], detalhesPavimentos: {}, unidadesPorPavimento: 2, tipologia: { tipo: 'Studio' }, fechamentoInterno: 'Drywall' },
    { nome: 'ZEUS', pavimentos: ['Térreo', '1º Pavimento Tipo', 'Cobertura'], detalhesPavimentos: {}, unidadesPorPavimento: 2, tipologia: { tipo: '3 Quartos' }, fechamentoInterno: 'Alvenaria' },
    { nome: 'GRAND GARDEN', pavimentos: ['Pilotis', 'Térreo', '1º Pavimento Tipo', 'Cobertura'], detalhesPavimentos: {}, unidadesPorPavimento: 4, tipologia: { tipo: '2 Quartos' }, fechamentoInterno: 'Drywall' }
];

function obterEmpreendimentos() {
    const salvo = localStorage.getItem('conformeObra_empreendimentos');
    if (salvo) {
        let lista = JSON.parse(salvo);
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

let indiceEdicaoUnidade = null;

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
            <p>Selecione o empreendimento para configurar</p>
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
            <p>${nomeObra} - Selecione o Tipo de Área</p>
        </header>
        <main class="menu-inicial">
            <button class="btn-primary" onclick="escolherPavimentosArea('${nomeObra}', 'privativa')">
                <h2>🏢 ÁREA PRIVATIVA</h2>
            </button>
            <button class="btn-primary" onclick="escolherPavimentosArea('${nomeObra}', 'comum')">
                <h2>🏛 ÁREA COMUM</h2>
            </button>
            <button class="btn-primary btn-back" onclick="carregarListaCadastro()" style="margin-top: 10px;">
                <h2>⬅ Voltar à Lista</h2>
            </button>
        </main>
    `;
}

function obterPavimentosPorTipo(nomeObra, tipoArea) {
    const nome = nomeObra.toUpperCase();
    if (tipoArea === 'comum') {
        if (nome.includes('NAOKI')) {
            return ['Pilotis', 'Coberta'];
        } else {
            return ['Subsolo', 'Pilotis', 'Cobertura', 'Coberta'];
        }
    } else {
        if (nome.includes('ZEN LIFE')) {
            return ['1º Pavimento', '2º Pavimento', '3º Pavimento', '4º Pavimento (c/ piscina)'];
        } else if (nome.includes('ZOE') || nome.includes('ZEUS')) {
            return ['Térreo', '1º Pavimento Tipo', '2º Pavimento Tipo', '3º Pavimento Tipo', '4º Pavimento Tipo', 'Cobertura'];
        } else if (nome.includes('GRAND GARDEN')) {
            return ['Pilotis', 'Térreo', '1º Pavimento Tipo', '2º Pavimento Tipo', '3º Pavimento Tipo', '4º Pavimento Tipo', 'Cobertura'];
        } else if (nome.includes('NAOKI')) {
            return ['Pilotis', '1º Pavimento Tipo', '2º Pavimento Tipo', '3º Pavimento + Cobertura'];
        } else {
            return ['Térreo', '1º Pavimento Tipo', 'Cobertura'];
        }
    }
}

function escolherPavimentosArea(nomeObra, tipoArea) {
    const container = document.querySelector('.container');
    const pavimentos = obterPavimentosPorTipo(nomeObra, tipoArea);
    
    let botoesPavimentos = '';
    pavimentos.forEach(pav => {
        botoesPavimentos += `
            <button class="btn-primary" onclick="abrirCadastroUnidadesPavimento('${nomeObra}', '${pav}', '${tipoArea}')">
                <h2>📌 ${pav.toUpperCase()}</h2>
            </button>
        `;
    });

    container.innerHTML = `
        <header>
            <img src="logo.png" alt="Conforme Obra" class="logo-img">
            <h1>CONFORME OBRA</h1>
            <p>${nomeObra} - ${tipoArea === 'privativa' ? 'Área Privativa' : 'Área Comum'}</p>
        </header>
        <main class="menu-inicial">
            ${botoesPavimentos}
            <button class="btn-primary btn-back" onclick="gerenciarEmpreendimento('${nomeObra}')" style="margin-top: 10px;">
                <h2>⬅ Voltar aos Tipos</h2>
            </button>
        </main>
    `;
}

function abrirCadastroUnidadesPavimento(nomeObra, pavimento, tipoArea) {
    const container = document.querySelector('.container');
    const lista = obterEmpreendimentos();
    const obraObj = lista.find(e => e.nome === nomeObra);

    if (!obraObj.detalhesPavimentos) obraObj.detalhesPavimentos = {};
    const chavePav = `${tipoArea.toUpperCase()} - ${pavimento}`;
    if (!obraObj.detalhesPavimentos[chavePav]) obraObj.detalhesPavimentos[chavePav] = [];

    const unidadesSalvas = obraObj.detalhesPavimentos[chavePav];
    let listaUnidadesHtml = '';

    unidadesSalvas.forEach((u, idx) => {
        listaUnidadesHtml += `
            <div style="background: #0f172a; padding: 10px 14px; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155;">
                <span onclick="carregarUnidadeParaEdicao('${nomeObra}', '${pavimento}', '${tipoArea}', ${idx})" style="color: #f8fafc; font-size: 0.95rem; cursor: pointer; flex: 1; font-weight: bold;">Unidade ${u.unidade}</span>
                <div style="display: flex; gap: 6px;">
                    <button onclick="carregarUnidadeParaEdicao('${nomeObra}', '${pavimento}', '${tipoArea}', ${idx})" style="background: #3b82f6; border: none; color: white; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">Editar</button>
                    <button onclick="removerUnidadePavimento('${nomeObra}', '${pavimento}', '${tipoArea}', ${idx})" style="background: #ef4444; border: none; color: white; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">Apagar</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <header>
            <img src="logo.png" alt="Conforme Obra" class="logo-img">
            <h1>${nomeObra}</h1>
            <p>${tipoArea.toUpperCase()} | Pavimento: ${pavimento}</p>
        </header>
        <main class="menu-inicial">
            <div style="text-align: left; background: #1e293b; padding: 15px; border-radius: 12px; border: 2px solid #334155; margin-bottom: 15px;">
                <h3 id="tituloFormUnidade" style="color: #38bdf8; margin-bottom: 10px; font-size: 0.95rem;">Adicionar Unidade / Terminação</h3>
                
                <label style="color: #94a3b8; font-size: 0.85rem;">Número ou Terminação da Unidade (Ex: 101, 01):</label>
                <input type="text" id="inputTerminacao" placeholder="Ex: 101" style="width: 100%; padding: 10px; margin: 6px 0 12px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">

                <label style="color: #94a3b8; font-size: 0.85rem;">Escolha a Tipologia:</label>
                <select id="selectTipologiaUnidade" onchange="verificarTipologiaUnidade()" style="width: 100%; padding: 10px; margin: 6px 0 12px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                    <option value="Studio">Studio</option>
                    <option value="Quarto/Sala">Quarto/Sala</option>
                    <option value="2 Quartos">2 Quartos</option>
                    <option value="3 Quartos">3 Quartos</option>
                </select>

                <div id="divBanheiros" style="display: none; margin-bottom: 12px;">
                    <label style="color: #94a3b8; font-size: 0.85rem;">Quantidade de Banheiros (fora suíte):</label>
                    <select id="selectBanheirosUnidade" style="width: 100%; padding: 10px; margin: 6px 0 0 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                        <option value="1">1 Banheiro</option>
                        <option value="2">2 Banheiros</option>
                        <option value="3">3 Banheiros</option>
                    </select>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 12px 0;">
                    <label style="display: flex; align-items: center; gap: 8px; color: white; cursor: pointer; font-size: 0.9rem;">
                        <input type="checkbox" id="checkSuiteUnidade" style="width: 16px; height: 16px; accent-color: #3b82f6;"> Suíte
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; color: white; cursor: pointer; font-size: 0.9rem;">
                        <input type="checkbox" id="checkVarandaUnidade" style="width: 16px; height: 16px; accent-color: #3b82f6;"> Varanda
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; color: white; cursor: pointer; font-size: 0.9rem;">
                        <input type="checkbox" id="checkLavaboUnidade" style="width: 16px; height: 16px; accent-color: #3b82f6;"> Lavabo
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; color: white; cursor: pointer; font-size: 0.9rem;">
                        <input type="checkbox" id="checkAreaServicoUnidade" style="width: 16px; height: 16px; accent-color: #3b82f6;"> Área de Serviço
                    </label>
                </div>

                <label style="color: #94a3b8; font-size: 0.85rem; display: block; margin-top: 10px;">Padrão / Reforma:</label>
                <select id="selectReformaUnidade" style="width: 100%; padding: 10px; margin: 6px 0 12px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                    <option value="Padrão">Padrão</option>
                    <option value="Reforma">Reforma</option>
                </select>

                <div style="display: flex; gap: 8px; margin-top: 14px;">
                    <button id="btnSalvarUnidade" onclick="salvarUnidadePavimento('${nomeObra}', '${pavimento}', '${tipoArea}')" style="flex: 1; background: #2563eb; color: white; border: none; padding: 10px 14px; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                        <span>+ Salvar Unidade</span>
                    </button>
                    <button id="btnCancelarEdicao" onclick="cancelarEdicaoUnidade('${nomeObra}', '${pavimento}', '${tipoArea}')" style="display: none; background: #475569; border: none; color: white; padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem;">
                        Cancelar
                    </button>
                    <button id="btnDeletarEdicao" style="display: none; background: #dc2626; border: none; color: white; padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem;">
                        Excluir
                    </button>
                </div>
            </div>

            <div style="text-align: left; background: #1e293b; padding: 15px; border-radius: 12px; border: 2px solid #334155; margin-bottom: 15px; max-height: 250px; overflow-y: auto;">
                <h3 style="color: #38bdf8; margin-bottom: 8px; font-size: 0.95rem;">Unidades Cadastradas</h3>
                ${listaUnidadesHtml || '<p style="color: #64748b; font-size: 0.85rem;">Nenhuma unidade cadastrada ainda.</p>'}
            </div>

            <button class="btn-primary btn-back" onclick="escolherPavimentosArea('${nomeObra}', '${tipoArea}')">
                <h2>⬅ Voltar aos Pavimentos</h2>
            </button>
        </main>
    `;
    indiceEdicaoUnidade = null;
    setTimeout(verificarTipologiaUnidade, 50);
}

function verificarTipologiaUnidade() {
    const tipologia = document.getElementById('selectTipologiaUnidade').value;
    const divBanheiros = document.getElementById('divBanheiros');
    if (!divBanheiros) return;
    if (tipologia !== 'Studio') {
        divBanheiros.style.display = 'block';
    } else {
        divBanheiros.style.display = 'none';
    }
}

function carregarUnidadeParaEdicao(nomeObra, pavimento, tipoArea, index) {
    let lista = obterEmpreendimentos();
    let obraObj = lista.find(e => e.nome === nomeObra);
    const chavePav = `${tipoArea.toUpperCase()} - ${pavimento}`;
    const u = obraObj.detalhesPavimentos[chavePav][index];

    indiceEdicaoUnidade = index;

    document.getElementById('inputTerminacao').value = u.unidade;
    document.getElementById('selectTipologiaUnidade').value = u.tipologia;
    verificarTipologiaUnidade();
    if (u.tipologia !== 'Studio' && document.getElementById('selectBanheirosUnidade')) {
        document.getElementById('selectBanheirosUnidade').value = u.banheiros || '1';
    }
    document.getElementById('checkSuiteUnidade').checked = (u.suite === 'Sim');
    document.getElementById('checkVarandaUnidade').checked = (u.varanda === 'Sim');
    document.getElementById('checkLavaboUnidade').checked = (u.lavabo === 'Sim');
    document.getElementById('checkAreaServicoUnidade').checked = (u.areaServico === 'Sim');
    document.getElementById('selectReformaUnidade').value = u.reforma || 'Padrão';

    document.getElementById('tituloFormUnidade').innerText = `Editando Unidade ${u.unidade}`;
    document.getElementById('btnSalvarUnidade').innerHTML = '<span>💾 Atualizar Unidade</span>';
    document.getElementById('btnCancelarEdicao').style.display = 'block';
    
    const btnDel = document.getElementById('btnDeletarEdicao');
    btnDel.style.display = 'block';
    btnDel.onclick = () => {
        if (confirm(`Deseja excluir a unidade ${u.unidade}?`)) {
            removerUnidadePavimento(nomeObra, pavimento, tipoArea, index);
        }
    };

    document.getElementById('inputTerminacao').scrollIntoView({ behavior: 'smooth' });
}

function cancelarEdicaoUnidade(nomeObra, pavimento, tipoArea) {
    abrirCadastroUnidadesPavimento(nomeObra, pavimento, tipoArea);
}

function salvarUnidadePavimento(nomeObra, pavimento, tipoArea) {
    const terminacao = document.getElementById('inputTerminacao').value.trim();
    if (!terminacao) {
        alert('Informe a terminação ou número da unidade.');
        return;
    }
    const tipo = document.getElementById('selectTipologiaUnidade').value;
    const banheiros = tipo !== 'Studio' ? document.getElementById('selectBanheirosUnidade').value : '0';

    const novaUnidade = {
        unidade: terminacao,
        tipologia: tipo,
        banheiros: banheiros,
        suite: document.getElementById('checkSuiteUnidade').checked ? 'Sim' : 'Não',
        lavabo: document.getElementById('checkLavaboUnidade').checked ? 'Sim' : 'Não',
        areaServico: document.getElementById('checkAreaServicoUnidade').checked ? 'Sim' : 'Não',
        varanda: document.getElementById('checkVarandaUnidade').checked ? 'Sim' : 'Não',
        reforma: document.getElementById('selectReformaUnidade').value,
        piscina: pavimento.includes('piscina') ? 'Com piscina' : 'Sem piscina'
    };

    let lista = obterEmpreendimentos();
    let obraObj = lista.find(e => e.nome === nomeObra);
    if (!obraObj.detalhesPavimentos) obraObj.detalhesPavimentos = {};
    const chavePav = `${tipoArea.toUpperCase()} - ${pavimento}`;
    if (!obraObj.detalhesPavimentos[chavePav]) obraObj.detalhesPavimentos[chavePav] = [];

    if (indiceEdicaoUnidade !== null && indiceEdicaoUnidade >= 0) {
        obraObj.detalhesPavimentos[chavePav][indiceEdicaoUnidade] = novaUnidade;
    } else {
        obraObj.detalhesPavimentos[chavePav].push(novaUnidade);
    }

    salvarEmpreendimentos(lista);
    abrirCadastroUnidadesPavimento(nomeObra, pavimento, tipoArea);
}

function removerUnidadePavimento(nomeObra, pavimento, tipoArea, index) {
    if (confirm('Deseja realmente apagar esta unidade?')) {
        let lista = obterEmpreendimentos();
        let obraObj = lista.find(e => e.nome === nomeObra);
        const chavePav = `${tipoArea.toUpperCase()} - ${pavimento}`;
        if (obraObj && obraObj.detalhesPavimentos && obraObj.detalhesPavimentos[chavePav]) {
            obraObj.detalhesPavimentos[chavePav].splice(index, 1);
            salvarEmpreendimentos(lista);
            abrirCadastroUnidadesPavimento(nomeObra, pavimento, tipoArea);
        }
    }
}

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
                    <select id="selectTipologia" style="width: 100%; padding: 12px; margin: 8px 0 15px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                        <option value="Studio">Studio</option>
                        <option value="Quarto/Sala">Quarto/Sala</option>
                        <option value="2 Quartos">2 Quartos</option>
                        <option value="3 Quartos">3 Quartos</option>
                    </select>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0;">
                        <label style="display: flex; align-items: center; gap: 8px; color: white; cursor: pointer; font-size: 0.9rem;">
                            <input type="checkbox" id="checkSuite" style="width: 16px; height: 16px; accent-color: #3b82f6;"> Suíte
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; color: white; cursor: pointer; font-size: 0.9rem;">
                            <input type="checkbox" id="checkVaranda" style="width: 16px; height: 16px; accent-color: #3b82f6;"> Varanda
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; color: white; cursor: pointer; font-size: 0.9rem;">
                            <input type="checkbox" id="checkLavabo" style="width: 16px; height: 16px; accent-color: #3b82f6;"> Lavabo
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; color: white; cursor: pointer; font-size: 0.9rem;">
                            <input type="checkbox" id="checkAreaServico" style="width: 16px; height: 16px; accent-color: #3b82f6;"> Área de Serviço
                        </label>
                    </div>

                    <label style="color: #94a3b8; font-size: 0.9rem; display: block; margin-top: 10px;">Padrão / Reforma:</label>
                    <select id="selectReforma" style="width: 100%; padding: 12px; margin: 8px 0 10px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                        <option value="Padrão">Padrão</option>
                        <option value="Reforma">Reforma</option>
                    </select>

                    <label style="color: #94a3b8; font-size: 0.9rem; display: block; margin-top: 10px;">Piscina Privativa:</label>
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
                    <select id="selectFechamento" onchange="verificarOutroFechamento()" style="width: 100%; padding: 12px; margin: 8px 0 15px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                        <option value="Bloco de gesso">Bloco de gesso</option>
                        <option value="Bloco cerâmico">Bloco cerâmico</option>
                        <option value="Drywall">Drywall</option>
                        <option value="Outros">Outros (escrever)</option>
                    </select>

                    <div id="containerOutroFechamento" style="display: none; margin-top: 10px;">
                        <label style="color: #94a3b8; font-size: 0.9rem;">Especifique o fechamento interno:</label>
                        <input type="text" id="inputOutroFechamento" placeholder="Digite o tipo de fechamento" style="width: 100%; padding: 12px; margin-top: 8px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 8px;">
                    </div>
                </div>
                <button class="btn-primary" onclick="concluirCadastro()" style="text-align: center; margin-top: 15px; background-color: #16a34a;">
                    <h2>Salvar e Inserir na Lista ✅</h2>
                </button>
                <button class="btn-primary btn-back" onclick="carregarPassoWizard(3)" style="margin-top: 10px;">
                    <h2>⬅ Voltar</h2>
                </button>
            </main>
        `;
        setTimeout(verificarOutroFechamento, 50);
    }
}

function verificarOutroFechamento() {
    const select = document.getElementById('selectFechamento');
    const containerOutro = document.getElementById('containerOutroFechamento');
    if (!select || !containerOutro) return;
    if (select.value === 'Outros') {
        containerOutro.style.display = 'block';
    } else {
        containerOutro.style.display = 'none';
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
    const reforma = document.getElementById('selectReforma').value;

    novoEmpreendimentoTemp.tipologia = {
        tipo: tipo,
        suite: document.getElementById('checkSuite').checked ? 'Sim' : 'Não',
        lavabo: document.getElementById('checkLavabo').checked ? 'Sim' : 'Não',
        areaServico: document.getElementById('checkAreaServico').checked ? 'Sim' : 'Não',
        varanda: document.getElementById('checkVaranda').checked ? 'Sim' : 'Não',
        reforma: reforma,
        piscina: piscina
    };
    carregarPassoWizard(4);
}

function concluirCadastro() {
    const selectFechamento = document.getElementById('selectFechamento').value;
    let fechamento = selectFechamento;
    if (selectFechamento === 'Outros') {
        const outroInput = document.getElementById('inputOutroFechamento').value.trim();
        fechamento = outroInput || 'Outros';
    }
    novoEmpreendimentoTemp.fechamentoInterno = fechamento;
    
    let lista = obterEmpreendimentos();
    let index = lista.findIndex(e => e.nome === novoEmpreendimentoTemp.nome);
    
    if (index >= 0) {
        lista[index] = { ...lista[index], ...novoEmpreendimentoTemp };
    } else {
        lista.push(novoEmpreendimentoTemp);
    }
    
    salvarEmpreendimentos(lista);

    alert(`Empreendimento "${novoEmpreendimentoTemp.nome}" cadastrado e salvo com sucesso!`);
    voltarInicio();
}

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
    
    container.innerHTML = `
        <header>
            <img src="logo.png" alt="Conforme Obra" class="logo-img">
            <h1>CONFORME OBRA</h1>
            <p>${nomeObra} - Selecione o Tipo de Área</p>
        </header>
        <main class="menu-inicial">
            <button class="btn-primary" onclick="carregarVistoriaPavimentosTipo('${nomeObra}', 'privativa')">
                <h2>🏢 ÁREA PRIVATIVA</h2>
            </button>
            <button class="btn-primary" onclick="carregarVistoriaPavimentosTipo('${nomeObra}', 'comum')">
                <h2>🏛 ÁREA COMUM</h2>
            </button>
            <button class="btn-primary btn-back" onclick="carregarFasesObra('${nomeObra}')" style="margin-top: 10px;">
                <h2>⬅ Voltar às Fases</h2>
            </button>
        </main>
    `;
}

function carregarVistoriaPavimentosTipo(nomeObra, tipoArea) {
    const container = document.querySelector('.container');
    const pavimentos = obterPavimentosPorTipo(nomeObra, tipoArea);
    
    let botoesPavimentos = '';
    pavimentos.forEach(pav => {
        botoesPavimentos += `
            <button class="btn-primary" onclick="carregarTipoArea('${nomeObra}', '${pav}', '${tipoArea}')">
                <h2>${pav.toUpperCase()}</h2>
            </button>
        `;
    });

    container.innerHTML = `
        <header>
            <img src="logo.png" alt="Conforme Obra" class="logo-img">
            <h1>CONFORME OBRA</h1>
            <p>${nomeObra} - ${tipoArea === 'privativa' ? 'Área Privativa' : 'Área Comum'}</p>
        </header>
        <main class="menu-inicial">
            ${botoesPavimentos}
            <button class="btn-primary btn-back" onclick="carregarListaPavimentos('${nomeObra}')" style="margin-top: 10px;">
                <h2>⬅ Voltar aos Tipos</h2>
            </button>
        </main>
    `;
}

function carregarTipoArea(nomeObra, pavimento, tipoArea) {
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
            <button class="btn-primary" onclick="carregarListaApartamentos('${nomeObra}', '${pavimento}', '${tipoArea}')">
                <h2>ÁREA PRIVATIVA</h2>
            </button>
            <button class="btn-primary btn-back" onclick="carregarVistoriaPavimentosTipo('${nomeObra}', '${tipoArea}')" style="margin-top: 10px;">
                <h2>⬅ Voltar aos Pavimentos</h2>
            </button>
        </main>
    `;
}

function carregarListaApartamentos(nomeObra, pavimento, tipoArea) {
    const container = document.querySelector('.container');
    const lista = obterEmpreendimentos();
    const obraObj = lista.find(e => e.nome === nomeObra);
    
    let botoesUnidades = '';
    const chavePav = `${tipoArea.toUpperCase()} - ${pavimento}`;

    if (obraObj && obraObj.detalhesPavimentos && obraObj.detalhesPavimentos[chavePav] && obraObj.detalhesPavimentos[chavePav].length > 0) {
        const unidadesDoPav = obraObj.detalhesPavimentos[chavePav];
        unidadesDoPav.forEach(item => {
            botoesUnidades += `
                <button class="btn-primary" onclick="alert('Abrindo Vistoria do Apto ${item.unidade} - ${pavimento} | Tipologia: ${item.tipologia} | Banheiros: ${item.banheiros || 0} | Suíte: ${item.suite} | Varanda: ${item.varanda} | ${item.reforma || 'Padrão'}')">
                    <h2>APTO ${item.unidade} (${item.tipologia})</h2>
                </button>
            `;
        });
    } else {
        botoesUnidades = `<p style="color: #94a3b8; text-align: center; padding: 20px;">Nenhuma unidade cadastrada neste pavimento.</p>`;
    }

    container.innerHTML = `
        <header>
            <img src="logo.png" alt="Conforme Obra" class="logo-img">
            <h1>CONFORME OBRA</h1>
            <p>${nomeObra} - ${pavimento} - Selecione a Unidade</p>
        </header>
        <main class="menu-inicial">
            ${botoesUnidades}
            <button class="btn-primary btn-back" onclick="carregarTipoArea('${nomeObra}', '${pavimento}', '${tipoArea}')" style="margin-top: 10px;">
                <h2>⬅ Voltar às Áreas</h2>
            </button>
        </main>
    `;
}

function voltarInicio() {
    location.reload(); 
}

// ================= EXPOSIÇÃO GLOBAL PARA O WINDOW =================
window.navegar = navegar;
window.voltarInicio = voltarInicio;
window.carregarListaCadastro = carregarListaCadastro;
window.iniciarWizardCadastro = iniciarWizardCadastro;
window.gerenciarEmpreendimento = gerenciarEmpreendimento;
window.escolherPavimentosArea = escolherPavimentosArea;
window.abrirCadastroUnidadesPavimento = abrirCadastroUnidadesPavimento;
window.verificarTipologiaUnidade = verificarTipologiaUnidade;
window.carregarUnidadeParaEdicao = carregarUnidadeParaEdicao;
window.cancelarEdicaoUnidade = cancelarEdicaoUnidade;
window.salvarUnidadePavimento = salvarUnidadePavimento;
window.removerUnidadePavimento = removerUnidadePavimento;
window.carregarPassoWizard = carregarPassoWizard;
window.salvarPasso1 = salvarPasso1;
window.salvarPasso2 = salvarPasso2;
window.salvarPasso3 = salvarPasso3;
window.concluirCadastro = concluirCadastro;
window.verificarOutroFechamento = verificarOutroFechamento;
window.carregarFasesObra = carregarFasesObra;
window.carregarEstrutural = carregarEstrutural;
window.carregarListaPavimentos = carregarListaPavimentos;
window.carregarVistoriaPavimentosTipo = carregarVistoriaPavimentosTipo;
window.carregarTipoArea = carregarTipoArea;
window.carregarListaApartamentos = carregarListaApartamentos;
