import { db as dbConfig } from './firebaseConfig.js';
import { getFirestore, doc, getDoc, setDoc, arrayUnion, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; 
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
        tipoEmpresa: 'Construtora',
        itensReforma: [],
        empreendimentos: [
            { nome: 'ZEN LIFE', tipologia: ['Misto'], pavimentosTipo: 4, cobertura: 'Ambas', fechamento: ['Drywall'], tipoObra: 'Obra Nova', itensReforma: [] },
            { nome: 'ZOE', tipologia: ['2 Quartos'], pavimentosTipo: 2, cobertura: 'Privativa', fechamento: ['Drywall'], tipoObra: 'Obra Nova', itensReforma: [] },
            { nome: 'NAOKI', tipologia: ['Studio'], pavimentosTipo: 2, cobertura: 'Área Comum', fechamento: ['Drywall'], tipoObra: 'Obra Nova', itensReforma: [] },
            { nome: 'ZEUS', tipologia: ['3 Quartos'], pavimentosTipo: 2, cobertura: 'Ambas', fechamento: ['Alvenaria'], tipoObra: 'Obra Nova', itensReforma: [] },
            { nome: 'GRAND GARDEN', tipologia: ['2 Quartos'], pavimentosTipo: 3, cobertura: 'Privativa', fechamento: ['Drywall'], tipoObra: 'Obra Nova', itensReforma: [] }
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

function obterEmpresaAtualObj() {
    const empresas = obterEmpresas();
    return empresas.find(e => e.nome === empresaAtual);
}

function obterEmpreendimentos() {
    const emp = obterEmpresaAtualObj();
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
        const isReforma = emp.tipoEmpresa === 'Reforma';
        const badgeTipo = isReforma ? '<span style="color: #facc15; font-size: 11px; margin-left: 5px;">(Reforma)</span>' : '';
        const icone = isReforma ? 'fa-hammer' : 'fa-building-user';
        const subtitulo = isReforma ? 'Projeto de Reforma' : `${emp.empreendimentos.length} empreendimento(s) cadastrado(s)`;

        htmlEmpresas += `
            <div class="card-menu" style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 12px; flex: 1; cursor: pointer;" onclick="abrirEmpresa('${emp.nome}')">
                    <div class="card-icon" style="margin-bottom: 0;"><i class="fa-solid ${icone}"></i></div>
                    <div class="card-info" style="flex: 1;">
                        <h2>${emp.nome} ${badgeTipo}</h2>
                        <span>${subtitulo}</span>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button onclick="event.stopPropagation(); solicitarExclusaoEmpresa('${emp.nome}')" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; border-radius: 6px; padding: 8px 10px; cursor: pointer; font-size: 14px;" title="Excluir Empresa"><i class="fa-solid fa-trash-can"></i></button>
                    <div class="card-arrow" onclick="abrirEmpresa('${emp.nome}')" style="cursor: pointer;"><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-city"></i> Empresas & Reformas</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Selecione a empresa ou adicione um novo cadastro</p>
        </div>
        <div class="menu-inicial">
            ${htmlEmpresas}
            <div class="card-menu" onclick="iniciarCadastroEmpresa()" style="border: 2px dashed var(--primary); background: rgba(37, 99, 235, 0.05);">
                <div class="card-icon"><i class="fa-solid fa-circle-plus"></i></div>
                <div class="card-info">
                    <h2 style="color: var(--primary);">ADICIONAR EMPRESA / REFORMA</h2>
                    <span>Criar novo grupo ou cadastro de reforma</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
        </div>
    `;
};

window.solicitarExclusaoEmpresa = function(nomeEmpresa) {
    const senhaAdmin = prompt(`Excluir empresa ou reforma "${nomeEmpresa}"?\n\n- Para exclusão LOCAL, clique em OK sem digitar senha.\n- Para exclusão PERMANENTE (Administrador), digite a senha de acesso:`);
    
    if (senhaAdmin === null) return; // Cancelado pelo usuário

    const empresas = obterEmpresas();
    const senhaAdminCorreta = "admin123"; // Defina a senha de administrador desejada

    if (senhaAdmin === senhaAdminCorreta) {
        // Exclusão Permanente (Admin)
        const novasEmpresas = empresas.filter(e => e.nome !== nomeEmpresa);
        salvarEmpresas(novasEmpresas);
        alert(`Empresa "${nomeEmpresa}" excluída PERMANENTEMENTE pelo Administrador.`);
    } else if (senhaAdmin === "") {
        // Exclusão Local padrão
        const novasEmpresas = empresas.filter(e => e.nome !== nomeEmpresa);
        salvarEmpresas(novasEmpresas);
        alert(`Empresa "${nomeEmpresa}" excluída do armazenamento local.`);
    } else {
        alert("Senha de administrador incorreta. A exclusão foi cancelada.");
        return;
    }
    voltarInicio();
};

window.iniciarCadastroEmpresa = function() {
    const container = document.getElementById('main-content');
    
    const itensPadraoReforma = [
        "Demolição / Remoção de Paredes ou Estruturas",
        "Substituição de Revestimentos (Pisos e Azulejos)",
        "Ampliação ou Adequação de Pontos Elétricos e Iluminação",
        "Modificações nas Instalações Hidráulicas / Sanitárias",
        "Instalação de Forro de Gesso ou Sancas",
        "Pintura Geral (Paredes e Tetos)",
        "Substituição de Portas, Janelas ou Esquadrias",
        "Instalação de Novas Bancadas e Pedras"
    ];

    let htmlCheckboxes = '';
    itensPadraoReforma.forEach(item => {
        htmlCheckboxes += `
            <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; padding: 4px 0;">
                <input type="checkbox" name="itemReformaEmpresa" value="${item}" style="width: 15px; height: 15px; accent-color: var(--primary);">
                <span>${item}</span>
            </label>
        `;
    });

    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-circle-plus"></i> Novo Cadastro</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Cadastre uma nova construtora ou um projeto de reforma</p>
        </div>
        <div class="menu-inicial" style="gap: 12px;">
            <div>
                <label style="font-size: 13px; font-weight: 600;">Nome (Empresa ou Reforma):</label>
                <input type="text" id="novoNomeEmpresa" placeholder="Ex: Construtora Horizonte ou Reforma Ap. 202">
            </div>
            <div>
                <label style="font-size: 13px; font-weight: 600;">Tipo de Cadastro:</label>
                <select id="novoTipoEmpresa" onchange="window.toggleSecaoReformaEmpresa(this.value)" style="width: 100%; padding: 10px; margin-top: 5px; background: rgba(15,23,42,0.6); color: white; border: 1px solid var(--border-color); border-radius: 6px; font-size: 13px;">
                    <option value="Construtora">Empresa / Grupo Construtora</option>
                    <option value="Reforma">Reforma (Cadastro Direto)</option>
                </select>
            </div>

            <div id="secao-reforma-empresa" style="display: none; background: rgba(15, 23, 42, 0.4); padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; margin-top: 5px;">
                <label style="font-size: 13px; font-weight: bold; color: var(--primary); display: block; margin-bottom: 8px;">Itens de Reforma (Escopo):</label>
                <div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px;">
                    ${htmlCheckboxes}
                </div>
                <label style="font-size: 13px; font-weight: bold; color: var(--primary); display: block; margin-bottom: 5px; margin-top: 10px;">Outros Itens (especificar):</label>
                <textarea id="novoOutrosReformaEmpresa" placeholder="Digite outros itens separados por vírgula ou linha..." style="width: 100%; height: 60px; padding: 8px; background: rgba(15,23,42,0.6); color: white; border: 1px solid var(--border-color); border-radius: 6px; font-size: 13px; resize: vertical;"></textarea>
            </div>

            <button class="btn-action" onclick="salvarNovaEmpresa()"><i class="fa-solid fa-check"></i> Salvar Cadastro</button>
        </div>
        <button class="btn-action btn-back" onclick="voltarInicio()"><i class="fa-solid fa-house-chimney"></i> Voltar</button>
    `;
};

window.toggleSecaoReformaEmpresa = function(tipo) {
    const secao = document.getElementById('secao-reforma-empresa');
    if (secao) {
        secao.style.display = tipo === 'Reforma' ? 'block' : 'none';
    }
};

window.salvarNovaEmpresa = function() {
    const nome = document.getElementById('novoNomeEmpresa').value.trim();
    const tipoEmpresa = document.getElementById('novoTipoEmpresa').value;
    if (!nome) {
        alert("Por favor, informe o nome.");
        return;
    }
    const empresas = obterEmpresas();
    if (empresas.some(e => e.nome.toUpperCase() === nome.toUpperCase())) {
        alert("Já existe um cadastro com este nome.");
        return;
    }

    let itensReforma = [];
    let empreendimentos = [];

    if (tipoEmpresa === 'Reforma') {
        const checkboxes = document.querySelectorAll('input[name="itemReformaEmpresa"]:checked');
        itensReforma = Array.from(checkboxes).map(cb => cb.value);
        const outrosTexto = document.getElementById('novoOutrosReformaEmpresa').value.trim();
        if (outrosTexto) {
            const outrosSeparados = outrosTexto.split(/[\n,]+/).map(i => i.trim()).filter(i => i.length > 0);
            itensReforma.push(...outrosSeparados);
        }
        empreendimentos.push({
            nome: nome.toUpperCase(),
            tipologia: ['Reforma'],
            pavimentosTipo: 1,
            cobertura: 'Privativa',
            fechamento: ['Diversos'],
            tipoObra: 'Reforma',
            itensReforma: itensReforma
        });
    }

    empresas.push({ 
        nome: nome.toUpperCase(), 
        tipoEmpresa: tipoEmpresa,
        itensReforma: itensReforma,
        empreendimentos: empreendimentos 
    });
    salvarEmpresas(empresas);
    alert("Cadastro realizado com sucesso!");
    voltarInicio();
};

window.abrirEmpresa = function(nomeEmpresa) {
    empresaAtual = nomeEmpresa;
    const empObj = obterEmpresaAtualObj();
    const container = document.getElementById('main-content');

    if (empObj && empObj.tipoEmpresa === 'Reforma') {
        const itensReformaEmp = empObj.itensReforma && empObj.itensReforma.length > 0 ? empObj.itensReforma : ["Nenhum item específico cadastrado"];
        container.innerHTML = `
            <div class="app-header" style="border-bottom: none; margin-bottom: 10px; padding-bottom: 0;">
                <div class="header-titles">
                    <h1 style="color: var(--primary);"><i class="fa-solid fa-hammer"></i> ${empresaAtual}</h1>
                    <p>Painel de Vistoria de Reforma</p>
                </div>
            </div>
            
            <div class="menu-inicial" style="margin-top: 15px;">
                <div class="card-menu" onclick="abrirChecklistReformaDinamico('${empresaAtual}', ${JSON.stringify(itensReformaEmp).replace(/"/g, '&quot;')})">
                    <div class="card-icon"><i class="fa-solid fa-clipboard-check"></i></div>
                    <div class="card-info">
                        <h2>INICIAR CHECKLIST DE REFORMA</h2>
                        <span>Ver ${itensReformaEmp.length} item(ns) configurado(s)</span>
                    </div>
                    <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                </div>

                <div class="card-menu" onclick="carregarCronogramaGeral()">
                    <div class="card-icon"><i class="fa-solid fa-timeline"></i></div>
                    <div class="card-info">
                        <h2>CRONOGRAMA</h2>
                        <span>Acompanhamento do avanço físico</span>
                    </div>
                    <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                </div>

                <div class="card-menu" onclick="carregarPainelIndicadores()">
                    <div class="card-icon"><i class="fa-solid fa-chart-pie"></i></div>
                    <div class="card-info">
                        <h2>INDICADORES</h2>
                        <span>Painel consolidado de conformidades</span>
                    </div>
                    <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            </div>

            <button class="btn-action btn-back" onclick="voltarInicio()"><i class="fa-solid fa-arrow-left"></i> Voltar para Lista</button>
        `;
        return;
    }

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

window.escolherDisciplinaVistoria = function(nomeObra) {
    const obra = obterObraPorNome(nomeObra);
    const container = document.getElementById('main-content');

    if (obra && obra.tipoObra === 'Reforma') {
        const itensReformaObra = obra.itensReforma && obra.itensReforma.length > 0 ? obra.itensReforma : ["Nenhum item específico cadastrado"];
        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-hammer"></i> ${nomeObra} (Reforma)</h3>
                <p style="font-size: 13px; color: var(--text-muted);">Módulo de vistorias baseado no escopo cadastrado</p>
            </div>
            <div class="menu-inicial">
                <div class="card-menu" onclick="abrirChecklistReformaDinamico('${nomeObra}', ${JSON.stringify(itensReformaObra).replace(/"/g, '&quot;')})">
                    <div class="card-icon"><i class="fa-solid fa-list-check"></i></div>
                    <div class="card-info">
                        <h2>INICIAR CHECKLIST DE REFORMA</h2>
                        <span>Ver ${itensReformaObra.length} item(ns) configurado(s)</span>
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

window.abrirChecklistReformaDinamico = function(nomeObra, itens) {
    const container = document.getElementById('main-content');
    let itensHtml = '';
    
    itens.forEach((desc, idx) => {
        const id = idx + 1;
        itensHtml += `
            <div class="card-item" style="border:1px solid #475569; margin-bottom:10px; border-radius:8px; overflow:hidden;">
                <div onclick="toggleItem(${id})" style="padding:15px; cursor:pointer; background:#1e293b; display:flex; justify-content:space-between; align-items:center;">
                    <span>${id}. ${desc}</span>
                    <i class="fa-solid fa-chevron-down" style="font-size:12px; color:#94a3b8;"></i>
                </div>
                <div id="content-${id}" style="display:none; padding:15px; border-top:1px solid #475569; background:#0f172a;">
                    <button id="btn-c-${id}" onclick="setOption(${id}, 'conforme')" class="btn-state" style="width:48%; padding:10px; border:none; border-radius:4px; color:white; cursor:pointer; background:#334155;">Conforme ✓</button>
                    <button id="btn-nc-${id}" onclick="setOption(${id}, 'nao-conforme')" class="btn-state" style="width:48%; padding:10px; border:none; border-radius:4px; color:white; cursor:pointer; background:#334155;">Não Conforme ✗</button>
                </div>
            </div>
        `;
    });

    const botaoVoltar = obterEmpresaAtualObj().tipoEmpresa === 'Reforma' ? 
        `<button class="btn-action btn-back" onclick="voltarInicio()" style="margin-top: 15px;"><i class="fa-solid fa-arrow-left"></i> Voltar</button>` :
        `<button class="btn-action btn-back" onclick="escolherDisciplinaVistoria('${nomeObra}')" style="margin-top: 15px;"><i class="fa-solid fa-arrow-left"></i> Voltar</button>`;

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-clipboard-check"></i> Vistoria de Reforma: ${nomeObra}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Checklist baseado no escopo cadastrado</p>
        </div>
        <div id="status-tag-container"></div>
        <div id="items-container">${itensHtml}</div>
        ${botaoVoltar}
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

window.abrirPainelVistoriaUnificado = function(nomeObra, tipoArea) {
    const container = document.getElementById('main-content');
    const obra = obterObraPorNome(nomeObra);
    const qtdPav = obra ? obra.pavimentosTipo : 4;

    let pavSelecionado = 1;
    let unidadeSelecionada = `${pavSelecionado}01`;
    let tipoVistoriaSelecionado = 'Padrão Construtora';

    function renderizarPainel() {
        let botoesPav = '';
        for (let p = 1; p <= qtdPav; p++) {
            const ativo = pavSelecionado === p ? 'background: var(--primary); color: white; border-color: var(--primary);' : 'background: rgba(255,255,255,0.05); color: var(--text-main);';
            botoesPav += `<button onclick="window.mudarPavimentoVistoria(${p})" style="padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-color); font-weight: 600; cursor: pointer; ${ativo}">${p}º Pav</button>`;
        }

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

            <div id="status-tag-container"></div>
            <div id="containerChecklistItens"></div>

            <button class="btn-action btn-back" onclick="escolherTipoAreaArquitetonica('${nomeObra}')" style="margin-top: 15px;"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
        `;

        renderChecklist(`Vistoria ${tipoVistoriaSelecionado}`);
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

