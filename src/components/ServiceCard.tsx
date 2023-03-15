import { servicos } from '../assets/types/type'


function ServiceCard({servico, setServicosCart, servicosCart, setSearch}:any) {

    const handleClickAddItemCart = (servico: servicos) => {        
        let add = true
        let servicos = servicosCart.map((item:servicos) => {
            if (item.id == servico.id) {
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
        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-4" style={{minHeight:130}} >
            <div className="food-card" style={{ cursor: 'pointer' }}>
                <div className="food-card_content" onClick={_ => handleClickAddItemCart(servico)}>
                    <div className="food-card_title-section" title={servico.nome}>
                        <div className="food-card_title">{servico.nome}</div>
                    </div>
                    <div className="food-card_bottom-section">
                        <hr className='mt-1 mb-1'/>
                        <div className="row justify-conten-between">
                            <div className="food-card_price d-flex text-secondary mt-1">
                                <span>R$ {servico.preco_venda.replace(".", ",")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceCard