export interface pagador {
    cpf: string
    data: string
    nome: string
    local: number
    unidade: number | ''
    tipo?: string
    radio:number | string
}

export interface servicos {
    qtd_serv: number | string
    i_servico: number
    qtdUnitarios: string
    nome: string
    valor: number
    valor_custo: number
    qtd: number | string
}
  