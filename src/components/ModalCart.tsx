interface servicos {
    qtd_serv: number
    i_servico: number
    qtdUnitarios: string
    nome: string
    valor: number
    valor_custo: number
    qtd: number
}

function ModalCart({setDetailsCart, list, total, paymentCheck}: any) {
  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center" style={{position:'absolute', top:0, zIndex:999, backgroundColor:'rgba(0,0,0,0.2)'}}>
      <div style={{width:700, backgroundColor:'white'}} className='shadow-lg rounded-5 row py-3' >
        <div className="d-flex justify-content-between" style={{height:50}}>
          <div className='d-flex align-items-center fs-4 ms-3'>Carrinho</div>
          <button className="btn btn-white" onClick={()=>setDetailsCart(false)}><i className="bi bi-x-lg"></i></button>
        </div>
        <div className="px-4">
          <table className="table">
            <thead>
              <tr className="table-light">
                <th className="text-center">#</th>
                <th>Item</th>
                <th className="text-center">Qtd</th>
                <th className="text-center">Valor</th>
                <th className="text-center">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item: servicos) => (
                <tr key={item.i_servico}>
                  <th scope="row" className="text-center">{item.i_servico}</th>
                  <td>{item.nome}</td>
                  <td className="text-center">{item.qtd}</td>
                  {paymentCheck === 0 ?
                    <>
                      <td className="text-center">{item.valor_custo.toFixed(3)}</td>
                      <td style={{ textAlign: 'right' }}>{(item.valor_custo * item.qtd).toFixed(3)}</td>
                    </>
                    :
                    <>
                      <td className="text-center">{item.valor.toFixed(2)}</td>
                      <td style={{ textAlign: 'right' }}>{(item.valor * item.qtd).toFixed(2)}</td>
                    </>
                  }
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="table-light">
                <td>Total:</td>
                <td colSpan={4} style={{ textAlign: 'right' }}>R$ {Number(total).toFixed(paymentCheck === 0 ? 3 : 2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ModalCart