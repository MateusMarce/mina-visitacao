import { formatValue } from 'react-currency-input-field'
import CurrencyInput from 'react-currency-masked-input'
import { useState, useEffect } from 'react'
import axios from '../api/axios'
import { toast } from 'react-toastify'
import { servicos } from '../assets/types/type'

function ModalEnd({
  setEnd, 
  mode, 
  list, 
  total, 
  devedor, 
  pagador, 
  codesearch, 
  setServicosCart, 
  setPaymentCheck,
  formikForm, 
  setDevedor, 
  setCodeSearch,
  menuValue
}:any) {
    const [troco, setTroco] = useState<string>('')
    const [timer, setTimer] = useState<number | undefined>()
    const [cancel, setCancel] = useState<boolean>(false)

    let date = new Date()
    let year = date.toLocaleString("default", { year: "numeric" })
    let month = date.toLocaleString("default", { month: "2-digit" })
    let day = date.toLocaleString("default", { day: "2-digit" })
    let hours = date.toLocaleString("default", { hour: "2-digit" })
    let minutes = date.toLocaleString("pt-br", { minute: "2-digit" })
    var pay: string = 'PIX'

    if (parseInt(minutes) < 10) minutes = `0${minutes}`

    const handleInterval = (apoio:any) => {
      if(timer) {
        clearInterval(timer)
        setTimer(0)
      }

      const newTimer = window.setInterval(async ()=>{
        if(!cancel) {
          let res = await axios.get(`/api/apoio/pix/get/${apoio}`)
          if(res.data.codret === "00") {
            toast('Venda paga com successo!', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
              theme: "light",
              type:'success'
            })
            setEnd(false)
            setDevedor(0)
            setCodeSearch('')
            setServicosCart([])
            setPaymentCheck(null)
            setTimer(0)
            clearInterval(newTimer)
          }
          
        }
      }, 5000)

      setTimer(newTimer)
    }
    const handleClickFinalizar = async () => {
      let apoio_user = {
          nome: pagador.nome,
          cpf_cnpj:pagador.cpf.replaceAll('.','').replace('-',''),
          i_unidade: pagador.unidade,
          dt_apoio: pagador.data,
          i_local: pagador.local,
          usuario: 'AUTO',
          vl_recibo: (devedor > 0 ? Number(total) + devedor : Number(total)).toFixed(2),
          vl_dinheiro: (devedor > 0 ? Number(total) + devedor : Number(total)).toFixed(2),
          vl_troco: (parseFloat(troco?.replaceAll(',','.')) - (devedor != 0 ? (Number(total) + devedor) : Number(total))).toFixed(2),
          cod_biblioteca: codesearch,
          itens: list,
          flag: 'A',
          pagamento: 'P'
      }
      switch (pay) {
        case 'PIX':
          setCancel(true)
          //apenas quando nao estiver monitorando, deve fazer a requisicao do pamento
          if(!cancel) {
            try {
              let valor = formatValue({value: (devedor > 0 ? Number(total) + devedor : Number(total)).toString(), decimalSeparator: '.', decimalScale: 2})
              apoio_user = {...apoio_user, vl_recibo:valor, vl_dinheiro: valor, cpf_cnpj:pagador.cpf.replaceAll('.','').replace('-',''), vl_troco:'0.00'}
              var res = await axios.post('api/apoio/novo-atendimento', apoio_user)
              handleInterval(res.data.i_apoio)
              window.open(`${import.meta.env.VITE_API_BASE_URL_PIX}/apoio?valor=${valor}&nome=${pagador.nome}&cpf_cnpj=${pagador.cpf.replaceAll('.','').replace('-','')}&origem=${pagador.local}&i_apoio=${res.data.i_apoio}`, '_blank')
              
            } catch (error) {
              
            }
          }
          if(cancel) {
            setEnd(false)
            setDevedor(0)
            setCodeSearch('')
            setServicosCart([])
            setPaymentCheck(null)
            setTimer(0)
            clearInterval(timer)
          }
          break

        case 'SATC':
          try {
            apoio_user = {...apoio_user, 
              pagamento: 'S', 
              flag: 'P',
              vl_recibo: (Number(total)).toFixed(3),
              vl_dinheiro: (Number(total)).toFixed(3),
              vl_troco:"0.00"
            }
            console.log(apoio_user);
            
            var res = await axios.post('api/apoio/novo-atendimento', apoio_user)
            setEnd(false)
            setDevedor(0)
            setCodeSearch('')
            toast.success('Venda finalizada com sucesso!')
            setServicosCart([])
            setPaymentCheck(null)
          } catch (e) {
            toast.error('Erro ao concluir venda!')
          }
          break

        case 'dinheiro':
          apoio_user = {
            ...apoio_user,
            vl_troco: (parseFloat(troco.replace(',','.') || '0') - (devedor != 0 ? Number(total) + devedor : Number(total))).toFixed(2),
            vl_dinheiro: parseFloat(troco.replaceAll(',', '.')),
            pagamento: 'D',
            flag: 'P'
          }
          try {
            var res = await axios.post('api/apoio/novo-atendimento', apoio_user)
            setEnd(false)
            setDevedor(0)
            setCodeSearch('')
            toast.success('Venda finalizada com sucesso!')
            setServicosCart([])
            setPaymentCheck(null)
          } catch (e) {
            toast.error('Erro ao concluir venda!')
          }
          break

        case 'conta':
          apoio_user = {
            ...apoio_user,
            vl_recibo: (Number(total)).toFixed(2),
            vl_dinheiro: (Number(total)).toFixed(2),
            pagamento: 'C',
            flag: 'A',
            vl_troco:"0.00"
          }
          try {
            var res = await axios.post('api/apoio/novo-atendimento', apoio_user)
            setEnd(false)
            setDevedor(0)
            setCodeSearch('')
            toast.success('Venda finalizada com sucesso!')
            setServicosCart([])
            setPaymentCheck(null)
          } catch (e) {
            toast.error('Erro ao concluir venda!')
          }
          break
      }
      formikForm.current?.resetForm()
    }

    switch (mode) {
        case 0:
            pay = 'SATC'
            break
        case 1:
            pay = 'dinheiro'
            break
        case 2:
            pay = 'PIX'
            break
        case 3:
            pay = 'conta'
    }

    console.log(pagador);
    

    return (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center" style={{position:'absolute', top:0, zIndex:999, backgroundColor:'rgba(0,0,0,0.2)'}}>
            <div style={{width:500, backgroundColor:'white'}} className='shadow-lg rounded-5 row py-3' >
                <div className="d-flex pt-2 justify-content-end" style={{height:50}}>
                    <button className="btn btn-white" onClick={()=>setEnd(false)}><i className="bi bi-x-lg"></i></button>
                </div>
                <div className="px-4">
                    <div className="row mb-4">
                        {pay == 'PIX' && <i className="bi bi-qr-code fs-1 d-flex justify-content-center"></i>}
                        {pay == 'dinheiro' && <i className="bi bi-cash-stack fs-1 d-flex justify-content-center"></i>}
                        {pay == 'conta' && <i className="bi bi-wallet2 fs-1 d-flex justify-content-center"></i>}
                        {pay == 'SATC' && <i className="ico-satc"></i>}
                        
                        <h5 className="d-flex justify-content-center mt-3" style={{fontSize:18}}>Pagamento {mode === 1 ? 'em': 'por'} {pay}</h5>
                        {pay == 'SATC' ?
                          <h4 className="d-flex justify-content-center" style={{fontSize:30}}>{formatValue({value: total, groupSeparator: '.', decimalSeparator: ',', prefix: 'R$ ', decimalScale: 3})}</h4>
                          :
                          <h4 className="d-flex justify-content-center" style={{fontSize:30}}>{formatValue({value: (devedor > 0 ? Number(total) + devedor : Number(total)).toFixed(2), groupSeparator: '.', decimalSeparator: ',', prefix: 'R$ ', decimalScale: 2})}</h4>
                        }
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="mb-1">{menuValue.label} - {menuValue.value}</p>
                    </div>
                    <div className="d-flex justify-content-between border-bottom mb-2">
                        <p className="mb-1">{pagador.nome}</p>
                        <p className="mb-1">{`${day}/${month}/${year} ${hours}:${minutes}`}</p>
                    </div>
                    <div className="d-flex col-sm-12">
                        <p className="col-sm-1">#</p>
                        <p style={{flex:1}}>Item</p>
                        <p className="col-sm-1 text-center">Qtd</p>
                        <p className="col-sm-3 text-end">Subtotal</p>
                    </div>
                    {list.map((i:servicos,k:number)=>(
                        <div className="d-flex col-sm-12" key={k}>
                            <p className="col-sm-1 mb-0" style={{fontSize:14}}>{k+1}</p>
                            <p style={{flex:1, margin:0, fontSize:14}}>{i.nome}</p>
                            <p className="col-sm-1 mb-0 text-center">{i.qtd}</p>
                            {pay == 'SATC' ? 
                              <p className="col-sm-3 mb-1 text-end">{formatValue({value: (i.valor_custo * Number(i.qtd)).toString(), groupSeparator: '.', decimalSeparator: ',', decimalScale: 3})}</p>
                              :
                              <p className="col-sm-3 mb-1 text-end">{formatValue({value: (i.valor * Number(i.qtd)).toString(), groupSeparator: '.', decimalSeparator: ',', decimalScale: 2})}</p>
                            }
                        </div>
                    ))}
                        <div className="d-flex justify-content-between mt-2">
                            <p className="m-0">TOTAL ITEM</p>
                            <p className="m-0">{formatValue({value: total.toString(), groupSeparator: '.', decimalSeparator: ',', prefix: 'R$ '})}</p>
                        </div>
                    <div className="border-top mt-2">


                        {devedor > 0 && pay != 'SATC' &&
                          <>
                            <div className="d-flex justify-content-between mt-2">
                                <p className="m-0">SALDO DEVEDOR</p>
                                <p className="m-0">{formatValue({value: devedor.toString(), groupSeparator: '.', decimalSeparator: ',', prefix: '+ R$ ', decimalScale: 2})}</p>
                            </div>
                            <div className={`d-flex justify-content-between mb-2`}>
                                <p className="m-0">TOTAL</p>
                                <p className="m-0">{formatValue({value: (Number(total) + devedor).toFixed(2), groupSeparator: '.', decimalSeparator: ',', prefix: 'R$ ', decimalScale: 2})}</p>
                            </div>
                          </>
                        }

                        {pay != "SATC" && devedor === 0 && 
                          <div className={`d-flex justify-content-between my-2`}>
                            <p className="m-0">TOTAL</p>
                            <p className="m-0">{formatValue({value: (Number(total)).toFixed(2), groupSeparator: '.', decimalSeparator: ',', prefix: 'R$ ', decimalScale: 2})}</p>
                          </div>
                        }
                        {pay == "SATC" && 
                          <div className='d-flex justify-content-between mb-2 mt-2'>
                              <p className="m-0">TOTAL</p>
                              <p className="m-0">{formatValue({value: (Number(total)).toFixed(3), groupSeparator: '.', decimalSeparator: ',', prefix: 'R$ ', decimalScale: 3})}</p>
                          </div>
                        }
                    </div>


                    {pay == 'dinheiro' &&
                      <>
                        <div className="d-flex justify-content-between mt-2 align-items-center border-top">
                            <p className="m-0">DINHEIRO</p>
                            <div className="d-flex col-sm-3">
                                <CurrencyInput
                                  name="myInput"
                                  required
                                  type="text"
                                  separator=','
                                  className='ms-2 form-control form-control-borderless text-end px-0 border-bottom rounded-0 py-1'
                                  onChange={(e: any, b: any) => setTroco(b)}
                                  value={troco}
                                  autoFocus={true}
                                />
                            </div>
                        </div>
                        <div className={`d-flex justify-content-between mt-2 mb-2 ${(parseFloat(troco?.replaceAll(',','.') || '0') - (devedor != 0 ? Number(total) + devedor : total)) < 0 ? 'total-dev px-2 py-1 rounded-3' : 'total-cre px-2 py-1 rounded-3'} `}>
                            <p className="d-flex align-items-center mb-0">TROCO</p>
                            <p className="d-flex align-items-center mb-0">{formatValue({value: (parseFloat(troco?.replaceAll(',','.') || '0') - (devedor != 0 ? Number(total) + devedor : Number(total))).toFixed(2), groupSeparator: '.', decimalSeparator: ',', prefix: 'R$ ', decimalScale: 2})}</p>
                        </div>
                      </>
                    }
                </div>

                {/* botao */}
                <div>
                  {(pay == 'PIX' && !cancel) && <button
                    className="btn-original rounded-4 mx-2 text-white mt-2 py-3"
                    style={{width:'calc(100% - 1rem)'}}
                    onClick={handleClickFinalizar}
                  >
                      PAGAR COM QR CODE
                  </button>}
                  {(pay == 'PIX' && cancel) && <button
                    className="btn btn-secondary rounded-4 mx-2 text-white mt-2 py-3"
                    style={{width:'calc(100% - 1rem)'}}
                    onClick={handleClickFinalizar}
                  >
                      CANCELAR VENDA
                  </button>}

                  {(pay == 'SATC' || pay == 'conta') && <button
                    className="btn-original rounded-4 mx-2 text-white mt-2 py-3"
                    style={{width:'calc(100% - 1rem)'}}
                    onClick={handleClickFinalizar}
                  >
                      CONCLUIR VENDA
                  </button>}

                  {pay == 'dinheiro' && <button
                    className="btn-original rounded-4 mx-2 text-white mt-2 py-3"
                    style={{width:'calc(100% - 1rem)'}}
                    onClick={handleClickFinalizar}
                    disabled={(parseFloat(troco.replace(',','.') || '0') - (devedor > 0 ? Number(total) + devedor : 0)) < 0}
                  >
                    CONCLUIR VENDA
                  </button>}
                </div>
            </div>
        </div>
    )
}

export default ModalEnd