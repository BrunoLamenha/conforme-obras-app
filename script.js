import { db as dbConfig } from './firebaseConfig.js';
import { getFirestore, doc, getDoc, setDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const db = getFirestore();
const storage = getStorage();

// Modelo de checklist estrutural oficial importado diretamente da base[cite: 11]
const checklistEstruturalModel = {
  "checklist_vistoria_estrutural": [
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
        "Checagem de contra-flechas e alinhamento das vigas e pilares.",
        "Verificação da estanqueidade e vedação das juntas para evitar fuga de pasta de cimento.",
        "Aplicação correta do produto desmoldante nas faces internas (evitando contato excessivo com o aço)."
      ]
    },
    {
      "etapa": 3,
      "categoria": "Elementos Embutidos e Passagens",
      "itens": [
        "Posicionamento de esperas, caixas de passagem, eletrodutos e tubulações hidráulicas/elétricas.",
        "Fixação adequada dos elementos embutidos para evitar deslocamento durante o lançamento."
      ]
    },
    {
      "etapa": 4,
      "categoria": "Montagem da Armadura Passiva (Aço)",
      "itens": [
        "Conferência dos diâmetros das barras, número de elementos e disposição conforme o projeto estrutural.",
        "Verificação do comprimento de ancoragem, ganchos e traspasses (emendas).",
        "Posicionamento correto dos espaçadores (plásticos ou de argamassa) para garantir rigorosamente o cobrimento mínimo.",
        "Inspeção da limpeza do aço (livre de ferrugem escamosa/não aderente, graxas ou tintas)."
      ]
    },
    {
      "etapa": 5,
      "categoria": "Instalação de Armadura de Protensão (Quando Aplicável)",
      "itens": [
        "Posicionamento e fixação das bainhas e cordoas conforme o traçado teórico previsto em projeto.",
        "Conferência do posicionamento das ancoragens ativas e passivas."
      ]
    },
    {
      "etapa": 6,
      "categoria": "Vistoria Final Pré-Concretagem (Liberação)",
      "itens": [
        "Remoção de qualquer resíduo restante dentro das fôrmas (serragem, pontas de arame, lixo).",
        "Conferência final integrada (fôrma + armadura + embutidos) e liberação formal para a concreteira."
      ]
    },
    {
      "etapa": 7,
      "categoria": "Lançamento, Adensamento e Cura do Concreto",
      "itens": [
        "Conferência da Nota Fiscal da concreteira (fck especificado, slump/abatimento e horário de emissão).",
        "Realização do ensaio de abatimento (Slump Test) na chegada do caminhão.",
        "Acompanhamento do lançamento, controlando a altura de queda para evitar segregação dos agregados (máximo de 2 metros).",
        "Adensamento correto com vibradores de imersão em camadas adequadas, evitando contato prolongado com fôrmas e armações.",
        "Acabamento superficial da peça e início imediato do procedimento de cura."
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
    if (salvo) {
        return JSON.parse(salvo);
    }
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
                <div class="card-menu" onclick="abrirVistoriaObra('${obra.nome}')">
                    <div class="card-icon"><i class="fa-solid fa-folder-open"></i></div>
                    <div class="card-info">
                        <h2>${obra.nome}</h2>
                    </div>
                    <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            `;
        });

        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-clipboard-check"></i> Vistoria</h3>
                <p style="font-size: 13px; color: var(--text-muted);">Selecione o empreendimento para iniciar a vistoria estrutural</p>
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
    }
}

// --- MÓDULO DE VISTORIA ESTRUTURAL COM O CHECKLIST COMPLETO ---

window.abrirVistoriaObra = function(nomeObra) {
    const container = document.getElementById('main-content');

    let pavimentosVistoria = ['Fundações', 'Subsolo', 'Pilotis', '1º Pavimento', '2º Pavimento', '3º Pavimento', '4º Pavimento', 'Cobertura', 'Coberta'];

    let optionsVistoria = '';
    pavimentosVistoria.forEach(pav => {
        const val = pav.toLowerCase().replace(/[ºª]/g, '').replace(/\s+/g, '_');
        optionsVistoria += `<option value="${val}">${pav}</option>`;
    });

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-helmet-safety"></i> Vistoria Estrutural: ${nomeObra}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Selecione o pavimento e aplique o checklist completo de execução</p>
        </div>

        <div class="upload-section">
            <label style="font-size: 13px; font-weight: 600; color: var(--text-main);">Pavimento / Etapa:</label>
            <select id="selectPavimentoVistoria">
                ${optionsVistoria}
            </select>

            <div id="checklistContainer" style="margin-top: 15px;">
                <!-- O checklist injetado baseado no checklist.json aparecerá aqui -->
            </div>

            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="btn-action" onclick="salvarVistoria('${nomeObra}')" style="margin-top:0;"><i class="fa-solid fa-check-double"></i> Salvar Vistoria</button>
                <button class="btn-action" onclick="enviarRelatorioWhatsApp('${nomeObra}')" style="margin-top:0; background-color: #16a34a; color: white;"><i class="fa-brands fa-whatsapp"></i> Enviar WhatsApp</button>
            </div>
        </div>

        <button class="btn-action btn-back" onclick="navegar('vistoria')"><i class="fa-solid fa-house-chimney"></i><i class="fa-solid fa-arrow-left" style="font-size: 10px; margin-left: -4px;"></i> Voltar para Obras</button>
    `;

    const selectPavVistoria = document.getElementById('selectPavimentoVistoria');
    
    function atualizarChecklist() {
        gerarItensChecklistDoModelo();
    }

    selectPavVistoria.addEventListener('change', atualizarChecklist);
    atualizarChecklist();
};

function gerarItensChecklistDoModelo() {
    const containerChecklist = document.getElementById('checklistContainer');
    const checklistData = checklistEstruturalModel.checklist_vistoria_estrutural;

    let htmlGeral = '';

    checklistData.forEach(bloco => {
        htmlGeral += `
            <div style="margin-bottom: 15px; background: rgba(15, 23, 42, 0.4); padding: 12px; border: 1px solid var(--border-color); border-radius: 8px;">
                <h4 style="font-size: 14px; color: var(--primary); margin-bottom: 8px;"><i class="fa-solid fa-layer-group"></i> Etapa ${bloco.etapa}: ${bloco.categoria}</h4>
                <div class="checkbox-group" style="grid-template-columns: 1fr; gap: 8px;">
        `;

        bloco.itens.forEach((itemText) => {
            htmlGeral += `
                <label style="align-items: flex-start; line-height: 1.4;">
                    <input type="checkbox" name="checkItemModel" value="${itemText}" style="margin-top: 3px;">
                    <span>${itemText}</span>
                </label>
            `;
        });

        htmlGeral += `</div></div>`;
    });

    containerChecklist.innerHTML = htmlGeral;
}

window.salvarVistoria = function(nomeObra) {
    const checks = document.querySelectorAll('input[name="checkItemModel"]:checked');
    const total = document.querySelectorAll('input[name="checkItemModel"]').length;
    const pavimento = document.getElementById('selectPavimentoVistoria').value;
    
    const dadosVistoria = {
        obra: nomeObra,
        pavimento: pavimento,
        totalVerificados: checks.length,
        totalItens: total,
        data: new Date().toISOString()
    };

    localStorage.setItem(`vistoria_${nomeObra}_${pavimento}`, JSON.stringify(dadosVistoria));
    alert(`Vistoria salva com sucesso para ${nomeObra} (${pavimento.toUpperCase()})! Itens verificados: ${checks.length} de ${total}.`);
};

window.enviarRelatorioWhatsApp = function(nomeObra) {
    const checks = document.querySelectorAll('input[name="checkItemModel"]:checked');
    const total = document.querySelectorAll('input[name="checkItemModel"]').length;
    const pavimento = document.getElementById('selectPavimentoVistoria').value;

    const textoMensagem = `*RELATÓRIO DE VISTORIA - CONFORME OBRA*\n\n` +
                          `🏢 *Obra:* ${nomeObra}\n` +
                          `📍 *Pavimento:* ${pavimento.toUpperCase()}\n` +
                          `✅ *Itens Conformes:* ${checks.length} / ${total}\n` +
                          `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')}`;

    const urlWpp = `https://api.whatsapp.com/send?text=${encodeURIComponent(textoMensagem)}`;
    window.open(urlWpp, '_blank');
};

// --- MÓDULOS DE CADASTRO E UPLOAD[cite: 12] ---

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
        ? ['Fundações', 'Subsolo', '1º Pavimento', '2º Pavimento', '3º Pavimento', '4º Pavimento', 'Cobertura', 'Coberta']
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
            <select id="selectPavimentoModulo">
                ${optionsPavimentos}
            </select>

            <label style="font-size: 13px; font-weight: 600; color: var(--text-main); display:block; margin-top: 10px;">Arquivo PDF:</label>
            <input type="file" id="pdfFileModulo" accept="application/pdf">
            
            <button class="btn-action" id="uploadBtnModulo"><i class="fa-solid fa-upload"></i> Enviar Arquivo PDF</button>

            <div class="arquivos-list-section">
                <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--text-main);">Arquivos Disponíveis</h4>
                <ul id="listaArquivosModulo">
                    <li>Carregando...</li>
                </ul>
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

    selectPav.addEventListener('change', (e) => {
        carregarArquivos(e.target.value);
    });

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
                <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 4px;">Tipologia (Selecione uma ou mais):</label>
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
                    <label><input type="radio" name="cobertura" value="Ambas"> Ambas</label>
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

    const tipologiasSelecionadas = Array.from(document.querySelectorAll('input[name="tipologia"]:checked')).map(el => el.value);
    const coberturaSelecionada = document.querySelector('input[name="cobertura"]:checked')?.value || 'Área Comum';
    const fechamentoSelecionado = Array.from(document.querySelectorAll('input[name="fechamento"]:checked')).map(el => el.value);

    const lista = obterEmpreendimentos();
    lista.push({
        nome: nome.toUpperCase(),
        tipologia: tipologiasSelecionadas.length > 0 ? tipologiasSelecionadas : ['Padrão'],
        pavimentosTipo: qtdPavimentos,
        cobertura: coberturaSelecionada,
        fechamento: fechamentoSelecionado
    });

    salvarEmpreendimentos(lista);
    alert("Empreendimento cadastrado com sucesso!");
    carregarListaCadastro();
};

window.voltarInicio = function() {
    location.reload();
};

window.navegar = navegar;
