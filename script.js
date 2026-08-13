import { db as dbConfig } from './firebaseConfig.js';
import { getFirestore, doc, getDoc, setDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const db = getFirestore();
const storage = getStorage();

// Modelos de Checklists por Disciplina
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
    },
    {
      "etapa": 3,
      "categoria": "Montagem da Armadura Passiva (Aço)",
      "itens": [
        "Conferência dos diâmetros das barras, número de elementos e disposição conforme o projeto estrutural.",
        "Posicionamento correto dos espaçadores para garantir rigorosamente o cobrimento mínimo."
      ]
    },
    {
      "etapa": 4,
      "categoria": "Lançamento, Adensamento e Cura do Concreto",
      "itens": [
        "Conferência da Nota Fiscal da concreteira (fck especificado, slump e horário).",
        "Realização do ensaio de abatimento (Slump Test) na chegada do caminhão.",
        "Adensamento correto com vibradores de imersão e início imediato da cura."
      ]
    }
  ],
  "arquitetonico": [
    {
      "etapa": 1,
      "categoria": "Alvenaria e Vedação",
      "itens": [
        "Conferência do esquadro, prumo e alinhamento das paredes conforme projeto arquitetônico.",
        "Verificação da execução de vergas e contravergas em vãos de portas e janelas.",
        "Conferência de paginação e juntas de movimentação."
      ]
    },
    {
      "etapa": 2,
      "categoria": "Revestimentos e Esquadrias",
      "itens": [
        "Inspeção de prumo e planeza de paredes antes do revestimento final.",
        "Verificação de caimentos em áreas molhadas (banheiros, varandas e cozinhas).",
        "Checagem de vedação, esquadro e fixação de caixilhos e esquadrias."
      ]
    }
  ]
};

