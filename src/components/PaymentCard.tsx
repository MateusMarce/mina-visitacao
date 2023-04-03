import { Field } from "formik"


function PaymentCard({nome, pagador, keyK, setPaymentCheck, paymentCheck, setFieldValue, values, setMenuValue, options, colaborador}:any) {

  const handleCheckPay = () => {
    const params = location.pathname.split('/')[2]
    setPaymentCheck(keyK)

    if (keyK == 0) {
      setFieldValue('local', params == '2' ? 4 : 3)
      if(pagador){
        setFieldValue('unidade', values)
        setMenuValue({value: values, label:options.filter((i:any)=>i.value == pagador.unidade)[0].label})
      } else {
        setFieldValue('unidade', 0)
        setMenuValue({value: undefined, label:undefined})
      }
    } else {
      setFieldValue('local', parseFloat(params))
      setFieldValue('unidade', 2000003)
      setMenuValue({value:2000003, label:options.filter((i:any)=>i.value == 2000003)[0].label})
    }
  }

  return (
    <div className="div-btn-input" title={nome} key={keyK} style={{position:'relative', width:'25%'}}>
      <label htmlFor={nome} className='btn-input-label'>
        {nome === 'Dinheiro' && <i className="bi bi-cash-stack d-flex justify-content-center fs-1"></i>}
        {nome === 'PIX' && <i className="bi bi-qr-code d-flex justify-content-center fs-1"></i>}
        {nome === 'Conta' && <i className="bi bi-wallet2 d-flex justify-content-center fs-1"></i>}
        {nome === 'SATC' && <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 19" width="100%" height="40">
                              <path id="path23306" fillRule="evenodd" className="ico-satc" d="m0 4l2.9 2.3v4.5l-2.9-2.4zm2.9 6.9l0.5 4.5-3.4-3.5v-3.5c0 0 2.9 2.5 2.9 2.5zm4 3.9v4l-3.5-3.4-0.5-4.5c0 0 3.9 3.9 4 3.9q0 0 0 0zm-4-8.5l-2.9-2.3 3.4-2 3.5-2 3.4 2-3.4 2-4 2.3c0 0 0.5-4.3 0.5-4.3 0 0-0.5 4.3-0.5 4.3zm10.8-2.3l-2.9 2.3c0-0.1-0.5-4.3-0.5-4.3zm-2.9 2.3q0 0 0 0zm-0.5-4.3q0 0 0 0zm0.5 4.3l2.9-2.3v4.4zm2.9 2.2v3.5l-3.4 3.4 0.5-4.5c0 0 2.9-2.4 2.9-2.4zm-6.9 6.4q0 0 0 0l3.5 0.5-3.5 3.5v-4q0 0 0 0zm3.5 0.5zm0.5-9.1l2.9 2.2-2.9 2.4zm-0.5-4.2q0 0 0 0 0 0 0 0zm0 0c0 0 0.5 4.2 0.5 4.2l-4-2.3zm0.6 4.3q0 0 0 0zm-0.6 9.1zm0.6-4.5c0 0-4 3.9-4 4l3.4 0.5z"/>
                            </svg>
        }
        <p className="d-flex justify-content-center mt-2 mb-0">{nome}</p>
      </label>
      <Field
        type="radio"
        name='radio'
        className='btn-input'
        id={nome}
        disabled={((nome == 'Conta' || nome == 'SATC') && pagador?.tipo === 'E' && !colaborador) || (nome == 'SATC' && pagador?.tipo === 'A')}
        onChange={handleCheckPay}
        value={keyK}
        checked={paymentCheck === keyK}
      />
    </div>
  )
}

export default PaymentCard