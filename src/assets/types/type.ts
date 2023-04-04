export interface pagador {
    cpf: string
    email: string
    nome: string
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
  