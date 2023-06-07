export interface pagador {
    cpf: string
    email: string
    nome: string
    radio:number | string
}

export interface servicos {
    id: number,
    descricao: string
    vl_ingresso: number
    qtde_maxima: number,
    status: string
    i_plano: null | number,
    usuario: string
    dt_sistema: string
    qtd:number
}

export interface historico {
    id: number,
    nome: string
    cpf_cnpj: string
    vl_venda: string
    vl_pago: string
    flag: string
    pagamento: string
    dt_venda: string
    id_local: number,
    i_pagamento: null,
    usuario: string
    dt_sistema: string
    vl_recibo_str: string
    dt_sistema_f: string
}
  