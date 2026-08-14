// --- MÓDULO: RELATÓRIOS E EXPORTAÇÃO ---
import { obterEmpresas } from './empresas.js';

export function gerarResumoGeralObra(nomeEmpresa) {
    const empresas = obterEmpresas();
    const empObj = empresas.find(e => e.nome === nomeEmpresa);
    if (!empObj) return 'Empresa não encontrada.';

    const totalAmbientes = empObj.ambientes ? empObj.ambientes.length : 0;
    let totalItens = 0;
    let itensConcluidos = 0;

    if (empObj.ambientes) {
        empObj.ambientes.forEach(amb => {
            if (amb.itens) {
                totalItens += amb.itens.length;
                itensConcluidos += amb.itens.filter(i => i.status === 'Concluído' || i.status === 'Aprovado').length;
            }
        });
    }

    const percentualGeral = totalItens > 0 ? Math.round((itensConcluidos / totalItens) * 100) : 0;

    return {
        nome: empObj.nome,
        tipo: empObj.tipoEmpresa,
        totalAmbientes,
        totalItens,
        itensConcluidos,
        percentualGeral
    };
}
