import { Field } from "formik"


function PaymentCard({nome, keyK, setPaymentCheck, paymentCheck}:any) {

  const handleCheckPay = () => {
    setPaymentCheck(keyK)
  }

  const ShowIcon = (name:string) => {
    switch (name) {
      case 'Crédito':
        return<i className="bi bi-credit-card d-flex justify-content-center fs-1"></i>
      case 'PIX':
        return<i className="bi bi-qr-code d-flex justify-content-center fs-1"></i>
      case 'Débito':
        return<i className="bi bi-credit-card-fill d-flex justify-content-center fs-1"></i>
      case 'Dinheiro':
        return<i className="bi bi-cash d-flex justify-content-center fs-1"></i>
    
      default:
        break;
    }
  }

  return (
    <div className="div-btn-input" title={nome} key={keyK} style={{position:'relative', width:'25%'}}>
      <label htmlFor={nome} className='btn-input-label'>
        {ShowIcon(nome)}
        <p className="d-flex justify-content-center mt-2 mb-0">{nome}</p>
      </label>
      <Field
        type="radio"
        name='radio'
        className='btn-input'
        id={nome}
        onChange={handleCheckPay}
        value={keyK}
        checked={paymentCheck === keyK}
      />
    </div>
  )
}

export default PaymentCard