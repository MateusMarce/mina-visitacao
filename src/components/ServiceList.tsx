import Currency2 from 'react-currency-input-field'
import {useEffect, useState} from 'react'
import { servicos } from '../assets/types/type'


function ServiceList({item, setServicosCart, servicosCart, paymentCheck}:any) {
    const [qtd, setQtd] = useState<number>(item.qtd)


    useEffect(()=>{
        setQtd(item.qtd)
    },[item.qtd])

    const handleDigitarValor = (servico: servicos, value: number) => {
        setServicosCart(servicosCart.map((item:servicos) => {
            if (item.id == servico.id) {
                if(value) {
                    item.qtd = Number(value) > item.qtde_maxima ? item.qtde_maxima : value
                } else {
                    item.qtd = 1
                }
            }
            return item
        }))
    }
    const HandleClicarBotao = (action: string, servico: servicos) => {
        setServicosCart(servicosCart.map((item:servicos) => {
            if (item.id == servico.id) {
                switch (action) {
                    case '-':
                        item.qtd = (qtd - 1)
                        setQtd((qtd - 1))
                    break
                    
                    case '+':
                        if(item.qtd < item.qtde_maxima){
                            item.qtd = (qtd + 1)
                            setQtd((qtd + 1))
                        }
                    break
                }
            }
            
            return item
        }).filter((item:servicos) => Number(item.qtd) >= 1))
    }
    const HandleExcluir = (servico: servicos) => {
        setServicosCart(servicosCart.map((item:servicos) => {
            if (item.id == servico.id) {
                item.qtd = -1
            }
            
            return item
        }).filter((item:servicos) => Number(item.qtd) >= 1))
    }
    
    return (
        <div className='d-flex mb-2 overflow-hidden'>
            <div className="leftMine-product w-100 d-flex justify-content-between align-items-center">
                <div className="colList-1 px-2">
                    <div className='fw-bold'>{item?.descricao}</div>
                    <small className='text-secondary'>R$ {parseFloat(item.vl_ingresso).toFixed(2).replace(".", ",")}</small>
                </div>
                
                <div className="colList-2 input-group shadow-sm" style={{flex:1, minWidth:20}}>
                    <div className="input-group-prepend">
                        <button className="btn btn-sec minus-btn btn-sm" type="button" onClick={_ => HandleClicarBotao('-', item)}>
                            <i className="bi bi-dash-lg"></i>
                        </button>
                    </div>
                    <Currency2
                        name="item-input"
                        className='form-control px-0 form-control-sm text-center border-0'
                        defaultValue={1000}
                        decimalSeparator={'.'}
                        groupSeparator={','}
                        disableGroupSeparators={true}
                        value={qtd}
                        onValueChange={(value:any) => handleDigitarValor(item, value)}
                    />
                    <div className="input-group-append">
                        <button className="btn btn-sec add-btn btn-sm" type="button" onClick={_ => HandleClicarBotao('+', item)}>
                            <i className="bi bi-plus-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <button className='border-0 h-100 roundedRight linkBut-01' title='Excluir item' onClick={_ => HandleExcluir(item)}>
                    <i className="bi bi-trash text-white"></i>
                </button>
            </div>
        </div>
    )
}

export default ServiceList