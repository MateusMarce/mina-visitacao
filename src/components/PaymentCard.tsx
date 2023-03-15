import { Field } from "formik"


function PaymentCard({nome, pagador, keyK, setPaymentCheck, paymentCheck, avulsa}:any) {

  const handleCheckPay = () => {
    setPaymentCheck(keyK)
  }

  return (
    <div className="div-btn-input" title={nome} key={keyK} style={{position:'relative', width:'25%'}}>
      <label htmlFor={nome} className='btn-input-label'>
        {nome === 'Dinheiro' && <i className="bi bi-cash-stack d-flex justify-content-center fs-1"></i>}
        {nome === 'PIX' && <i className="bi bi-qr-code d-flex justify-content-center fs-1"></i>}
        {nome === 'Conta' && <i className="bi bi-wallet2 d-flex justify-content-center fs-1"></i>}
        {nome === 'Cartão' && <i className="bi bi-credit-card d-flex justify-content-center fs-1"></i>}
        <span className="d-flex justify-content-center mt-2 mb-0 fw-bold">{nome}</span>
      </label>
      <Field
        type="radio"
        name='radio'
        className='btn-input'
        id={nome}
        onChange={handleCheckPay}
        value={keyK}
        disabled={nome != 'Dinheiro' && avulsa}
        checked={paymentCheck === keyK}
      />
    </div>
  )
}

export default PaymentCard