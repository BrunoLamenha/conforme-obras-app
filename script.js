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

let empreendimentosPadrao = [
    { nome: 'ZEN LIFE', tipologia: ['Misto'], pavimentosTipo: 4, cobertura: 'Ambas', fechamento: ['Drywall'] },
    { nome: 'ZOE', tipologia: ['2 Quartos'], pavimentosTipo: 2, cobertura: 'Privativa', fechamento: ['Drywall'] },
    { nome: 'NAOKI', tipologia: ['Studio'], pavimentosTipo: 2, cobertura: 'Área Comum', fechamento: ['Drywall'] },
    { nome: 'ZEUS', tipologia: ['3 Quartos'], pavimentosTipo: 2, cobertura: 'Ambas', fechamento: ['Alvenaria'] },
    { nome: 'GRAND GARDEN', tipologia: ['2 Quartos'], pavimentosTipo: 3, cobertura: 'Privativa', fechamento: ['Drywall'] }
];

function obterEmpreendimentos() {
    const salvo = localStorage.getItem('conformeObra_empreendimentos');
    if (salvo) return JSON.parse(salvo);
    localStorage.setItem('conformeObra_empreendimentos', JSON.stringify(empreendimentosPadrao));
    return empreendimentosPadrao;
}

function salvarEmpreendimentos(lista) {
    localStorage.setItem('conformeObra_empreendimentos', JSON.stringify(lista));
}

