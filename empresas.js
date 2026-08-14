// --- MÓDULO: EMPRESAS E REFORMAS ---

export const empresasPadrao = [
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

export function obterEmpresas() {
    const salvo = localStorage.getItem('conformeObra_empresas');
    if (salvo) return JSON.parse(salvo);
    localStorage.setItem('conformeObra_empresas', JSON.stringify(empresasPadrao));
    return empresasPadrao;
}

export function salvarEmpresas(lista) {
    localStorage.setItem('conformeObra_empresas', JSON.stringify(lista));
}

export function solicitarExclusaoEmpresa(nomeEmpresa, callbackAtualizar) {
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
    if (callbackAtualizar) callbackAtualizar();
}
