// --- MÓDULO: CHECKLISTS E VISTORIAS ---
import { obterEmpresas, salvarEmpresas } from './empresas.js';

export function atualizarStatusItem(nomeEmpresa, nomeAmbiente, idItem, novoStatus) {
    const empresas = obterEmpresas();
    const empObj = empresas.find(e => e.nome === nomeEmpresa);
    if (!empObj) return;

    let ambienteObj = empObj.ambientes.find(a => a.nome === nomeAmbiente);
    if (ambienteObj && ambienteObj.itens) {
        let item = ambienteObj.itens.find(i => i.id === idItem || i.descricao === idItem);
        if (item) {
            item.status = novoStatus;
            salvarEmpresas(empresas);
        }
    }
}

export function calcularProgressoAmbiente(ambiente) {
    if (!ambiente.itens || ambiente.itens.length === 0) return 0;
    const concluidos = ambiente.itens.filter(i => i.status === 'Concluído' || i.status === 'Aprovado').length;
    return Math.round((concluidos / ambiente.itens.length) * 100);
}
