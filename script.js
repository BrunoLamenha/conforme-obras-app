import { db as dbConfig } from './firebaseConfig.js';
import { getFirestore, doc, getDoc, setDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const db = getFirestore();
const storage = getStorage();

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

// --- MÓDULO DE VISTORIA ESTRUTURAL COM CHECKLISTS ESPECÍFICOS ---

window.abrirVistoriaObra = function(nomeObra) {
    const container = document.getElementById('main-content');
    
    // Validar se a obra possui vistoria estrutural configurada
    if (nomeObra !== 'GRAND GARDEN' && nomeObra !== 'ZEN LIFE') {
        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-clipboard-check"></i> ${nomeObra}</h3>
                <p style="font-size: 13px; color: var(--text-muted);">Módulo de vistoria estrutural indisponível para este empreendimento.</p>
            </div>
            <button class="btn-action btn-back" onclick="navegar('vistoria')"><i class="fa-solid fa-house-chimney"></i><i class="fa-solid fa-arrow-left" style="font-size: 10px; margin-left: -4px;"></i> Voltar</button>
        `;
        return;
    }

    let pavimentosVistoria = [];
    if (nomeObra === 'GRAND GARDEN') {
        pavimentosVistoria = ['2º Pavimento', '3º Pavimento', '4º Pavimento', '4º Pavimento Mezanino', 'Cobertura', 'Coberta'];
    } else if (nomeObra === 'ZEN LIFE') {
        pavimentosVistoria = ['Fundações', 'Subsolo', 'Pilotis', '1º Pavimento', '2º Pavimento', '3º Pavimento', '4º Pavimento', 'Cobertura', 'Coberta'];
    }

    let optionsVistoria = '';
    pavimentosVistoria.forEach(pav => {
        const val = pav.toLowerCase().replace(/[ºª]/g, '').replace(/\s+/g, '_');
        optionsVistoria += `<option value="${val}">${pav}</option>`;
    });

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-helmet-safety"></i> Vistoria Estrutural: ${nomeObra}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Selecione o pavimento para realizar o checklist de execução</p>
        </div>

        <div class="upload-section">
            <label style="font-size: 13px; font-weight: 600; color: var(--text-main);">Pavimento / Etapa:</label>
            <select id="selectPavimentoVistoria">
                ${optionsVistoria}
            </select>

            <div id="checklistContainer" style="margin-top: 15px;">
                <!-- O checklist injetado via JS aparecerá aqui -->
            </div>

            <button class="btn-action" onclick="salvarVistoria('${nomeObra}')" style="margin-top: 15px;"><i class="fa-solid fa-check-double"></i> Salvar Vistoria</button>
        </div>

        <button class="btn-action btn-back" onclick="navegar('vistoria')"><i class="fa-solid fa-house-chimney"></i><i class="fa-solid fa-arrow-left" style="font-size: 10px; margin-left: -4px;"></i> Voltar para Obras</button>
    `;

    const selectPavVistoria = document.getElementById('selectPavimentoVistoria');
    
    function atualizarChecklist() {
        const pavSelecionado = selectPavVistoria.value;
        gerarItensChecklist(nomeObra, pavSelecionado);
    }

    selectPavVistoria.addEventListener('change', atualizarChecklist);
    atualizarChecklist();
};

function gerarItensChecklist(nomeObra, pavimentoId) {
    const containerChecklist = document.getElementById('checklistContainer');
    let itens = [];

    // Regras específicas baseadas nos parâmetros da construtora fornecidos
    if (nomeObra === 'ZEN LIFE' && pavimentoId === 'fundacoes') {
        itens = [
            "Conferência de gabarito e locação dos eixos",
            "Escavação e conformidade das cavas de fundação",
            "Armadura dos blocos de concreto armado (bitolas, espaçadores e cobrimento)",
            "Lançamento e adensamento do concreto nos blocos e baldramas",
            "Tratamento de impermeabilização nas vigas baldrame"
        ];
    } else if (nomeObra === 'ZEN LIFE' && pavimentoId === 'subsolo') {
        itens = [
            "Execução e armação das paredes de contensão (cortinas/diafragma)",
            "Sistema de drenagem profunda e barbacãs",
            "Preparação do subleito e lastro de concreto magro",
            "Armação e instalação de juntas de dilatação/waterstop para laje de subpressão",
            "Concretagem da laje de subpressão (controle de patologias e fissuras)"
        ];
    } else {
        // Pavimentos com Laje Protendida (Grand Garden e demais andares do Zen Life)
        let tipoEstruturaMsg = nomeObra === 'GRAND GARDEN' ? "Concreto Armado com Protensão (Cabo Engraxado/Gordura protendida)" : "Laje Maciça Protendida";
        itens = [
            `Verificação de formas, escoramento e prumo (${tipoEstruturaMsg})`,
            "Posicionamento das armações passivas (inferior e superior) e estribos de pilares e vigas",
            "Montagem e traçado das cordoalhas de protensão (perfil e alinhamento em planta)",
            "Conferência de ancoragens ativas e passivas, nichos e inserções metálicas",
            "Inspeção pré-concretagem (limpeza de formas, gabaritos de eletrodutos)",
            "Acompanhamento da concretagem e adensamento rigoroso com vibrador",
            "Controle tecnológico (corpos de prova e abatimento do concreto)",
            "Operação de protensão (tração das cordoalhas) e liberação de escoramento conforme projeto estrutural"
        ];
    }

    let htmlItens = `<h4 style="font-size: 13px; color: var(--primary); margin-bottom: 8px;"><i class="fa-solid fa-list-check"></i> Fases de Execução e Verificação:</h4>`;
    htmlItens += `<div class="checkbox-group" style="grid-template-columns: 1fr; gap: 10px;">`;
    
    itens.forEach((item, index) => {
        htmlItens += `
            <label style="align-items: flex-start; line-height: 1.4;">
                <input type="checkbox" name="checkItem" value="${item}" style="margin-top: 3px;">
                <span>${item}</span>
            </label>
        `;
    });
    htmlItens += `</div>`;

    containerChecklist.innerHTML = htmlItens;
}

window.salvarVistoria = function(nomeObra) {
    const checks = document.querySelectorAll('input[name="checkItem"]:checked');
    const total = document.querySelectorAll('input[name="checkItem"]').length;
    
    alert(`Vistoria salva com sucesso para ${nomeObra}! Itens verificados: ${checks.length} de ${total}.`);
};

// --- MÓDULOS DE CADASTRO E UPLOAD ANTERIORES ---

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