function navegar(destino) {
    const container = document.getElementById('main-content');
    const lista = obterEmpreendimentos();

    if (destino === 'vistoria') {
        let botoesObras = '';
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

        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-clipboard-check"></i> Vistorias por Empreendimento</h3>
                <p style="font-size: 13px; color: var(--text-muted);">Escolha a obra para visualizar os caminhos e disciplinas</p>
            </div>
            <div class="menu-inicial">${botoesObras}</div>
            <button class="btn-action btn-back" onclick="voltarInicio()"><i class="fa-solid fa-house-chimney"></i><i class="fa-solid fa-arrow-left" style="font-size: 10px; margin-left: -4px;"></i> Voltar ao Início</button>
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
            <button class="btn-action btn-back" onclick="voltarInicio()"><i class="fa-solid fa-house-chimney"></i><i class="fa-solid fa-arrow-left" style="font-size: 10px; margin-left: -4px;"></i> Voltar ao Início</button>
        `;
    } else if (destino === 'cronograma') {
        carregarCronogramaGeral();
    } else if (destino === 'indicadores') {
        carregarPainelIndicadores();
    }
}

// --- SELEÇÃO DE DISCIPLINA PARA VISTORIA ---
window.escolherDisciplinaVistoria = function(nomeObra) {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-diagram-project"></i> ${nomeObra}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Selecione a disciplina correspondente para iniciar a vistoria</p>
        </div>

        <div class="menu-inicial">
            <div class="card-menu" onclick="abrirVistoriaObra('${nomeObra}', 'estrutural')">
                <div class="card-icon"><i class="fa-solid fa-helmet-safety"></i></div>
                <div class="card-info">
                    <h2>PROJETO ESTRUTURAL</h2>
                    <span>Checklist de execução, armações e concreto</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>

            <div class="card-menu" onclick="abrirVistoriaObra('${nomeObra}', 'arquitetonico')">
                <div class="card-icon"><i class="fa-solid fa-compass-drafting"></i></div>
                <div class="card-info">
                    <h2>PROJETO ARQUITETÔNICO</h2>
                    <span>Checklist de alvenaria, vãos e acabamentos</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
        </div>

        <button class="btn-action btn-back" onclick="navegar('vistoria')"><i class="fa-solid fa-house-chimney"></i><i class="fa-solid fa-arrow-left" style="font-size: 10px; margin-left: -4px;"></i> Voltar para Obras</button>
    `;
};

// --- MÓDULO DE VISTORIA COM CHECKLIST, FOTOS E NÃO CONFORMIDADES (NC) ---
window.abrirVistoriaObra = function(nomeObra, disciplina) {
    const container = document.getElementById('main-content');
    const nomeDisciplinaFormatado = disciplina === 'estrutural' ? 'Projeto Estrutural' : 'Projeto Arquitetônico';
    
    let pavimentosVistoria = ['Fundações', 'Subsolo', 'Pilotis', '1º Pavimento', '2º Pavimento', '3º Pavimento', 'Cobertura'];
    let optionsVistoria = '';
    pavimentosVistoria.forEach(pav => {
        const val = pav.toLowerCase().replace(/[ºª]/g, '').replace(/\s+/g, '_');
        optionsVistoria += `<option value="${val}">${pav}</option>`;
    });

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-clipboard-list"></i> ${nomeObra} (${nomeDisciplinaFormatado})</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Aplique o checklist, anexe fotos e registre não conformidades</p>
        </div>

        <div class="upload-section">
            <label style="font-size: 13px; font-weight: 600; color: var(--text-main);">Pavimento / Setor:</label>
            <select id="selectPavimentoVistoria">${optionsVistoria}</select>

            <div id="checklistContainer" style="margin-top: 15px;"></div>

            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="btn-action" onclick="salvarVistoriaCompleta('${nomeObra}', '${disciplina}')" style="margin-top:0;"><i class="fa-solid fa-check-double"></i> Salvar Vistoria</button>
                <button class="btn-action" onclick="enviarRelatorioWhatsApp('${nomeObra}', '${disciplina}')" style="margin-top:0; background-color: #16a34a; color: white;"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>
            </div>
        </div>

        <button class="btn-action btn-back" onclick="escolherDisciplinaVistoria('${nomeObra}')"><i class="fa-solid fa-house-chimney"></i><i class="fa-solid fa-arrow-left" style="font-size: 10px; margin-left: -4px;"></i> Voltar</button>
    `;

    carregarItensChecklist(disciplina);
    document.getElementById('selectPavimentoVistoria').addEventListener('change', () => carregarItensChecklist(disciplina));
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
                    
                    <!-- Evidência Fotográfica e NC (Ocultas inicialmente) -->
                    <div id="extra_${itemId}" style="display: none; margin-top: 8px; padding-top: 6px; border-top: 1px dashed var(--border-color); display: flex; flex-direction: column; gap: 6px;">
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

    // Listener para nome do arquivo da foto
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
    // Se o item NÃO estiver marcado (desmarcado), assume-se falha/não conformidade e exibe campos extras
    if (!chk.checked) {
        extraDiv.style.display = 'flex';
    } else {
        extraDiv.style.display = 'none';
    }
};

window.salvarVistoriaCompleta = function(nomeObra, disciplina) {
    const todosChecks = document.querySelectorAll('input[name="checkItemModel"]');
    const pavimento = document.getElementById('selectPavimentoVistoria').value;
    
    let totalVerificados = 0;
    let naoConformidades = [];

    todosChecks.forEach(chk => {
        if (chk.checked) {
            totalVerificados++;
        } else {
            const id = chk.id;
            const desc = document.getElementById(`nc_desc_${id}`)?.value || 'Não verificado / Falha';
            const resp = document.getElementById(`nc_resp_${id}`)?.value || 'Não atribuído';
            naoConformidades.push({
                item: chk.value,
                descricao: desc,
                responsavel: resp,
                status: 'Pendente'
            });
        }
    });

    const dadosVistoria = {
        obra: nomeObra,
        disciplina: disciplina,
        pavimento: pavimento,
        totalItens: todosChecks.length,
        totalVerificados: totalVerificados,
        naoConformidades: naoConformidades,
        data: new Date().toISOString()
    };

    localStorage.setItem(`vistoria_${nomeObra}_${disciplina}_${pavimento}`, JSON.stringify(dadosVistoria));
    alert(`Vistoria salva com sucesso! Itens conformes: ${totalVerificados}/${todosChecks.length}. NCs registradas: ${naoConformidades.length}.`);
};

window.enviarRelatorioWhatsApp = function(nomeObra, disciplina) {
    const pavimento = document.getElementById('selectPavimentoVistoria').value;
    const todosChecks = document.querySelectorAll('input[name="checkItemModel"]');
    let conformes = 0;
    let ncsCount = 0;

    todosChecks.forEach(chk => {
        if (chk.checked) conformes++;
        else ncsCount++;
    });

    const texto = `*RELATÓRIO DE VISTORIA - CONFORME OBRA*\n\n` +
                  `🏢 *Obra:* ${nomeObra}\n` +
                  `📐 *Disciplina:* ${disciplina.toUpperCase()}\n` +
                  `📍 *Pavimento:* ${pavimento.toUpperCase()}\n` +
                  `✅ *Conformes:* ${conformes} / ${todosChecks.length}\n` +
                  `⚠️ *Não Conformidades:* ${ncsCount}\n` +
                  `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
};

// --- CRONOGRAMA INTERATIVO ---
window.carregarCronogramaGeral = function() {
    const container = document.getElementById('main-content');
    const lista = obterEmpreendimentos();

    let htmlObra = '';
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

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-timeline"></i> Cronograma Interativo</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Acompanhamento do avanço físico dos empreendimentos</p>
        </div>
        <div class="menu-inicial">${htmlObra}</div>
        <button class="btn-action btn-back" onclick="voltarInicio()"><i class="fa-solid fa-house-chimney"></i><i class="fa-solid fa-arrow-left" style="font-size: 10px; margin-left: -4px;"></i> Voltar ao Início</button>
    `;
};

// --- PAINEL DE INDICADORES (DASHBOARD) ---
window.carregarPainelIndicadores = function() {
    const container = document.getElementById('main-content');
    const totalObras = obterEmpreendimentos().length;

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-chart-pie"></i> Painel de Indicadores</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Visão consolidada da gestão de obras</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            <div style="background: rgba(15, 23, 42, 0.6); padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; text-align: center;">
                <span style="font-size: 22px; font-weight: bold; color: var(--primary);">${totalObras}</span>
                <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Obras Cadastradas</p>
            </div>
            <div style="background: rgba(15, 23, 42, 0.6); padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; text-align: center;">
                <span style="font-size: 22px; font-weight: bold; color: #22c55e;">94.2%</span>
                <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Índice Médio de Conformidade</p>
            </div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.4); padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 15px;">
            <h4 style="font-size: 13px; color: var(--text-main); margin-bottom: 8px;"><i class="fa-solid fa-triangle-exclamation"></i> Status de Não Conformidades</h4>
            <div style="font-size: 12px; color: var(--text-muted); display: flex; flex-direction: column; gap: 4px;">
                <span>• Pendentes: 3 itens</span>
                <span>• Em Correção: 5 itens</span>
                <span>• Resolvidos: 22 itens</span>
            </div>
        </div>

        <button class="btn-action btn-back" onclick="voltarInicio()"><i class="fa-solid fa-house-chimney"></i><i class="fa-solid fa-arrow-left" style="font-size: 10px; margin-left: -4px;"></i> Voltar ao Início</button>
    `;
};

// --- MÓDULOS DE CADASTRO E UPLOAD ---
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
        <button class="btn-action btn-back" onclick="navegar('cadastros')"><i class="fa-solid fa-house-chimney"></i><i class="fa-solid fa-arrow-left" style="font-size: 10px; margin-left: -4px;"></i> Voltar</button>
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

        <button class="btn-action btn-back" onclick="carregarListaCadastro()"><i class="fa-solid fa-house-chimney"></i><i class="fa-solid fa-arrow-left" style="font-size: 10px; margin-left: -4px;"></i> Voltar para Lista</button>
    `;
};

window.abrirGerenciadorUpload = async function(nomeObra, disciplina) {
    const container = document.getElementById('main-content');
    const obraId = nomeObra.toLowerCase().replace(/\s+/g, '_');
    const disciplinaNome = disciplina === 'estrutural' ? 'Projeto Estrutural' : 'Projeto Arquitetônico';

    let pavimentosLista = disciplina === 'estrutural' 
        ? ['Fundações', 'Subsolo', '1º Pavimento', '2º Pavimento', '3º Pavimento', '4º Pavimento', 'Cobertura']
        : ['Térreo', 'Pavimento Tipo', 'Cobertura'];

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

        <button class="btn-action btn-back" onclick="escolherDisciplinaObra('${nomeObra}')"><i class="fa-solid fa-house-chimney"></i><i class="fa-solid fa-arrow-left" style="font-size: 10px; margin-left: -4px;"></i> Voltar para Disciplinas</button>
    `;

    const selectPav = document.getElementById('selectPavimentoModulo');

    async function carregarArquivos(pavId) {
        const listaElement = document.getElementById('listaArquivosModulo');
        listaElement.innerHTML = "<li>Carregando projetos...</li>";

        try {
            const docRef = doc(db, "obras", obraId, disciplina, pavId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().arquivos && docSnap.data().arquivos.length > 0) {
                const arquivos = docSnap.data().arquivos;
                listaElement.innerHTML = ""; 

                arquivos.forEach(arq => {
                    const li = document.createElement('li');
                    let dataFormatada = "";
                    if (arq.dataUpload) {
                        const data = arq.dataUpload.toDate ? arq.dataUpload.toDate() : new Date(arq.dataUpload.seconds * 1000);
                        dataFormatada = data.toLocaleDateString('pt-BR');
                    }

                    li.innerHTML = `
                        <a href="${arq.url}" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 500;">
                            <i class="fa-regular fa-file-pdf"></i> ${arq.nome}
                        </a> 
                        <span style="font-size: 11px; color: var(--text-muted);">(${dataFormatada})</span>
                    `;
                    listaElement.appendChild(li);
                });
            } else {
                listaElement.innerHTML = "<li>Nenhum projeto cadastrado neste pavimento.</li>";
            }
        } catch (error) {
            console.error("Erro ao buscar arquivos:", error);
            listaElement.innerHTML = "<li>Erro ao carregar arquivos.</li>";
        }
    }

    selectPav.addEventListener('change', (e) => carregarArquivos(e.target.value));
    carregarArquivos(selectPav.value);

    document.getElementById('uploadBtnModulo').addEventListener('click', async () => {
        const fileInput = document.getElementById('pdfFileModulo');
        const file = fileInput.files[0];
        const pavimentoId = selectPav.value;

        if (!file) {
            alert("Selecione um arquivo PDF.");
            return;
        }

        try {
            const storageRef = ref(storage, `obras/${obraId}/${disciplina}/${pavimentoId}/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const urlDownload = await getDownloadURL(snapshot.ref);

            const docRef = doc(db, "obras", obraId, disciplina, pavimentoId);
            await setDoc(docRef, {
                arquivos: arrayUnion({
                    nome: file.name,
                    url: urlDownload,
                    dataUpload: new Date()
                })
            }, { merge: true });

            alert("Upload concluído com sucesso!");
            carregarArquivos(pavimentoId);
            fileInput.value = "";
        } catch (error) {
            console.error("Erro no upload:", error);
            alert("Falha ao enviar arquivo.");
        }
    });
};

window.iniciarWizardCadastro = function() {
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-circle-plus"></i> Novo Empreendimento</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Preencha as configurações da nova obra</p>
        </div>

        <div class="menu-inicial" style="gap: 10px;">
            <div>
                <label style="font-size: 13px; font-weight: 600;">Nome da Obra:</label>
                <input type="text" id="novoNomeObra" placeholder="Ex: Residencial Bella Vista">
            </div>

            <div>
                <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 4px;">Tipologia:</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" name="tipologia" value="2 Quartos"> 2 Quartos</label>
                    <label><input type="checkbox" name="tipologia" value="3 Quartos"> 3 Quartos</label>
                    <label><input type="checkbox" name="tipologia" value="Studio"> Studio</label>
                    <label><input type="checkbox" name="tipologia" value="Misto"> Misto</label>
                </div>
            </div>

            <div>
                <label style="font-size: 13px; font-weight: 600;">Quantidade de Pavimentos Tipo:</label>
                <input type="number" id="novoQtdPavimentos" value="3" min="1" max="50">
            </div>

            <div>
                <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 4px;">Cobertura:</label>
                <div class="checkbox-group">
                    <label><input type="radio" name="cobertura" value="Área Comum" checked> Área Comum</label>
                    <label><input type="radio" name="cobertura" value="Privativa"> Privativa</label>
                </div>
            </div>

            <div>
                <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 4px;">Fechamento Interno:</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" name="fechamento" value="Drywall" checked> Drywall</label>
                    <label><input type="checkbox" name="fechamento" value="Alvenaria"> Alvenaria</label>
                </div>
            </div>
            
            <button class="btn-action" onclick="salvarNovoEmpreendimento()"><i class="fa-solid fa-check"></i> Salvar Empreendimento</button>
        </div>
        <button class="btn-action btn-back" onclick="navegar('cadastros')"><i class="fa-solid fa-house-chimney"></i><i class="fa-solid fa-arrow-left" style="font-size: 10px; margin-left: -4px;"></i> Voltar</button>
    `;
};

window.salvarNovoEmpreendimento = function() {
    const nome = document.getElementById('novoNomeObra').value.trim();
    const qtdPavimentos = parseInt(document.getElementById('novoQtdPavimentos').value) || 1;

    if (!nome) {
        alert("Por favor, informe o nome da obra.");
        return;
    }

    const tipologias = Array.from(document.querySelectorAll('input[name="tipologia"]:checked')).map(el => el.value);
    const cobertura = document.querySelector('input[name="cobertura"]:checked')?.value || 'Área Comum';
    const fechamento = Array.from(document.querySelectorAll('input[name="fechamento"]:checked')).map(el => el.value);

    const lista = obterEmpreendimentos();
    lista.push({
        nome: nome.toUpperCase(),
        tipologia: tipologias.length > 0 ? tipologias : ['Padrão'],
        pavimentosTipo: qtdPavimentos,
        cobertura: cobertura,
        fechamento: fechamento
    });

    salvarEmpreendimentos(lista);
    alert("Empreendimento cadastrado com sucesso!");
    carregarListaCadastro();
};

window.voltarInicio = function() {
    location.reload();
};

// Registro do Service Worker para suporte a PWA e funcionamento offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado:', reg.scope))
            .catch(err => console.log('Falha ao registrar Service Worker:', err));
    });
}

window.navegar = navegar;
