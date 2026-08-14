// --- MÓDULO: AMBIENTES E MODIFICAÇÕES ---
import { obterEmpresas, salvarEmpresas } from './empresas.js';

export function renderizarGerenciamentoAmbientes(nomeObra, containerId = 'main-content') {
    const container = document.getElementById(containerId);
    const empresas = obterEmpresas();
    const empObj = empresas.find(e => e.nome === nomeObra);
    const ambientes = empObj && empObj.ambientes ? empObj.ambientes : [];

    let htmlAmbientesCadastrados = '';
    ambientes.forEach((amb, idx) => {
        let itensResumo = amb.itens ? amb.itens.map(i => i.descricao).join(', ') : '';
        htmlAmbientesCadastrados += `
            <div style="background: rgba(15, 23, 42, 0.6); padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <h4 style="color: var(--primary); font-size: 14px; margin: 0; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-door-open"></i> ${amb.nome}
                    </h4>
                    <button onclick="window.removerAmbienteReforma('${amb.nome}')" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;"><i class="fa-solid fa-trash-can"></i> Excluir</button>
                </div>
                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 6px;">
                    <strong>Modificações:</strong> ${itensResumo || 'Nenhuma'}
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: var(--primary); font-size: 18px; margin-bottom: 2px;"><i class="fa-solid fa-door-open"></i> Ambientes: ${nomeObra}</h3>
            <p style="font-size: 13px; color: var(--text-muted);">Gerenciamento de cômodos cadastrados</p>
        </div>

        <div style="margin-bottom: 15px;">
            <h4 style="font-size: 14px; margin-bottom: 10px; color: var(--text-main);">Ambientes Cadastrados</h4>
            ${htmlAmbientesCadastrados || '<p style="color: var(--text-muted); font-size: 13px;">Nenhum ambiente cadastrado ainda.</p>'}
        </div>

        <button class="btn-action btn-back" onclick="abrirEmpresa('${nomeObra}')"><i class="fa-solid fa-arrow-left"></i> Voltar ao Painel</button>
    `;
}
