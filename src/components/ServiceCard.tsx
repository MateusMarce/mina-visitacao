import { useState, useEffect } from 'react'
import { servicos } from '../assets/types/type'
import axios from '../api/axios'
import { version } from '../../package.json'
import { toast } from 'react-toastify'

function ServiceCard({servico, setServicosCart, servicosCart}:any) {

    const handleClickAddItemCart = async (servico: servicos) => {
        try {
            let res = await axios.get(`versao/1/${version}`)
            if(!res.data.status){
                let add = true
                let servicos = servicosCart.map((item:servicos) => {
                    if (item.id == servico.id) {
                        add = false
                        // item.qtd += servico.qtd
                        if(item.qtd < item.qtde_maxima) item.qtd = (Number(item.qtd) + 1)
                    }    
                    return item
                    
                })
                
                if (add) {
                    setServicosCart((current:any) => [...current, {...servico, qtd: 1}])
                } else {
                    setServicosCart(servicos)
                }
            } else {
                toast.error(`Seu sistema tem uma nova versão dispoível. Recarregue a página com CTRL+F5.`, {position:'top-center'})
            }
        } catch (error) {
            
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
                    <div className="food-card_title-section" title={servico.descricao}>
                        <div className="food-card_title">{servico.descricao}</div>
                    </div>
                    <div className="food-card_bottom-section">
                        <hr className='mt-1 mb-1' style={{borderColor:'#ffedc24d'}}/>
                        <div className="row justify-conten-between">
                            <div className="food-card_price text-white mt-1">
                                <span>R$ {servico.vl_ingresso.toFixed(2).replace(".", ",")}</span>
                            </div>
                            <div className="food-card_price text-white mt-1">
                                <span>Máx.: {servico.qtde_maxima} unidades </span>
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