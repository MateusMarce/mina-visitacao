import { useState, useEffect } from 'react'

interface servicos {
    qtd_serv: number
    i_servico: number
    qtdUnitarios: string
    nome: string
    valor: number
    valor_custo:number
    qtd: number | string
  }

function ServiceCard({servico, setServicosCart, servicosCart, setSearch}:any) {

    const handleClickAddItemCart = (servico: servicos) => {
        let add = true
        let servicos = servicosCart.map((item:servicos) => {
            if (item.i_servico == servico.i_servico) {
                add = false
                // item.qtd += servico.qtd
                item.qtd = (Number(item.qtd) + 1).toFixed(2)
            }    
            
            return item
        })
        
        if (add) {
            setServicosCart((current:any) => [...current, {...servico, qtd: '1.00'}])
            setSearch('')
        } else {
            setServicosCart(servicos)
        }
    }

    return (
        <div className="col-sm-6" >
        <div className="card card-corrige" >
            <div className="card-body food-card row justify-content-between" onClick={_ => handleClickAddItemCart(servico)}>
                 <div className="food-card_img col">
                    <img src="/src/assets/img/ticket_1.svg" alt=""/>
                    <a href="#!"><i className="far fa-heart"></i></a>
                </div> 
                <div className="food-card_content col">
                    <div className="food-card_title-section" title={servico.nome}>
                        <div className="food-card_title">{servico.nome}</div>
                    </div>
                    <div className="food-card_bottom-section">
                        <hr className='mt-1 mb-1' style={{borderColor:'#ffedc24d'}}/>
                        <div className="row justify-conten-between">
                            <div className="food-card_price text-white mt-1">
                                <span>R$ {servico.valor.toFixed(2).replace(".", ",")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default ServiceCard