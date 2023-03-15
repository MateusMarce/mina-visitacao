import { useEffect, useState, useCallback, useRef } from 'react'
import ReactPaginate from "react-paginate"
import axios from '../api/axios'
import debounce from 'lodash.debounce'

interface apoios {
  i_apoio: number
  nome: string
  vl_recibo_str: string
  dt_sistema_f: string
  flag: string
  pagamento: string
}

function ModalHistory({setHistory, pagador, setHistoryUser, history, historyUser}:any) {
  const [pageCount, setpageCount] = useState(0)
  const [items, setItems] = useState<Array<apoios>>([])
  const [search, setSearch] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const inputSearch = useRef<HTMLInputElement>(null)
  const limit = 10

  const getApoios = async (currentPage: number = 1, search: string = '') => {
    let res = await axios.get(`/api/apoio/historico?page=${currentPage}&limit=${limit}&search=${search}`)
    setpageCount(Math.ceil(res.data.total / limit))
    setItems(res.data.itens)
    setItems(res.data.itens)
  }

  const handlePageClick = async (data: any) => {
    let currentPage = data.selected + 1
    await getApoios(currentPage, inputValue)
  }

  const debouncedCallback = useCallback(
    debounce(async (e) => {
      setInputValue(e.target.value)
      setSearch(e.target.value.trim())
      if (e.target.value.trim() && e.target.value.trim().length >= 3) await getApoios(1, e.target.value.trim())
      if (!e.target.value.trim()) await getApoios()
    }, 1500), []
  )

  useEffect(() => {
    (async () => {
      if (pagador?.nome && historyUser) {
        await getApoios(1, pagador?.nome.trim())
        setInputValue(pagador?.nome)
        // inputSearch.current?.value = 'asdsadsa'
      } else {
        await getApoios()
      }

    })()
  }, [])

  const renderFlag = useCallback((flag: string) => {
    switch(flag) {
      case 'A':
        return <span className="badge text-bg-primary" >Aberto</span>

      case 'P':
        return <span className="badge text-bg-success" >Pago</span>

      case 'C':
        return <span className="badge text-bg-danger" >Cancelado</span>

      default:
        return null;

    }
  }, []);

  const renderFormaPag = useCallback((pagamento: string) => {
    switch(pagamento) {
      case 'S':
        return 'SATC'

      case 'D':
        return 'Dinheiro'

      case 'P':
        return 'PIX'

      case 'C':
        return 'Conta'

      default:
        return null;

    }
  }, []);

  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center" style={{position:'absolute', top:0, zIndex:999, backgroundColor:'rgba(0,0,0,0.2)'}}>
      <div style={{width:960, backgroundColor:'white'}} className='shadow-lg rounded-5 row py-3' >
        <div className="d-flex justify-content-between" style={{height:50}}>
          <div className='d-flex align-items-center fs-4 ms-3'>Histórico</div>
          {history ?
            <button className="btn btn-white" onClick={()=>{setHistory(false)}}><i className="bi bi-x-lg"></i></button>
            :
            <button className="btn btn-white" onClick={()=>{ setHistoryUser(false)}}><i className="bi bi-x-lg"></i></button>
          }
        </div>
        <div className="px-4 col-5 offset-7 mb-2">
          <input
            className="form-control form-control-sm"
            type="search"
            value={inputValue}
            onChange={(e)=>{debouncedCallback(e); setInputValue(e.target.value)}}
            placeholder="Buscar..."
            ref={inputSearch}
          />
        </div>
        <div className="px-4">
          <table className="table">
            <thead>
              <tr className="table-light">
                <th className='text-center'>#</th>
                <th>Nome</th>
                <th className="text-center">Situação / Forma</th>
                <th className="text-center">Total</th>
                <th className="text-center">Data</th>
                {/* <th className="text-center">Recibo</th> */}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(apoio => (
                <tr key={apoio.i_apoio}>
                  <th scope="row" className="text-center">{apoio.i_apoio}</th>
                  <td style={{wordBreak:'break-all'}}>{apoio.nome}</td>
                  <td className="text-center">
                    {renderFlag(apoio.flag)} / {renderFormaPag(apoio.pagamento)}
                  </td>
                  <td className="text-center">{apoio.vl_recibo_str}</td>
                  <td className="text-center">{apoio.dt_sistema_f}</td>
                  <td className="text-center">
                    {apoio.flag != 'C' &&
                      <a className="btn btn-sm" target="_blank" href={`${import.meta.env.VITE_API_BASE_URL}/api/apoio/recibo/pdf/${apoio.i_apoio}`} title="Recibo">
                        <i className="bi bi-receipt"></i>
                      </a>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4">
          <ReactPaginate
            previousLabel={false}
            nextLabel={false}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination pagination-sm justify-content-end"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
      </div>
    </div>
  )
}

export default ModalHistory