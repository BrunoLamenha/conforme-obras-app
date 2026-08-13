import { db as dbConfig } from './firebaseConfig.js';
import { getFirestore, doc, getDoc, setDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const db = getFirestore();
const storage = getStorage();

let empreendimentosPadrao = [
    { 
        nome: 'ZEN LIFE', 
        pavimentos: ['1º Pavimento', '2º Pavimento', '3º Pavimento', '4º Pavimento (c/ piscina)'],
        tipologia: 'Misto',
        fechamentoInterno: 'Drywall'
    },
    { nome: 'ZOE', pavimentos: ['Térreo', '1º Pavimento Tipo', 'Cobertura'], tipologia: '2 Quartos', fechamentoInterno: 'Drywall' },
    { nome: 'NAOKI', pavimentos: ['Térreo', '1º Pavimento Tipo', 'Cobertura'], tipologia: 'Studio', fechamentoInterno: 'Drywall' },
    { nome: 'ZEUS', pavimentos: ['Térreo', '1º Pavimento Tipo', 'Cobertura'], tipologia: '3 Quartos', fechamentoInterno: 'Alvenaria' },
    { nome: 'GRAND GARDEN', pavimentos: ['Pilotis', 'Térreo', '1º Pavimento Tipo', 'Cobertura'], tipologia: '2 Quartos', fechamentoInterno: 'Drywall' }
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
                        <span>Acessar vistorias e relatórios</span>
                    </div>
                    <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                </div>
            `;
        });

        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-clipboard-check"></i> Vistoria</h3>
                <p style="font-size: 13px; color: var(--text-muted);">Selecione o empreendimento para iniciar a vistoria</p>
            </div>
            <div class="menu-inicial">
                ${botoesObras}
            </div>
            <button class="btn-action btn-back" onclick="voltarInicio()"><i class="fa-solid fa-arrow-left"></i> Voltar ao Início</button>
        `;
    } else if (destino === 'cadastros') {
        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-building-shield"></i> Cadastros & Projetos</h3>
                <p style="font-size: 13px; color: var(--text-muted);">Gerencie empreendimentos e envie projetos em PDF por pavimento</p>
            </div>
            <div class="menu-inicial">
                <div class="card-menu" onclick="carregarListaCadastro()">
                    <div class="card-icon"><i class="fa-solid fa-list-check"></i></div>
                    <div class="card-info">
                        <h2>ESCOLHER DA LISTA</h2>
                        <span>Gerenciar obras, pavimentos e enviar projetos PDF</span>
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
            <button class="btn-action btn-back" onclick="voltarInicio()"><i class="fa-solid fa-arrow-left"></i> Voltar ao Início</button>
        `;
    }
}

// 1. Carregar Lista de Obras (Cadastro > Escolher da Lista)
window.carregarListaCadastro = function() {
    const container = document.getElementById('main-content');
    const lista = obterEmpreendimentos();
    
    let htmlObras = '';
    lista.forEach(obra => {
        htmlObras += `
            <div class="card-menu" onclick="gerenciarObraDetalhes('${obra.nome}')">
                <div class="card-icon"><i class="fa-solid fa-building"></i></div>
                <div class="card-info">
                    <h2>${obra.nome}</h2>
                    <span>Tipologia: ${obra.tipologia || 'Misto'} | Pavimentos: ${obra.pavimentos.length}</span>
                </div>
                <div class="card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
        `;
    });

    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-list-check"></i> Escolher Obra</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Selecione a obra para gerenciar projetos e fazer upload por pavimento</p>
        </div>
        <div class="menu-inicial">
            ${htmlObras.length > 0 ? htmlObras : '<p style="color:var(--text-muted); text-align:center;">Nenhum empreendimento cadastrado.</p>'}
        </div>
        <button class="btn-action btn-back" onclick="navegar('cadastros')"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;
};

// 2. Gerenciamento da Obra Selecionada (Com Upload integrado por pavimento)
window.gerenciarObraDetalhes = async function(nomeObra) {
    const container = document.getElementById('main-content');
    const lista = obterEmpreendimentos();
    const obra = lista.find(o => o.nome === nomeObra);
    
    if (!obra) return;

    const obraId = obra.nome.toLowerCase().replace(/\s+/g, '_');

    let optionsPavimentos = '';
    obra.pavimentos.forEach(pav => {
        const val = pav.toLowerCase().replace(/\s+/g, '_');
        optionsPavimentos += `<option value="${val}">${pav}</option>`;
    });

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-diagram-project"></i> ${obra.nome}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Gerenciamento de Projetos e Uploads por Pavimento</p>
        </div>

        <div class="upload-section">
            <label style="font-size: 13px; font-weight: 600; color: var(--text-main);">Selecione o Pavimento:</label>
            <select id="selectPavimentoModal">
                ${optionsPavimentos}
            </select>

            <label style="font-size: 13px; font-weight: 600; color: var(--text-main); display:block; margin-top: 10px;">Arquivo PDF do Projeto:</label>
            <input type="file" id="pdfFileModal" accept="application/pdf">
            
            <button class="btn-action" id="uploadBtnModal"><i class="fa-solid fa-cloud-arrow-up"></i> Enviar Projeto PDF</button>

            <div class="arquivos-list-section">
                <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--text-main);">Projetos Disponíveis</h4>
                <ul id="listaArquivosModal">
                    <li>Selecione um pavimento para carregar os projetos.</li>
                </ul>
            </div>
        </div>

        <button class="btn-action btn-back" onclick="carregarListaCadastro()"><i class="fa-solid fa-arrow-left"></i> Voltar para Lista de Obras</button>
    `;

    const selectPav = document.getElementById('selectPavimentoModal');
    
    async function carregarArquivosAtuais(pavimentoId) {
        const listaElement = document.getElementById('listaArquivosModal');
        listaElement.innerHTML = "<li>Carregando projetos...</li>";

        try {
            const docRef = doc(db, "obras", obraId, "pavimentos", pavimentoId);
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
                listaElement.innerHTML = "<li>Nenhum projeto PDF cadastrado neste pavimento.</li>";
            }
        } catch (error) {
            console.error("Erro ao buscar arquivos:", error);
            listaElement.innerHTML = "<li>Erro ao carregar projetos.</li>";
        }
    }

    selectPav.addEventListener('change', (e) => {
        carregarArquivosAtuais(e.target.value);
    });

    carregarArquivosAtuais(selectPav.value);

    document.getElementById('uploadBtnModal').addEventListener('click', async () => {
        const fileInput = document.getElementById('pdfFileModal');
        const file = fileInput.files[0];
        const pavimentoId = selectPav.value;

        if (!file) {
            alert("Por favor, selecione um arquivo PDF.");
            return;
        }

        try {
            const storageRef = ref(storage, `obras/${obraId}/pavimentos/${pavimentoId}/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const urlDownload = await getDownloadURL(snapshot.ref);

            const docRef = doc(db, "obras", obraId, "pavimentos", pavimentoId);
            await setDoc(docRef, {
                arquivos: arrayUnion({
                    nome: file.name,
                    url: urlDownload,
                    dataUpload: new Date()
                })
            }, { merge: true });

            alert("Upload concluído com sucesso!");
            carregarArquivosAtuais(pavimentoId);
            fileInput.value = "";
        } catch (error) {
            console.error("Erro no upload:", error);
            alert("Falha ao subir arquivo.");
        }
    });
};

// 3. Cadastrar Novo Empreendimento
window.iniciarWizardCadastro = function() {
    const container = document.getElementById('main-content');
    
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 5px;"><i class="fa-solid fa-circle-plus"></i> Novo Empreendimento</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Preencha as informações básicas da nova obra</p>
        </div>

        <div class="menu-inicial" style="gap: 12px;">
            <div>
                <label style="font-size: 13px; font-weight: 600;">Nome da Obra:</label>
                <input type="text" id="novoNomeObra" placeholder="Ex: Residencial Bella Vista">
            </div>
            <div>
                <label style="font-size: 13px; font-weight: 600;">Tipologia:</label>
                <input type="text" id="novaTipologia" placeholder="Ex: 2 Quartos, Studio, Misto">
            </div>
            <div>
                <label style="font-size: 13px; font-weight: 600;">Fechamento Interno:</label>
                <select id="novoFechamento">
                    <option value="Drywall">Drywall</option>
                    <option value="Alvenaria">Alvenaria</option>
                </select>
            </div>
            <div>
                <label style="font-size: 13px; font-weight: 600;">Pavimentos (separados por vírgula):</label>
                <input type="text" id="novosPavimentos" value="Térreo, 1º Pavimento Tipo, Cobertura">
            </div>
            
            <button class="btn-action" onclick="salvarNovoEmpreendimento()"><i class="fa-solid fa-check"></i> Salvar Empreendimento</button>
        </div>
        <button class="btn-action btn-back" onclick="navegar('cadastros')"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
    `;
};

window.salvarNovoEmpreendimento = function() {
    const nome = document.getElementById('novoNomeObra').value.trim();
    const tipologia = document.getElementById('novaTipologia').value.trim();
    const fechamento = document.getElementById('novoFechamento').value;
    const pavimentosStr = document.getElementById('novosPavimentos').value.trim();

    if (!nome) {
        alert("Por favor, informe o nome da obra.");
        return;
    }

    const pavimentos = pavimentosStr ? pavimentosStr.split(',').map(p => p.trim()) : ['Térreo', 'Cobertura'];

    const lista = obterEmpreendimentos();
    lista.push({
        nome: nome.toUpperCase(),
        tipologia: tipologia || 'Padrão',
        fechamentoInterno: fechamento,
        pavimentos: pavimentos
    });

    salvarEmpreendimentos(lista);
    alert("Empreendimento cadastrado com sucesso!");
    carregarListaCadastro();
};

window.abrirVistoriaObra = function(nomeObra) {
    alert(`Abrindo módulo de vistoria para: ${nomeObra}`);
};

window.voltarInicio = function() {
    location.reload();
};

window.navegar = navegar;
