import 'bootstrap-icons/font/bootstrap-icons.css'
import 'react-toastify/dist/ReactToastify.css'
import { useState, useEffect, useRef, useCallback } from 'react'
import axios from './api/axios'
import ModalEnd from './components/ModalEnd'
import ModalHistory from './components/ModalHistory'
import PaymentCard from './components/PaymentCard'
import ServiceCard from './components/ServiceCard'
import ServiceList from './components/ServiceList'
import { ToastContainer, toast } from 'react-toastify'
import { Formik, Form, useField, Field, FormikValues } from 'formik'
import Feedback from 'react-bootstrap/Feedback'
import * as Yup from 'yup'
import ModalCart from './components/ModalCart'
import { formatValue } from 'react-currency-input-field'
import debounce from 'lodash.debounce';
import { pagador, servicos } from './assets/types/type'
import Select from 'react-select'
import MaskedInput from "react-text-mask";
import handleCpfCnpjChange from './components/HandleCpfCnpjChange'



const validation = Yup.object().shape({
    nome: Yup.string().required('Preencha o campo Nome'),
    cpf: Yup.string().required('Preencha o campo CPF'),
    email: Yup.string().required('Preencha o campo E-mail'),
  })


function App() {
  const [end, setEnd] = useState<boolean>(false)
  const [history, setHistory] = useState<boolean>(false)
  const [historyUser, setHistoryUser] = useState<boolean>(false)
  const [detailsCart, setDetailsCart] = useState<boolean>(false)
  const [servicos, setServicos] = useState<servicos[]>([])
  const [servicosCart, setServicosCart] = useState<servicos[]>([])
  const [search, setSearch] = useState<string>('')
  const [total, setTotal] = useState<number | string>(0)
  const [devedor, setDevedor] = useState<number>(0)
  const [pagador, setPagador] = useState<pagador>()
  const [paymentCheck, setPaymentCheck] = useState<number | null>(null)
  const [codeSearch, setCodeSearch] = useState<string>('')
  const [menuValue, setMenuValue] = useState<{value:number|string, label:string}>({value:0, label:''})
  const inputSearch = useRef<HTMLInputElement>(null)
  const formikForm = useRef(null)
  const lista = [
    {nome:'PIX'},
    {nome:'Crédito'},
    {nome:'Débito'},
    {nome:'Dinheiro'},
  ]


  useEffect(() => {
    (async () => {
      inputSearch.current?.focus()

      let res = await axios.get('/api/apoio/servicos')
      setServicos(res.data)
    })()
  }, [])
  

  // total da compra
  useEffect(() => {
    let total = 0
    
    total = servicosCart.map(item => item.valor * Number(item.qtd)).reduce((sum, a) => sum + a, 0)
    setTotal(Number(total).toFixed(3))
  }, [servicosCart, paymentCheck])



  function OtherField (props: any) {
    const [field] = useField(props.name);
    return props.values.replaceAll('.','').replace('-','').length <= 11 ?
      (
          <MaskedInput mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} guide={false} {...field} {...props} />
      ) 
      :
      (
          <MaskedInput mask={[/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,'/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]} guide={false} {...field} {...props} />
      ) 
  }



  return (
    <section>
      <ToastContainer/>
      <div className="container-fluid" style={end ? {filter:'blur(3px)'}:{}}>
        <Formik
          initialValues={{ nome: '', cpf: '', email:'', radio:''}}
          validationSchema={validation}
          onSubmit={(values: pagador, { setSubmitting }) => {
            // let cpf = values.cpf.replaceAll('.','').replace('-','')
            // setPagador({...values, cpf})
            setPagador(values)
            setEnd(true)
            setSubmitting(false)
          }}
          innerRef={formikForm}
          enableReinitialize
        >
          {({ setFieldValue, errors, touched, values, submitForm }) => (
            <div className="row" style={{height:'100vh'}}>

              {/* left */}
              <div className="col-sm-12 col-md-6 col-lg-7 col-xl-7 pe-3" style={{height:'100%', overflow:'hidden'}}>

                {/* search */}
                {/* <div className="row m-3" style={{height:70}}>
                  <div className="col card border-0 p-0 shadow-sm">
                    <div className="card-body p-0 d-flex align-items-center">
                      <div className="col-sm-1 p-3 ps-4">
                        <i className="bi bi-search h4 text-body"></i>
                      </div>
                      <div className="d-flex h-100 col-sm-11">
                        <input
                          className="form-control-borderless col-sm-12 rounded-3 me-5"
                          type="search"
                          placeholder="Buscar usuário/produto"
                          onChange={e => setSearch(e.target.value)}
                          ref={inputSearch}
                          value={search}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className='px-3 my-2'>
                  <h1 className='text-light fw-bold m-0' style={{fontFamily:'Raleway', letterSpacing:-1}}>Mina de Visitação</h1>
                  <h2 className='text-light fw-light m-0' style={{letterSpacing:6.2, fontFamily:'Raleway'}}>Octavio Fontana</h2>
                </div>

                {/* itens */}
                <div className='px-4' style={{overflow:'auto', height:'calc(100% - 100px)'}}>
                  <div className="row row-cols-xl-2 row-cols-lg-1 row-cols-md-1 row-cols-sm-1 row-cols-1 ">
                    {servicos.filter(e =>  e.nome?.toLowerCase().includes(search.toLowerCase())).map(servico => (
                        <ServiceCard
                          key={servico.i_servico}
                          servico={servico}
                          setServicosCart={setServicosCart}
                          servicosCart={servicosCart}
                          setSearch={setSearch}
                        />
                    ))}
                  </div>
                </div>

              </div>

              {/* right */}
              <div className="leftMine col-sm-12 col-md-6 col-lg-5 col-xl-5" style={{height:'100vh', overflowY:'auto'}}>              

                {/* mid cart */}
                <div className="col" >
                  <div className='leftMine-card-1 m-3 mt-4 rounded'>
                    <div className='d-flex justify-content-between'>
                      <div>
                        <button className='btn ' title='Histórico' onClick={_=>setHistory(true)}>
                          <i className="bi bi-clock fs-5"></i>
                        </button>
                        <button className='btn px-1' title='Carrinho' onClick={_ => setDetailsCart(!detailsCart)}>
                          {servicosCart.length > 0 ?
                            <i className="bi bi-minecart-loaded badge-custom fs-5 d-flex align-items-center justify-content-center" data-value={servicosCart.length}></i>
                            :
                            <i className="bi bi-minecart badge-custom fs-5 d-flex align-items-center justify-content-center" data-value={servicosCart.length}></i>
                          }
                        </button>
                      </div>
                      <button type="button" className="btn btn-mine-01 py-1" onClick={_ => setServicosCart([])}>
                        <i className="bi bi-trash3"></i> Limpar carrinho
                      </button>
                    </div>
                    <hr/>
                    <div className="col pe-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      <ul className="list-group list-group-flush" >
                        {servicosCart.length != 0 ? servicosCart.map((item,k) => (
                          <ServiceList
                            item={item}
                            key={k}
                            setServicosCart={setServicosCart}
                            servicosCart={servicosCart}
                            setServicos={setServicos}
                            servicos={servicos}
                            paymentCheck={paymentCheck}
                          />
                        ))
                          :
                          <div className='avisoSemcompra d-flex justify-content-center align-items-center gap-2'>
                            <i className="bi bi-emoji-frown d-flex justify-content-center fs-2"></i>
                            <p className='d-flex justify-content-center align-items-center m-0'>Sem itens no carrinho</p>
                          </div>
                        }
                      </ul>
                    </div>
                  </div>
                </div>

                {/* bot cart */}
                <Form>
                  <div>
                    {devedor > 0 &&
                      <>
                        <div className='mx-3 d-flex justify-content-between'>
                          <h4>Total Ítem</h4>
                          <h4>R$ {Number(total).toFixed(2).replace(".", ",")}</h4>
                        </div>
                        <div className='mx-3 px-3 py-2 mb-2 rounded-3 d-flex justify-content-between total-dev'>
                          <div className='d-flex gap-2' title='O saldo devedor deverá ser pago, sendo apenas por dinheiro ou PIX.'>
                            <h4 className='mb-0'>SALDO DEVEDOR</h4>
                            <i className="bi bi-info-circle"></i>
                          </div>
                          <h4 className='mb-0'>R$ {formatValue({value: (devedor).toString(), groupSeparator: '.', decimalSeparator: ',', decimalScale: 2})}</h4>
                        </div>
                      </>
                    }
                    <div className='mx-3 d-flex justify-content-between align-items-baseline'>
                      <h4 className='fw-light m-0'>Total</h4>
                      <div className=' flex-grow-1 mx-2' style={{borderBottom:'2px dotted #b3b3b3b2'}}></div>
                      <h4 className='vaCor m-0'>{formatValue({value: (Number(total) + devedor || 0).toFixed(2), groupSeparator: '.', decimalSeparator: ',',decimalScale: 2, prefix: 'R$ '})}</h4>
                    </div>

                    <div className='formPag mx-3'>
                      <h5>Formas de pagamento:</h5>
                      <div className='d-flex gap-2'>
                        {lista.map((i,k)=>(
                          <PaymentCard
                            key={k}
                            keyK={k}
                            nome={i.nome}
                            paymentCheck={paymentCheck}
                            setPaymentCheck={setPaymentCheck}
                          />
                          ))}
                      </div>
                        <Feedback type="invalid" style={{ display: errors.radio && touched.radio ? 'block' : 'none' }}>
                          {errors.radio}
                        </Feedback>
                    </div>

                    {/* form */}
                    <div className='mx-3 mt-4 pt-2 row'>
                      {/* <div className='mb-4 p-0  fw-bold fs-5'>Cadastro da compra:</div> */}
                      <div className='col-sm-6 ps-0'>
                        <div className='p-0 mb-1 custom-input'>
                          <p>CPF/CNPJ</p>
                          <OtherField name="cpf" onChange={(e:any)=>handleCpfCnpjChange(e.target.value, setFieldValue, pagador)} values={values.cpf} className="form-control form-control-borderless"  />
                        </div>
                        <Feedback type="invalid" style={{ display: errors.cpf && touched.cpf ? 'block' : 'none' }}>
                          {errors.cpf}
                        </Feedback>
                      </div>
                      <div className='col-sm-6 pe-0'>
                        <div className='p-0 custom-input'>
                          <p>E-mail</p>
                          <Field name="email" type="email" className="form-control form-control-borderless" />
                        </div>
                          <Feedback type="invalid" style={{ display: errors.email && touched.email ? 'block' : 'none' }}>
                            {errors.email}
                          </Feedback>
                      </div>
                      <div className='col-sm-12 px-0 mt-4 mb-1 '>
                        <div className='p-0 custom-input' title={values.nome}>
                          <p>Nome</p>
                          <Field name="nome" className="form-control form-control-borderless" />
                        </div>
                        <Feedback type="invalid" style={{ display: errors.nome && touched.nome ? 'block' : 'none' }}>
                          {errors.nome}
                        </Feedback>
                      </div>
                    </div>
                    <button 
                      className='mx-3 my-3 fs-4 text-light btn-original'
                      style={{fontFamily:'Raleway'}}
                      type='submit' 
                      onClick={()=>submitForm()} 
                      disabled={paymentCheck === null || (Number(total) + devedor) === 0}
                    >
                      FINALIZAR COMPRA
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          )}
        </Formik>
      </div>

      {end && (
        <ModalEnd
          setEnd={setEnd}
          mode={paymentCheck}
          list={servicosCart}
          total={total}
          devedor={devedor}
          pagador={pagador}
          codesearch={codeSearch}
          setServicosCart={setServicosCart}
          setPaymentCheck={setPaymentCheck}
          paymentCheck={paymentCheck}
          formikForm={formikForm}
          setDevedor={setDevedor}
          setCodeSearch={setCodeSearch}
          menuValue={menuValue}
        />
      )}
      {history &&
        <ModalHistory setHistory={setHistory} history={history} pagador={pagador} />
      }
      {historyUser &&
        <ModalHistory setHistoryUser={setHistoryUser} historyUser={historyUser} pagador={pagador} />
      }
      {detailsCart &&
        <ModalCart setDetailsCart={setDetailsCart} list={servicosCart} total={total} paymentCheck={paymentCheck} />
      }
    </section>
  )
}

export default App