let empresasPadrao = [
    {
        nome: 'VIVER BEM',
        empreendimentos: [
            { nome: 'ZEN LIFE', tipologia: ['Misto'], pavimentosTipo: 4, cobertura: 'Ambas', fechamento: ['Drywall'] },
            { nome: 'ZOE', tipologia: ['2 Quartos'], pavimentosTipo: 2, cobertura: 'Privativa', fechamento: ['Drywall'] },
            { nome: 'NAOKI', tipologia: ['Studio'], pavimentosTipo: 2, cobertura: 'Área Comum', fechamento: ['Drywall'] },
            { nome: 'ZEUS', tipologia: ['3 Quartos'], pavimentosTipo: 2, cobertura: 'Ambas', fechamento: ['Alvenaria'] },
            { nome: 'GRAND GARDEN', tipologia: ['2 Quartos'], pavimentosTipo: 3, cobertura: 'Privativa', fechamento: ['Drywall'] }
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

// --- TELA INICIAL: SELEÇÃO DE EMPRESAS ---
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

// --- DASHBOARD DA EMPRESA SELECIONADA ---
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
                botoesObras += `
                    <div class="card-menu" onclick="escolherDisciplinaVistoria('${obra.nome}')">
                        <div class="card-icon"><i class="fa-solid fa-folder-open"></i></div>
                        <div class="card-info">
                            <h2>${obra.nome}</h2>
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
                        <span>Adicionar nova obra ao sistema</span>
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

// --- SELEÇÃO DE DISCIPLINA PARA VISTORIA ---
window.escolherDisciplinaVistoria = function(nomeObra) {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-diagram-project"></i> ${nomeObra}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Selecione a disciplina correspondente para iniciar a vistoria</p>
        </div>

        <div class="menu-inicial">
            <div class="card-menu" onclick="abrirVistoriaObra('${nomeObra}', 'estrutural', 'Estrutural', 'Geral', 'Geral')">
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

// --- FLUXO ESPECÍFICO DE PROJETOS ARQUITETÔNICOS (ÁREA PRIVATIVA / COMUM) ---
window.escolherTipoAreaArquitetonica = function(nomeObra) {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-compass-drafting"></i> ${nomeObra} (Arquitetônico)</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Selecione o tipo de área para a vistoria</p>
        </div>

        <div class="menu-inicial">
            <div class="card-menu" onclick="escolherPavimentoArquitetonico('${nomeObra}', 'Área Privativa')">
                <div class="card-icon"><i class="fa-solid fa-door-open"></i></div>
                <div class="card-info">
                    <h2>ÁREA PRIVATIVA</h2>
                    <span>Apartamentos e unidades habitacionais</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>

            <div class="card-menu" onclick="escolherPavimentoArquitetonico('${nomeObra}', 'Área Comum')">
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

window.escolherPavimentoArquitetonico = function(nomeObra, tipoArea) {
    const container = document.getElementById('main-content');
    const obra = obterObraPorNome(nomeObra);
    const qtdPav = obra ? obra.pavimentosTipo : 3;
    let htmlPavimentos = '';
    
    if (tipoArea === 'Área Privativa') {
        for (let i = 1; i <= qtdPav; i++) {
            htmlPavimentos += `
                <div class="card-menu" onclick="escolherUnidadeArquitetonica('${nomeObra}', '${tipoArea}', '${i}º Pavimento')">
                    <div class="card-icon"><i class="fa-solid fa-building"></i></div>
                    <div class="card-info">
                        <h2>${i}º PAVIMENTO</h2>
                        <span>Selecionar apartamento / unidade</span>
                    </div>
                    <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            `;
        }
    } else {
        const setoresComuns = ['Térreo / Portaria', 'Área de Lazer', 'Cobertura / Comum', 'Subsolo / Garagem'];
        setoresComuns.forEach(setor => {
            htmlPavimentos += `
                <div class="card-menu" onclick="abrirVistoriaObra('${nomeObra}', 'arquitetonico', '${tipoArea}', '${setor}', 'Setor Comum')">
                    <div class="card-icon"><i class="fa-solid fa-layer-group"></i></div>
                    <div class="card-info">
                        <h2>${setor.toUpperCase()}</h2>
                        <span>Iniciar checklist de área comum</span>
                    </div>
                    <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            `;
        });
    }

    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-building-user"></i> ${nomeObra} (${tipoArea})</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Selecione o pavimento ou setor catalogado</p>
        </div>
        <div class="menu-inicial">${htmlPavimentos}</div>
        <button class="btn-action btn-back" onclick="escolherTipoAreaArquitetonica('${nomeObra}')"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;
};

window.escolherUnidadeArquitetonica = function(nomeObra, tipoArea, pavimento) {
    const container = document.getElementById('main-content');
    const numPav = pavimento.replace(/\D/g, '') || '1';
    const unidades = [`Apto ${numPav}01`, `Apto ${numPav}02`, `Apto ${numPav}03`, `Apto ${numPav}04`];

    let htmlUnidades = '';
    unidades.forEach(apt => {
        htmlUnidades += `
            <div class="card-menu" onclick="abrirVistoriaObra('${nomeObra}', 'arquitetonico', '${tipoArea}', '${pavimento}', '${apt}')">
                <div class="card-icon"><i class="fa-solid fa-door-closed"></i></div>
                <div class="card-info">
                    <h2>${apt.toUpperCase()}</h2>
                    <span>Aplicar checklist na unidade</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
        `;
    });

    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-house"></i> ${nomeObra} - ${pavimento}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Selecione o apartamento</p>
        </div>
        <div class="menu-inicial">${htmlUnidades}</div>
        <button class="btn-action btn-back" onclick="escolherPavimentoArquitetonico('${nomeObra}', '${tipoArea}')"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;
};

// --- MÓDULO DE VISTORIA COM CHECKLIST, FOTOS E NÃO CONFORMIDADES (NC) ---
window.abrirVistoriaObra = function(nomeObra, disciplina, tipoArea = 'Geral', pavimento = 'Geral', unidade = '') {
    const container = document.getElementById('main-content');
    const nomeDisciplinaFormatado = disciplina === 'estrutural' ? 'Projeto Estrutural' : 'Projeto Arquitetônico';
    
    let subTitulo = `${nomeDisciplinaFormatado}`;
    if (tipoArea !== 'Geral') subTitulo += ` • ${tipoArea}`;
    if (pavimento !== 'Geral') subTitulo += ` • ${pavimento}`;
    if (unidade) subTitulo += ` • ${unidade}`;

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-clipboard-list"></i> ${nomeObra}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">${subTitulo}</p>
        </div>

        <div class="upload-section">
            <div id="checklistContainer" style="margin-top: 5px;"></div>

            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="btn-action" onclick="salvarVistoriaCompleta('${nomeObra}', '${disciplina}', '${tipoArea}', '${pavimento}', '${unidade}')" style="margin-top:0;"><i class="fa-solid fa-check-double"></i> Salvar Vistoria</button>
                <button class="btn-action" onclick="enviarRelatorioWhatsApp('${nomeObra}', '${disciplina}', '${tipoArea}', '${pavimento}', '${unidade}')" style="margin-top:0; background-color: #16a34a; color: white;"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>
            </div>
        </div>

        <button class="btn-action btn-back" onclick="${disciplina === 'estrutural' ? `escolherDisciplinaVistoria('${nomeObra}')` : (tipoArea === 'Área Privativa' ? `escolherUnidadeArquitetonica('${nomeObra}', '${tipoArea}', '${pavimento}')` : `escolherPavimentoArquitetonico('${nomeObra}', '${tipoArea}')`)}"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;

    carregarItensChecklist(disciplina);
};

function carregarItensChecklist(disciplina) {
    const containerChecklist = document.getElementById('checklistContainer');
    const checklistData = checklistsModelos[disciplina] || checklistsModelos["estrutural"];
    let htmlGeral = '';

    checklistData.forEach((bloco, blocoIndex) => {
        htmlGeral += `
            <div style="margin-bottom: 15px; background: rgba(15, 23, 42, 0.4); padding: 12px; border: 1px solid var(--border-color); border-radius: 8px;">
                <h4 style="font-size: 14px; color: var(--primary); margin-bottom: 8px;"><i class="fa-solid fa-layer-group"></i> Etapa ${bloco.etapa}: ${bloco.categoria}</h4>
                <div style="display: flex; flex-direction: column; gap: 10px;">
        `;

        bloco.itens.forEach((itemText, itemIndex) => {
            const itemId = `chk_${blocoIndex}_${itemIndex}`;
            htmlGeral += `
                <div style="background: rgba(255,255,255,0.02); padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
                    <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 12px; cursor: pointer;">
                        <input type="checkbox" id="${itemId}" name="checkItemModel" value="${itemText}" onchange="toggleSecaoNC('${itemId}')" style="margin-top: 2px;">
                        <span style="flex: 1; color: var(--text-main);">${itemText}</span>
                    </label>
                    
                    <div id="extra_${itemId}" style="display: none; margin-top: 8px; padding-top: 6px; border-top: 1px dashed var(--border-color); flex-direction: column; gap: 6px;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <label style="font-size: 11px; color: #facc15; font-weight: 600;"><i class="fa-solid fa-triangle-exclamation"></i> Não Conformidade Detectada</label>
                        </div>
                        <input type="text" id="nc_desc_${itemId}" placeholder="Descrição da falha / Não conformidade" style="font-size: 11px; padding: 6px;">
                        <input type="text" id="nc_resp_${itemId}" placeholder="Responsável pela correção" style="font-size: 11px; padding: 6px;">
                        
                        <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                            <label style="font-size: 11px; color: var(--text-muted); cursor: pointer; background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color);">
                                <i class="fa-solid fa-camera"></i> Anexar Foto <input type="file" id="foto_${itemId}" accept="image/*" style="display:none;">
                            </label>
                            <span id="foto_nome_${itemId}" style="font-size: 10px; color: var(--text-muted);">Nenhuma foto anexada</span>
                        </div>
                    </div>
                </div>
            `;
        });

        htmlGeral += `</div></div>`;
    });

    containerChecklist.innerHTML = htmlGeral;

    document.querySelectorAll('input[type="file"][id^="foto_"]').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = e.target.id.replace('foto_', '');
            const nomeSpan = document.getElementById(`foto_nome_${id}`);
            if (e.target.files.length > 0) {
                nomeSpan.textContent = e.target.files[0].name;
                nomeSpan.style.color = '#22c55e';
            }
        });
    });
}

window.toggleSecaoNC = function(itemId) {
    const chk = document.getElementById(itemId);
    const extraDiv = document.getElementById(`extra_${itemId}`);
    if (!chk.checked) {
        extraDiv.style.display = 'flex';
    } else {
        extraDiv.style.display = 'none';
    }
};

window.salvarVistoriaCompleta = function(nomeObra, disciplina, tipoArea, pavimento, unidade) {
    const todosChecks = document.querySelectorAll('input[name="checkItemModel"]');
    let totalVerificados = 0;
    let naoConformidades = [];

    todosChecks.forEach(chk => {
        if (chk.checked) {
            totalVerificados++;
        } else {
            const id = chk.id;
            const desc = document.getElementById(`nc_desc_${id}`)?.value || 'Não verificado / Falha';
            const resp = document.getElementById(`nc_resp_${id}`)?.value || 'Não atribuído';
            naoConformidades.push({ item: chk.value, descricao: desc, responsabilizados: resp, status: 'Pendente' });
        }
    });

    const dadosVistoria = {
        empresa: empresaAtual,
        obra: nomeObra,
        disciplina: disciplina,
        tipoArea: tipoArea,
        pavimento: pavimento,
        unidade: unidade,
        totalItens: todosChecks.length,
        totalVerificados: totalVerificados,
        naoConformidades: naoConformidades,
        data: new Date().toISOString()
    };

    localStorage.setItem(`vistoria_${empresaAtual}_${nomeObra}_${disciplina}_${pavimento}_${unidade}`, JSON.stringify(dadosVistoria));
    alert(`Vistoria salva com sucesso! Conformes: ${totalVerificados}/${todosChecks.length}. NCs: ${naoConformidades.length}.`);
};

window.enviarRelatorioWhatsApp = function(nomeObra, disciplina, tipoArea, pavimento, unidade) {
    const todosChecks = document.querySelectorAll('input[name="checkItemModel"]');
    let conformes = 0;
    let ncsCount = 0;

    todosChecks.forEach(chk => {
        if (chk.checked) conformes++;
        else ncsCount++;
    });

    const texto = `*RELATÓRIO DE VISTORIA - ${empresaAtual}*\n\n` +
                  `🏢 *Obra:* ${nomeObra}\n` +
                  `📐 *Disciplina:* ${disciplina.toUpperCase()} (${tipoArea})\n` +
                  `📍 *Local:* ${pavimento} ${unidade ? '• ' + unidade : ''}\n` +
                  `✅ *Conformes:* ${conformes} / ${todosChecks.length}\n` +
                  `⚠️ *Não Conformidades:* ${ncsCount}\n` +
                  `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
};

// --- CRONOGRAMA & INDICADORES & CADASTROS ---
window.carregarCronogramaGeral = function() {
    const container = document.getElementById('main-content');
    const lista = obterEmpreendimentos();
    let htmlObra = '';

    if (lista.length === 0) {
        htmlObra = `<p style="color: var(--text-muted); text-align:center; padding: 20px;">Nenhum empreendimento cadastrado.</p>`;
    } else {
        lista.forEach((obra, idx) => {
            htmlObra += `
                <div style="background: rgba(15, 23, 42, 0.4); padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 12px;">
                    <h4 style="color: var(--primary); font-size: 14px; margin-bottom: 6px;">${obra.nome}</h4>
                    <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">Tipologia: ${obra.tipologia.join(', ')} | Pavimentos: ${obra.pavimentosTipo}</div>
                    <label style="font-size: 12px; font-weight: 600;">Progresso Físico Atual:</label>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 4px;">
                        <input type="range" min="0" max="100" value="${(idx + 1) * 15}" style="flex: 1; accent-color: var(--primary);" disabled>
                        <span style="font-size: 12px; font-weight: bold; color: var(--text-main);">${(idx + 1) * 15}%</span>
                    </div>
                </div>
            `;
        });
    }

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
                    <h2>${obra.nome}</h2>
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
        <div class="menu-inicial">${htmlObras.length > 0 ? htmlObras : '<p style="color:var(--text-muted); text-align:center;">Nenhum empreendimento cadastrado.</p>'}</div>
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

    let pavimentosLista = ['Térreo', '1º Pavimento', '2º Pavimento', '3º Pavimento', 'Cobertura'];
    let optionsPavimentos = '';
    pavimentosLista.forEach(pav => {
        const val = pav.toLowerCase().replace(/[ºª]/g, '').replace(/\s+/g, '_');
        optionsPavimentos += `<option value="${val}">${pav}</option>`;
    });

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
            <p style="font-size: 13px; color: var(--text-muted);">Preencha as configurações da nova obra</p>
        </div>
        <div class="menu-inicial" style="gap: 10px;">
            <div>
                <label style="font-size: 13px; font-weight: 600;">Nome da Obra:</label>
                <input type="text" id="novoNomeObra" placeholder="Ex: Residencial Bella Vista">
            </div>
            <div>
                <label style="font-size: 13px; font-weight: 600;">Quantidade de Pavimentos Tipo:</label>
                <input type="number" id="novoQtdPavimentos" value="3" min="1" max="50">
            </div>
            <button class="btn-action" onclick="salvarNovoEmpreendimento()"><i class="fa-solid fa-check"></i> Salvar Empreendimento</button>
        </div>
        <button class="btn-action btn-back" onclick="navegar('cadastros')"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;
};

window.salvarNovoEmpreendimento = function() {
    const nome = document.getElementById('novoNomeObra').value.trim();
    const qtdPavimentos = parseInt(document.getElementById('novoQtdPavimentos').value) || 1;
    if (!nome) { alert("Por favor, informe o nome da obra."); return; }

    const lista = obterEmpreendimentos();
    lista.push({ nome: nome.toUpperCase(), tipologia: ['Padrão'], pavimentosTipo: qtdPavimentos, cobertura: 'Privativa', fechamento: ['Drywall'] });
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
