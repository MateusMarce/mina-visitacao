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
                        {/* <a href="#!" className="food-card_author">Burger</a> */}
                    </div>
                    <div className="food-card_bottom-section">
                        <hr className='mt-1 mb-1'/>
                        <div className="row justify-conten-between">
                            <div className="food-card_price text-white mt-1">
                                <span>R$ {servico.valor.toFixed(2).replace(".", ",")}</span>
                            </div>
                            {/*<div className="food-card_price text-white gap-2 d-flex mt-1" title='Valor interno SATC'>
                                <span>R$ {servico.valor_custo.toFixed(3).replace(".", ",")}</span>
                                <svg version="1.2" xmlns="http://www.w3.org/2000/svg" style={{fill:"#24a141"}} viewBox="0 0 14 19" width="12" height={27}>
                                    <path id="path23306" fillRule="evenodd" className="ico-satc" d="m0 4l2.9 2.3v4.5l-2.9-2.4zm2.9 6.9l0.5 4.5-3.4-3.5v-3.5c0 0 2.9 2.5 2.9 2.5zm4 3.9v4l-3.5-3.4-0.5-4.5c0 0 3.9 3.9 4 3.9q0 0 0 0zm-4-8.5l-2.9-2.3 3.4-2 3.5-2 3.4 2-3.4 2-4 2.3c0 0 0.5-4.3 0.5-4.3 0 0-0.5 4.3-0.5 4.3zm10.8-2.3l-2.9 2.3c0-0.1-0.5-4.3-0.5-4.3zm-2.9 2.3q0 0 0 0zm-0.5-4.3q0 0 0 0zm0.5 4.3l2.9-2.3v4.4zm2.9 2.2v3.5l-3.4 3.4 0.5-4.5c0 0 2.9-2.4 2.9-2.4zm-6.9 6.4q0 0 0 0l3.5 0.5-3.5 3.5v-4q0 0 0 0zm3.5 0.5zm0.5-9.1l2.9 2.2-2.9 2.4zm-0.5-4.2q0 0 0 0 0 0 0 0zm0 0c0 0 0.5 4.2 0.5 4.2l-4-2.3zm0.6 4.3q0 0 0 0zm-0.6 9.1zm0.6-4.5c0 0-4 3.9-4 4l3.4 0.5z"/>
                                </svg>
                            </div>*/}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default ServiceCard