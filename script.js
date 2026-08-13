<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vistoria Interna de Obra - Pro</title>

    <!-- LIBS EXTERNAS -->
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>

    <style>
        :root {
            --primary: #004a8f;
            --primary-hover: #003366;
            --secondary: #0891b2;
            --success: #16a34a;
            --danger: #dc2626;
            --bg-body: #f8fafc;
            --card-bg: #ffffff;
            --border-color: #e2e8f0;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        body { background: var(--bg-body); padding: 12px; color: #1e293b; max-width: 1400px; margin: 0 auto; overflow-x: hidden; }
        
        .header { background: var(--primary); color: white; padding: 18px; text-align: center; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 4px 12px rgba(0,74,143,0.15); }
        .header h2 { font-size: 1.5rem; font-weight: 700; }
        .header small { font-size: 0.8rem; opacity: 0.9; }

        .tabs { display: flex; gap: 8px; margin-bottom: 15px; overflow-x: auto; padding-bottom: 4px; }
        .tab-btn { flex: 1; min-width: 110px; padding: 10px 12px; border: none; background: #e2e8f0; font-weight: bold; font-size: 0.85rem; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; color: #475569; display: flex; align-items: center; justify-content: center; gap: 6px; white-space: nowrap; }
        .tab-btn.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(0,74,143,0.25); }

        .card { background: var(--card-bg); padding: 16px; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); border: 1px solid var(--border-color); width: 100%; }
        .card h3, .card h4 { color: var(--primary); font-size: 1.05rem; margin-bottom: 10px; }

        .text-center { text-align: center; }
        .btn-group-center { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 10px; }

        .btn-group { display: grid; grid-template-columns: repeat(auto-fill, minmax(55px, 1fr)); gap: 6px; margin-top: 10px; }
        .btn { padding: 10px 12px; border: 1px solid var(--border-color); background: #f8fafc; border-radius: 8px; text-align: center; font-weight: bold; font-size: 0.85rem; cursor: pointer; transition: 0.15s; }
        .btn:hover { background: #f1f5f9; }
        .btn.active { outline: 3px solid var(--primary); outline-offset: -3px; }
        
        .unit-ok { background: #d1fae5 !important; border-color: #10b981 !important; color: #065f46; }
        .unit-nok { background: #fee2e2 !important; border-color: #ef4444 !important; color: #991b1b; }
        .unit-pending { background: #f1f5f9 !important; border-color: #cbd5e1 !important; color: #64748b; }

        .item-card { border: 1px solid var(--border-color); border-radius: 10px; padding: 14px; margin-bottom: 12px; background: #fafafa; }
        .item-header { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
        .item-title { font-weight: 600; font-size: 0.9rem; flex: 1; min-width: 150px; }
        
        .btn-status { padding: 8px 12px; border: none; border-radius: 6px; font-weight: bold; font-size: 0.75rem; cursor: pointer; transition: 0.2s; }
        .btn-neutral { background: #e2e8f0; color: #475569; }
        .btn-ok-active { background: var(--success); color: white; }
        .btn-nok-active { background: var(--danger); color: white; }

        .nc-box { background: #fff; border: 1px dashed var(--danger); padding: 12px; border-radius: 10px; margin-top: 10px; }
        .nc-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 0.8rem; color: var(--danger); margin-bottom: 8px; }

        .checklist-group { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 6px; margin-bottom: 10px; background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); }
        .chk-label { font-size: 0.8rem; display: flex; align-items: center; gap: 6px; cursor: pointer; line-height: 1.2; }
        .chk-label input { width: auto; margin: 0; cursor: pointer; }

        .grid-two { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        @media(max-width: 768px) { .grid-two { grid-template-columns: 1fr; } }

        input, select { width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.85rem; background: #fff; }
        input:focus, select:focus { outline: 2px solid var(--primary); border-color: transparent; }
        label { font-size: 0.75rem; font-weight: 700; color: #475569; display: block; margin-bottom: 4px; text-transform: uppercase; }

        .photo-area { margin-top: 8px; border-top: 1px solid #eee; padding-top: 8px; }
        .photo-gallery { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
        .photo-container { position: relative; width: 60px; height: 60px; }
        .photo-thumb { width: 100%; height: 100%; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; }
        .btn-remove-photo { position: absolute; top: -5px; right: -5px; background: var(--danger); color: white; border: none; border-radius: 50%; width: 18px; height: 18px; font-size: 10px; cursor: pointer; font-weight: bold; }

        .btn-main { width: 100%; padding: 12px; background: var(--secondary); color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 0.95rem; cursor: pointer; margin-top: 10px; transition: 0.2s; box-shadow: 0 2px 6px rgba(8,145,178,0.2); }
        .btn-main:hover { opacity: 0.95; }
        .btn-add-nc { width: 100%; padding: 8px; background: #64748b; color: white; border: none; border-radius: 8px; font-size: 0.8rem; margin-top: 6px; cursor: pointer; font-weight: 600; }

        .kpi-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }
        @media(max-width: 600px) { .kpi-container { grid-template-columns: 1fr; } }
        .kpi-card { background: white; padding: 14px; border-radius: 12px; text-align: center; border: 1px solid var(--border-color); box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
        .kpi-card small { font-size: 0.7rem; font-weight: 700; color: #64748b; }
        .kpi-num { font-size: 1.4rem; font-weight: bold; margin-top: 4px; }

        .badge-resp { display: inline-block; padding: 3px 8px; border-radius: 12px; color: white; font-size: 0.7rem; font-weight: bold; }

        .cronograma-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 12px; }
        @media(max-width: 900px) { .cronograma-layout { grid-template-columns: 1fr; } }

        #calendar { width: 100%; height: 500px; }

        .service-group-card { background: #ffffff; border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .service-group-header { padding: 10px 14px; font-weight: bold; font-size: 0.9rem; display: flex; justify-content: space-between; align-items: center; color: white; }
        .service-group-body { padding: 10px; display: flex; flex-direction: column; gap: 8px; background: #fafafa; }
        .unit-subcard { background: #ffffff; border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); transition: all 0.3s ease; }
        .unit-subcard.highlighted { border: 2px solid var(--secondary); background: #f0fdf4; box-shadow: 0 0 12px rgba(8,145,178,0.3); }

        .general-units-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(65px, 1fr)); gap: 6px; margin-top: 10px; }
        .unit-grid-box { padding: 10px 6px; text-align: center; border-radius: 8px; font-weight: bold; font-size: 0.85rem; cursor: pointer; border: 1px solid var(--border-color); transition: transform 0.1s; }
        .unit-grid-box:hover { transform: scale(1.05); }

        .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:none; justify-content:center; align-items:center; z-index:9999; padding: 15px; }
        .modal-content { background: #fff; width: 100%; max-width: 600px; max-height: 85vh; border-radius: 12px; padding: 20px; overflow-y: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
        .modal-overlay img { max-width:90%; max-height:80vh; border-radius:8px; }

        .history-card { background: #f8fafc; border: 1px solid var(--border-color); padding: 12px; border-radius: 8px; margin-bottom: 10px; }
        .history-actions { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
        .btn-hist { padding: 6px 10px; border: none; border-radius: 6px; font-size: 0.75rem; font-weight: bold; cursor: pointer; color: white; }
    </style>
</head>
<body>

    <div class="header">
        <h2>Vistoria Interna de Obra</h2>
        <small>Controle Técnico de Qualidade & Nuvem Pro</small>
    </div>

    <!-- NAVEGAÇÃO DE ABAS -->
    <div class="tabs">
        <button class="tab-btn active" id="tab-vistorias-btn" onclick="switchTab('vistorias')">📝 Vistorias</button>
        <button class="tab-btn" id="tab-mapa-btn" onclick="switchTab('mapa')">📊 Mapa & Indicadores</button>
        <button class="tab-btn" id="tab-cronograma-btn" onclick="switchTab('cronograma')">📅 Cronograma</button>
    </div>

    <!-- ABA 1: VISTORIAS -->
    <div id="tab-vistorias">
        <div class="card" id="inspector-card">
            <h3>👤 Identificação do Vistoriador</h3>
            <label style="margin-top:8px;">Nome Completo do Engenheiro / Vistoriador:</label>
            <input type="text" id="inspector-name" placeholder="Ex: Eng. Bruno Lamenha">
            <div id="device-info-text" style="margin-top:8px; font-size:0.8rem; color:#666;"></div>
            <button class="btn-main" style="background:var(--success);" onclick="confirmInspector()">Confirmar & Iniciar Vistoria ✓</button>
        </div>

        <div class="card text-center" id="floor-card" style="display:none;">
            <h3>1. Selecione o Pavimento</h3>
            <div class="btn-group-center" id="floors">
                <div class="btn" onclick="setFloor(1, this)">1º Pav</div>
                <div class="btn" onclick="setFloor(2, this)">2º Pav</div>
                <div class="btn" onclick="setFloor(3, this)">3º Pav</div>
                <div class="btn" onclick="setFloor(4, this)">4º Pav</div>
            </div>
        </div>

        <div class="card" id="unit-card" style="display:none;">
            <h3>2. Selecione a Unidade</h3>
            <div class="btn-group" id="units"></div>
        </div>

        <div class="card" id="type-card" style="display:none;">
            <h3>3. Tipo de Vistoria</h3>
            <div style="display:flex; gap:8px; margin-top:8px; flex-wrap:wrap;" id="category-selection-container">
                <button class="tab-btn btn-opt" style="flex:1; min-width:140px;" id="btn-cat-padrao" onclick="setCategory('Padrão Construtora', this)">Padrão Construtora</button>
                <button class="tab-btn btn-opt" style="flex:1; min-width:140px;" id="btn-cat-reforma" onclick="setCategory('Reforma / Aditivo', this)">Reforma / Aditivo</button>
            </div>

            <h3 style="margin-top: 15px;">4. Etapa da Vistoria</h3>
            <div style="display:flex; gap:8px; margin-top:8px;" id="stage-selection-container">
                <button class="btn btn-stage" id="btn-stage-1" style="flex:1;" onclick="setStage('1ª Vistoria', this)">📋 1ª Vistoria</button>
                <button class="btn btn-stage" id="btn-stage-rev" style="flex:1;" onclick="setStage('Revistoria', this)">🔄 Revistoria</button>
            </div>
            <div id="stage-info-text" style="margin-top:10px; font-weight:bold; color:var(--primary); font-size:0.9rem;"></div>
        </div>

        <!-- HISTÓRICO DA UNIDADE -->
        <div class="card" id="history-section" style="display:none;">
            <h4>📜 Histórico de Vistorias da Unidade</h4>
            <div id="unit-history-list"></div>
        </div>

        <!-- AMBIENTES DA UNIDADE -->
        <div id="inspection-area" style="display:none;">
            <div class="card" style="background:var(--primary); color:white;">
                <h3 id="unit-title" style="color:white; margin-bottom:0;">Unidade</h3>
            </div>

            <div class="card">
                <h4>🚪 Dormitório / Cozinha</h4>
                <div id="room-dorm"></div>
            </div>

            <div class="card">
                <h4>🚿 Banheiro</h4>
                <div id="room-bath"></div>
            </div>

            <div class="card">
                <h4>🌿 Varanda</h4>
                <div id="room-balcony"></div>
            </div>

            <button class="btn-main" onclick="generateTechnicalPDF()">📄 Finalizar & Salvar Vistoria</button>
            <button class="btn-main" id="btn-next" style="background:var(--success); display:none; margin-top:8px;" onclick="sendWhatsAppSummary()">📲 Enviar Resumo WhatsApp</button>
        </div>
    </div>

    <!-- ABA 2: MAPA E INDICADORES -->
    <div id="tab-mapa" style="display:none;">
        <div class="kpi-container">
            <div class="kpi-card">
                <small>UNIDADES VISTORIADAS</small>
                <div class="kpi-num" id="unidades-vistoriadas" style="color:var(--primary);">0 / 76</div>
            </div>
            <div class="kpi-card">
                <small>APROVADAS (100% OK)</small>
                <div class="kpi-num" id="unidades-aprovadas" style="color:var(--success);">0</div>
            </div>
            <div class="kpi-card">
                <small>PENDÊNCIAS ABERTAS</small>
                <div class="kpi-num" id="pendencias-abertas" style="color:var(--danger);">0</div>
            </div>
        </div>

        <button class="btn-main" style="background:var(--success); margin-bottom:12px;" onclick="exportToExcelXLSX()">📊 Baixar Dados em Excel (.xlsx)</button>

        <div class="card">
            <h4>🏢 Quadro Geral de Unidades (Clique para ver Vistorias)</h4>
            <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 8px;">Toque em qualquer apartamento para inspecionar o histórico completo de vistorias realizadas.</div>
            <div class="general-units-grid" id="general-units-grid-container"></div>
        </div>

        <div class="card">
            <h4>🔥 Top Não Conformidades Mais Recorrentes na Obra</h4>
            <div id="top-nc-list" style="margin-top:10px;">Nenhuma pendência registrada ainda.</div>
        </div>

        <div class="card">
            <h4>👷 Fila de Pendências por Responsável</h4>
            <div id="resp-queue-list" style="margin-top:10px;">Nenhuma pendência ativa para exibição.</div>
        </div>
    </div>

    <!-- ABA 3: CRONOGRAMA & CALENDÁRIO -->
    <div id="tab-cronograma" style="display:none;">
        <div class="card">
            <label>Filtrar Responsável / Serviço:</label>
            <select id="calendar-resp-filter" onchange="renderInteractiveCalendar()">
                <option value="TODOS">Todos os Serviços / Responsáveis</option>
                <option value="Piso e Revestimento">Piso e Revestimento</option>
                <option value="Gesso / Sancas">Gesso / Sancas</option>
                <option value="Eletricista">Eletricista</option>
                <option value="Instalações Hidráulicas">Instalações Hidráulicas</option>
                <option value="Climatização / Ar-Condicionado">Climatização / Ar-Condicionado</option>
                <option value="Marmoraria / Graniteiro">Marmoraria / Graniteiro</option>
                <option value="Esquadrias de Alumínio / Vidros">Esquadrias de Alumínio / Vidros</option>
                <option value="Marcenaria / Portas de Madeira">Marcenaria / Portas de Madeira</option>
                <option value="Pintura / Emassamento">Pintura / Emassamento</option>
            </select>
        </div>
        
        <div class="cronograma-layout">
            <div class="card">
                <div id="calendar"></div>
            </div>

            <div class="card">
                <h4>📋 Atividades por Serviço e Unidades</h4>
                <div id="scheduled-activities-list" style="margin-top:10px; max-height:600px; overflow-y:auto;"></div>
            </div>
        </div>
    </div>

    <!-- MODAL DE HISTÓRICO GERAL DA UNIDADE -->
    <div class="modal-overlay" id="unit-modal-overview" onclick="closeUnitOverviewModal(event)">
        <div class="modal-content" onclick="event.stopPropagation()">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 id="modal-overview-title" style="margin:0; color:var(--primary);">Histórico da Unidade</h3>
                <button onclick="document.getElementById('unit-modal-overview').style.display='none'" style="background:none; border:none; font-size:1.2rem; font-weight:bold; cursor:pointer; color:#64748b;">✕</button>
            </div>
            <div id="modal-overview-body"></div>
        </div>
    </div>

    <!-- MODAL PARA EXPANDIR FOTO -->
    <div class="modal-overlay" id="img-modal" onclick="this.style.display='none'">
        <img id="modal-img-src" src="">
    </div>

    <script>
        const firebaseConfig = {
          apiKey: "AIzaSyBqtptEp5QjIOoAjwx0wT--cswUhSvcsGM",
          authDomain: "vistoria-obra.firebaseapp.com",
          projectId: "vistoria-obra",
          storageBucket: "vistoria-obra.firebasestorage.app",
          messagingSenderId: "269277062191",
          appId: "1:269277062191:web:ab9a9d404129df66cd12da",
          measurementId: "G-GP1QQVWR50"
        };

        if (typeof firebase !== 'undefined' && !firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        const db = (typeof firebase !== 'undefined' && firebase.firestore) ? firebase.firestore() : null;

        const TOTAL_UNIDADES = 76;

        const roomNames = {
            'room-dorm': 'Dormitório / Cozinha',
            'room-bath': 'Banheiro',
            'room-balcony': 'Varanda'
        };

        const respColors = {
            "Piso e Revestimento": "#059669",
            "Gesso / Sancas": "#db2777",
            "Eletricista": "#d97706",
            "Instalações Hidráulicas": "#0284c7",
            "Climatização / Ar-Condicionado": "#0891b2",
            "Marmoraria / Graniteiro": "#7c3aed",
            "Esquadrias de Alumínio / Vidros": "#475569",
            "Marcenaria / Portas de Madeira": "#78350f",
            "Pintura / Emassamento": "#2563eb",
            "Serralharia / Portões": "#525252",
            "Impermeabilização": "#0891b2",
            "Limpeza Pós-Obra": "#16a34a",
            "Gás Encanado": "#ea580c"
        };

        const checklist = [
            { id: "piso", name: "1. Contrapiso, Revestimentos e Rodapés", cleanName: "Contrapiso e Revestimentos Cerâmicos/Porcelanato", options: ["Peça Oca / Solta", "Junta Desalinhada", "Caimento Incorreto (Poça)", "Rodapé Solto / Danificado", "Falta Rejunte no Piso", "Piso Riscado / Manchado", "Outros"] },
            { id: "gesso", name: "2. Forro e Sancas de Gesso", cleanName: "Gesso e Sancas", options: ["Fissura / Trinca na Chapa ou Junta", "Desnível / Placa Oca / Abulada", "Falta Tabica / Junta de Dilatação Deficiente", "Abertura / Recorte Incorreto para Luminária", "Marcas de Parafuso / Rebarbas Expostas", "Falta Emassamento / Rejunte no Gesso", "Umidade / Mofo / Mancha amarelada", "Outros"] },
            { id: "eletrica", name: "3. Tubulações, Tomadas, Interruptores e Luminárias", cleanName: "Instalações Elétricas e Iluminação", options: ["Espelho Torto / Descaixado", "Sem Espelho / Módulo", "Adicionar ou Retirar Módulo", "Adicionar ou Retirar Ponto", "Ponto Sem Energia / Fio Solto", "Luminária Não Liga / Danificada", "Quadro de Disjuntores Incompleto", "Outros"] },
            { id: "hidra", name: "4. Tubulações, Louças, Metais e Sifão", cleanName: "Instalações Hidráulicas e Louças/Metais", options: ["Vazamento / Gotejamento", "Sifão Sem Vedação", "Instalar Torneira e Engate", "Instalar Grelha e Porta Grelha", "Peça Arranhada / Amassada", "Falta Acabamento de Registro", "Vaso Sanitário Solto", "Descarga Sem Funcionamento", "Outros"] },
            { id: "ac", name: "5. Infraestrutura / Aparelho Ar-Condicionado", cleanName: "Infraestrutura de Climatização", options: ["Dreno Entupido / Sem Vazão", "Falta Ponto Elétrico", "Carga Sem Pressão", "Tubulação Exposta", "Outros"] },
            { id: "bancada", name: "6. Bancadas, Soleiras e Peitoris", cleanName: "Marmoraria / Bancadas e Soleiras", options: ["Peça Trincada / Bicada", "Falta de Rejunte / Silicone", "Falta Rodamão / Espelho", "Desnível / Fora de Prumo", "Mancha no Granito", "Outros"] },
            { id: "esquadria", name: "7. Esquadrias de Alumínio, Vidros e Vedações", cleanName: "Esquadrias e Vidraçaria", options: ["Vidro Riscado / Trincado", "Falta Vedação de Silicone", "Trilho / Roldana Travando", "Fecho / Trava Danificada", "Guarda-Corpo Desancorado", "Outros"] },
            { id: "portas", name: "8. Portas de Madeira e Alizares", cleanName: "Esquadrias de Madeira", options: ["Porta Raspando no Piso/Marco", "Fechadura / Maçaneta Ruim", "Alizar Descolando / Fora de Prumo", "Falta Pintura / Verniz", "Porta Empenada", "Outros"] },
            { id: "pintura", name: "9. Emassamento, Lixamento e Pintura", cleanName: "Pintura e Acabamento de Parede/Teto", options: ["Falta Emassamento", "Falta Lixamento / Imperfeição", "Falta 1ª Demão", "Falta 2ª Demão / Pintura Final", "Mancha / Desbotamento", "Recorte Mal Feito", "Fissura / Trinca", "Sujeira / Tinta Escorrida", "Outros"] }
        ];

        var pendingNCs = {};
        var itemStatuses = {};
        let selectedFloorNum = null;
        let selectedUnitNum = null;
        let selectedCategory = "Padrão Construtora";
        let selectedStage = "1ª Vistoria";
        let inspectorName = "";
        let dbUnitsCache = {};
        let fullCalendarInstance = null;

        window.onload = function() {
            detectDevice();
            loadAllUnitsData();
        };

        function detectDevice() {
            let deviceId = localStorage.getItem('vistoria_device_id') || 'DEV-' + Math.random().toString(36).substr(2, 6).toUpperCase();
            localStorage.setItem('vistoria_device_id', deviceId);
            const infoEl = document.getElementById('device-info-text');
            if (infoEl) infoEl.innerHTML = "📱 Dispositivo: <strong>" + deviceId + "</strong>";

            const localName = localStorage.getItem('vistoria_inspector_name');
            const nameInput = document.getElementById('inspector-name');
            if (localName && nameInput) nameInput.value = localName;
        }

        function confirmInspector() {
            const nameInput = document.getElementById('inspector-name').value.trim();
            if (!nameInput) { alert('Informe o nome do vistoriador.'); return; }

            inspectorName = nameInput;
            localStorage.setItem('vistoria_inspector_name', nameInput);

            document.getElementById('inspector-card').innerHTML = `
                <h3>👤 Responsável Confirmado</h3>
                <p style="margin-top:5px; color:var(--primary);"><strong>Vistoriador:</strong> ${inspectorName}</p>
            `;
            document.getElementById('floor-card').style.display = 'block';
        }

        function loadAllUnitsData() {
            try {
                const localData = localStorage.getItem('vistorias_db');
                if (localData) {
                    dbUnitsCache = JSON.parse(localData);
                    updateDashboardData();
                    renderGeneralUnitsOverview();
                }
            } catch (e) {}

            if (db && db.collection) {
                db.collection('vistorias').get().then(snapshot => {
                    snapshot.forEach(doc => { dbUnitsCache[doc.id] = doc.data().history || []; });
                    localStorage.setItem('vistorias_db', JSON.stringify(dbUnitsCache));
                    updateDashboardData();
                    renderGeneralUnitsOverview();
                    if (selectedFloorNum) renderUnitsGrid();
                }).catch(err => console.log("Carregado localmente"));
            }
        }

        function parseToDate(dateStr) {
            if (!dateStr || String(dateStr).includes('Não') || String(dateStr).trim() === '') return null;
            let str = String(dateStr).trim();

            if (str.includes('-') && str.indexOf('-') === 4) {
                let parts = str.split('-');
                if (parts.length === 3) {
                    return new Date(`${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}T00:00:00`);
                }
            }

            let parts;
            if (str.includes('-')) {
                parts = str.split('-');
            } else if (str.includes('/')) {
                parts = str.split('/');
            } else {
                return null;
            }

            if (parts.length === 3) {
                if (parts[0].length === 2 && parts[2].length === 4) {
                    return new Date(`${parts[2]}-${parts[1].padStart(2, '0')}T00:00:00`);
                }
                if (parts[0].length === 4 && parts[2].length === 2) {
                    return new Date(`${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}T00:00:00`);
                }
            }
            return null;
        }

        function formatDateToDDMMAAAA(dateObj) {
            if (!dateObj || isNaN(dateObj.getTime())) return "Não definida";
            let day = String(dateObj.getDate()).padStart(2, '0');
            let month = String(dateObj.getMonth() + 1).padStart(2, '0');
            let year = dateObj.getFullYear();
            return `${day}-${month}-${year}`;
        }

        function formatDateToISO(dateObj) {
            if (!dateObj || isNaN(dateObj.getTime())) return null;
            let day = String(dateObj.getDate()).padStart(2, '0');
            let month = String(dateObj.getMonth() + 1).padStart(2, '0');
            let year = dateObj.getFullYear();
            return `${year}-${month}-${day}`;
        }

        function addBusinessDays(dateStr, days) {
            let date = parseToDate(dateStr);
            if (!date) return "Não calculada";

            let daysToAdd = parseInt(days);
            if (isNaN(daysToAdd)) return "Não calculada";

            let added = 0;
            while (added < daysToAdd) {
                date.setDate(date.getDate() + 1);
                if (date.getDay() !== 0 && date.getDay() !== 6) added++;
            }
            return formatDateToDDMMAAAA(date);
        }

        function setFloor(f, el) {
            selectedFloorNum = f;
            document.querySelectorAll('#floors .btn').forEach(b => b.classList.remove('active'));
            el.classList.add('active');

            renderUnitsGrid();

            document.getElementById('unit-card').style.display = 'block';
            document.getElementById('type-card').style.display = 'none';
            document.getElementById('inspection-area').style.display = 'none';
            document.getElementById('history-section').style.display = 'none';
        }

        function renderUnitsGrid() {
            if (!selectedFloorNum) return;
            const u = document.getElementById('units');
            u.innerHTML = '';

            for (let i = 1; i <= 19; i++) {
                let num = (selectedFloorNum * 100) + i;
                const historyKey = `unit_${num}`;
                const existingHistory = dbUnitsCache[historyKey] || [];
                
                let statusClass = 'unit-pending';

                if (existingHistory.length > 0) {
                    const lastInsp = existingHistory[existingHistory.length - 1];
                    if (lastInsp.status === '100_ok' && lastInsp.pendenciesCount === 0) {
                        statusClass = 'unit-ok';
                    } else {
                        statusClass = 'unit-nok';
                    }
                }
                u.innerHTML += `<div class="btn ${statusClass} ${selectedUnitNum === num ? 'active' : ''}" onclick="selectUnit(${num}, this)">${num}</div>`;
            }
        }

        function renderGeneralUnitsOverview() {
            const gridContainer = document.getElementById('general-units-grid-container');
            if (!gridContainer) return;
            gridContainer.innerHTML = '';

            for (let f = 1; f <= 4; f++) {
                for (let i = 1; i <= 19; i++) {
                    let num = (f * 100) + i;
                    const historyKey = `unit_${num}`;
                    const history = dbUnitsCache[historyKey] || [];
                    
                    let statusClass = 'unit-pending';
                    if (history.length > 0) {
                        const lastInsp = history[history.length - 1];
                        if (lastInsp.status === '100_ok' && lastInsp.pendenciesCount === 0) {
                            statusClass = 'unit-ok';
                        } else {
                            statusClass = 'unit-nok';
                        }
                    }

                    gridContainer.innerHTML += `
                        <div class="unit-grid-box ${statusClass}" onclick="openUnitOverview(${num})" title="Apto ${num} - ${history.length} vistoria(s)">
                            ${num}
                        </div>
                    `;
                }
            }
        }

        function openUnitOverview(unitNum) {
            const historyKey = `unit_${unitNum}`;
            const history = dbUnitsCache[historyKey] || [];
            const modal = document.getElementById('unit-modal-overview');
            const titleEl = document.getElementById('modal-overview-title');
            const bodyEl = document.getElementById('modal-overview-body');

            titleEl.innerText = `Histórico de Vistorias - Apto ${unitNum}`;

            if (history.length === 0) {
                bodyEl.innerHTML = `<p style="color:#64748b; text-align:center; padding:20px;">Nenhuma vistoria realizada nesta unidade ainda.</p>`;
            } else {
                bodyEl.innerHTML = history.map((h, idx) => `
                    <div class="history-card" style="margin-bottom:12px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <strong>${h.stage || 'Vistoria'} — ${h.date}</strong>
                            <span style="font-size:0.75rem; font-weight:bold; color:${(h.pendenciesCount === 0 && h.status === '100_ok') ? 'var(--success)' : 'var(--danger)'}">
                                ${(h.pendenciesCount === 0 && h.status === '100_ok') ? 'Aprovada ✓' : h.pendenciesCount + ' Pendência(s)'}
                            </span>
                        </div>
                        <div style="font-size:0.8rem; color:#64748b; margin-top:4px;">
                            Vistoriador: ${h.inspector} | Tipo: ${h.category || 'Padrão'}
                        </div>
                        <div class="history-actions">
                            <button class="btn-hist" style="background:#25D366;" onclick="shareHistoryWhatsAppCustom(${unitNum}, ${idx})">📲 WhatsApp</button>
                            <button class="btn-hist" style="background:var(--primary);" onclick="printHistoryReportCustom(${unitNum}, ${idx})">🖨️ PDF</button>
                        </div>
                    </div>
                `).join('');
            }

            modal.style.display = 'flex';
        }

        function closeUnitOverviewModal(event) {
            if (event.target.id === 'unit-modal-overview') {
                event.target.style.display = 'none';
            }
        }

        function shareHistoryWhatsAppCustom(unitNum, histIdx) {
            const historyKey = `unit_${unitNum}`;
            const h = dbUnitsCache[historyKey]?.[histIdx];
            if (!h) return;

            let text = `*RELATÓRIO DE VISTORIA - APTO ${unitNum}*\n`;
            text += `*Etapa:* ${h.stage || 'Vistoria'}\n`;
            text += `*Data:* ${h.date}\n`;
            text += `*Vistoriador:* ${h.inspector}\n`;
            text += `*Resultado:* ${(h.pendenciesCount === 0 && h.status === '100_ok') ? 'APROVADO ✓' : h.pendenciesCount + ' pendência(s)'}\n\n`;

            if (h.details && h.details.length > 0) {
                text += `*PENDÊNCIAS:*\n`;
                h.details.forEach((d, i) => {
                    text += `${i+1}. [${d.room}] ${d.item} - ${d.nonConformity} (Resp: ${d.responsible || 'A definir'})\n`;
                });
            }

            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
        }

        function printHistoryReportCustom(unitNum, histIdx) {
            const historyKey = `unit_${unitNum}`;
            const h = dbUnitsCache[historyKey]?.[histIdx];
            if (!h) return;

            let printWin = window.open('', '_blank');
            let content = `
                <html>
                <head>
                    <title>Relatório Apto ${unitNum} - ${h.stage}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; color: #1e293b; }
                        h2 { color: #004a8f; border-bottom: 2px solid #004a8f; padding-bottom: 5px; }
                        .info { margin-bottom: 20px; font-size: 0.9rem; line-height: 1.5; }
                        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                        th, td { border: 1px solid #cbd5e1; padding: 8px; font-size: 0.85rem; text-align: left; }
                        th { background: #f1f5f9; }
                    </style>
                </head>
                <body>
                    <h2>Relatório Técnico de Vistoria - Apto ${unitNum}</h2>
                    <div class="info">
                        <strong>Etapa:</strong> ${h.stage || 'Vistoria'}<br>
                        <strong>Data:</strong> ${h.date}<br>
                        <strong>Vistoriador:</strong> ${h.inspector}<br>
                        <strong>Categoria:</strong> ${h.category || 'Padrão Construtora'}<br>
                        <strong>Status:</strong> ${(h.pendenciesCount === 0 && h.status === '100_ok') ? 'Conforme / Aprovado' : h.pendenciesCount + ' Pendência(s)'}
                    </div>
            `;

            if (h.details && h.details.length > 0) {
                content += `
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Ambiente</th>
                                <th>Item</th>
                                <th>Não Conformidade</th>
                                <th>Responsável</th>
                                <th>Prazo Final</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                h.details.forEach((d, i) => {
                    content += `
                        <tr>
                            <td>${i+1}</td>
                            <td>${d.room}</td>
                            <td>${d.item}</td>
                            <td>${d.nonConformity}</td>
                            <td>${d.responsible || 'A definir'}</td>
                            <td>${d.deadlineDate || 'Não calculada'}</td>
                        </tr>
                    `;
                });
                content += `</tbody></table>`;
            }

            content += `<script>window.onload = function() { window.print(); }<\/script></body></html>`;
            printWin.document.write(content);
            printWin.document.close();
        }

        function selectUnit(u, el) {
            selectedUnitNum = u;
            document.querySelectorAll('#units .btn').forEach(b => b.classList.remove('active'));
            if (el) el.classList.add('active');

            document.getElementById('type-card').style.display = 'block';
            
            // Definir padrão inicial automático
            selectedCategory = 'Padrão Construtora';
            selectedStage = '1ª Vistoria';

            document.querySelectorAll('#category-selection-container .btn-opt').forEach(b => b.classList.remove('active'));
            document.getElementById('btn-cat-padrao').classList.add('active');

            document.querySelectorAll('#stage-selection-container .btn-stage').forEach(b => b.classList.remove('active'));
            const btnStage1 = document.getElementById('btn-stage-1');
            const btnStageRev = document.getElementById('btn-stage-rev');
            btnStage1.style.display = 'block';
            btnStageRev.style.display = 'none';
            btnStage1.classList.add('active');

            updateCategoryAndStageState();
            renderUnitHistory();
            checkReadyToInspect();
        }

        function updateCategoryAndStageState() {
            const historyKey = `unit_${selectedUnitNum}`;
            const history = dbUnitsCache[historyKey] || [];

            const btnPadrao = document.getElementById('btn-cat-padrao');
            const btnReforma = document.getElementById('btn-cat-reforma');
            const btnStage1 = document.getElementById('btn-stage-1');
            const btnStageRev = document.getElementById('btn-stage-rev');

            btnPadrao.classList.remove('active');
            btnReforma.classList.remove('active');

            if (history.length > 0) {
                const lastHistory = history[history.length - 1];
                let categoryToSet = lastHistory.category || 'Padrão Construtora';
                
                selectedCategory = categoryToSet;
                
                if (categoryToSet === 'Padrão Construtora') {
                    btnPadrao.classList.add('active');
                } else {
                    btnReforma.classList.add('active');
                }

                const historyOfCurrentCategory = history.filter(h => h.category === selectedCategory);
                
                if (historyOfCurrentCategory.length > 0) {
                    btnStage1.style.display = 'none';
                    btnStageRev.style.display = 'block';
                    setStage('Revistoria', btnStageRev, false);
                } else {
                    btnStage1.style.display = 'block';
                    btnStageRev.style.display = 'none';
                    setStage('1ª Vistoria', btnStage1, false);
                }
            } else {
                btnPadrao.classList.add('active');
                selectedCategory = 'Padrão Construtora';
                btnStage1.style.display = 'block';
                btnStageRev.style.display = 'none';
                setStage('1ª Vistoria', btnStage1, false);
            }
        }

        function setCategory(cat, el) {
            const historyKey = `unit_${selectedUnitNum}`;
            const history = dbUnitsCache[historyKey] || [];

            if (selectedCategory && selectedCategory !== cat) {
                const confirmChange = confirm(`A unidade já está configurada como "${selectedCategory}". Deseja alterar para "${cat}"?\n\nNota: A alteração iniciará o fluxo de 1ª Vistoria para este novo tipo.`);
                if (!confirmChange) return;
            }

            selectedCategory = cat;
            document.querySelectorAll('#category-selection-container .btn-opt').forEach(b => b.classList.remove('active'));
            el.classList.add('active');

            const btnStage1 = document.getElementById('btn-stage-1');
            const btnStageRev = document.getElementById('btn-stage-rev');

            const historyOfSelectedCategory = history.filter(h => h.category === selectedCategory);

            if (historyOfSelectedCategory.length > 0) {
                btnStage1.style.display = 'none';
                btnStageRev.style.display = 'block';
                setStage('Revistoria', btnStageRev, false);
            } else {
                btnStage1.style.display = 'block';
                btnStageRev.style.display = 'none';
                setStage('1ª Vistoria', btnStage1, false);
            }

            checkReadyToInspect();
        }

        function setStage(stageType, el, triggerReadyCheck = true) {
            document.querySelectorAll('#stage-selection-container .btn-stage').forEach(b => b.classList.remove('active'));
            if (el) el.classList.add('active');

            const historyKey = `unit_${selectedUnitNum}`;
            const history = dbUnitsCache[historyKey] || [];

            if (stageType === '1ª Vistoria') {
                selectedStage = '1ª Vistoria';
                document.getElementById('stage-info-text').innerText = '📋 Etapa Definida: 1ª Vistoria Inicial';
            } else {
                let revistoriaCount = history.filter(h => h.category === selectedCategory && h.stage && h.stage.includes('Revistoria')).length + 1;
                selectedStage = `${revistoriaCount}ª Revistoria`;
                document.getElementById('stage-info-text').innerText = `🔄 Etapa Definida: ${selectedStage}`;
            }

            if (triggerReadyCheck) checkReadyToInspect();
        }

        function checkReadyToInspect() {
            if (selectedCategory && selectedStage) {
                document.getElementById('unit-title').innerText = `Apto ${selectedUnitNum} — ${selectedCategory} (${selectedStage})`;
                document.getElementById('inspection-area').style.display = 'block';

                loadPreviousActivePendencies();
                buildInspectionForm();
            }
        }

        function renderUnitHistory() {
            const historyKey = `unit_${selectedUnitNum}`;
            const history = dbUnitsCache[historyKey] || [];
            const historyEl = document.getElementById('unit-history-list');
            const historyCard = document.getElementById('history-section');

            if (!historyEl || !historyCard) return;

            if (history.length === 0) {
                historyCard.style.display = 'none';
                return;
            }

            historyCard.style.display = 'block';
            historyEl.innerHTML = history.map((h, idx) => `
                <div class="history-card">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong>${h.stage || 'Vistoria'} — ${h.date}</strong>
                        <span style="font-size:0.75rem; font-weight:bold; color:${(h.pendenciesCount === 0 && h.status === '100_ok') ? 'var(--success)' : 'var(--danger)'}">
                            ${(h.pendenciesCount === 0 && h.status === '100_ok') ? 'Aprovada ✓' : h.pendenciesCount + ' Pendência(s)'}
                        </span>
                    </div>
                    <div style="font-size:0.8rem; color:#64748b; margin-top:4px;">
                        Vistoriador: ${h.inspector} | Tipo: ${h.category || 'Padrão'}
                    </div>
                    <div class="history-actions">
                        <button class="btn-hist" style="background:#25D366;" onclick="shareHistoryWhatsApp(${idx})">📲 Enviar WhatsApp</button>
                        <button class="btn-hist" style="background:var(--primary);" onclick="printHistoryReport(${idx})">🖨️ Imprimir / PDF</button>
                    </div>
                </div>
            `).join('');
        }

        function shareHistoryWhatsApp(histIdx) {
            shareHistoryWhatsAppCustom(selectedUnitNum, histIdx);
        }

        function printHistoryReport(histIdx) {
            printHistoryReportCustom(selectedUnitNum, histIdx);
        }

        function loadPreviousActivePendencies() {
            pendingNCs = {};
            itemStatuses = {};
            const historyKey = `unit_${selectedUnitNum}`;
            const history = dbUnitsCache[historyKey] || [];
            if (history.length === 0) return;

            const lastInsp = history[history.length - 1];
            if (!lastInsp.details || lastInsp.details.length === 0) return;

            lastInsp.details.forEach(d => {
                if (d.status !== 'Concluído') {
                    let roomKey = Object.keys(roomNames).find(k => roomNames[k] === d.room) || 'room-dorm';
                    let itemObj = checklist.find(i => i.cleanName === d.item || i.name === d.item) || checklist[0];
                    let key = `${roomKey}_${itemObj.id}`;

                    if (!pendingNCs[key]) pendingNCs[key] = [];

                    let opts = [];
                    let obsText = '';

                    if (d.nonConformity) {
                        let parts = d.nonConformity.split(' (');
                        opts = parts[0] ? parts[0].split(', ').map(s => s.trim()) : [];
                        if (parts[1]) obsText = parts[1].replace(')', '').trim();
                    }

                    let defaultStartDate = d.scheduledFor;
                    if (!defaultStartDate) {
                        let now = new Date();
                        defaultStartDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
                    }

                    pendingNCs[key].push({
                        id: d.id || Date.now(),
                        selectedOpts: opts,
                        obs: obsText,
                        resp: d.responsible || '',
                        respOther: '',
                        startDate: defaultStartDate,
                        businessDays: d.businessDays || '3',
                        status: d.status || 'Aguardando',
                        severity: d.severity || 'Baixa',
                        photos: d.photos || []
                    });
                    
                    itemStatuses[key] = 'NOK';
                }
            });
        }

        function buildInspectionForm() {
            ['room-dorm', 'room-bath', 'room-balcony'].forEach(roomId => {
                const container = document.getElementById(roomId);
                if (!container) return;
                container.innerHTML = '';

                checklist.forEach(item => {
                    if (item.id === 'ac' && roomId !== 'room-dorm') return;
                    const key = `${roomId}_${item.id}`;
                    if (!pendingNCs[key]) pendingNCs[key] = [];

                    let status = itemStatuses[key] || (pendingNCs[key].length > 0 ? 'NOK' : '');
                    let btnOkClass = status === 'OK' ? 'btn-ok-active' : 'btn-neutral';
                    let btnNokClass = status === 'NOK' ? 'btn-nok-active' : 'btn-neutral';
                    let hasPending = pendingNCs[key].length > 0;

                    container.innerHTML += `
                        <div class="item-card" id="card_${key}">
                            <div class="item-header">
                                <span class="item-title">${item.name}</span>
                                <div>
                                    <button class="btn-status ${btnOkClass}" id="btn_ok_${key}" onclick="setItemStatus('${key}', 'OK', '${item.id}')">Conforme ✓</button>
                                    <button class="btn-status ${btnNokClass}" id="btn_nok_${key}" onclick="setItemStatus('${key}', 'NOK', '${item.id}')">Não Conforme ✕</button>
                                </div>
                            </div>
                            <div id="nc_container_${key}"></div>
                            <button class="btn-add-nc" id="btn_add_${key}" style="display:${hasPending ? 'block' : 'none'};" onclick="addNC('${key}', '${item.id}')">+ Adicionar Pendência Neste Item</button>
                        </div>
                    `;
                });
            });

            Object.keys(pendingNCs).forEach(key => {
                if (pendingNCs[key].length > 0) {
                    const lastUnderscoreIndex = key.lastIndexOf('_');
                    const itemId = key.substring(lastUnderscoreIndex + 1);
                    const itemObj = checklist.find(i => i.id === itemId);
                    const container = document.getElementById(`nc_container_${key}`);
                    if (container) {
                        container.innerHTML = renderNCBoxes(key, itemObj);
                        restaurarValoresInputs(key);
                    }
                }
            });
        }

        function renderNCBoxes(key, itemObj) {
            if (!pendingNCs[key] || pendingNCs[key].length === 0) return '';

            return pendingNCs[key].map((nc, index) => {
                const chkBoxes = itemObj.options.map(opt => `
                    <label class="chk-label">
                        <input type="checkbox" class="chk_${key}_${index}" value="${opt}" onchange="salvarEstadoAtualInput('${key}')"> ${opt}
                    </label>
                `).join('');

                return `
                    <div class="nc-box">
                        <div class="nc-header">
                            <span>PENDÊNCIA #${index + 1}</span>
                            <div>
                                <button type="button" style="color:var(--success); background:none; border:none; font-weight:bold; cursor:pointer; margin-right:8px;" onclick="sanarNC('${key}', ${index}, '${itemObj.id}')">✓ Sanar</button>
                                <button type="button" style="color:var(--danger); background:none; border:none; font-weight:bold; cursor:pointer;" onclick="removeNC('${key}', ${index}, '${itemObj.id}')">Excluir ✕</button>
                            </div>
                        </div>
                        <div class="checklist-group">${chkBoxes}</div>
                        
                        <div class="grid-two">
                            <div>
                                <label>Serviço / Responsável:</label>
                                <select id="resp_${key}_${index}" onchange="toggleOutroResp('${key}', ${index})">
                                    <option value="" selected>Escolher depois / A definir...</option>
                                    <option value="Piso e Revestimento">Piso e Revestimento</option>
                                    <option value="Gesso / Sancas">Gesso / Sancas</option>
                                    <option value="Eletricista">Eletricista</option>
                                    <option value="Instalações Hidráulicas">Instalações Hidráulicas</option>
                                    <option value="Climatização / Ar-Condicionado">Climatização / Ar-Condicionado</option>
                                    <option value="Marmoraria / Graniteiro">Marmoraria / Graniteiro</option>
                                    <option value="Esquadrias de Alumínio / Vidros">Esquadrias de Alumínio / Vidros</option>
                                    <option value="Marcenaria / Portas de Madeira">Marcenaria / Portas de Madeira</option>
                                    <option value="Pintura / Emassamento">Pintura / Emassamento</option>
                                    <option value="Outro">Outro</option>
                                </select>
                                <input type="text" id="resp_other_${key}_${index}" placeholder="Especifique..." style="display:none; margin-top:4px;" oninput="salvarEstadoAtualInput('${key}')">
                            </div>
                            
                            <div class="grid-two">
                                <div>
                                    <label>Data Início:</label>
                                    <input type="date" id="date_${key}_${index}" onchange="salvarEstadoAtualInput('${key}')">
                                </div>
                                <div>
                                    <label>Dias Úteis:</label>
                                    <input type="number" min="1" id="days_${key}_${index}" placeholder="Ex: 3, 5" oninput="salvarEstadoAtualInput('${key}')">
                                </div>
                            </div>
                        </div>

                        <div class="grid-two" style="margin-top: 6px;">
                            <div>
                                <label>Status:</label>
                                <select id="status_${key}_${index}" onchange="salvarEstadoAtualInput('${key}')">
                                    <option value="Aguardando">Aguardando Início</option>
                                    <option value="Em Andamento">Em Andamento</option>
                                    <option value="Concluído">Concluído</option>
                                </select>
                            </div>
                            <div>
                                <label>Gravidade:</label>
                                <select id="sev_${key}_${index}" onchange="salvarEstadoAtualInput('${key}')">
                                    <option value="Baixa">Baixa</option>
                                    <option value="Média">Média</option>
                                    <option value="Alta">Alta</option>
                                </select>
                            </div>
                        </div>

                        <div style="margin-top: 6px;">
                            <label>Observação Técnica:</label>
                            <input type="text" id="obs_${key}_${index}" placeholder="Detalhes..." oninput="salvarEstadoAtualInput('${key}')">
                        </div>

                        <div class="photo-area">
                            <label>📷 Fotos Anexadas:</label>
                            <input type="file" accept="image/*" multiple capture="environment" onchange="handleMultiplePhotos(this, '${key}', ${index})">
                            <div class="photo-gallery" id="gallery_${key}_${index}"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function toggleOutroResp(key, index) {
            const select = document.getElementById(`resp_${key}_${index}`);
            const otherInput = document.getElementById(`resp_other_${key}_${index}`);
            if (select && otherInput) {
                otherInput.style.display = select.value === 'Outro' ? 'block' : 'none';
            }
            salvarEstadoAtualInput(key);
        }

        function sanarNC(key, index, itemId) {
            if (confirm("Confirma que esta pendência foi SANADA?")) {
                pendingNCs[key].splice(index, 1);
                const itemObj = checklist.find(i => i.id === itemId);
                const container = document.getElementById(`nc_container_${key}`);
                if (container) {
                    container.innerHTML = renderNCBoxes(key, itemObj);
                    restaurarValoresInputs(key);
                }

                if (pendingNCs[key].length === 0) setItemStatus(key, 'OK', itemId);
            }
        }

        function salvarEstadoAtualInput(key) {
            if (!pendingNCs[key]) return;
            pendingNCs[key].forEach((nc, index) => {
                nc.obs = document.getElementById(`obs_${key}_${index}`)?.value || '';
                nc.resp = document.getElementById(`resp_${key}_${index}`)?.value || '';
                nc.respOther = document.getElementById(`resp_other_${key}_${index}`)?.value || '';
                nc.startDate = document.getElementById(`date_${key}_${index}`)?.value || '';
                nc.businessDays = document.getElementById(`days_${key}_${index}`)?.value || '3';
                nc.status = document.getElementById(`status_${key}_${index}`)?.value || 'Aguardando';
                nc.severity = document.getElementById(`sev_${key}_${index}`)?.value || 'Baixa';

                nc.selectedOpts = [];
                document.querySelectorAll(`.chk_${key}_${index}:checked`).forEach(chk => {
                    nc.selectedOpts.push(chk.value);
                });
            });
        }

        function setItemStatus(key, status, itemId) {
            const btnOk = document.getElementById(`btn_ok_${key}`);
            const btnNok = document.getElementById(`btn_nok_${key}`);
            const btnAdd = document.getElementById(`btn_add_${key}`);

            itemStatuses[key] = status;

            if (status === 'OK') {
                if (btnOk) btnOk.className = "btn-status btn-ok-active";
                if (btnNok) btnNok.className = "btn-status btn-neutral";
                pendingNCs[key] = [];
                const ncContainer = document.getElementById(`nc_container_${key}`);
                if (ncContainer) ncContainer.innerHTML = '';
                if (btnAdd) btnAdd.style.display = 'none';
            } else {
                if (btnOk) btnOk.className = "btn-status btn-neutral";
                if (btnNok) btnNok.className = "btn-status btn-nok-active";
                if (btnAdd) btnAdd.style.display = 'block';

                if (!pendingNCs[key] || pendingNCs[key].length === 0) {
                    addNC(key, itemId);
                }
            }
        }

        function addNC(key, itemId) {
            salvarEstadoAtualInput(key);
            if (!pendingNCs[key]) pendingNCs[key] = [];

            itemStatuses[key] = 'NOK';

            let now = new Date();
            let defaultDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

            pendingNCs[key].push({
                id: Date.now(),
                selectedOpts: [],
                obs: '',
                resp: '',
                respOther: '',
                startDate: defaultDate,
                businessDays: '3',
                status: 'Aguardando',
                severity: 'Baixa',
                photos: []
            });

            const itemObj = checklist.find(i => i.id === itemId);
            const container = document.getElementById(`nc_container_${key}`);
            if (container) {
                container.innerHTML = renderNCBoxes(key, itemObj);
                restaurarValoresInputs(key);
            }
            
            const btnAdd = document.getElementById(`btn_add_${key}`);
            if (btnAdd) btnAdd.style.display = 'block';
        }

        function removeNC(key, index, itemId) {
            salvarEstadoAtualInput(key);
            pendingNCs[key].splice(index, 1);
            const itemObj = checklist.find(i => i.id === itemId);
            
            const container = document.getElementById(`nc_container_${key}`);
            if (container) {
                container.innerHTML = renderNCBoxes(key, itemObj);
                restaurarValoresInputs(key);
            }

            if (pendingNCs[key].length === 0) setItemStatus(key, 'OK', itemId);
        }

        function handleMultiplePhotos(input, key, index) {
            if (!input.files || input.files.length === 0) return;
            salvarEstadoAtualInput(key);

            if (!pendingNCs[key][index].photos) pendingNCs[key][index].photos = [];

            const files = Array.from(input.files);
            let loaded = 0;

            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    pendingNCs[key][index].photos.push(e.target.result);
                    loaded++;
                    if (loaded === files.length) renderGallery(key, index);
                };
                reader.readAsDataURL(file);
            });
        }

        function renderGallery(key, index) {
            const galleryEl = document.getElementById(`gallery_${key}_${index}`);
            if (!galleryEl) return;
            const photos = (pendingNCs[key] && pendingNCs[key][index]) ? pendingNCs[key][index].photos || [] : [];
            
            galleryEl.innerHTML = photos.map((p, pIdx) => `
                <div class="photo-container">
                    <img src="${p}" class="photo-thumb" onclick="openModal('${p}')">
                    <button type="button" class="btn-remove-photo" onclick="removePhoto('${key}', ${index}, ${pIdx})">✕</button>
                </div>
            `).join('');
        }

        function openModal(src) {
            document.getElementById('modal-img-src').src = src;
            document.getElementById('img-modal').style.display = 'flex';
        }

        function removePhoto(key, ncIndex, photoIndex) {
            salvarEstadoAtualInput(key);
            if (pendingNCs[key]?.[ncIndex]?.photos) {
                pendingNCs[key][ncIndex].photos.splice(photoIndex, 1);
                renderGallery(key, ncIndex);
            }
        }

        function restaurarValoresInputs(key) {
            if (!pendingNCs[key]) return;
            pendingNCs[key].forEach((nc, index) => {
                const obsEl = document.getElementById(`obs_${key}_${index}`);
                const respEl = document.getElementById(`resp_${key}_${index}`);
                const respOtherEl = document.getElementById(`resp_other_${key}_${index}`);
                const dateEl = document.getElementById(`date_${key}_${index}`);
                const daysEl = document.getElementById(`days_${key}_${index}`);
                const statusEl = document.getElementById(`status_${key}_${index}`);
                const sevEl = document.getElementById(`sev_${key}_${index}`);

                if (obsEl && nc.obs) obsEl.value = nc.obs;
                if (respEl) {
                    if (nc.resp) {
                        let options = Array.from(respEl.options).map(o => o.value);
                        if (options.includes(nc.resp)) {
                            respEl.value = nc.resp;
                        } else {
                            respEl.value = 'Outro';
                            if (respOtherEl) {
                                respOtherEl.style.display = 'block';
                                respOtherEl.value = nc.resp;
                            }
                        }
                    } else {
                        respEl.value = '';
                    }
                }
                if (dateEl && nc.startDate) {
                    let dClean = nc.startDate;
                    if (dClean.includes('/') || (dClean.includes('-') && dClean.indexOf('-') === 2)) {
                        let parsed = parseToDate(dClean);
                        dClean = parsed ? formatDateToISO(parsed) : dClean;
                    }
                    dateEl.value = dClean;
                }
                if (daysEl) daysEl.value = nc.businessDays || '3';
                if (statusEl && nc.status) statusEl.value = nc.status;
                if (sevEl && nc.severity) sevEl.value = nc.severity;

                if (nc.selectedOpts) {
                    nc.selectedOpts.forEach(val => {
                        const chk = document.querySelector(`.chk_${key}_${index}[value="${val}"]`);
                        if (chk) chk.checked = true;
                    });
                }

                renderGallery(key, index);
            });
        }

        function renderInteractiveCalendar() {
            const calendarEl = document.getElementById('calendar');
            const listEl = document.getElementById('scheduled-activities-list');
            const filterResp = document.getElementById('calendar-resp-filter')?.value || 'TODOS';

            if (!calendarEl) return;

            let events = [];
            let groupedActivities = {};

            let respOpcoesHTML = `
                <option value="">A definir...</option>
                <option value="Piso e Revestimento">Piso e Revestimento</option>
                <option value="Gesso / Sancas">Gesso / Sancas</option>
                <option value="Eletricista">Eletricista</option>
                <option value="Instalações Hidráulicas">Instalações Hidráulicas</option>
                <option value="Climatização / Ar-Condicionado">Climatização / Ar-Condicionado</option>
                <option value="Marmoraria / Graniteiro">Marmoraria / Graniteiro</option>
                <option value="Esquadrias de Alumínio / Vidros">Esquadrias de Alumínio / Vidros</option>
                <option value="Marcenaria / Portas de Madeira">Marcenaria / Portas de Madeira</option>
                <option value="Pintura / Emassamento">Pintura / Emassamento</option>
            `;

            Object.keys(dbUnitsCache).forEach(key => {
                const unitNum = key.replace('unit_', '');
                const history = dbUnitsCache[key] || [];

                if (history.length > 0) {
                    const lastHistoryIndex = history.length - 1;
                    const last = history[lastHistoryIndex];

                    (last.details || []).forEach((d, detailIdx) => {
                        if (d.status !== 'Concluído') {
                            let respText = d.responsible || 'A definir';
                            if (filterResp === 'TODOS' || respText === filterResp) {
                                let dateObj = parseToDate(d.scheduledFor);
                                let startDateISO = dateObj ? formatDateToISO(dateObj) : '';
                                
                                let bDaysStr = String(d.businessDays || '3').trim();
                                let deadline = d.deadlineDate || (startDateISO && bDaysStr ? addBusinessDays(d.scheduledFor, bDaysStr) : "Não calculada");

                                if (startDateISO) {
                                    events.push({
                                        id: `${key}_${lastHistoryIndex}_${detailIdx}`,
                                        title: `Apto ${unitNum}`,
                                        start: startDateISO,
                                        backgroundColor: respColors[respText] || '#004a8f',
                                        borderColor: respColors[respText] || '#004a8f',
                                        extendedProps: {
                                            unitKey: key,
                                            historyIdx: lastHistoryIndex,
                                            detailIdx: detailIdx
                                        }
                                    });
                                }

                                if (!groupedActivities[respText]) {
                                    groupedActivities[respText] = [];
                                }

                                let selectRespHTML = respOpcoesHTML.replace(`value="${d.responsible || ''}"`, `value="${d.responsible || ''}" selected`);

                                groupedActivities[respText].push(`
                                    <div class="unit-subcard" id="card_sub_${key}_${lastHistoryIndex}_${detailIdx}">
                                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                            <strong>Apto ${unitNum}</strong>
                                            <span style="font-size:0.75rem; background:#fee2e2; color:#dc2626; padding:2px 8px; border-radius:12px; font-weight:bold;">${d.status || 'Aguardando'}</span>
                                        </div>
                                        <div style="font-size:0.85rem; color:#334155; margin-bottom:8px;">
                                            <strong>Item:</strong> ${d.item} (${d.nonConformity})
                                        </div>
                                        
                                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:8px;">
                                            <div>
                                                <label>Serviço / Responsável:</label>
                                                <select id="cal_resp_${key}_${lastHistoryIndex}_${detailIdx}" onblur="atualizarDadosCalendarInline('${key}', ${lastHistoryIndex}, ${detailIdx})" onchange="atualizarDadosCalendarInline('${key}', ${lastHistoryIndex}, ${detailIdx})">
                                                    ${selectRespHTML}
                                                </select>
                                            </div>
                                            <div>
                                                <label>Início:</label>
                                                <input type="date" id="cal_date_${key}_${lastHistoryIndex}_${detailIdx}" value="${startDateISO}" onblur="atualizarDadosCalendarInline('${key}', ${lastHistoryIndex}, ${detailIdx})" onchange="atualizarDadosCalendarInline('${key}', ${lastHistoryIndex}, ${detailIdx})">
                                            </div>
                                        </div>

                                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:10px; align-items:center;">
                                            <div>
                                                <label>Dias Úteis:</label>
                                                <input type="number" min="1" id="cal_days_${key}_${lastHistoryIndex}_${detailIdx}" value="${d.businessDays || '3'}" onblur="atualizarDadosCalendarInline('${key}', ${lastHistoryIndex}, ${detailIdx})" onchange="atualizarDadosCalendarInline('${key}', ${lastHistoryIndex}, ${detailIdx})">
                                            </div>
                                            <div style="font-size:0.78rem; color:#64748b; padding-top:14px;">
                                                Prazo Final: <strong id="cal_deadline_${key}_${lastHistoryIndex}_${detailIdx}">${deadline}</strong>
                                            </div>
                                        </div>

                                        <div style="display:flex; gap:6px;">
                                            <button type="button" onclick="focarDataNoCalendario('${startDateISO}')" style="flex:1; padding:8px; font-size:0.75rem; background:var(--primary); color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">📅 Ver no Calendário</button>
                                            <button type="button" onclick="concluirPendenciaCalendar('${key}', ${lastHistoryIndex}, ${detailIdx})" style="flex:2; padding:8px; font-size:0.75rem; background:var(--success); color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">✓ Concluir Pendência</button>
                                        </div>
                                    </div>
                                `);
                            }
                        }
                    });
                }
            });

            let groupedHTML = '';
            const services = Object.keys(groupedActivities);

            if (services.length > 0) {
                services.forEach(service => {
                    const serviceColor = respColors[service] || '#004a8f';
                    groupedHTML += `
                        <div class="service-group-card">
                            <div class="service-group-header" style="background-color: ${serviceColor};">
                                <span>🛠️ ${service}</span>
                                <span style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">${groupedActivities[service].length} unidade(s)</span>
                            </div>
                            <div class="service-group-body">
                                ${groupedActivities[service].join('')}
                            </div>
                        </div>
                    `;
                });
            } else {
                groupedHTML = '<p style="color:#666; text-align:center; padding:20px;">Nenhuma atividade pendente agendada.</p>';
            }

            if (!fullCalendarInstance) {
                fullCalendarInstance = new FullCalendar.Calendar(calendarEl, {
                    initialView: 'dayGridMonth',
                    locale: 'pt-br',
                    events: events,
                    headerToolbar: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek'
                    },
                    eventClick: function(info) {
                        const props = info.event.extendedProps;
                        const cardId = `card_sub_${props.unitKey}_${props.historyIdx}_${props.detailIdx}`;
                        const cardEl = document.getElementById(cardId);
                        if (cardEl) {
                            cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            cardEl.classList.add('highlighted');
                            setTimeout(() => {
                                cardEl.classList.remove('highlighted');
                            }, 2500);
                        }
                    }
                });
                fullCalendarInstance.render();
            } else {
                fullCalendarInstance.removeAllEvents();
                fullCalendarInstance.addEventSource(events);
                fullCalendarInstance.render();
            }

            if (listEl) listEl.innerHTML = groupedHTML;
        }

        function focarDataNoCalendario(dateISO) {
            if (fullCalendarInstance && dateISO) {
                fullCalendarInstance.gotoDate(dateISO);
                const calElement = document.getElementById('calendar');
                if (calElement) calElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        function atualizarDadosCalendarInline(unitKey, historyIdx, detailIdx) {
            const item = dbUnitsCache[unitKey]?.[historyIdx]?.details?.[detailIdx];
            if (!item) return;

            const respEl = document.getElementById(`cal_resp_${unitKey}_${historyIdx}_${detailIdx}`);
            const dateEl = document.getElementById(`cal_date_${unitKey}_${historyIdx}_${detailIdx}`);
            const daysEl = document.getElementById(`cal_days_${unitKey}_${historyIdx}_${detailIdx}`);
            const deadlineEl = document.getElementById(`cal_deadline_${unitKey}_${historyIdx}_${detailIdx}`);

            if (respEl) item.responsible = respEl.value;
            if (dateEl && dateEl.value) {
                let parsedNew = parseToDate(dateEl.value);
                item.scheduledFor = formatDateToDDMMAAAA(parsedNew);
            } else {
                item.scheduledFor = "";
            }
            if (daysEl) item.businessDays = daysEl.value || '3';

            let calculatedDeadline = addBusinessDays(item.scheduledFor, item.businessDays);
            item.deadlineDate = calculatedDeadline;
            if (deadlineEl) deadlineEl.innerText = calculatedDeadline;

            salvarAlteracaoGlobalSilencioso(unitKey);
        }

        function concluirPendenciaCalendar(unitKey, historyIdx, detailIdx) {
            if (confirm("Deseja marcar esta pendência como SANADA / CONCLUÍDA?")) {
                const item = dbUnitsCache[unitKey][historyIdx].details[detailIdx];
                item.status = "Concluído";
                item.resolvedAt = formatDateToDDMMAAAA(new Date());

                salvarAlteracaoGlobal(unitKey);
            }
        }

        function salvarAlteracaoGlobalSilencioso(unitKey) {
            localStorage.setItem('vistorias_db', JSON.stringify(dbUnitsCache));

            if (db && db.collection) {
                db.collection('vistorias').doc(unitKey).set({
                    unit: unitKey.replace('unit_', ''),
                    history: dbUnitsCache[unitKey]
                }, { merge: true }).then(() => {
                    updateDashboardData();
                    renderGeneralUnitsOverview();
                });
            } else {
                updateDashboardData();
                renderGeneralUnitsOverview();
            }
        }

        function salvarAlteracaoGlobal(unitKey) {
            localStorage.setItem('vistorias_db', JSON.stringify(dbUnitsCache));

            if (db && db.collection) {
                db.collection('vistorias').doc(unitKey).set({
                    unit: unitKey.replace('unit_', ''),
                    history: dbUnitsCache[unitKey]
                }, { merge: true }).then(() => {
                    alert("Alteração salva com sucesso!");
                    renderInteractiveCalendar();
                    updateDashboardData();
                    renderGeneralUnitsOverview();
                    if (selectedFloorNum) renderUnitsGrid();
                });
            } else {
                alert("Alteração salva localmente!");
                renderInteractiveCalendar();
                updateDashboardData();
                renderGeneralUnitsOverview();
                if (selectedFloorNum) renderUnitsGrid();
            }
        }

        function generateTechnicalPDF() {
            let totalNCs = 0;
            let ncList = [];
            let totalChecklistItems = 0;
            let totalEvaluatedItems = 0;
            const nowFormatted = formatDateToDDMMAAAA(new Date());

            ['room-dorm', 'room-bath', 'room-balcony'].forEach(roomId => {
                checklist.forEach(item => {
                    if (item.id === 'ac' && roomId !== 'room-dorm') return;
                    totalChecklistItems++;
                    const key = `${roomId}_${item.id}`;
                    if (itemStatuses[key] === 'OK' || itemStatuses[key] === 'NOK') {
                        totalEvaluatedItems++;
                    }
                });
            });

            Object.keys(pendingNCs).forEach(key => {
                salvarEstadoAtualInput(key);
                const lastUnderscoreIndex = key.lastIndexOf('_');
                const roomKey = key.substring(0, lastUnderscoreIndex);
                const itemId = key.substring(lastUnderscoreIndex + 1);
                const itemObj = checklist.find(i => i.id === itemId);

                pendingNCs[key].forEach(nc => {
                    totalNCs++;
                    let startDateFormatted = "";
                    if (nc.startDate) {
                        let parsedD = parseToDate(nc.startDate);
                        startDateFormatted = parsedD ? formatDateToDDMMAAAA(parsedD) : nc.startDate;
                    }
                    
                    let days = parseInt(nc.businessDays || '3');
                    let deadlineDate = startDateFormatted && !isNaN(days) ? addBusinessDays(startDateFormatted, days) : "Não calculada";
                    let optsText = nc.selectedOpts && nc.selectedOpts.length > 0 ? nc.selectedOpts.join(', ') : '';
                    let obsText = nc.obs ? ` (${nc.obs})` : '';

                    ncList.push({
                        id: nc.id || Date.now(),
                        room: roomNames[roomKey] || 'Geral',
                        item: itemObj ? itemObj.cleanName : 'Item',
                        nonConformity: (optsText + obsText).trim() || 'Pendência mantida',
                        responsible: nc.resp === 'Outro' ? nc.respOther : nc.resp,
                        severity: nc.severity || 'Baixa',
                        status: nc.status || 'Aguardando',
                        inspectedAt: nowFormatted,
                        scheduledFor: startDateFormatted,
                        businessDays: String(nc.businessDays || '3'),
                        deadlineDate: deadlineDate,
                        photos: nc.photos || []
                    });
                });
            });

            const is100Ok = (totalNCs === 0) && (totalEvaluatedItems === totalChecklistItems);

            const record = {
                date: nowFormatted,
                inspector: inspectorName,
                category: selectedCategory,
                stage: selectedStage,
                pendenciesCount: totalNCs,
                status: is100Ok ? '100_ok' : 'com_pendencia',
                details: ncList
            };

            const historyKey = `unit_${selectedUnitNum}`;
            if (!dbUnitsCache[historyKey]) dbUnitsCache[historyKey] = [];
            dbUnitsCache[historyKey].push(record);

            localStorage.setItem('vistorias_db', JSON.stringify(dbUnitsCache));

            if (db && db.collection) {
                db.collection('vistorias').doc(historyKey).set({
                    unit: selectedUnitNum,
                    history: dbUnitsCache[historyKey]
                }, { merge: true });
            }

            alert(`Vistoria da Unidade ${selectedUnitNum} salva com sucesso!`);
            
            if (selectedFloorNum) renderUnitsGrid();
            renderGeneralUnitsOverview();
            updateCategoryAndStageState();
            renderUnitHistory();
            updateDashboardData();
            document.getElementById('btn-next').style.display = 'block';
        }

        function switchTab(tab) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.getElementById(`tab-${tab}-btn`).classList.add('active');

            document.getElementById('tab-vistorias').style.display = tab === 'vistorias' ? 'block' : 'none';
            document.getElementById('tab-mapa').style.display = tab === 'mapa' ? 'block' : 'none';
            document.getElementById('tab-cronograma').style.display = tab === 'cronograma' ? 'block' : 'none';

            if (tab === 'mapa' || tab === 'cronograma') {
                loadAllUnitsData();
                if (tab === 'mapa') {
                    updateDashboardData();
                    renderGeneralUnitsOverview();
                }
                if (tab === 'cronograma') {
                    setTimeout(() => {
                        renderInteractiveCalendar();
                        if (fullCalendarInstance) fullCalendarInstance.updateSize();
                    }, 100);
                }
            }
        }

        function updateDashboardData() {
            let totalVistoriadas = 0;
            let totalAprovadas = 0;
            let totalPendenciasAbertas = 0;
            let ncCount = {};
            let respQueue = {};

            Object.keys(dbUnitsCache).forEach(key => {
                const history = dbUnitsCache[key] || [];
                if (history.length > 0) {
                    totalVistoriadas++;
                    const last = history[history.length - 1];

                    if (last.details && last.details.length > 0) {
                        let activeNCs = last.details.filter(d => d.status !== 'Concluído');
                        if (activeNCs.length === 0 && last.status === '100_ok') {
                            totalAprovadas++;
                        } else {
                            totalPendenciasAbertas += activeNCs.length;
                            activeNCs.forEach(d => {
                                ncCount[d.nonConformity] = (ncCount[d.nonConformity] || 0) + 1;
                                let respKey = d.responsible || 'A definir';
                                respQueue[respKey] = (respQueue[respKey] || 0) + 1;
                            });
                        }
                    } else if (last.status === '100_ok' && last.pendenciesCount === 0) {
                        totalAprovadas++;
                    }
                }
            });

            document.getElementById('unidades-vistoriadas').innerText = `${totalVistoriadas} / ${TOTAL_UNIDADES}`;
            document.getElementById('unidades-aprovadas').innerText = totalAprovadas;
            document.getElementById('pendencias-abertas').innerText = totalPendenciasAbertas;

            const topNcEl = document.getElementById('top-nc-list');
            const sortedNCs = Object.keys(ncCount).sort((a,b) => ncCount[b] - ncCount[a]);
            if (sortedNCs.length > 0) {
                topNcEl.innerHTML = sortedNCs.slice(0, 5).map(nc => `
                    <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee; font-size:0.85rem;">
                        <span>${nc}</span>
                        <strong style="color:var(--danger);">${ncCount[nc]}x</strong>
                    </div>
                `).join('');
            } else {
                topNcEl.innerHTML = "Nenhuma pendência registrada ainda.";
            }

            const queueEl = document.getElementById('resp-queue-list');
            const sortedResps = Object.keys(respQueue).sort((a,b) => respQueue[b] - respQueue[a]);
            if (sortedResps.length > 0) {
                queueEl.innerHTML = sortedResps.map(r => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee; font-size:0.85rem;">
                        <span class="badge-resp" style="background:${respColors[r] || 'var(--primary)'}">${r}</span>
                        <strong>${respQueue[r]} pendência(s)</strong>
                    </div>
                `).join('');
            } else {
                queueEl.innerHTML = "Nenhuma pendência ativa para exibição.";
            }
        }

        function exportToExcelXLSX() {
            let exportData = [];
            Object.keys(dbUnitsCache).forEach(key => {
                const unitNum = key.replace('unit_', '');
                (dbUnitsCache[key] || []).forEach(h => {
                    (h.details || []).forEach(d => {
                        exportData.push({
                            Unidade: unitNum,
                            Data: h.date,
                            Vistoriador: h.inspector,
                            Ambiente: d.room,
                            Item: d.item,
                            Pendencia: d.nonConformity,
                            Responsavel: d.responsible || 'A definir',
                            Severidade: d.severity,
                            Status: d.status
                        });
                    });
                });
            });

            if (exportData.length === 0) { alert('Sem dados para exportar.'); return; }

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Vistorias");
            XLSX.writeFile(workbook, "Relatorio_Vistorias.xlsx");
        }

        function sendWhatsAppSummary() {
            let text = `*VISTORIA REALIZADA - APTO ${selectedUnitNum}*\n`;
            text += `Vistoriador: ${inspectorName}\n`;
            text += `Tipo: ${selectedCategory} (${selectedStage})\n`;
            text += `Status: Registrado no sistema.`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
        }
    </script>
</body>
</html>
