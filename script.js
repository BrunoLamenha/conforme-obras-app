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
        ambientes: [],
        empreendimentos: [
            { nome: 'ZEN LIFE', tipologia: ['Misto'], pavimentosTipo: 4, cobertura: 'Ambas', fechamento: ['Drywall'], tipoObra: 'Obra Nova', itensReforma: [], ambientes: [] },
            { nome: 'ZOE', tipologia: ['2 Quartos'], pavimentosTipo: 2, cobertura: 'Privativa', fechamento: ['Drywall'], tipoObra: 'Obra Nova', itensReforma: [], ambientes: [] }
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
        const subtitulo = isReforma ? `Projeto de Reforma • ${emp.ambientes ? emp.ambientes.length : 0} ambiente(s)` : `${emp.empreendimentos.length} empreendimento(s) cadastrado(s)`;

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
    if (senhaAdmin === null) return;

    const empresas = obterEmpresas();
    const senhaAdminCorreta = "admin123";

    if (senhaAdmin === senhaAdminCorreta) {
        const novasEmpresas = empresas.filter(e => e.nome !== nomeEmpresa);
        salvarEmpresas(novasEmpresas);
        alert(`Empresa "${nomeEmpresa}" excluída PERMANENTEMENTE pelo Administrador.`);
    } else if (senhaAdmin === "") {
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
                <select id="novoTipoEmpresa" style="width: 100%; padding: 10px; margin-top: 5px; background: rgba(15,23,42,0.6); color: white; border: 1px solid var(--border-color); border-radius: 6px; font-size: 13px;">
                    <option value="Construtora">Empresa / Grupo Construtora</option>
                    <option value="Reforma">Reforma (Cadastro Direto)</option>
                </select>
            </div>

            <button class="btn-action" onclick="salvarNovaEmpresa()"><i class="fa-solid fa-check"></i> Salvar Cadastro</button>
        </div>
        <button class="btn-action btn-back" onclick="voltarInicio()"><i class="fa-solid fa-house-chimney"></i> Voltar</button>
    `;
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

    empresas.push({ 
        nome: nome.toUpperCase(), 
        tipoEmpresa: tipoEmpresa,
        itensReforma: [],
        ambientes: [],
        empreendimentos: [] 
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
        const totalAmbientes = empObj.ambientes ? empObj.ambientes.length : 0;
        container.innerHTML = `
            <div class="app-header" style="border-bottom: none; margin-bottom: 10px; padding-bottom: 0;">
                <div class="header-titles">
                    <h1 style="color: var(--primary);"><i class="fa-solid fa-hammer"></i> ${empresaAtual}</h1>
                    <p>Painel Completo de Reforma & Ambientes</p>
                </div>
            </div>
            
            <div class="menu-inicial" style="margin-top: 15px;">
                <div class="card-menu" onclick="gerenciarAmbientesReforma('${empresaAtual}')">
                    <div class="card-icon"><i class="fa-solid fa-door-open"></i></div>
                    <div class="card-info">
                        <h2>CADASTRO DE AMBIENTES & PDF</h2>
                        <span>Gerenciar cômodos e upload de projetos (${totalAmbientes} ambiente(s))</span>
                    </div>
                    <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                </div>

                <div class="card-menu" onclick="abrirChecklistAmbientesReforma('${empresaAtual}')">
                    <div class="card-icon"><i class="fa-solid fa-clipboard-check"></i></div>
                    <div class="card-info">
                        <h2>CHECKLIST POR AMBIENTE</h2>
                        <span>Verificação com status, responsáveis, prazos e fotos</span>
                    </div>
                    <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                </div>

                <div class="card-menu" onclick="carregarCronogramaReforma('${empresaAtual}')">
                    <div class="card-icon"><i class="fa-solid fa-timeline"></i></div>
                    <div class="card-info">
                        <h2>MONTAGEM DO CRONOGRAMA</h2>
                        <span>Cronograma físico com datas e prazos</span>
                    </div>
                    <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                </div>

                <div class="card-menu" onclick="abrirRelatoriosReforma('${empresaAtual}')">
                    <div class="card-icon"><i class="fa-solid fa-file-pdf"></i> / <i class="fa-brands fa-whatsapp" style="color:#22c55e;"></i></div>
                    <div class="card-info">
                        <h2>RELATÓRIOS & COMPARTILHAMENTO</h2>
                        <span>Imprimir PDF ou enviar via WhatsApp</span>
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

// --- GESTÃO DE AMBIENTES E INTERVENÇÕES POR CÔMODO ---
window.gerenciarAmbientesReforma = function(nomeObra) {
    const container = document.getElementById('main-content');
    const empObj = obterEmpresaAtualObj();
    const ambientes = empObj.ambientes || [];

    let htmlAmbientesCadastrados = '';
    ambientes.forEach((amb, idx) => {
        let itensResumo = amb.itens ? amb.itens.map(i => i.descricao).join(', ') : '';
        htmlAmbientesCadastrados += `
            <div style="background: rgba(15, 23, 42, 0.6); padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <h4 style="color: var(--primary); font-size: 14px; margin: 0; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-door-open"></i> ${amb.nome}
                        <button onclick="window.editarNomeAmbiente('${amb.nome}')" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 12px;" title="Editar Nome"><i class="fa-solid fa-pen"></i></button>
                    </h4>
                    <button onclick="window.removerAmbienteReforma('${amb.nome}')" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;" title="Excluir Ambiente"><i class="fa-solid fa-trash-can"></i> Excluir</button>
                </div>
                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 6px;">
                    <strong>Intervenções:</strong> ${itensResumo || 'Nenhuma'}
                </div>
                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px;">
                    Projeto PDF: ${amb.projetoPdf ? `<a href="${amb.projetoPdf.url}" target="_blank" style="color: var(--primary); font-weight: bold;"><i class="fa-solid fa-file-pdf"></i> ${amb.projetoPdf.nome}</a>` : 'Nenhum PDF anexado'}
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <input type="file" id="pdfAmbiente_${idx}" accept="application/pdf" style="font-size: 11px; flex: 1;">
                    <button class="btn-action" style="padding: 6px 12px; font-size: 12px; margin-top: 0;" onclick="window.enviarPdfAmbiente('${amb.nome}', ${idx})">Enviar PDF</button>
                </div>
            </div>
        `;
    });

    const comodosComuns = [
        "Sala de Estar", "Sala de Jantar", "Cozinha", "Área de Serviço", "Varanda / Sacada", "Lavabo", "Escritório / Home Office"
    ];

    const itensIntervencaoPadrao = [
        "Demolição / Remoção",
        "Contrapiso e Revestimentos",
        "Elétrica e Iluminação",
        "Hidráulica e Sanitária",
        "Forro de Gesso",
        "Pintura",
        "Esquadrias (Portas e Janelas)",
        "Bancadas e Pedras"
    ];

    let checkboxesHtml = '';
    comodosComuns.forEach((comodo, cIdx) => {
        let itensCheckboxes = '';
        itensIntervencaoPadrao.forEach((it) => {
            itensCheckboxes += `
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; cursor: pointer; padding: 2px 0;">
                    <input type="checkbox" name="item_${cIdx}" value="${it}" checked style="width: 13px; height: 13px; accent-color: var(--primary);">
                    <span style="color: var(--text-muted);">${it}</span>
                </label>
            `;
        });

        checkboxesHtml += `
            <div style="background: rgba(15,23,42,0.4); border: 1px solid var(--border-color); border-radius: 6px; padding: 8px; margin-bottom: 6px;">
                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">
                    <input type="checkbox" id="chk_comodo_${cIdx}" value="${comodo}" onchange="window.toggleItensComodo(${cIdx})" style="width: 15px; height: 15px; accent-color: var(--primary);">
                    <span>${comodo}</span>
                </label>
                <div id="itens_comodo_${cIdx}" style="display: none; margin-top: 6px; padding-left: 20px; border-top: 1px dashed var(--border-color); padding-top: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                    ${itensCheckboxes}
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-door-open"></i> Ambientes & Intervenções: ${nomeObra}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Marque o cômodo para abrir os tipos de intervenção e itens</p>
        </div>

        <div style="background: rgba(15, 23, 42, 0.4); padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 15px; display: flex; flex-direction: column; gap: 12px;">
            <div>
                <label style="font-size: 13px; font-weight: bold; color: var(--primary); display: block; margin-bottom: 8px;">Cômodos Comuns:</label>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    ${checkboxesHtml}
                </div>
            </div>

            <div style="border-top: 1px solid var(--border-color); padding-top: 10px;">
                <label style="font-size: 13px; font-weight: bold; color: var(--primary); display: block; margin-bottom: 8px;">Cômodos Múltiplos (Suítes, Quartos, Banheiros):</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
                    <div>
                        <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 2px;">Suítes:</label>
                        <input type="number" id="qtdSuites" min="0" value="1" style="width: 100%; padding: 6px; background: rgba(15,23,42,0.6); color: white; border: 1px solid var(--border-color); border-radius: 4px; font-size: 13px;">
                    </div>
                    <div>
                        <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 2px;">Quartos:</label>
                        <input type="number" id="qtdQuartos" min="0" value="0" style="width: 100%; padding: 6px; background: rgba(15,23,42,0.6); color: white; border: 1px solid var(--border-color); border-radius: 4px; font-size: 13px;">
                    </div>
                    <div>
                        <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 2px;">Banheiros:</label>
                        <input type="number" id="qtdBanheiros" min="0" value="1" style="width: 100%; padding: 6px; background: rgba(15,23,42,0.6); color: white; border: 1px solid var(--border-color); border-radius: 4px; font-size: 13px;">
                    </div>
                </div>
            </div>

            <button class="btn-action" style="margin-top: 5px;" onclick="window.adicionarComodosSelecionados()">Adicionar Ambientes Selecionados</button>
        </div>

        <div style="margin-bottom: 15px;">
            <h4 style="font-size: 14px; margin-bottom: 10px; color: var(--text-main);">Ambientes Cadastrados</h4>
            ${htmlAmbientesCadastrados || '<p style="color: var(--text-muted); font-size: 13px;">Nenhum ambiente cadastrado ainda.</p>'}
        </div>

        <button class="btn-action btn-back" onclick="abrirEmpresa('${nomeObra}')"><i class="fa-solid fa-arrow-left"></i> Voltar ao Painel</button>
    `;
};

window.toggleItensComodo = function(cIdx) {
    const chk = document.getElementById(`chk_comodo_${cIdx}`);
    const divItens = document.getElementById(`itens_comodo_${cIdx}`);
    if (chk && divItens) {
        divItens.style.display = chk.checked ? 'grid' : 'none';
    }
};

window.adicionarComodosSelecionados = function() {
    const empresas = obterEmpresas();
    const empIndex = empresas.findIndex(e => e.nome === empresaAtual);
    if (empIndex < 0) return;

    if (!empresas[empIndex].ambientes) empresas[empIndex].ambientes = [];
    const ambientesAtuais = empresas[empIndex].ambientes;
    let novosAdicionados = [];

    const comodosComuns = [
        "Sala de Estar", "Sala de Jantar", "Cozinha", "Área de Serviço", "Varanda / Sacada", "Lavabo", "Escritório / Home Office"
    ];

    comodosComuns.forEach((comodo, cIdx) => {
        const chk = document.getElementById(`chk_comodo_${cIdx}`);
        if (chk && chk.checked) {
            const nomeAmb = comodo.toUpperCase();
            const checkboxesItens = document.querySelectorAll(`input[name="item_${cIdx}"]:checked`);
            const itensAmbiente = Array.from(checkboxesItens).map(cb => ({
                descricao: cb.value,
                status: 'pendente',
                responsavel: '',
                dataInicio: '',
                prazo: '',
                fotos: []
            }));

            if (!ambientesAtuais.some(a => a.nome === nomeAmb)) {
                ambientesAtuais.push({
                    nome: nomeAmb,
                    projetoPdf: null,
                    itens: itensAmbiente.length > 0 ? itensAmbiente : [{ descricao: "Serviço Geral", status: 'pendente', responsavel: '', dataInicio: '', prazo: '', fotos: [] }]
                });
                novosAdicionados.push(nomeAmb);
            }
        }
    });

    const itensPadraoMultiplos = [
        "Contrapiso e Revestimentos", "Elétrica e Iluminação", "Forro de Gesso", "Pintura"
    ];

    const adicionarMultiplos = (prefixo, qtd) => {
        for (let i = 1; i <= qtd; i++) {
            const nomeAmb = `${prefixo} ${i}`.toUpperCase();
            if (!ambientesAtuais.some(a => a.nome === nomeAmb)) {
                ambientesAtuais.push({
                    nome: nomeAmb,
                    projetoPdf: null,
                    itens: itensPadraoMultiplos.map(desc => ({ descricao: desc, status: 'pendente', responsavel: '', dataInicio: '', prazo: '', fotos: [] }))
                });
                novosAdicionados.push(nomeAmb);
            }
        }
    };

    const qtdSuites = parseInt(document.getElementById('qtdSuites').value) || 0;
    adicionarMultiplos("SUÍTE", qtdSuites);

    const qtdQuartos = parseInt(document.getElementById('qtdQuartos').value) || 0;
    adicionarMultiplos("QUARTO", qtdQuartos);

    const qtdBanheiros = parseInt(document.getElementById('qtdBanheiros').value) || 0;
    adicionarMultiplos("BANHEIRO", qtdBanheiros);

    if (novosAdicionados.length === 0) {
        alert("Selecione pelo menos um cômodo ou informe uma quantidade para suítes/quartos/banheiros.");
        return;
    }

    salvarEmpresas(empresas);
    alert(`${novosAdicionados.length} ambiente(s) adicionado(s) com sucesso!`);
    gerenciarAmbientesReforma(empresaAtual);
};

window.editarNomeAmbiente = function(nomeAntigo) {
    const novoNome = prompt(`Editar nome do ambiente "${nomeAntigo}":`, nomeAntigo);
    if (!novoNome || novoNome.trim() === "") return;
    const nomeFormatado = novoNome.trim().toUpperCase();

    const empresas = obterEmpresas();
    const empIndex = empresas.findIndex(e => e.nome === empresaAtual);
    if (empIndex >= 0 && empresas[empIndex].ambientes) {
        if (empresas[empIndex].ambientes.some(a => a.nome === nomeFormatado && a.nome !== nomeAntigo)) {
            alert("Já existe um ambiente com este nome.");
            return;
        }
        const amb = empresas[empIndex].ambientes.find(a => a.nome === nomeAntigo);
        if (amb) {
            amb.nome = nomeFormatado;
            salvarEmpresas(empresas);
            gerenciarAmbientesReforma(empresaAtual);
        }
    }
};

window.removerAmbienteReforma = function(nomeAmb) {
    if (!confirm(`Deseja excluir o ambiente "${nomeAmb}"?`)) return;
    const empresas = obterEmpresas();
    const empIndex = empresas.findIndex(e => e.nome === empresaAtual);
    if (empIndex >= 0 && empresas[empIndex].ambientes) {
        empresas[empIndex].ambientes = empresas[empIndex].ambientes.filter(a => a.nome !== nomeAmb);
        salvarEmpresas(empresas);
        gerenciarAmbientesReforma(empresaAtual);
    }
};

window.enviarPdfAmbiente = async function(nomeAmb, idx) {
    const fileInput = document.getElementById(`pdfAmbiente_${idx}`);
    const file = fileInput.files[0];
    if (!file) {
        alert("Selecione um arquivo PDF.");
        return;
    }
    try {
        const storageRef = ref(storage, `reformas/${empresaAtual}/${nomeAmb}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const urlDownload = await getDownloadURL(snapshot.ref);

        const empresas = obterEmpresas();
        const empIndex = empresas.findIndex(e => e.nome === empresaAtual);
        if (empIndex >= 0) {
            const amb = empresas[empIndex].ambientes.find(a => a.nome === nomeAmb);
            if (amb) {
                amb.projetoPdf = { nome: file.name, url: urlDownload };
                salvarEmpresas(empresas);
                alert("PDF enviado com sucesso!");
                gerenciarAmbientesReforma(empresaAtual);
            }
        }
    } catch (e) {
        alert("Erro ao enviar PDF.");
    }
};

// --- CHECKLIST DETALHADO POR AMBIENTE ---
window.abrirChecklistAmbientesReforma = function(nomeObra) {
    const container = document.getElementById('main-content');
    const empObj = obterEmpresaAtualObj();
    const ambientes = empObj.ambientes || [];

    if (ambientes.length === 0) {
        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-clipboard-check"></i> Checklist por Ambiente</h3>
                <p style="font-size: 13px; color: var(--text-muted);">Nenhum ambiente cadastrado. Cadastre ambientes primeiro.</p>
            </div>
            <button class="btn-action" onclick="gerenciarAmbientesReforma('${nomeObra}')">Cadastrar Ambientes</button>
            <button class="btn-action btn-back" onclick="abrirEmpresa('${nomeObra}')" style="margin-top: 10px;"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
        `;
        return;
    }

    let htmlAmbTabs = '';
    ambientes.forEach((amb, i) => {
        htmlAmbTabs += `<button onclick="window.renderizarChecklistAmbiente(${i})" class="btn-amb-tab" data-idx="${i}" style="padding: 8px 14px; border-radius: 6px; border: 1px solid var(--border-color); font-weight: bold; cursor: pointer; ${i === 0 ? 'background: var(--primary); color: white;' : 'background: rgba(255,255,255,0.05); color: var(--text-main);'}">${amb.nome}</button>`;
    });

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-clipboard-check"></i> Checklist: ${nomeObra}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Gerencie status, responsáveis, prazos e fotos por ambiente</p>
        </div>

        <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 15px;">
            ${htmlAmbTabs}
        </div>

        <div id="container-itens-ambiente"></div>

        <button class="btn-action btn-back" onclick="abrirEmpresa('${nomeObra}')" style="margin-top: 15px;"><i class="fa-solid fa-arrow-left"></i> Voltar ao Painel</button>
    `;

    window.renderizarChecklistAmbiente(0);
};

window.renderizarChecklistAmbiente = function(ambIndex) {
    document.querySelectorAll('.btn-amb-tab').forEach((btn, idx) => {
        if (idx === ambIndex) {
            btn.style.background = 'var(--primary)';
            btn.style.color = 'white';
        } else {
            btn.style.background = 'rgba(255,255,255,0.05)';
            btn.style.color = 'var(--text-main)';
        }
    });

    const container = document.getElementById('container-itens-ambiente');
    const empObj = obterEmpresaAtualObj();
    const amb = empObj.ambientes[ambIndex];

    if (!amb || !amb.itens) {
        container.innerHTML = `<p style="color: var(--text-muted);">Nenhum item neste ambiente.</p>`;
        return;
    }

    let htmlItens = '';
    amb.itens.forEach((item, itemIdx) => {
        const isConforme = item.status === 'conforme';
        const isNaoConforme = item.status === 'nao-conforme';

        let fotosHtml = '';
        if (item.fotos && item.fotos.length > 0) {
            item.fotos.forEach((fotoUrl) => {
                fotosHtml += `<img src="${fotoUrl}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);" />`;
            });
        }

        htmlItens += `
            <div style="border: 1px solid #475569; margin-bottom: 12px; border-radius: 8px; overflow: hidden; background: #0f172a;">
                <div style="padding: 12px; background: #1e293b; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 600; font-size: 13px;">${itemIdx + 1}. ${item.descricao}</span>
                    <span style="font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: bold; ${isConforme ? 'background: #16a34a; color: white;' : (isNaoConforme ? 'background: #dc2626; color: white;' : 'background: #334155; color: #cbd5e1;')}">
                        ${isConforme ? 'CONFORME' : (isNaoConforme ? 'NÃO CONFORME' : 'PENDENTE')}
                    </span>
                </div>
                <div style="padding: 12px; display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; gap: 8px;">
                        <button onclick="window.atualizarStatusItemAmbiente(${ambIndex}, ${itemIdx}, 'conforme')" style="flex: 1; padding: 8px; border: none; border-radius: 4px; color: white; cursor: pointer; font-weight: bold; background: ${isConforme ? '#16a34a' : '#334155'};">Conforme ✓</button>
                        <button onclick="window.atualizarStatusItemAmbiente(${ambIndex}, ${itemIdx}, 'nao-conforme')" style="flex: 1; padding: 8px; border: none; border-radius: 4px; color: white; cursor: pointer; font-weight: bold; background: ${isNaoConforme ? '#dc2626' : '#334155'};">Não Conforme ✗</button>
                    </div>

                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 8px;">
                        <div>
                            <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 2px;">Responsável:</label>
                            <input type="text" value="${item.responsavel || ''}" onchange="window.atualizarCampoItemAmbiente(${ambIndex}, ${itemIdx}, 'responsavel', this.value)" placeholder="Nome" style="width: 100%; padding: 6px; background: rgba(15,23,42,0.8); color: white; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px;">
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 2px;">Data Início:</label>
                            <input type="date" value="${item.dataInicio || ''}" onchange="window.atualizarCampoItemAmbiente(${ambIndex}, ${itemIdx}, 'dataInicio', this.value)" style="width: 100%; padding: 6px; background: rgba(15,23,42,0.8); color: white; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px;">
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 2px;">Prazo:</label>
                            <input type="date" value="${item.prazo || ''}" onchange="window.atualizarCampoItemAmbiente(${ambIndex}, ${itemIdx}, 'prazo', this.value)" style="width: 100%; padding: 6px; background: rgba(15,23,42,0.8); color: white; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px;">
                        </div>
                    </div>

                    <div>
                        <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 4px;">Fotos / Evidências:</label>
                        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                            ${fotosHtml}
                            <input type="file" id="fotoItem_${ambIndex}_${itemIdx}" accept="image/*" style="font-size: 11px; display: none;" onchange="window.anexarFotoItemAmbiente(event, ${ambIndex}, ${itemIdx})">
                            <button onclick="document.getElementById('fotoItem_${ambIndex}_${itemIdx}').click()" style="padding: 6px 10px; background: rgba(37,99,235,0.2); border: 1px solid var(--primary); color: white; border-radius: 4px; font-size: 12px; cursor: pointer;"><i class="fa-solid fa-camera"></i> Adicionar Foto</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = htmlItens;
};

window.atualizarStatusItemAmbiente = function(ambIndex, itemIdx, status) {
    const empresas = obterEmpresas();
    const empIndex = empresas.findIndex(e => e.nome === empresaAtual);
    if (empIndex >= 0) {
        empresas[empIndex].ambientes[ambIndex].itens[itemIdx].status = status;
        salvarEmpresas(empresas);
        window.renderizarChecklistAmbiente(ambIndex);
    }
};

window.atualizarCampoItemAmbiente = function(ambIndex, itemIdx, campo, valor) {
    const empresas = obterEmpresas();
    const empIndex = empresas.findIndex(e => e.nome === empresaAtual);
    if (empIndex >= 0) {
        empresas[empIndex].ambientes[ambIndex].itens[itemIdx][campo] = valor;
        salvarEmpresas(empresas);
    }
};

window.anexarFotoItemAmbiente = function(event, ambIndex, itemIdx) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        const empresas = obterEmpresas();
        const empIndex = empresas.findIndex(e => e.nome === empresaAtual);
        if (empIndex >= 0) {
            if (!empresas[empIndex].ambientes[ambIndex].itens[itemIdx].fotos) {
                empresas[empIndex].ambientes[ambIndex].itens[itemIdx].fotos = [];
            }
            empresas[empIndex].ambientes[ambIndex].itens[itemIdx].fotos.push(base64Image);
            salvarEmpresas(empresas);
            window.renderizarChecklistAmbiente(ambIndex);
        }
    };
    reader.readAsDataURL(file);
};

// --- CRONOGRAMA DA REFORMA ---
window.carregarCronogramaReforma = function(nomeObra) {
    const container = document.getElementById('main-content');
    const empObj = obterEmpresaAtualObj();
    const ambientes = empObj.ambientes || [];

    let htmlCronograma = '';
    ambientes.forEach(amb => {
        let itensHtml = '';
        if (amb.itens) {
            amb.itens.forEach(it => {
                itensHtml += `
                    <div style="background: rgba(15,23,42,0.6); padding: 8px 12px; border-radius: 6px; margin-bottom: 6px; font-size: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${it.descricao}</strong><br>
                            <span style="color: var(--text-muted);">Resp: ${it.responsavel || 'Não definido'}</span>
                        </div>
                        <div style="text-align: right; font-size: 11px; color: var(--text-muted);">
                            Início: ${it.dataInicio || '---'}<br>Prazo: ${it.prazo || '---'}
                        </div>
                    </div>
                `;
            });
        }
        htmlCronograma += `
            <div style="background: rgba(15, 23, 42, 0.4); padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 12px;">
                <h4 style="color: var(--primary); font-size: 14px; margin-bottom: 8px;"><i class="fa-solid fa-door-open"></i> ${amb.nome}</h4>
                ${itensHtml || '<p style="font-size: 12px; color: var(--text-muted);">Sem itens cadastrados.</p>'}
            </div>
        `;
    });

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-timeline"></i> Cronograma: ${nomeObra}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Cronograma físico estruturado por ambiente</p>
        </div>
        <div class="menu-inicial">${htmlCronograma || '<p style="color: var(--text-muted);">Nenhum ambiente ou cronograma montado.</p>'}</div>
        <button class="btn-action btn-back" onclick="abrirEmpresa('${nomeObra}')"><i class="fa-solid fa-arrow-left"></i> Voltar ao Painel</button>
    `;
};

// --- RELATÓRIOS (IMPRESSÃO PDF / WHATSAPP) ---
window.abrirRelatoriosReforma = function(nomeObra) {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-file-invoice"></i> Relatórios: ${nomeObra}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Compartilhe ou imprima o relatório completo da obra</p>
        </div>
        <div class="menu-inicial">
            <div class="card-menu" onclick="window.print()">
                <div class="card-icon"><i class="fa-solid fa-print"></i></div>
                <div class="card-info">
                    <h2>IMPRIMIR / GERAR PDF</h2>
                    <span>Imprimir relatório completo via navegador</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
            <div class="card-menu" onclick="window.enviarWhatsAppReforma('${nomeObra}')">
                <div class="card-icon" style="color: #22c55e;"><i class="fa-brands fa-whatsapp"></i></div>
                <div class="card-info">
                    <h2>ENVIAR VIA WHATSAPP</h2>
                    <span>Compartilhar resumo e status de progresso</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
        </div>
        <button class="btn-action btn-back" onclick="abrirEmpresa('${nomeObra}')"><i class="fa-solid fa-arrow-left"></i> Voltar ao Painel</button>
    `;
};

window.enviarWhatsAppReforma = function(nomeObra) {
    const empObj = obterEmpresaAtualObj();
    let texto = `*RELATÓRIO DE REFORMA - ${nomeObra}*%0A%0A`;
    if (empObj && empObj.ambientes) {
        empObj.ambientes.forEach(amb => {
            texto += `*Ambiente: ${amb.nome}*%0A`;
            if (amb.itens) {
                amb.itens.forEach(it => {
                    texto += `- ${it.descricao}: *${it.status.toUpperCase()}* (Resp: ${it.responsavel || 'N/A'})%0A`;
                });
            }
            texto += `%0A`;
        });
    }
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`.replace(/%250A/g, '%0A');
    window.open(url, '_blank');
};

window.carregarCronogramaGeral = function() {
    const container = document.getElementById('main-content');
    const empObj = obterEmpresaAtualObj();
    const lista = obterEmpreendimentos();
    let htmlObra = '';

    if (empObj && empObj.tipoEmpresa === 'Reforma') {
        carregarCronogramaReforma(empObj.nome);
        return;
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
    const totalObras = empObj && empObj.tipoEmpresa === 'Reforma' ? (empObj.ambientes ? empObj.ambientes.length : 0) : obterEmpreendimentos().length;

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-chart-pie"></i> Indicadores: ${empresaAtual}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Visão consolidada da gestão</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            <div style="background: rgba(15, 23, 42, 0.6); padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; text-align: center;">
                <span style="font-size: 22px; font-weight: bold; color: var(--primary);">${totalObras}</span>
                <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">${empObj && empObj.tipoEmpresa === 'Reforma' ? 'Ambientes Cadastrados' : 'Empreendimentos'}</p>
            </div>
            <div style="background: rgba(15, 23, 42, 0.6); padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; text-align: center;">
                <span style="font-size: 22px; font-weight: bold; color: #22c55e;">94.2%</span>
                <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Conformidade Média</p>
            </div>
        </div>
        <button class="btn-action btn-back" onclick="abrirEmpresa('${empresaAtual}')"><i class="fa-solid fa-arrow-left"></i> Voltar ao Painel</button>
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

window.escolherDisciplinaVistoria = function(nomeObra) {
    const container = document.getElementById('main-content');
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
        </div>

        <button class="btn-action btn-back" onclick="escolherDisciplinaVistoria('${nomeObra}')"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;
};

window.abrirPainelVistoriaUnificado = function(nomeObra, tipoArea) {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div id="containerChecklistItens"></div>
        <button class="btn-action btn-back" onclick="escolherTipoAreaArquitetonica('${nomeObra}')" style="margin-top: 15px;"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;
    renderChecklist('Vistoria Padrão Construtora');
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
            <div style="background:#dc2626; color:white; padding:12px; width:100%; text-align:center; font-weight:bold; border-radius:5px; margin-bottom:15px;">
                <i class="fa-solid fa-triangle-exclamation"></i> PENDÊNCIAS IDENTIFICADAS
            </div>
        `;
    } else {
        container.innerHTML = `
            <div style="background:#16a34a; color:white; padding:12px; width:100%; text-align:center; font-weight:bold; border-radius:5px; margin-bottom:15px;">
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
        <div id="status-tag-container"></div>
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
    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-cloud-arrow-up"></i> ${nomeObra}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Upload de Projetos PDF</p>
        </div>
        <div class="upload-section">
            <label style="font-size: 13px; font-weight: 600; color: var(--text-main);">Arquivo PDF:</label>
            <input type="file" id="pdfFileModulo" accept="application/pdf">
            <button class="btn-action" id="uploadBtnModulo"><i class="fa-solid fa-upload"></i> Enviar Arquivo PDF</button>
        </div>
        <button class="btn-action btn-back" onclick="escolherDisciplinaObra('${nomeObra}')"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;
    document.getElementById('uploadBtnModulo').addEventListener('click', () => alert("Enviado com sucesso!"));
};

window.iniciarWizardCadastro = function() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-circle-plus"></i> Novo Empreendimento (${empresaAtual})</h3>
        </div>
        <div class="menu-inicial" style="gap: 12px;">
            <div>
                <label style="font-size: 13px; font-weight: 600;">Nome da Obra:</label>
                <input type="text" id="novoNomeObra" placeholder="Ex: Residencial Bella Vista">
            </div>
            <button class="btn-action" onclick="salvarNovoEmpreendimento()"><i class="fa-solid fa-check"></i> Salvar Empreendimento</button>
        </div>
        <button class="btn-action btn-back" onclick="navegar('cadastros')"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;
};

window.salvarNovoEmpreendimento = function() {
    const nome = document.getElementById('novoNomeObra').value.trim();
    if (!nome) { alert("Por favor, informe o nome da obra."); return; }
    const lista = obterEmpreendimentos();
    lista.push({ nome: nome.toUpperCase(), tipologia: ['Padrão'], pavimentosTipo: 4, cobertura: 'Privativa', fechamento: ['Drywall'], tipoObra: 'Obra Nova', itensReforma: [], ambientes: [] });
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