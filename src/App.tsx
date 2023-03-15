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
import Select, { MultiValue, PropsValue, SingleValue } from 'react-select'
import MaskedInput from "react-text-mask";


const validation = Yup.object().shape({
    pagamento: Yup.number().required('Preencha a forma de pagamento')
  })
const validationPix = Yup.object().shape({
    nome: Yup.string().required('Preencha o campo Nome'),
    cpf: Yup.string(),
    unidade: Yup.string().required('Preencha o campo Unidade'),
    local: Yup.string().required('Preencha o campo Local'),
    pagamento: Yup.number().required('Preencha a forma de pagamento')
  })


function App() {
  const [end, setEnd] = useState<boolean>(false)
  const [history, setHistory] = useState<boolean>(false)
  const [historyUser, setHistoryUser] = useState<boolean>(false)
  const [detailsCart, setDetailsCart] = useState<boolean>(false)
  const [servicos, setServicos] = useState<servicos[]>([])
  const [servicosCart, setServicosCart] = useState<servicos[]>([])
  const [search, setSearch] = useState<string>('')
  const [searchName, setSearchName] = useState<boolean>(false)
  const [optionsUser, setOptionsUser] = useState<Array<{value:number|string, label:string}>>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number | string>(0)
  const [type, setType] = useState<string>("1")
  const [saldo, setSaldo] = useState<number>(0)
  const [pagador, setPagador] = useState<pagador>()
  const [pagadorName, setPagadorName] = useState<String>('')
  const [avulsa, setAvulsa] = useState<Boolean>(false)
  const [paymentCheck, setPaymentCheck] = useState<number | null>(null)
  const [codeSearch, setCodeSearch] = useState<string>('')
  const inputSearch = useRef<HTMLInputElement>(null)
  const formikForm = useRef(null)
  const lista = [
    {nome:'Dinheiro'},
    {nome:'Cartão'},
    {nome:'PIX'},
    {nome:'Conta'},
  ]


  useEffect(() => {
    (async () => {
      inputSearch.current?.focus()

      let res = await axios.get('getProdutos')
      setServicos(res.data)
    })()
  }, [])
  
    // total da compra
  useEffect(() => {
    let total = 0
    
    total = servicosCart.map(item => Number(item.preco_venda) * Number(item.qtd)).reduce((sum, a) => sum + a, 0)
    setTotal(Number(total).toFixed(2))
  }, [servicosCart, paymentCheck])



  // const handleInputMenuChange = (value:any) => {
  //   if(value != '' && value.length >= 3) {
  //     inputSearchNameFunction(value)
  //   }
  // }
  // const inputSearchNameFunction = useCallback(
	// 	debounce(async (value) => {
  //     try {
  //       setIsLoading(true)
  //       setMenuValueName(value)
  //       setSaldo(0)
  
  //       let res = await axios.get(`/api/apoio/pessoas/${value}`)
  //       let opt = [...res?.data].map(user => ({value:{...user}, label:user.nome_cartao}))
  //       setOptionsUser(opt)

  //       setIsLoading(false)
  //     } catch (error) {
        
  //     }
  //   }, 1500),
	// 	[]
	// )
  const handleOpenUser = async (type:string) => {

    if(!optionsUser[0]){
      setIsLoading(true)
      try {
        let {data} = await axios.get(`getAlunos`)
        let opt = [...data].map(user => ({value:{...user}, label:user.nome}))
        setOptionsUser(opt)
      } catch (error) {
        
      }
      setIsLoading(false)
    } else {
      // setOptionsUser([])
    }
  }
  const HandleMenuChange = async (value:any, setFieldValue:(field: string, value: any, shouldValidate?: boolean | undefined)=>void) => {
    inputSearchNameChange(value, setFieldValue)
  }
  const inputSearchNameChange = useCallback(
    debounce(async (value, setFieldValue) => {

      setSaldo(0)
      let date = new Date()      
      let year = date.toLocaleString("default", { year: "numeric" })
      let month = date.toLocaleString("default", { month: "2-digit" })
      let day = date.toLocaleString("default", { day: "2-digit" })
      let hours = date.toLocaleString("default", { hour: "2-digit" })
      let minutes = date.toLocaleString("pt-br", { minute: "2-digit" })
      if (parseInt(minutes) < 10) minutes = `0${minutes}`      

      toast.success(`Encontramos: ${value.label}`, {
        autoClose:2000
      })
      setSearch('')
      setPagadorName(value.label)
      setPaymentCheck(null)
      setSaldo(Number(value.value.saldo))
      setPagador({
        data: `${year}-${month}-${day}T${hours}:${minutes}`,
        aluno_id: value.value.id,
        cliente_id:'',
        pagamento:1
      })
      
    }, 1000),
		[]
  )
  const handleAvulsa = () => {
    let date = new Date()      
    let year = date.toLocaleString("default", { year: "numeric" })
    let month = date.toLocaleString("default", { month: "2-digit" })
    let day = date.toLocaleString("default", { day: "2-digit" })
    let hours = date.toLocaleString("default", { hour: "2-digit" })
    let minutes = date.toLocaleString("pt-br", { minute: "2-digit" })
    if (parseInt(minutes) < 10) minutes = `0${minutes}`  

    setSearch('')
    setPagadorName('Compra avulsa')
    setPaymentCheck(null)
    setSaldo(0)
    setAvulsa(true)
    setPagador({
      data: `${year}-${month}-${day}T${hours}:${minutes}`,
      aluno_id: 0,
      cliente_id:'',
      pagamento:1
    })
  }

  const colourStyles = {
    control: (styles:any) => ({ ...styles, backgroundColor: 'white', height:'100%' }),
    option: (styles:any, { data, isDisabled, isFocused, isSelected, isHover }:any) => {
      return {
        ...styles,
        backgroundColor:isFocused ? '#f1f6fb' : 'white',
        borderBottom:'1px solid var(--bs-gray-400)',
        padding:'5px',
        color: 'black',
        cursor: isDisabled ? 'not-allowed' : 'default'
      };
    },
    menu: (styles:any) => ({
      ...styles, 
      boxShadow: '0 .5rem 2rem rgba(0, 10, 36, 0.158)!important',
      marginTop: 10,
      borderRadius:'0.375rem',
      overflow:'hidden'
    }),
    menuList: (styles:any) => ({
      ...styles,
      backgroundColor: 'white',
      padding:5
    }),
  };

  console.log(pagador);
  

  return (
    <section>
      <ToastContainer/>
      <div className="container-fluid" style={end ? {filter:'blur(3px)'}:{}}>
        <Formik
          initialValues={{ data: '', pagamento:1, cliente_id:'', aluno_id:'' }}
          validationSchema={paymentCheck === 2 ? validationPix : validation}
          onSubmit={(values: pagador, { setSubmitting }) => {
            // let cpf = values.cpf.replaceAll('.','').replace('-','')
            // setPagador({...values, cpf})
            // setPagador(values)
            setEnd(true)
            setSubmitting(false)
          }}
          innerRef={formikForm}
          enableReinitialize
        >
          {({ setFieldValue, errors, touched, values, submitForm }) => (
            <div className="row" style={{height:'100vh'}}>

              {/* left */}
              <div className="col-sm-12 col-md-6 col-lg-7 col-xl-8" style={{height:'100vh'}}>

                {/* search */}
                <div className="row m-3" style={{height:70}}>
                  <div className="col card border-0 p-0 shadow-sm">
                    <div className="card-body p-0 d-flex align-items-center">

                      <div className="col-sm-1 p-3 ps-4">
                        <i className="bi bi-search h4 text-body"></i>
                      </div>

                      <div className="d-flex h-100 col-sm-10">
                        {!searchName ?
                          <input
                            className="form-control-borderless col-sm-10 me-5"
                            type="search"
                            placeholder="Buscar produto"
                            onChange={e => setSearch(e.target.value)}
                            ref={inputSearch}
                            value={search}
                          />
                          :
                          <Select
                            className='basic-single col-xxl-10 col-xl-9 col-lg-8 col-md-5 col-sm-8 pe-3 h-100'
                            styles={colourStyles}
                            unstyled
                            options={optionsUser}
                            menuPlacement='bottom' 
                            name="searchName"
                            placeholder="Digite um nome..."
                            isLoading={isLoading}
                            onMenuOpen={()=>handleOpenUser(type)}
                            onChange={(v)=>HandleMenuChange(v, setFieldValue)}
                            noOptionsMessage={() => "Sem resultados"}
                          />
                        }
                        <div className='d-flex gap-1 align-items-center position-absolute' style={{right:30, top:20}}>
                          <input type="checkbox" name="seachName" id="searchName" style={{width:20, height:28}} onChange={()=>setSearchName(!searchName)} />
                          <select name="type" onChange={v=>{setType(v.target.value), handleOpenUser(v.target.value)}} className="border-0 fw-bold" style={{color:'#2c5028', fontSize:'1rem', outline:0}}>
                            <option value={1}>Buscar Alunos</option>
                            <option value={2}>Buscar Clientes</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* itens */}
                <div className='pe-4 ps-3 me-3' style={{height:'calc(100vh - 120px)', overflow:'auto'}}>
                  <div className="row track">
                    {servicos.filter(e =>  e.nome?.toLowerCase().includes(search.toLowerCase())).map(servico => (
                        <ServiceCard
                          key={servico.id}
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
              <div className="col-sm-12 col-md-6 col-lg-5 col-xl-4" style={{height:'100vh', overflowY:'auto'}}>

                {/* top cart */}
                <div className="col m-3 p-3 bg-white shadow-sm rounded d-flex align-items-center justify-content-between" style={{height:70}}>
                  
                  {/* <button className='btn d-flex gap-2 align-items-center' title='Histórico' onClick={_=>setHistory(true)}>
                    <i className="bi bi-clock fs-5"></i>
                  </button> */}
                    {pagador ?
                      <>
                        <div className='m-0 px-2 d-flex align-items-center gap-2'>
                          <i className="bi bi-person-circle text-black fs-5"></i>
                          {pagadorName}
                        </div>
                        <div>Saldo: <b>R$ {formatValue({value: (saldo).toString(), groupSeparator: '.', decimalSeparator: ',', decimalScale: 2})}</b></div>
                      </>
                      :
                      <button type='button' onClick={_=>handleAvulsa()} className='m-0 btn btn-light py-1 shadow-sm d-flex align-items-center gap-2'>
                        <i className="bi bi-person-circle text-black fs-5"></i>
                        Compra avulsa
                      </button>
                    }
                  
                </div>
                

                {/* mid cart */}
                <div className="col" >
                  <div className='p-3 m-3 bg-white shadow-sm rounded'>
                    <div className='d-flex justify-content-between'>
                      <button className='btn px-1' title='Carrinho' onClick={_ => setDetailsCart(!detailsCart)}>
                        <i className="bi bi-cart3 badge-custom fs-5 d-flex align-items-center justify-content-center" data-value={servicosCart.length}></i>
                      </button>
                      <button type="button" className="btn btn-light py-1 shadow-sm" style={{color:'rgb(230, 65, 92)'}} onClick={_ => setServicosCart([])}>
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
                          <div>
                            <p className='d-flex justify-content-center mb-0 text-secondary h-100 align-items-center' style={{fontSize:18}}>Sem itens no carrinho</p>
                          </div>
                        }
                      </ul>
                    </div>
                  </div>
                </div>


                {/* bot cart */}
                <Form>
                  <div>
                    <div className='mx-3 px-3 d-flex justify-content-between'>
                      <h4>TOTAL</h4>
                      <h4>{
                        formatValue({
                          value: (Number(total)).toFixed(2), 
                          groupSeparator: '.', 
                          decimalSeparator: ',',
                          decimalScale: 2, 
                          prefix: 'R$ '
                        })
                        }
                      </h4>
                    </div>

                    <div className='mx-3 p-3 rounded' style={{backgroundColor:'#C5E1A5'}}>
                      <p className='mb-2 fw-bold'>Formas de pagamento:</p>
                      <div className='d-flex gap-2'>
                        {lista.map((i,k)=>(
                          <PaymentCard
                            key={k}
                            keyK={k}
                            nome={i.nome}
                            paymentCheck={paymentCheck}
                            setPaymentCheck={setPaymentCheck}
                            pagador={pagador}
                            avulsa={avulsa}
                          />
                          ))}
                      </div>
                        <Feedback type="invalid" style={{ display: errors.pagamento && touched.pagamento ? 'block' : 'none' }}>
                          {errors.pagamento}
                        </Feedback>
                    </div>

                    {/* form */}
                    <button 
                      className='mx-3 my-3 fs-4 text-light btn-original' 
                      type='submit' 
                      onClick={()=>submitForm()} 
                      disabled={paymentCheck === null || Number(total) === 0 || !pagador}
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
          saldo={saldo}
          pagador={pagador}
          setPagador={setPagador}
          codesearch={codeSearch}
          setServicosCart={setServicosCart}
          setPaymentCheck={setPaymentCheck}
          paymentCheck={paymentCheck}
          formikForm={formikForm}
          setSaldo={setSaldo}
          setCodeSearch={setCodeSearch}
        />
      )}
      {/* {history &&
        <ModalHistory setHistory={setHistory} history={history} pagador={pagador} />
      }
      {historyUser &&
        <ModalHistory setHistoryUser={setHistoryUser} historyUser={historyUser} pagador={pagador} />
      } */}
      {detailsCart &&
        <ModalCart setDetailsCart={setDetailsCart} list={servicosCart} total={total} paymentCheck={paymentCheck} />
      }
    </section>
  )
}

export default App