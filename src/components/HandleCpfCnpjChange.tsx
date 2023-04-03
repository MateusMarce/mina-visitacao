import axios from "../api/axios"
import { pagador } from "../assets/types/type"

const handleCpfCnpjChange = async (value:string, setFieldValue:any, pagador:pagador|undefined) => {
    setFieldValue('cpf', value)
    
    if(pagador?.tipo === 'E') {
      if(value.replaceAll('.','').replace('-','').length === 11) {
        try {
          let res = await axios.get(`/api/apoio/get/cpf_cnpj/${value.replaceAll('.','').replace('-','')}`)
          setFieldValue('nome', res.data.nome)        
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

  export default handleCpfCnpjChange