let respostas = {};

window.setOption = function(id, option) {
    respostas[id] = option;
    
    document.querySelectorAll(`#content-${id} .btn-state`).forEach(btn => {
        btn.style.background = '#334155';
    });
    const selectedBtn = document.getElementById(`btn-${option === 'conforme' ? 'c' : 'nc'}-${id}`);
    if (selectedBtn) {
        selectedBtn.style.background = option === 'conforme' ? '#16a34a' : '#dc2626';
    }

    updateStatusTag();
};

function updateStatusTag() {
    const container = document.getElementById('status-tag-container');
    if (!container) return;
    const valores = Object.values(respostas);
    
    if (valores.length === 0) {
        container.innerHTML = '';
        return;
    }

    const temNaoConforme = valores.includes('nao-conforme');
    
    if (temNaoConforme) {
        container.innerHTML = `
            <div style="background:#dc2626; color:white; padding:12px; width:100%; text-align:center; font-weight:bold; border-radius:5px; margin-bottom:15px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                <i class="fa-solid fa-triangle-exclamation"></i> PENDÊNCIAS IDENTIFICADAS
            </div>
        `;
    } else {
        container.innerHTML = `
            <div style="background:#16a34a; color:white; padding:12px; width:100%; text-align:center; font-weight:bold; border-radius:5px; margin-bottom:15px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                <i class="fa-solid fa-check"></i> TUDO OK
            </div>
        `;
    }
}

