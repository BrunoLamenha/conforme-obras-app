import { db as dbConfig } from './firebaseConfig.js';
import { getFirestore, doc, getDoc, setDoc, arrayUnion, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const db = getFirestore();
const storage = getStorage();
const obraId = "grand_garden";

// Função para buscar e exibir os arquivos do pavimento
async function carregarArquivos(pavimentoId) {
    const listaElement = document.getElementById('listaArquivos');
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
                    <a href="${arq.url}" target="_blank" style="color: #ffa500; text-decoration: underline;">
                        📄 ${arq.nome}
                    </a> 
                    <span style="font-size: 12px; color: #aaa;">(${dataFormatada})</span>
                `;
                listaElement.appendChild(li);
            });
        } else {
            listaElement.innerHTML = "<li>Nenhum projeto PDF cadastrado para este pavimento estrutural.</li>";
        }
    } catch (error) {
        console.error("Erro ao buscar arquivos:", error);
        listaElement.innerHTML = "<li>Erro ao carregar projetos.</li>";
    }
}

// Ouvinte de mudança no seletor de pavimento
document.getElementById('selectPavimento').addEventListener('change', (e) => {
    carregarArquivos(e.target.value);
});

// Carrega automaticamente os arquivos do pavimento padrão ao abrir a tela
window.addEventListener('DOMContentLoaded', () => {
    const pavimentoInicial = document.getElementById('selectPavimento').value;
    carregarArquivos(pavimentoInicial);
});

// Manipulador unificado do botão de Upload
document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('pdfFile');
    const pavimentoSelect = document.getElementById('selectPavimento');
    
    const file = fileInput.files[0];
    const pavimentoId = pavimentoSelect.value;

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
        carregarArquivos(pavimentoId);
    } catch (error) {
        console.error("Erro no upload:", error);
        alert("Falha ao subir arquivo.");
    }
});

let empreendimentosPadrao = [
    { 
        nome: 'ZEN LIFE', 
        pavimentos: ['1º Pavimento', '2º Pavimento', '3º Pavimento', '4º Pavimento (c/ piscina)'],
        detalhesPavimentos: {
            'PRIVATIVA - 1º Pavimento': [
                { unidade: '101', tipologia: '3 Quartos', banheiros: '2', suite: 'Sim', lavabo: 'Não', areaServico: 'Sim', varanda: 'Sim', reforma: 'Padrão', piscina: 'Sem piscina' }
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

function voltarInicio() {
    location.reload(); 
}

// Exposição global para o escopo do window
window.navegar = navegar;
window.voltarInicio = voltarInicio;
window.carregarListaCadastro = carregarListaCadastro;
window.iniciarWizardCadastro = iniciarWizardCadastro;
