import { db as dbConfig } from './firebaseConfig.js';
import { getFirestore, doc, getDoc, setDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const db = getFirestore();
const storage = getStorage();

const checklistsModelos = {
  "estrutural": [
    {
      "etapa": 1,
      "categoria": "Preparação e Locação Inicial",
      "itens": [
        "Verificação dos eixos, alinhamento e prumos em relação ao projeto geométrico.",
        "Limpeza inicial da base ou laje anterior, removendo poeira, serragem, pregos e detritos."
      ]
    },
    {
      "etapa": 2,
      "categoria": "Montagem de Fôrmas e Escoramento",
      "itens": [
        "Conferência das dimensões geométricas das fôrmas (largura, altura, espessura de paredes/lajes).",
        "Verificação da rigidez, estabilidade, apoios no solo e contraventamento do escoramento.",
        "Checagem de contra-flechas e alinhamento das vigas e pilares."
      ]
    }
  ],
  "arquitetonico": [
    {
      "etapa": 1,
      "categoria": "Dormitório / Cozinha",
      "itens": [
        "Contrapiso, Revestimentos e Rodapés",
        "Forro e Sancas de Gesso",
        "Tubulações, Tomadas, Interruptores e Luminárias",
        "Tubulações, Louças, Metais e Sifão",
        "Infraestrutura / Aparelho Ar-Condicionado",
        "Bancadas, Soleiras e Peitoris"
      ]
    }
  ]
};

let empresasPadrao = [
    {
        nome: 'VIVER BEM',
        empreendimentos: [
            { nome: 'ZEN LIFE', tipologia: ['Misto'], pavimentosTipo: 4, cobertura: 'Ambas', fechamento: ['Drywall'], tipoObra: 'Obra Nova' },
            { nome: 'ZOE', tipologia: ['2 Quartos'], pavimentosTipo: 2, cobertura: 'Privativa', fechamento: ['Drywall'], tipoObra: 'Obra Nova' },
            { nome: 'NAOKI', tipologia: ['Studio'], pavimentosTipo: 2, cobertura: 'Área Comum', fechamento: ['Drywall'], tipoObra: 'Obra Nova' },
            { nome: 'ZEUS', tipologia: ['3 Quartos'], pavimentosTipo: 2, cobertura: 'Ambas', fechamento: ['Alvenaria'], tipoObra: 'Obra Nova' },
            { nome: 'GRAND GARDEN', tipologia: ['2 Quartos'], pavimentosTipo: 3, cobertura: 'Privativa', fechamento: ['Drywall'], tipoObra: 'Obra Nova' }
        ]
    }
];

let empresaAtual = 'VIVER BEM';

function obterEmpresas() {
    const salvo = localStorage.getItem('conformeObra_empresas');
    if (salvo) return JSON.parse(salvo);
    localStorage.setItem('conformeObra_empresas', JSON.stringify(empresasPadrao));
    return empresasPadrao;
}

function salvarEmpresas(lista) {
    localStorage.setItem('conformeObra_empresas', JSON.stringify(lista));
}

function obterEmpreendimentos() {
    const empresas = obterEmpresas();
    const emp = empresas.find(e => e.nome === empresaAtual);
    return emp ? emp.empreendimentos : [];
}

function obterObraPorNome(nomeObra) {
    const lista = obterEmpreendimentos();
    return lista.find(o => o.nome === nomeObra);
}

function salvarEmpreendimentos(novaListaEmpreendimentos) {
    const empresas = obterEmpresas();
    const empIndex = empresas.findIndex(e => e.nome === empresaAtual);
    if (empIndex >= 0) {
        empresas[empIndex].empreendimentos = novaListaEmpreendimentos;
        salvarEmpresas(empresas);
    }
}

window.voltarInicio = function() {
    const container = document.getElementById('main-content');
    const empresas = obterEmpresas();

    let htmlEmpresas = '';
    empresas.forEach(emp => {
        htmlEmpresas += `
            <div class="card-menu" onclick="abrirEmpresa('${emp.nome}')">
                <div class="card-icon"><i class="fa-solid fa-building-user"></i></div>
                <div class="card-info">
                    <h2>${emp.nome}</h2>
                    <span>${emp.empreendimentos.length} empreendimento(s) cadastrado(s)</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
        `;
    });

    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-city"></i> Empresas & Grupos</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Selecione a empresa ou adicione uma nova</p>
        </div>
        <div class="menu-inicial">
            ${htmlEmpresas}
            <div class="card-menu" onclick="iniciarCadastroEmpresa()" style="border: 2px dashed var(--primary); background: rgba(37, 99, 235, 0.05);">
                <div class="card-icon"><i class="fa-solid fa-circle-plus"></i></div>
                <div class="card-info">
                    <h2 style="color: var(--primary);">ADICIONAR OUTRA EMPRESA</h2>
                    <span>Criar novo grupo/empresa</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
        </div>
    `;
};

window.iniciarCadastroEmpresa = function() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-circle-plus"></i> Adicionar Nova Empresa</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Insira o nome da nova empresa ou grupo</p>
        </div>
        <div class="menu-inicial" style="gap: 10px;">
            <div>
                <label style="font-size: 13px; font-weight: 600;">Nome da Empresa:</label>
                <input type="text" id="novoNomeEmpresa" placeholder="Ex: Construtora Horizonte">
            </div>
            <button class="btn-action" onclick="salvarNovaEmpresa()"><i class="fa-solid fa-check"></i> Salvar Empresa</button>
        </div>
        <button class="btn-action btn-back" onclick="voltarInicio()"><i class="fa-solid fa-house-chimney"></i> Voltar</button>
    `;
};

window.salvarNovaEmpresa = function() {
    const nome = document.getElementById('novoNomeEmpresa').value.trim();
    if (!nome) {
        alert("Por favor, informe o nome da empresa.");
        return;
    }
    const empresas = obterEmpresas();
    if (empresas.some(e => e.nome.toUpperCase() === nome.toUpperCase())) {
        alert("Já existe uma empresa com este nome.");
        return;
    }
    empresas.push({ nome: nome.toUpperCase(), empreendimentos: [] });
    salvarEmpresas(empresas);
    alert("Empresa cadastrada com sucesso!");
    voltarInicio();
};

window.abrirEmpresa = function(nomeEmpresa) {
    empresaAtual = nomeEmpresa;
    const container = document.getElementById('main-content');

    container.innerHTML = `
        <div class="app-header" style="border-bottom: none; margin-bottom: 10px; padding-bottom: 0;">
            <div class="header-titles">
                <h1 style="color: var(--primary);"><i class="fa-solid fa-building"></i> ${empresaAtual}</h1>
                <p>Painel de Gestão e Vistoria</p>
            </div>
        </div>
        
        <div class="menu-inicial" style="margin-top: 15px;">
            <div class="card-menu" onclick="navegar('vistoria')">
                <div class="card-icon"><i class="fa-solid fa-clipboard-check"></i></div>
                <div class="card-info">
                    <h2>VISTORIA</h2>
                    <span>Checklists de execução estrutural e arquitetônica</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>

            <div class="card-menu" onclick="navegar('cadastros')">
                <div class="card-icon"><i class="fa-solid fa-building-shield"></i></div>
                <div class="card-info">
                    <h2>CADASTROS & PROJETOS</h2>
                    <span>Gerenciar empreendimentos e envio de PDFs</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>

            <div class="card-menu" onclick="navegar('cronograma')">
                <div class="card-icon"><i class="fa-solid fa-timeline"></i></div>
                <div class="card-info">
                    <h2>CRONOGRAMA</h2>
                    <span>Acompanhamento do avanço físico</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>

            <div class="card-menu" onclick="navegar('indicadores')">
                <div class="card-icon"><i class="fa-solid fa-chart-pie"></i></div>
                <div class="card-info">
                    <h2>INDICADORES</h2>
                    <span>Painel consolidado de conformidades</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
        </div>

        <button class="btn-action btn-back" onclick="voltarInicio()"><i class="fa-solid fa-arrow-left"></i> Voltar para Lista de Empresas</button>
    `;
};

window.navegar = function(destino) {
    const container = document.getElementById('main-content');
    const lista = obterEmpreendimentos();

    if (destino === 'vistoria') {
        let botoesObras = '';
        if (lista.length === 0) {
            botoesObras = `<p style="color: var(--text-muted); text-align:center; padding: 20px;">Nenhum empreendimento cadastrado.</p>`;
        } else {
            lista.forEach(obra => {
                const badgeTipo = obra.tipoObra === 'Reforma' ? '<span style="color: #facc15; font-size: 11px; margin-left: 5px;">(Reforma)</span>' : '';
                botoesObras += `
                    <div class="card-menu" onclick="escolherDisciplinaVistoria('${obra.nome}')">
                        <div class="card-icon"><i class="fa-solid fa-folder-open"></i></div>
                        <div class="card-info">
                            <h2>${obra.nome} ${badgeTipo}</h2>
                            <span>Selecionar disciplina para vistoria</span>
                        </div>
                        <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                    </div>
                `;
            });
        }

        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-clipboard-check"></i> Vistoria: ${empresaAtual}</h3>
                <p style="font-size: 13px; color: var(--text-muted);">Escolha o empreendimento para iniciar a vistoria</p>
            </div>
            <div class="menu-inicial">${botoesObras}</div>
            <button class="btn-action btn-back" onclick="abrirEmpresa('${empresaAtual}')"><i class="fa-solid fa-arrow-left"></i> Voltar ao Painel</button>
        `;
    } else if (destino === 'cadastros') {
        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-building-shield"></i> Cadastros & Projetos</h3>
                <p style="font-size: 13px; color: var(--text-muted);">Gerencie empreendimentos e envie projetos</p>
            </div>
            <div class="menu-inicial">
                <div class="card-menu" onclick="carregarListaCadastro()">
                    <div class="card-icon"><i class="fa-solid fa-list-check"></i></div>
                    <div class="card-info">
                        <h2>ESCOLHER DA LISTA</h2>
                        <span>Gerenciar projetos por disciplina e pavimento</span>
                    </div>
                    <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                </div>
                <div class="card-menu" onclick="iniciarWizardCadastro()">
                    <div class="card-icon"><i class="fa-solid fa-circle-plus"></i></div>
                    <div class="card-info">
                        <h2>CADASTRAR NOVO EMPREENDIMENTO</h2>
                        <span>Adicionar nova obra ou reforma ao sistema</span>
                    </div>
                    <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            </div>
            <button class="btn-action btn-back" onclick="abrirEmpresa('${empresaAtual}')"><i class="fa-solid fa-arrow-left"></i> Voltar ao Painel</button>
        `;
    } else if (destino === 'cronograma') {
        carregarCronogramaGeral();
    } else if (destino === 'indicadores') {
        carregarPainelIndicadores();
    }
};

window.escolherDisciplinaVistoria = function(nomeObra) {
    const obra = obterObraPorNome(nomeObra);
    const container = document.getElementById('main-content');

    if (obra && obra.tipoObra === 'Reforma') {
        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-hammer"></i> ${nomeObra} (Reforma)</h3>
                <p style="font-size: 13px; color: var(--text-muted);">Módulo de vistorias e controle específico para Reformas</p>
            </div>
            <div class="menu-inicial">
                <div class="card-menu" onclick="alert('Módulo de Reformas em estruturação. Em breve!')">
                    <div class="card-icon"><i class="fa-solid fa-list-check"></i></div>
                    <div class="card-info">
                        <h2>CHECKLIST DE REFORMA</h2>
                        <span>Acompanhamento de diretrizes de reforma</span>
                    </div>
                    <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            </div>
            <button class="btn-action btn-back" onclick="navegar('vistoria')"><i class="fa-solid fa-arrow-left"></i> Voltar para Obras</button>
        `;
        return;
    }

    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-diagram-project"></i> ${nomeObra}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Selecione a disciplina correspondente para iniciar a vistoria</p>
        </div>

        <div class="menu-inicial">
            <div class="card-menu" onclick="abrirVistoriaObra('${nomeObra}', 'estrutural', 'Geral', 'Geral', 'Geral')">
                <div class="card-icon"><i class="fa-solid fa-helmet-safety"></i></div>
                <div class="card-info">
                    <h2>PROJETO ESTRUTURAL</h2>
                    <span>Checklist de execução, armações e concreto</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>

            <div class="card-menu" onclick="escolherTipoAreaArquitetonica('${nomeObra}')">
                <div class="card-icon"><i class="fa-solid fa-compass-drafting"></i></div>
                <div class="card-info">
                    <h2>PROJETO ARQUITETÔNICO</h2>
                    <span>Checklist de alvenaria, vãos e acabamentos</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
        </div>

        <button class="btn-action btn-back" onclick="navegar('vistoria')"><i class="fa-solid fa-arrow-left"></i> Voltar para Obras</button>
    `;
};

window.escolherTipoAreaArquitetonica = function(nomeObra) {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-compass-drafting"></i> ${nomeObra} (Arquitetônico)</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Selecione o tipo de área para a vistoria</p>
        </div>

        <div class="menu-inicial">
            <div class="card-menu" onclick="abrirPainelVistoriaUnificado('${nomeObra}', 'Área Privativa')">
                <div class="card-icon"><i class="fa-solid fa-door-open"></i></div>
                <div class="card-info">
                    <h2>ÁREA PRIVATIVA</h2>
                    <span>Apartamentos e unidades habitacionais</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>

            <div class="card-menu" onclick="escolherPavimentoComum('${nomeObra}')">
                <div class="card-icon"><i class="fa-solid fa-people-roof"></i></div>
                <div class="card-info">
                    <h2>ÁREA COMUM</h2>
                    <span>Halls, portaria, lazer e circulação</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
        </div>

        <button class="btn-action btn-back" onclick="escolherDisciplinaVistoria('${nomeObra}')"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;
};

window.escolherPavimentoComum = function(nomeObra) {
    const container = document.getElementById('main-content');
    const setoresComuns = ['Térreo / Portaria', 'Área de Lazer', 'Cobertura / Comum', 'Subsolo / Garagem'];
    let htmlPavimentos = '';
    setoresComuns.forEach(setor => {
        htmlPavimentos += `
            <div class="card-menu" onclick="abrirVistoriaObra('${nomeObra}', 'arquitetonico', 'Área Comum', '${setor}', 'Setor Comum')">
                <div class="card-icon"><i class="fa-solid fa-layer-group"></i></div>
                <div class="card-info">
                    <h2>${setor.toUpperCase()}</h2>
                    <span>Iniciar checklist de área comum</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
        `;
    });

    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-building-user"></i> ${nomeObra} (Área Comum)</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Selecione o setor catalogado</p>
        </div>
        <div class="menu-inicial">${htmlPavimentos}</div>
        <button class="btn-action btn-back" onclick="escolherTipoAreaArquitetonica('${nomeObra}')"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;
};

// --- NOVO PAINEL UNIFICADO DE VISTORIA COM BOTÕES DE PAVIMENTO E NÚMEROS DE UNIDADES (EXATAMENTE COMO OS PRINTS) ---
window.abrirPainelVistoriaUnificado = function(nomeObra, tipoArea) {
    const container = document.getElementById('main-content');
    const obra = obterObraPorNome(nomeObra);
    const qtdPav = obra ? obra.pavimentosTipo : 4;

    let pavSelecionado = 1;
    let unidadeSelecionada = `${pavSelecionado}01`;
    let tipoVistoriaSelecionado = 'Padrão Construtora';

    function renderizarPainel() {
        // Gera botões de pavimentos
        let botoesPav = '';
        for (let p = 1; p <= qtdPav; p++) {
            const ativo = pavSelecionado === p ? 'background: var(--primary); color: white; border-color: var(--primary);' : 'background: rgba(255,255,255,0.05); color: var(--text-main);';
            botoesPav += `<button onclick="window.mudarPavimentoVistoria(${p})" style="padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-color); font-weight: 600; cursor: pointer; ${ativo}">${p}º Pav</button>`;
        }

        // Gera unidades do pavimento selecionado (14 unidades para 1º, 2º e 3º; 12 unidades para o 4º)
        const totalUnidades = (pavSelecionado === 4) ? 12 : 14;
        let botoesUnidades = '';
        for (let u = 1; u <= totalUnidades; u++) {
            const numStr = u < 10 ? `0${u}` : `${u}`;
            const numUnidade = `${pavSelecionado}${numStr}`;
            const ativoUnit = unidadeSelecionada === numUnidade ? 'background: #ef4444; color: white; border-color: #ef4444;' : 'background: rgba(255,255,255,0.05); color: var(--text-main);';
            botoesUnidades += `<button onclick="window.mudarUnidadeVistoria('${numUnidade}')" style="padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-color); font-weight: 600; cursor: pointer; font-size: 13px; ${ativoUnit}">${numUnidade}</button>`;
        }

        container.innerHTML = `
            <div style="background: rgba(15, 23, 42, 0.4); padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 15px; font-size: 13px; display: flex; justify-content: space-between; align-items: center;">
                <div><i class="fa-solid fa-user-tie"></i> <strong>Responsável Confirmado</strong><br><span style="color: var(--text-muted);">Vistoriador: Bruno</span></div>
            </div>

            <div style="background: rgba(15, 23, 42, 0.4); padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 15px;">
                <label style="font-size: 13px; font-weight: bold; color: var(--primary); display: block; margin-bottom: 10px; text-align: center;">1. Selecione o Pavimento</label>
                <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">${botoesPav}</div>
            </div>

            <div style="background: rgba(15, 23, 42, 0.4); padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 15px;">
                <label style="font-size: 13px; font-weight: bold; color: var(--primary); display: block; margin-bottom: 10px; text-align: center;">2. Selecione a Unidade</label>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 6px;">${botoesUnidades}</div>
            </div>

            <div style="background: rgba(15, 23, 42, 0.4); padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 15px;">
                <label style="font-size: 13px; font-weight: bold; color: var(--primary); display: block; margin-bottom: 10px; text-align: center;">3. Tipo de Vistoria</label>
                <div style="display: flex; gap: 10px;">
                    <button onclick="window.mudarTipoVistoria('Padrão Construtora')" style="flex: 1; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); font-weight: bold; cursor: pointer; ${tipoVistoriaSelecionado === 'Padrão Construtora' ? 'background: var(--primary); color: white;' : 'background: rgba(255,255,255,0.05); color: var(--text-main);'}">Padrão Construtora</button>
                    <button onclick="window.mudarTipoVistoria('Reforma / Aditivo')" style="flex: 1; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); font-weight: bold; cursor: pointer; ${tipoVistoriaSelecionado === 'Reforma / Aditivo' ? 'background: var(--primary); color: white;' : 'background: rgba(255,255,255,0.05); color: var(--text-main);'}">Reforma / Aditivo</button>
                </div>
            </div>

            <div id="containerChecklistItens"></div>

            <button class="btn-action btn-back" onclick="escolherTipoAreaArquitetonica('${nomeObra}')" style="margin-top: 15px;"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
        `;

        renderizarChecklistItens(nomeObra, tipoArea, `${pavSelecionado}º Pavimento`, `Apto ${unidadeSelecionada}`);
    }

    window.mudarPavimentoVistoria = function(p) {
        pavSelecionado = p;
        unidadeSelecionada = `${p}01`;
        renderizarPainel();
    };

    window.mudarUnidadeVistoria = function(u) {
        unidadeSelecionada = u;
        renderizarPainel();
    };

    window.mudarTipoVistoria = function(t) {
        tipoVistoriaSelecionado = t;
        renderizarPainel();
    };

    renderizarPainel();
};

function renderizarChecklistItens(nomeObra, tipoArea, pavimento, unidade) {
    const container = document.getElementById('containerChecklistItens');
    const checklistData = checklistsModelos["arquitetonico"];
    let html = '';

    checklistData.forEach((bloco, bIdx) => {
        html += `
            <div style="background: rgba(15, 23, 42, 0.4); padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 15px;">
                <h4 style="font-size: 14px; color: var(--primary); margin-bottom: 12px;"><i class="fa-solid fa-book"></i> ${bloco.categoria}</h4>
                <div style="display: flex; flex-direction: column; gap: 10px;">
        `;

        bloco.itens.forEach((itemText, iIdx) => {
            const itemKey = `chk_${bIdx}_${iIdx}`;
            html += `
                <div style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <span style="font-size: 13px; color: var(--text-main); flex: 1; min-width: 200px;">${iIdx + 1}. ${itemText}</span>
                    <div style="display: flex; gap: 6px;">
                        <button id="btn_conf_${itemKey}" onclick="window.marcarStatusItem('${itemKey}', 'conforme')" style="padding: 6px 12px; border-radius: 6px; border: 1px solid #16a34a; background: #16a34a; color: white; font-size: 12px; font-weight: bold; cursor: pointer;">Conforme ✓</button>
                        <button id="btn_nao_${itemKey}" onclick="window.marcarStatusItem('${itemKey}', 'nao_conforme')" style="padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: rgba(255,255,255,0.05); color: var(--text-muted); font-size: 12px; font-weight: bold; cursor: pointer;">Não Conforme X</button>
                    </div>
                </div>
                <div id="painel_nc_${itemKey}" style="display: none; background: rgba(239, 68, 68, 0.05); border: 1px dashed #ef4444; border-radius: 6px; padding: 12px; margin-top: 6px; flex-direction: column; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #ef4444; font-weight: bold; font-size: 12px;"><i class="fa-solid fa-triangle-exclamation"></i> PENDÊNCIA #1</span>
                        <div style="display: flex; gap: 10px; font-size: 12px;">
                            <span style="color: #16a34a; cursor: pointer; font-weight: bold;" onclick="window.fecharNC('${itemKey}')">Sanar ✓</span>
                            <span style="color: #ef4444; cursor: pointer; font-weight: bold;" onclick="window.fecharNC('${itemKey}')">Excluir X</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap; font-size: 11px;">
                        <label><input type="checkbox"> Peça Oca / Solta</label>
                        <label><input type="checkbox"> Junta Desalinhada</label>
                        <label><input type="checkbox"> Caimento Incorreto (Poça)</label>
                        <label><input type="checkbox"> Rodapé Solto / Danificado</label>
                        <label><input type="checkbox"> Falta Rejunte no Piso</label>
                        <label><input type="checkbox"> Piso Riscado / Manchado</label>
                    </div>
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 8px;">
                        <div>
                            <label style="font-size: 11px; color: var(--text-muted);">Serviço / Responsável:</label>
                            <select style="width:100%; padding: 6px; font-size: 11px; background: rgba(15,23,42,0.6); color: white; border: 1px solid var(--border-color); border-radius: 4px;"><option>Escolher depois / A definir...</option></select>
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--text-muted);">Data Início:</label>
                            <input type="date" value="2026-08-01" style="width:100%; padding: 6px; font-size: 11px; background: rgba(15,23,42,0.6); color: white; border: 1px solid var(--border-color); border-radius: 4px;">
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--text-muted);">Dias Úteis:</label>
                            <input type="number" value="3" style="width:100%; padding: 6px; font-size: 11px; background: rgba(15,23,42,0.6); color: white; border: 1px solid var(--border-color); border-radius: 4px;">
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div>
                            <label style="font-size: 11px; color: var(--text-muted);">Status:</label>
                            <select style="width:100%; padding: 6px; font-size: 11px; background: rgba(15,23,42,0.6); color: white; border: 1px solid var(--border-color); border-radius: 4px;"><option>Aguardando Início</option></select>
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--text-muted);">Gravidade:</label>
                            <select style="width:100%; padding: 6px; font-size: 11px; background: rgba(15,23,42,0.6); color: white; border: 1px solid var(--border-color); border-radius: 4px;"><option>Baixa</option><option>Média</option><option>Alta</option></select>
                        </div>
                    </div>
                    <div>
                        <label style="font-size: 11px; color: var(--text-muted);">Observação Técnica:</label>
                        <input type="text" placeholder="Detalhes..." style="width:100%; padding: 6px; font-size: 11px; background: rgba(15,23,42,0.6); color: white; border: 1px solid var(--border-color); border-radius: 4px;">
                    </div>
                    <div>
                        <label style="font-size: 11px; color: var(--text-muted);">Fotos Anexadas:</label>
                        <input type="file" style="font-size: 11px; width: 100%; padding: 4px; background: rgba(15,23,42,0.6); color: white; border: 1px solid var(--border-color); border-radius: 4px;">
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
    });

    container.innerHTML = html;
}

window.marcarStatusItem = function(itemKey, status) {
    const btnConf = document.getElementById(`btn_conf_${itemKey}`);
    const btnNao = document.getElementById(`btn_nao_${itemKey}`);
    const painelNC = document.getElementById(`painel_nc_${itemKey}`);

    if (status === 'conforme') {
        btnConf.style.background = '#16a34a';
        btnConf.style.borderColor = '#16a34a';
        btnConf.style.color = 'white';
        btnNao.style.background = 'rgba(255,255,255,0.05)';
        btnNao.style.color = 'var(--text-muted)';
        btnNao.style.borderColor = 'var(--border-color)';
        painelNC.style.display = 'none';
    } else {
        btnNao.style.background = '#ef4444';
        btnNao.style.borderColor = '#ef4444';
        btnNao.style.color = 'white';
        btnConf.style.background = 'rgba(255,255,255,0.05)';
        btnConf.style.color = 'var(--text-muted)';
        btnConf.style.borderColor = 'var(--border-color)';
        painelNC.style.display = 'flex';
    }
};

window.fecharNC = function(itemKey) {
    document.getElementById(`painel_nc_${itemKey}`).style.display = 'none';
    window.marcarStatusItem(itemKey, 'conforme');
};

window.abrirVistoriaObra = function(nomeObra, disciplina, tipoArea, pavimento, unidade) {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-clipboard-list"></i> ${nomeObra}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">${disciplina} • ${tipoArea} • ${pavimento} • ${unidade}</p>
        </div>
        <div id="containerChecklistItens"></div>
        <button class="btn-action btn-back" onclick="escolherPavimentoComum('${nomeObra}')" style="margin-top: 15px;"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;
    renderizarChecklistItens(nomeObra, tipoArea, pavimento, unidade);
};

window.carregarCronogramaGeral = function() {
    const container = document.getElementById('main-content');
    const lista = obterEmpreendimentos();
    let htmlObra = '';

    lista.forEach((obra, idx) => {
        htmlObra += `
            <div style="background: rgba(15, 23, 42, 0.4); padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 12px;">
                <h4 style="color: var(--primary); font-size: 14px; margin-bottom: 6px;">${obra.nome} <span style="font-size: 11px; color: var(--text-muted);">(${obra.tipoObra || 'Obra Nova'})</span></h4>
                <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">Tipologia: ${obra.tipologia.join(', ')} | Pavimentos: ${obra.pavimentosTipo}</div>
                <label style="font-size: 12px; font-weight: 600;">Progresso Físico Atual:</label>
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 4px;">
                    <input type="range" min="0" max="100" value="${(idx + 1) * 15}" style="flex: 1; accent-color: var(--primary);" disabled>
                    <span style="font-size: 12px; font-weight: bold; color: var(--text-main);">${(idx + 1) * 15}%</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-timeline"></i> Cronograma: ${empresaAtual}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Acompanhamento do avanço físico dos empreendimentos</p>
        </div>
        <div class="menu-inicial">${htmlObra}</div>
        <button class="btn-action btn-back" onclick="abrirEmpresa('${empresaAtual}')"><i class="fa-solid fa-arrow-left"></i> Voltar ao Painel</button>
    `;
};

window.carregarPainelIndicadores = function() {
    const container = document.getElementById('main-content');
    const totalObras = obterEmpreendimentos().length;

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-chart-pie"></i> Indicadores: ${empresaAtual}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Visão consolidada da gestão de obras</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            <div style="background: rgba(15, 23, 42, 0.6); padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; text-align: center;">
                <span style="font-size: 22px; font-weight: bold; color: var(--primary);">${totalObras}</span>
                <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Obras Cadastradas</p>
            </div>
            <div style="background: rgba(15, 23, 42, 0.6); padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; text-align: center;">
                <span style="font-size: 22px; font-weight: bold; color: #22c55e;">94.2%</span>
                <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Conformidade Média</p>
            </div>
        </div>
        <button class="btn-action btn-back" onclick="abrirEmpresa('${empresaAtual}')"><i class="fa-solid fa-arrow-left"></i> Voltar ao Painel</button>
    `;
};

window.carregarListaCadastro = function() {
    const container = document.getElementById('main-content');
    const lista = obterEmpreendimentos();
    let htmlObras = '';
    
    lista.forEach(obra => {
        htmlObras += `
            <div class="card-menu" onclick="escolherDisciplinaObra('${obra.nome}')">
                <div class="card-icon"><i class="fa-solid fa-building"></i></div>
                <div class="card-info">
                    <h2>${obra.nome} <span style="font-size: 11px; color: var(--text-muted); font-weight: normal;">(${obra.tipoObra || 'Obra Nova'})</span></h2>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
        `;
    });

    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-list-check"></i> Escolher Obra</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Selecione o empreendimento para gerenciar os projetos</p>
        </div>
        <div class="menu-inicial">${htmlObras}</div>
        <button class="btn-action btn-back" onclick="navegar('cadastros')"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;
};

window.escolherDisciplinaObra = function(nomeObra) {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-diagram-project"></i> ${nomeObra}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Selecione a disciplina do projeto para envio</p>
        </div>
        <div class="menu-inicial">
            <div class="card-menu" onclick="abrirGerenciadorUpload('${nomeObra}', 'arquitetonico')">
                <div class="card-icon"><i class="fa-solid fa-compass-drafting"></i></div>
                <div class="card-info">
                    <h2>PROJETO ARQUITETÔNICO</h2>
                    <span>Gerenciar e enviar plantas e cortes</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
            <div class="card-menu" onclick="abrirGerenciadorUpload('${nomeObra}', 'estrutural')">
                <div class="card-icon"><i class="fa-solid fa-helmet-safety"></i></div>
                <div class="card-info">
                    <h2>PROJETO ESTRUTURAL</h2>
                    <span>Gerenciar pavimentos estruturais e fundações</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
        </div>
        <button class="btn-action btn-back" onclick="carregarListaCadastro()"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;
};

window.abrirGerenciadorUpload = async function(nomeObra, disciplina) {
    const container = document.getElementById('main-content');
    const obraId = nomeObra.toLowerCase().replace(/\s+/g, '_');
    const disciplinaNome = disciplina === 'estrutural' ? 'Projeto Estrutural' : 'Projeto Arquitetônico';

    let optionsPavimentos = '<option value="terreo">Térreo</option><option value="1_pavimento">1º Pavimento</option><option value="2_pavimento">2º Pavimento</option><option value="3_pavimento">3º Pavimento</option><option value="4_pavimento">4º Pavimento</option>';

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-cloud-arrow-up"></i> ${nomeObra}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">${disciplinaNome} - Upload e Listagem por Pavimento</p>
        </div>
        <div class="upload-section">
            <label style="font-size: 13px; font-weight: 600; color: var(--text-main);">Selecione o Pavimento:</label>
            <select id="selectPavimentoModulo">${optionsPavimentos}</select>
            <label style="font-size: 13px; font-weight: 600; color: var(--text-main); display:block; margin-top: 10px;">Arquivo PDF:</label>
            <input type="file" id="pdfFileModulo" accept="application/pdf">
            <button class="btn-action" id="uploadBtnModulo"><i class="fa-solid fa-upload"></i> Enviar Arquivo PDF</button>
            <div class="arquivos-list-section">
                <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--text-main);">Arquivos Disponíveis</h4>
                <ul id="listaArquivosModulo"><li>Carregando...</li></ul>
            </div>
        </div>
        <button class="btn-action btn-back" onclick="escolherDisciplinaObra('${nomeObra}')"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;

    const selectPav = document.getElementById('selectPavimentoModulo');

    async function carregarArquivos(pavId) {
        const listaElement = document.getElementById('listaArquivosModulo');
        listaElement.innerHTML = "<li>Carregando projetos...</li>";
        try {
            const docRef = doc(db, "obras", obraId, disciplina, pavId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().arquivos && docSnap.data().arquivos.length > 0) {
                listaElement.innerHTML = "";
                docSnap.data().arquivos.forEach(arq => {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="${arq.url}" target="_blank" style="color: var(--primary);"><i class="fa-regular fa-file-pdf"></i> ${arq.nome}</a>`;
                    listaElement.appendChild(li);
                });
            } else {
                listaElement.innerHTML = "<li>Nenhum projeto cadastrado neste pavimento.</li>";
            }
        } catch (error) {
            listaElement.innerHTML = "<li>Erro ao carregar arquivos.</li>";
        }
    }

    selectPav.addEventListener('change', (e) => carregarArquivos(e.target.value));
    carregarArquivos(selectPav.value);

    document.getElementById('uploadBtnModulo').addEventListener('click', async () => {
        const fileInput = document.getElementById('pdfFileModulo');
        const file = fileInput.files[0];
        const pavimentoId = selectPav.value;
        if (!file) { alert("Selecione um arquivo PDF."); return; }

        try {
            const storageRef = ref(storage, `obras/${obraId}/${disciplina}/${pavimentoId}/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const urlDownload = await getDownloadURL(snapshot.ref);

            const docRef = doc(db, "obras", obraId, disciplina, pavimentoId);
            await setDoc(docRef, { arquivos: arrayUnion({ nome: file.name, url: urlDownload, dataUpload: new Date() }) }, { merge: true });

            alert("Upload concluído com sucesso!");
            carregarArquivos(pavimentoId);
            fileInput.value = "";
        } catch (error) {
            alert("Falha ao enviar arquivo.");
        }
    });
};

window.iniciarWizardCadastro = function() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-circle-plus"></i> Novo Empreendimento (${empresaAtual})</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Preencha as configurações do novo empreendimento</p>
        </div>
        <div class="menu-inicial" style="gap: 12px;">
            <div>
                <label style="font-size: 13px; font-weight: 600;">Nome da Obra:</label>
                <input type="text" id="novoNomeObra" placeholder="Ex: Residencial Bella Vista">
            </div>
            <div>
                <label style="font-size: 13px; font-weight: 600;">Tipo de Empreendimento:</label>
                <select id="novoTipoObra" style="width: 100%; padding: 10px; margin-top: 5px; background: rgba(15,23,42,0.6); color: white; border: 1px solid var(--border-color); border-radius: 6px; font-size: 13px;">
                    <option value="Obra Nova">Obra Nova (Padrão Completo: Estrutural + Arquitetônico)</option>
                    <option value="Reforma">Reforma (Módulo Específico)</option>
                </select>
            </div>
            <div>
                <label style="font-size: 13px; font-weight: 600;">Quantidade de Pavimentos Tipo:</label>
                <input type="number" id="novoQtdPavimentos" value="4" min="1" max="50">
            </div>
            <button class="btn-action" onclick="salvarNovoEmpreendimento()"><i class="fa-solid fa-check"></i> Salvar Empreendimento</button>
        </div>
        <button class="btn-action btn-back" onclick="navegar('cadastros')"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;
};

window.salvarNovoEmpreendimento = function() {
    const nome = document.getElementById('novoNomeObra').value.trim();
    const tipoObra = document.getElementById('novoTipoObra').value;
    const qtdPavimentos = parseInt(document.getElementById('novoQtdPavimentos').value) || 1;
    if (!nome) { alert("Por favor, informe o nome da obra."); return; }

    const lista = obterEmpreendimentos();
    lista.push({ 
        nome: nome.toUpperCase(), 
        tipologia: ['Padrão'], 
        pavimentosTipo: qtdPavimentos, 
        cobertura: 'Privativa', 
        fechamento: ['Drywall'],
        tipoObra: tipoObra 
    });
    salvarEmpreendimentos(lista);
    alert("Empreendimento cadastrado com sucesso!");
    carregarListaCadastro();
};

window.addEventListener('DOMContentLoaded', () => {
    voltarInicio();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW falhou', err));
    });
}
// --- Estrutura de Dados Mockada (Persistência) ---
function getDb() {
    const data = localStorage.getItem('vistoria_db');
    return data ? JSON.parse(data) : { obras: { "Obra Exemplo": { unidades: {} } } };
}

function saveDb(db) {
    localStorage.setItem('vistoria_db', JSON.stringify(db));
}

// --- Variáveis de Estado ---
let state = {
    obra: "Obra Exemplo",
    pavimento: null,
    unidade: null,
    tipoVistoria: null, // "padrao" ou "reforma"
    checklist: [] // Itens da vistoria atual
};

// --- Funções de Navegação ---

window.renderPavimentos = function() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <h3>1. Selecione o Pavimento</h3>
        <div style="display:flex; gap:10px; margin-bottom:20px;">
            ${[1, 2, 3, 4].map(p => `<button onclick="selecionarPavimento(${p})" class="btn-nav">${p}º Pav</button>`).join('')}
        </div>
    `;
};

window.selecionarPavimento = function(pav) {
    state.pavimento = pav;
    const container = document.getElementById('main-content');
    
    // Gera unidades baseadas na lógica anterior
    const total = (pav === 4) ? 12 : 14;
    let unidadesHtml = '';
    for(let i=1; i<=total; i++) {
        const num = `${pav}${i < 10 ? '0'+i : i}`;
        unidadesHtml += `<button onclick="selecionarUnidade('${num}')" class="btn-unidade">${num}</button>`;
    }

    container.innerHTML += `
        <h3>2. Selecione a Unidade</h3>
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px;">${unidadesHtml}</div>
    `;
};

window.selecionarUnidade = function(unidade) {
    state.unidade = unidade;
    const container = document.getElementById('main-content');
    container.innerHTML += `
        <h3>3. Tipo de Vistoria</h3>
        <div style="display:flex; gap:10px;">
            <button onclick="iniciarVistoria('padrao')" class="btn-nav">Padrão Construtora</button>
            <button onclick="iniciarVistoria('reforma')" class="btn-nav">Reforma / Aditivo</button>
        </div>
    `;
};

window.iniciarVistoria = function(tipo) {
    state.tipoVistoria = tipo;
    const db = getDb();
    const unidadeData = db.obras[state.obra].unidades[state.unidade] || { vistorias: [] };
    
    // Lógica 1ª Vistoria vs Revistoria
    const count = unidadeData.vistorias.length;
    const labelVistoria = count === 0 ? "1ª Vistoria" : `${count}ª Revistoria`;

    renderChecklist(labelVistoria);
};

// --- Funções de Estado ---
let respostas = {}; // Armazena { id: 'conforme' ou 'nao-conforme' }
const totalItens = 2; // Quantidade total de itens no seu checklist atual

window.setOption = function(id, option) {
    respostas[id] = option;
    
    // Atualiza visual dos botões
    document.querySelectorAll(`#content-${id} button`).forEach(btn => btn.style.background = '#334155');
    const selectedBtn = document.getElementById(`btn-${option === 'conforme' ? 'c' : 'nc'}-${id}`);
    selectedBtn.style.background = option === 'conforme' ? '#16a34a' : '#dc2626';

    // Atualiza a fita (tag) instantaneamente
    updateStatusTag();
};

function updateStatusTag() {
    const container = document.getElementById('status-tag-container');
    const valores = Object.values(respostas);
    
    // Se não houver nada marcado, não mostra nada
    if (valores.length === 0) {
        container.innerHTML = '';
        return;
    }

    const temNaoConforme = valores.includes('nao-conforme');
    
    if (temNaoConforme) {
        // Fita Vermelha
        container.innerHTML = `
            <div style="background:#dc2626; color:white; padding:12px; width:100%; text-align:center; font-weight:bold; border-radius:5px; margin-bottom:15px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                <i class="fa-solid fa-triangle-exclamation"></i> PENDÊNCIAS IDENTIFICADAS
            </div>
        `;
    } else {
        // Fita Verde
        container.innerHTML = `
            <div style="background:#16a34a; color:white; padding:12px; width:100%; text-align:center; font-weight:bold; border-radius:5px; margin-bottom:15px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                <i class="fa-solid fa-check"></i> TUDO OK
            </div>
        `;
    }
}

// --- Renderização (Atualizada) ---
window.renderChecklist = function(titulo) {
    const container = document.getElementById('main-content');
    const itens = [
        { id: 1, desc: "Contrapiso, Revestimentos e Rodapés" },
        { id: 2, desc: "Forro e Sancas de Gesso" }
    ];

    container.innerHTML = `
        <div style="margin-bottom:20px;">
            <h3 style="color:#3b82f6; margin-bottom:10px;">${titulo} - ${state.unidade}</h3>
            <!-- Container onde as fitas aparecerão -->
            <div id="status-tag-container"></div> 
        </div>
        
        <div id="items-container">
            ${itens.map(item => `
                <div class="card-item" style="border:1px solid #475569; margin-bottom:10px; border-radius:8px; overflow:hidden;">
                    <div onclick="toggleItem(${item.id})" style="padding:15px; cursor:pointer; background:#1e293b; display:flex; justify-content:space-between; align-items:center;">
                        <span>${item.id}. ${item.desc}</span>
                        <i class="fa-solid fa-chevron-down" style="font-size:12px; color:#94a3b8;"></i>
                    </div>
                    <div id="content-${item.id}" style="display:none; padding:15px; border-top:1px solid #475569; background:#0f172a;">
                        <button id="btn-c-${item.id}" onclick="setOption(${item.id}, 'conforme')" class="btn-state" style="width:48%; padding:10px; border:none; border-radius:4px; color:white; cursor:pointer; background:#334155;">Conforme ✓</button>
                        <button id="btn-nc-${item.id}" onclick="setOption(${item.id}, 'nao-conforme')" class="btn-state" style="width:48%; padding:10px; border:none; border-radius:4px; color:white; cursor:pointer; background:#334155;">Não Conforme ✗</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
  function selectUnit(u, el) {
    selectedUnitNum = u;
    document.querySelectorAll('#units .btn').forEach(b => b.classList.remove('active'));
    if (el) el.classList.add('active');

    document.getElementById('type-card').style.display = 'block';
    
    // Define os valores padrão automaticamente para abrir o formulário direto
    selectedCategory = 'Padrão Construtora';
    selectedStage = '1ª Vistoria';

    const btnPadrao = document.getElementById('btn-cat-padrao');
    if (btnPadrao) {
        document.querySelectorAll('#category-selection-container .btn-opt').forEach(b => b.classList.remove('active'));
        btnPadrao.classList.add('active');
    }

    const btnStage1 = document.getElementById('btn-stage-1');
    const btnStageRev = document.getElementById('btn-stage-rev');
    if (btnStage1 && btnStageRev) {
        document.querySelectorAll('#stage-selection-container .btn-stage').forEach(b => b.classList.remove('active'));
        btnStage1.style.display = 'block';
        btnStageRev.style.display = 'none';
        btnStage1.classList.add('active');
    }

    updateCategoryAndStageState();
    renderUnitHistory();
    checkReadyToInspect();
}
};
