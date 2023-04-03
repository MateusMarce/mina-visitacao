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



const validation = Yup.object().shape({
    nome: Yup.string().required('Preencha o campo Nome'),
    cpf: Yup.string(),
    unidade: Yup.string().required('Preencha o campo Unidade'),
    local: Yup.string().required('Preencha o campo Local'),
    radio: Yup.number().required('Preencha a forma de pagamento')
  })
const validationPix = Yup.object().shape({
    nome: Yup.string().required('Preencha o campo Nome'),
    cpf: Yup.string().required('Preencha o campo CPF'),
    unidade: Yup.string().required('Preencha o campo Unidade'),
    local: Yup.string().required('Preencha o campo Local'),
    radio: Yup.number().required('Preencha a forma de pagamento')
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
  const [options, setOptions] = useState<Array<{value:number|string, label:string}>>([])
  const [optionsUser, setOptionsUser] = useState<Array<{value:number|string, label:string}>>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number | string>(0)
  const [devedor, setDevedor] = useState<number>(0)
  const [pagador, setPagador] = useState<pagador>()
  const [colaborador, setColaborador] = useState<boolean>(false)
  const [locais, setLocais] = useState<Array<any>>([])
  const [paymentCheck, setPaymentCheck] = useState<number | null>(null)
  const [codeSearch, setCodeSearch] = useState<string>('')
  const [menuValue, setMenuValue] = useState<{value:number|string, label:string}>({value:0, label:''})
  const [menuValueName, setMenuValueName] = useState<{value:number|string, label:string}>({value:0, label:''})
  const inputSearch = useRef<HTMLInputElement>(null)
  const formikForm = useRef(null)
  const params = location.pathname.split('/')[2]
  const lista = [
    {nome:'SATC'},
    {nome:'Dinheiro'},
    {nome:'PIX'},
    {nome:'Conta'},
  ]


  useEffect(() => {
    (async () => {
      inputSearch.current?.focus()

      let res = await axios.get('/api/apoio/servicos')
      setServicos(res.data)
      let resl = await axios.get('/api/apoio/locais')
      setLocais(resl.data)
      let res2 = await axios.get('/api/apoio/unidades')
      let opt = [0, ...res2?.data].map(local => ({value:local.i_unidade, label:local.nome}))
      setOptions(opt)

      //atualiza
      // await axios.post(`/api/apoio/set-atualizacao`, {
      //   i_local: params
      // })

    })()
  }, [])
  

  // total da compra
  useEffect(() => {
    let total = 0
    
    if(paymentCheck === 0) {

      total = servicosCart.map(item => item.valor_custo * Number(item.qtd)).reduce((sum, a) => sum + a, 0)
    } else {
      total = servicosCart.map(item => item.valor * Number(item.qtd)).reduce((sum, a) => sum + a, 0)
    }
    setTotal(Number(total).toFixed(3))
  }, [servicosCart, paymentCheck])



  const handleChangeInputSearch = async (value: string, setFieldValue: any, inputs: pagador) => {
    let {data} = await axios.get(`/api/apoio/atualizacao/${params}/${APP_VERSION}`)
    // let data = {status:false}

    if(data.status) {
      setSearch('')
      setFieldValue('searchName', '')
      toast.error(<>
        <div className='row'>
          <h5 className='fw-bold'>Atualização disponível!</h5>
          <small>Dê um CTRL+F5 para recarregar a página.</small>
        </div>
      </>, {
        position:'top-center',
        autoClose:false,
        style:{width:500},
        bodyStyle:{textAlign:'center'}
      })
    } else {
      let regex = /[c|a|f][0-9]+/i;
      let valor = value
      valor.replace('00','')
      valor.replace('000','')
      valor.replace('0000','')
      valor.replace('00000','')
      valor.replace('000000','')
      
      if(regex.test(valor) === true) {
        inputSearchFunction(value, setFieldValue, inputs)
      }
      setSearch(value)
    }
  
  }
  
  const inputSearchFunction = useCallback(
    debounce(async (value, setFieldValue, inputs) => {

      setSearch(value)
      setDevedor(0)
      let date = new Date()      
      let year = date.toLocaleString("default", { year: "numeric" })
      let month = date.toLocaleString("default", { month: "2-digit" })
      let day = date.toLocaleString("default", { day: "2-digit" })
      let hours = date.toLocaleString("default", { hour: "2-digit" })
      let minutes = date.toLocaleString("pt-br", { minute: "2-digit" })
      if (parseInt(minutes) < 10) minutes = `0${minutes}`


      if (value.length == 8) {
        let res = await axios.get(`/api/apoio/pessoa/${value}`)
        let res2 = await axios.get('/api/apoio/unidades')

        if (Object.keys(res.data).length !== 0) {
          toast.success(`Encontramos: ${res.data.nome_cartao}`, {
            isLoading: false, 
            autoClose: 2000
          })
          setSearch('')
          setFieldValue('nome', res.data.nome_cartao)
          setFieldValue('cpf', res.data.cpf)
          setFieldValue('data', `${year}-${month}-${day}T${hours}:${minutes}`)
          setFieldValue('unidade', res.data.i_unidade || 2000003)
          setMenuValue({value:res.data.i_unidade || 2000003, label:res2.data.filter((i:any)=>i.i_unidade == (res.data.i_unidade || 2000003))[0].nome})
          setFieldValue('local', parseFloat(params) || inputs.local || 0)
          setCodeSearch(value.toUpperCase())
          setPaymentCheck(null)
          setDevedor(res.data.devedor)
          setPagador({
            cpf: res.data.cpf,
            data: `${year}-${month}-${day}T${hours}:${minutes}`,
            nome: res.data.nome_cartao,
            local: parseFloat(params) || inputs.local || 0,
            unidade: res.data.i_unidade || 2000003,
            tipo: res.data.tipo,
            radio:1
          })
        } else {
        }
      }
      if (value.length == 7 && value.toUpperCase() != 'C99') {
        value = `0${value}`
        let res = await axios.get(`/api/apoio/pessoa/${value}`)
        let res2 = await axios.get('/api/apoio/unidades')

        if (Object.keys(res.data).length !== 0) {
          toast.success(`Encontramos: ${res.data.nome_cartao}`, {
            isLoading: false, 
            autoClose: 2000
          })
          setSearch('')
          setFieldValue('nome', res.data.nome_cartao)
          setFieldValue('cpf', res.data.cpf)
          setFieldValue('data', `${year}-${month}-${day}T${hours}:${minutes}`)
          setFieldValue('unidade', res.data.i_unidade || 2000003)
          setMenuValue({value:res.data.i_unidade || 2000003, label:res2.data.filter((i:any)=>i.i_unidade == (res.data.i_unidade || 2000003))[0].nome})
          setFieldValue('local', parseFloat(params) || inputs.local || 0)
          setCodeSearch(value.toUpperCase())
          setPaymentCheck(null)
          setDevedor(res.data.devedor)
          setPagador({
            cpf: res.data.cpf,
            data: `${year}-${month}-${day}T${hours}:${minutes}`,
            nome: res.data.nome_cartao,
            local: parseFloat(params) || inputs.local || 0,
            unidade: res.data.i_unidade || 2000003,
            tipo: res.data.tipo,
            radio:1
          })
        } else {
        }
      }
      if (value.length == 6 && value.toUpperCase() != 'C99') {
        value = `00${value}`
        let res = await axios.get(`/api/apoio/pessoa/${value}`)
        let res2 = await axios.get('/api/apoio/unidades')
        console.log(res.data.i_unidade || 2000003 || 2000003)

        if (Object.keys(res.data).length !== 0) {
          toast.success(`Encontramos: ${res.data.nome_cartao}`, {
            isLoading: false, 
            autoClose: 2000
          })
          setSearch('')
          setFieldValue('nome', res.data.nome_cartao)
          setFieldValue('cpf', res.data.cpf)
          setFieldValue('data', `${year}-${month}-${day}T${hours}:${minutes}`)
          setFieldValue('unidade', res.data.i_unidade || 2000003)
          setMenuValue({value:(res.data.i_unidade || 2000003 ), label:res2.data.filter((i:any)=>i.i_unidade == (res.data.i_unidade || 2000003))[0].nome})
          setFieldValue('local', parseFloat(params) || inputs.local || 0)
          setCodeSearch(value.toUpperCase())
          setPaymentCheck(null)
          setDevedor(res.data.devedor)
          setPagador({
            cpf: res.data.cpf,
            data: `${year}-${month}-${day}T${hours}:${minutes}`,
            nome: res.data.nome_cartao,
            local: parseFloat(params) || inputs.local || 0,
            unidade: res.data.i_unidade || 2000003,
            tipo: res.data.tipo,
            radio:1
          })
        } else {
        }
      }
      if (value.length == 5 && value.toUpperCase() != 'C99') {
        value = `000${value}`
        let res = await axios.get(`/api/apoio/pessoa/${value}`)
        let res2 = await axios.get('/api/apoio/unidades')

        if (Object.keys(res.data).length !== 0) {
          toast.success(`Encontramos: ${res.data.nome_cartao}`, {
            isLoading: false, 
            autoClose: 2000
          })
          setSearch('')
          setFieldValue('nome', res.data.nome_cartao)
          setFieldValue('cpf', res.data.cpf)
          setFieldValue('data', `${year}-${month}-${day}T${hours}:${minutes}`)
          setFieldValue('unidade', res.data.i_unidade || 2000003)
          setMenuValue({value:res.data.i_unidade || 2000003, label:res2.data.filter((i:any)=>i.i_unidade == (res.data.i_unidade || 2000003))[0].nome})
          setFieldValue('local', parseFloat(params) || inputs.local || 0)
          setCodeSearch(value.toUpperCase())
          setPaymentCheck(null)
          setDevedor(res.data.devedor)
          setPagador({
            cpf: res.data.cpf,
            data: `${year}-${month}-${day}T${hours}:${minutes}`,
            nome: res.data.nome_cartao,
            local: parseFloat(params) || inputs.local || 0,
            unidade: res.data.i_unidade || 2000003,
            tipo: res.data.tipo,
            radio:1
          })
        } else {
        }
      }
      if (value.length == 4 && value.toUpperCase() != 'C99') {
        value = `0000${value}`
        let res = await axios.get(`/api/apoio/pessoa/${value}`)
        let res2 = await axios.get('/api/apoio/unidades')

        if (Object.keys(res.data).length !== 0) {
          toast.success(`Encontramos: ${res.data.nome_cartao}`, {
            isLoading: false, 
            autoClose: 2000
          })
          setSearch('')
          setFieldValue('nome', res.data.nome_cartao)
          setFieldValue('cpf', res.data.cpf)
          setFieldValue('data', `${year}-${month}-${day}T${hours}:${minutes}`)
          setFieldValue('unidade', res.data.i_unidade || 2000003)
          setMenuValue({value:res.data.i_unidade || 2000003, label:res2.data.filter((i:any)=>i.i_unidade == (res.data.i_unidade || 2000003))[0].nome})
          setFieldValue('local', parseFloat(params) || inputs.local || 0)
          setCodeSearch(value.toUpperCase())
          setPaymentCheck(null)
          setDevedor(res.data.devedor)
          setPagador({
            cpf: res.data.cpf,
            data: `${year}-${month}-${day}T${hours}:${minutes}`,
            nome: res.data.nome_cartao,
            local: parseFloat(params) || inputs.local || 0,
            unidade: res.data.i_unidade || 2000003,
            tipo: res.data.tipo,
            radio:1
          })
        } else {
        }
      }
      if (value.length == 3 && value.toUpperCase() != 'C99') {
        value = `00000${value}`
        let res = await axios.get(`/api/apoio/pessoa/${value}`)
        let res2 = await axios.get('/api/apoio/unidades')

        if (Object.keys(res.data).length !== 0) {
          toast.success(`Encontramos: ${res.data.nome_cartao}`, {
            isLoading: false, 
            autoClose: 2000
          })
          setSearch('')
          setFieldValue('nome', res.data.nome_cartao)
          setFieldValue('cpf', res.data.cpf)
          setFieldValue('data', `${year}-${month}-${day}T${hours}:${minutes}`)
          setFieldValue('unidade', res.data.i_unidade || 2000003)
          setMenuValue({value:res.data.i_unidade || 2000003, label:res2.data.filter((i:any)=>i.i_unidade == (res.data.i_unidade || 2000003))[0].nome})
          setFieldValue('local', parseFloat(params) || inputs.local || 0)
          setCodeSearch(value.toUpperCase())
          setPaymentCheck(null)
          setDevedor(res.data.devedor)
          setPagador({
            cpf: res.data.cpf,
            data: `${year}-${month}-${day}T${hours}:${minutes}`,
            nome: res.data.nome_cartao,
            local: parseFloat(params) || inputs.local || 0,
            unidade: res.data.i_unidade || 2000003,
            tipo: res.data.tipo,
            radio:1
          })
        } else {
        }
      }
      if (value.length == 3 && value.toUpperCase() == 'C99') {
        toast.success(`Encontramos: Externo`, {
          isLoading: false, 
          autoClose: 2000
        })
        setPaymentCheck(null)
        setSearch('')
        setFieldValue('nome', '')
        setFieldValue('cpf', '')
        setCodeSearch(value.toUpperCase())
        setFieldValue('unidade', 2000003)
        setFieldValue('local', parseFloat(params) || inputs.local)
        setFieldValue('data', `${year}-${month}-${day}T${hours}:${minutes}`)
        setPagador({
          cpf: '',
          data: `${year}-${month}-${day}T${hours}:${minutes}`,
          nome: '',
          local: parseFloat(params),
          unidade: 2000003,
          tipo: 'E',
          radio:1
        })
      }
    }, 1000),
		[]
	)

  const handleInputMenuChange =  (value:any, setFieldValue:(field: string, value: any, shouldValidate?: boolean | undefined)=>void, name:string,values:FormikValues) => {
    if(value != '' && value.length >= 3) {
      inputSearchNameFunction(value, setFieldValue, values)
    }
  }
  const inputSearchNameFunction = useCallback(
		debounce(async (value, setFieldValue, inputs) => {
      
      try {
        setIsLoading(true)
        setMenuValueName(value)
        setDevedor(0)
  
        let res = await axios.get(`/api/apoio/pessoas/${value}`)
        let {data} = await axios.get(`/api/apoio/atualizacao/${params}/${APP_VERSION}`)
        if(data.status) {
          setSearch('')
          setFieldValue('searchName', '')
          toast.error(<>
            <div className='row'>
              <h5 className='fw-bold'>Atualização disponível!</h5>
              <small>Dê um CTRL+F5 para recarregar a página.</small>
            </div>
          </>, {
            position:'top-center',
            autoClose:false,
            style:{width:500},
            bodyStyle:{textAlign:'center'}
          })
        } else {
          let opt = [...res?.data].map(user => ({value:{...user}, label:user.nome_composto}))
          setOptionsUser(opt)
        }

        setIsLoading(false)
      } catch (error) {
        
      }
    }, 1500),
		[]
	)
  const inputSearchNameChange = useCallback(
    debounce(async (value, setFieldValue, inputs) => {

      setDevedor(0)
      let date = new Date()      
      let year = date.toLocaleString("default", { year: "numeric" })
      let month = date.toLocaleString("default", { month: "2-digit" })
      let day = date.toLocaleString("default", { day: "2-digit" })
      let hours = date.toLocaleString("default", { hour: "2-digit" })
      let minutes = date.toLocaleString("pt-br", { minute: "2-digit" })
      if (parseInt(minutes) < 10) minutes = `0${minutes}`


      let res = await axios.get(`/api/apoio/pessoa/${value.value.cod_biblioteca}`)
      let res2 = await axios.get('/api/apoio/unidades')
      
      

      if (Object.keys(res.data).length !== 0) {
        toast.success(`Encontramos: ${res.data.nome_cartao}`, {
          isLoading: false, 
          autoClose: 2000
        })
        setSearch('')
        setFieldValue('nome', res.data.nome_cartao)
        setFieldValue('cpf', res.data.cpf)
        setFieldValue('data', `${year}-${month}-${day}T${hours}:${minutes}`)
        setFieldValue('unidade', res2.data.filter((i:any)=>i.i_unidade === res.data.i_unidade).i_unidade || undefined)
        setMenuValue({value: res.data.i_unidade || 2000003, label:res2.data.filter((i:any)=>i.i_unidade == (res.data.i_unidade || 2000003))[0]?.nome || undefined})
        setFieldValue('local', parseFloat(params) || inputs.local || 0)
        setCodeSearch(value.value.cod_biblioteca)
        setPaymentCheck(null)
        setDevedor(res.data.devedor)
        setPagador({
          cpf: res.data.cpf,
          data: `${year}-${month}-${day}T${hours}:${minutes}`,
          nome: res.data.nome_cartao,
          local: parseFloat(params) || inputs.local || 0,
          unidade: res.data.i_unidade || 2000003,
          tipo: res.data.tipo,
          radio:1
        })
      } else {
        toast.error(`Não foi possível encontrar alguém`, {
          isLoading: false, 
          autoClose: 2000
        })
      }
      
    }, 1000),
		[]
    )
  
  

  const HandleMenuChange = async (value:any, setFieldValue:(field: string, value: any, shouldValidate?: boolean | undefined)=>void, name:string, values?:FormikValues) => {
    if(name === 'unidade') {
      setFieldValue(name, value.value, true)
      setMenuValue(value)
    }
    if(name === 'searchName') {
      inputSearchNameChange(value, setFieldValue, values)
    }
  }



  function OtherField (props: any) {
    const [field] = useField(props.name);
    // if(pagador?.tipo === 'E') {
    //   if(props.values.replaceAll('.','').replace('-','').length === 11) {
    //     console.log('cpf',props.values.replaceAll('.','').replace('-',''));
    //   } else if(props.values.replaceAll('.','').replace('-','').length === 14) {
    //     console.log('cnpj',props.values.replaceAll('.','').replace('-',''));
    //   }
    // }
    
    return props.values.replaceAll('.','').replace('-','').length <= 11 ?
      (
          <MaskedInput mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} guide={false} {...field} {...props} />
      ) 
      :
      (
          <MaskedInput mask={[/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,'/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]} guide={false} {...field} {...props} />
      ) 
  }

  const handleCpfCnpjChange = async (value:string, setFieldValue:any, pagador:pagador|undefined) => {
    setFieldValue('cpf', value)
    
    if(pagador?.tipo === 'E') {
      if(value.replaceAll('.','').replace('-','').length === 11) {
        try {
          let res = await axios.get(`/api/apoio/get/cpf_cnpj/${value.replaceAll('.','').replace('-','')}`)
          setFieldValue('nome', res.data.nome)        
          setColaborador(res.data.colaborador)
        } catch (error) {
          
        }
      } else if(value.replaceAll('.','').replace('-','').replace('/','').length === 14) {
        try {
          let res = await axios.get(`/api/apoio/get/cpf_cnpj/${value.replaceAll('.','').replace('-','').replace('/','')}`)
          setFieldValue('nome', res.data.nome)
        } catch (error) {
          
        }
      }
    }
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

  return (
    <section>
      <ToastContainer/>
      <div className="container-fluid" style={end ? {filter:'blur(3px)'}:{}}>
        <Formik
          initialValues={{ nome: '', cpf: '', local: 0, unidade: '', data: '', radio:1, searchName:'' }}
          validationSchema={paymentCheck === 2 ? validationPix : validation}
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
              <div className="col-sm-12 col-md-6 col-lg-7 col-xl-8" style={{height:'100vh'}}>

                {/* search */}
                <div className="row m-3" style={{height:70}}>
                  <div className="col card border-0 p-0 shadow-sm">
                    <div className="card-body p-0 d-flex align-items-center">
                      <div className="col-sm-1 p-3 ps-4">
                        <i className="bi bi-search h4 text-body"></i>
                      </div>
                      <div className="d-flex h-100 col-sm-11">
                        {!searchName ?
                          <input
                            className="form-control-borderless col-sm-10 me-5"
                            type="search"
                            placeholder="Buscar usuário/produto"
                            onChange={e => handleChangeInputSearch(e.target.value, setFieldValue, values)}
                            ref={inputSearch}
                            value={search}
                          />
                          :
                          <Select
                            className='basic-single col-sm-10 pe-3 h-100'
                            styles={colourStyles}
                            unstyled
                            options={optionsUser}
                            menuPlacement='auto' 
                            name="searchName"
                            placeholder="Digite um nome..."
                            isLoading={isLoading}
                            onChange={(v)=>HandleMenuChange(v, setFieldValue, 'searchName', values)}
                            onInputChange={(v)=>handleInputMenuChange(v, setFieldValue, 'searchName', values)}
                            value={menuValueName}
                            noOptionsMessage={() => "Nenhum resultado"}
                          />
                        }
                        <div className='d-flex gap-1 align-items-center position-absolute' style={{right:30, top:20}}>
                          <input type="checkbox" name="seachName" id="searchName" style={{width:18, height:28}} onChange={()=>setSearchName(!searchName)} />
                          <label htmlFor="searchName">Buscar nome</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* itens */}
                <div className='pe-4 ps-3' style={{height:'calc(100vh - 120px)', overflow:'auto'}}>
                  <div className="row row-cols-xl-2 row-cols-lg-1 row-cols-md-1 row-cols-sm-1 row-cols-1 track">
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
              <div className="leftMine col-sm-12 col-md-6 col-lg-5 col-xl-4" style={{height:'100vh', overflowY:'auto'}}>

                {/* top cart */}
                <div className="col m-3 p-3 bg-white shadow-sm rounded d-flex align-items-center" style={{height:70}}>
                  
                  <button className='btn ' title='Histórico' onClick={_=>setHistory(true)}>
                    <i className="bi bi-clock fs-5"></i>
                  </button>
                  {codeSearch && 
                    <button className='btn d-flex align-items-center w-100' title='Histórico do pagador' onClick={()=>{pagador?.nome && setHistoryUser(true)}}>
                      <p className='m-0 me-1'>Cód: </p>
                      <div className='d-flex justify-content-between w-100'>
                        <b>{codeSearch}</b> 
                        <b>{pagador?.nome}</b>
                      </div>
                    </button>
                  }
                  
                </div>
                

                {/* mid cart */}
                <div className="col" >
                  <div className='leftMine-card-1 m-3 rounded'>
                    <div className='d-flex justify-content-between'>
                      <button className='btn px-1' title='Carrinho' onClick={_ => setDetailsCart(!detailsCart)}>
                        <i className="bi bi-cart-fill badge-custom fs-5 d-flex align-items-center justify-content-center" data-value={servicosCart.length}></i>
                      </button>
                      <button type="button" className="btn btn-mine-01 py-1" onClick={_ => setServicosCart([])}>
                        <i className="bi bi-trash3"></i> Limpar carrinho
                      </button>
                    </div>
                    <hr/>
                    <div className="col" style={{ maxHeight: '300px', overflowY: 'auto' }}>
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
                          <div className='avisoSemcompra'>
                            <i className="bi bi-emoji-frown d-flex justify-content-center"></i>
                            <p className='d-flex justify-content-center align-items-center'>Sem itens no carrinho</p>
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
                          <h4>Total ítem</h4>
                          <h4>R$ {Number(total).toFixed(paymentCheck === 0 ? 3 : 2).replace(".", ",")}</h4>
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
                    <div className='mx-3 d-flex justify-content-between'>
                      <h4 className='fw-light'>Total</h4>
                      {paymentCheck === 0 ?
                        <h4 className='vaCor'>{formatValue({value: (Number(total) || 0).toString(), groupSeparator: '.', decimalSeparator: ',', decimalScale: 3, prefix: 'R$ '})}</h4>
                        :
                        <h4 className='vaCor'>{formatValue({value: (Number(total) + devedor || 0).toFixed(2), groupSeparator: '.', decimalSeparator: ',',decimalScale: 2, prefix: 'R$ '})}</h4>
                      }
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
                            pagador={pagador}
                            setFieldValue={setFieldValue}
                            values={pagador?.unidade}
                            setMenuValue={setMenuValue}
                            options={options}
                            colaborador={colaborador}
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
                        <div className='shadow-sm p-0 mb-1 custom-input' style={{position:'relative'}}>
                          <p className='ms-3 px-2 rounded-2' style={{ position:'absolute', backgroundColor:'white', top:-18}}>CPF/CNPJ</p>
                          <OtherField name="cpf" onChange={(e:any)=>handleCpfCnpjChange(e.target.value, setFieldValue, pagador)} values={values.cpf} className="form-control form-control-borderless" disabled={codeSearch != 'C99'}  />
                        </div>
                        <Feedback type="invalid" style={{ display: errors.cpf && touched.cpf ? 'block' : 'none' }}>
                          {errors.cpf}
                        </Feedback>
                      </div>
                      <div className='col-sm-6 pe-0 mb-1'>
                        <div className='shadow-sm p-0' style={{position:'relative'}}>
                          <p className='ms-3 px-2 rounded-2' style={{ position:'absolute', backgroundColor:'white', top:-18}}>Data</p>
                          {/* <input type="datetime-local" className='form-control form-control-borderless' value={pessoa?.data} onChange={e => setPessoa({...pessoa, data: e.target.value})} /> */}
                          <Field name="data" type="datetime-local" className="form-control form-control-borderless" />
                        </div>
                      </div>
                      <div className='col-sm-6 ps-0 mt-4 mb-1 '>
                        <div className='shadow-sm p-0 custom-input' title={values.nome} style={{position:'relative'}}>
                          <p className='ms-3 px-2 rounded-2' style={{ position:'absolute', backgroundColor:'white', top:-18}}>Nome</p>
                          <Field name="nome" className="form-control form-control-borderless" disabled={codeSearch != 'C99'} />
                        </div>
                        <Feedback type="invalid" style={{ display: errors.nome && touched.nome ? 'block' : 'none' }}>
                          {errors.nome}
                        </Feedback>
                      </div>
                      <div className='col-sm-6 pe-0 mt-4'>
                        <div className='shadow-sm p-0' style={{position:'relative'}}>
                          <p className='ms-3 px-2 rounded-2' style={{ position:'absolute', backgroundColor:'white', top:-18, zIndex:1}}>Local</p>
                          <Field as="select" name="local" className='form-control form-control-borderless'>
                            {[0, ...locais].map(local => (
                              <option key={local.i_local | local} value={local.i_local}>{local.nome}</option>
                            ))}
                          </Field>

                          {/* <Select
                            className='basic-single'
                            classNamePrefix="select"
                            options={optionsLocal}
                            menuPlacement='auto' 
                            name="local"
                            onMenuOpen={HandleMenuOpen}
                            onChange={(v)=>HandleMenuChange(v, setFieldValue, 'local')}
                          /> */}
                        </div>
                          <Feedback type="invalid" style={{ display: errors.local && touched.local ? 'block' : 'none' }}>
                            {errors.local}
                          </Feedback>
                      </div>
                      <div className='col-sm-12 p-0 mt-4'>
                        <div className='shadow-sm p-0' style={{position:'relative'}}>
                          <p className='ms-3 px-2 rounded-2' style={{ position:'absolute', backgroundColor:'white', top:-18, zIndex:1}}>Unidade</p>
                          {/* <Field name="unidade" className="form-control form-control-borderless" /> */}
                          <Select
                            className='basic-single'
                            classNamePrefix="select"
                            options={options}
                            styles={colourStyles}
                            menuPlacement='auto' 
                            name="unidade"
                            onChange={(v)=>HandleMenuChange(v, setFieldValue, 'unidade')}
                            value={menuValue}
                          />
                        </div>
                        <Feedback type="invalid" style={{ display: errors.unidade && touched.unidade ? 'block' : 'none' }}>
                          {errors.unidade}
                        </Feedback>
                      </div>
                    </div>
                    <button 
                      className='mx-3 my-3 fs-4 text-light btn-original' 
                      type='submit' 
                      onClick={()=>submitForm()} 
                      disabled={paymentCheck === null || (Number(total) + devedor) === 0 || !pagador}
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