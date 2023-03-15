import Currency2 from 'react-currency-input-field'
import {useEffect, useState} from 'react'
import { servicos } from '../assets/types/type'


function ServiceList({item, setServicosCart, servicosCart, paymentCheck}:any) {
    const [qtd, setQtd] = useState<string>(item.qtd)


    useEffect(()=>{
        setQtd(item.qtd)
    },[item.qtd])

    const handleDigitarValor = (servico: servicos, value: string) => {
        setQtd(value)
        setServicosCart(servicosCart.map((item:servicos) => {
            
            if (item.id == servico.id) item.qtd = value
            return item
        }))
    }
    const HandleClicarBotao = (action: string, servico: servicos) => {
        setServicosCart(servicosCart.map((item:servicos) => {
            if (item.id == servico.id) {
                switch (action) {
                    case '-':
                        item.qtd = (Number(parseFloat(qtd)) - 1.00).toFixed(2)
                        setQtd((Number(parseFloat(qtd)) - 1.00).toFixed(2))
                    break
                    
                    case '+':
                        item.qtd = (Number(parseFloat(qtd)) + 1.00).toFixed(2)
                        setQtd((Number(parseFloat(qtd)) + 1.00).toFixed(2))
                    break
                }
            }
            
            return item
        }).filter((item:servicos) => item.qtd > 0))
    }
    const HandleExcluir = (servico: servicos) => {
        setServicosCart(servicosCart.map((item:servicos) => {
            if (item.id == servico.id) {
                item.qtd = (-1).toFixed(2)
            }
            
            return item
        }).filter((item:servicos) => item.qtd > 0))
    }
    



    return (
        <div className='d-flex mb-2 rounded-3 overflow-hidden'>
            <div className="p-2 px-3 d-flex justify-content-between align-items-center w-100" style={{ backgroundColor: '#e5ecf1' }}>
                <div className="colList-1">
                    <div className='fw-bold'>{item?.nome}</div>
                    <small className='text-secondary'>R$ {item.preco_venda.replace(".", ",")}</small>
                </div>
                
                <div className="colList-2 input-group shadow-sm" style={{flex:1, minWidth:20}}>
                    <div className="input-group-prepend">
                        <button className="btn btn-sec minus-btn btn-sm" type="button" onClick={_ => HandleClicarBotao('-', item)} style={{borderWidth:4, borderColor:'white'}}>
                            <i className="bi bi-dash-lg"></i>
                        </button>
                    </div>
                    <Currency2
                        name="item-input"
                        className='form-control px-0 form-control-sm text-center border-0'
                        
                        defaultValue={1000}
                        decimalsLimit={2}
                        decimalScale={2}
                        decimalSeparator={'.'}
                        groupSeparator={','}
                        disableGroupSeparators={true}
                        value={qtd}
                        onValueChange={(value:any) => handleDigitarValor(item, value)}
                    />
                    <div className="input-group-append">
                        <button className="btn btn-sec add-btn btn-sm" type="button" onClick={_ => HandleClicarBotao('+', item)} style={{borderWidth:4, borderColor:'white'}}>
                            <i className="bi bi-plus-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <button className='border-0 h-100' title='Excluir item' onClick={_ => HandleExcluir(item)} style={{backgroundColor:'rgb(230, 65, 92)'}} >
                    <i className="bi bi-trash text-white"></i>
                </button>
            </div>
        </div>
    )
}

export default ServiceList