window.toggleItem = function(id) {
    const content = document.getElementById(`content-${id}`);
    if (content) {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }
};

window.renderChecklist = function(titulo) {
    const container = document.getElementById('containerChecklistItens');
    if (!container) return;

    const itens = [
        { id: 1, desc: "Contrapiso, Revestimentos e Rodapés" },
        { id: 2, desc: "Forro e Sancas de Gesso" }
    ];

    container.innerHTML = `
        <div style="margin-bottom:20px;">
            <h3 style="color:#3b82f6; margin-bottom:10px;">${titulo}</h3>
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
};

window.carregarCronogramaGeral = function() {
    const container = document.getElementById('main-content');
    const empObj = obterEmpresaAtualObj();
    const lista = obterEmpreendimentos();
    let htmlObra = '';

    if (empObj && empObj.tipoEmpresa === 'Reforma') {
        htmlObra = `
            <div style="background: rgba(15, 23, 42, 0.4); padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 12px;">
                <h4 style="color: var(--primary); font-size: 14px; margin-bottom: 6px;">${empObj.nome} <span style="font-size: 11px; color: var(--text-muted);">(Reforma)</span></h4>
                <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">Itens no escopo: ${empObj.itensReforma ? empObj.itensReforma.length : 0} item(ns)</div>
                <label style="font-size: 12px; font-weight: 600;">Progresso Físico Atual:</label>
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 4px;">
                    <input type="range" min="0" max="100" value="50" style="flex: 1; accent-color: var(--primary);" disabled>
                    <span style="font-size: 12px; font-weight: bold; color: var(--text-main);">50%</span>
                </div>
            </div>
        `;
    } else {
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
    }

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-timeline"></i> Cronograma: ${empresaAtual}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Acompanhamento do avanço físico</p>
        </div>
        <div class="menu-inicial">${htmlObra}</div>
        <button class="btn-action btn-back" onclick="abrirEmpresa('${empresaAtual}')"><i class="fa-solid fa-arrow-left"></i> Voltar ao Painel</button>
    `;
};

window.carregarPainelIndicadores = function() {
    const container = document.getElementById('main-content');
    const empObj = obterEmpresaAtualObj();
    const totalObras = empObj && empObj.tipoEmpresa === 'Reforma' ? 1 : obterEmpreendimentos().length;

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-chart-pie"></i> Indicadores: ${empresaAtual}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Visão consolidada da gestão</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            <div style="background: rgba(15, 23, 42, 0.6); padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; text-align: center;">
                <span style="font-size: 22px; font-weight: bold; color: var(--primary);">${totalObras}</span>
                <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Cadastros / Obras</p>
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
                    <option value="Obra Nova">Obra Nova (Padrão Completo)</option>
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
        tipoObra: tipoObra,
        itensReforma: []
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