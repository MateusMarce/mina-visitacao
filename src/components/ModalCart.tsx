import { servicos } from "../assets/types/type"

function ModalCart({setDetailsCart, list, total}: any) {
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
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item: servicos) => (
                <tr key={item.id}>
                  <th scope="row" className="text-center">{item.id}</th>
                  <td>{item.nome}</td>
                  <td className="text-center">{item.qtd}</td>
                      <td className="text-center">{item.preco_venda.replace('.',',')}</td>
                      <td style={{ textAlign: 'right' }}>{(Number(item.preco_venda) * Number(item.qtd)).toFixed(2).replace('.',',')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="table-light">
                <td className="text-center">Total:</td>
                <td colSpan={4} className="text-end">R$ {Number(total).toFixed(2).replace('.',',')}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ModalCart