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
	pagador,
	setServicosCart,
	setPaymentCheck,
	formikForm,
	setDevedor,
	setCodeSearch,
}: any) {
	const [troco, setTroco] = useState<string>('')
	const [timer, setTimer] = useState<number | undefined>()
	const [cancel, setCancel] = useState<boolean>(false)

	let date = new Date()
	let year = date.toLocaleString('default', { year: 'numeric' })
	let month = date.toLocaleString('default', { month: '2-digit' })
	let day = date.toLocaleString('default', { day: '2-digit' })
	let hours = date.toLocaleString('default', { hour: '2-digit' })
	let minutes = date.toLocaleString('pt-br', { minute: '2-digit' })
	var pay: string = 'PIX'

	if (parseInt(minutes) < 10) minutes = `0${minutes}`

	const handleInterval = (apoio: any) => {
		if (timer) {
			clearInterval(timer)
			setTimer(0)
		}

		const newTimer = window.setInterval(async () => {
			if (!cancel) {
				let res = await axios.get(`/api/apoio/pix/get/${apoio}`)
				if (res.data.codret === '00') {
					toast('Venda paga com successo!', {
						position: 'top-right',
						autoClose: 2000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: false,
						progress: undefined,
						theme: 'light',
						type: 'success',
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

	switch (mode) {
		case 0:
			pay = 'PIX'
			break
		case 1:
			pay = 'Crédito'
			break
		case 2:
			pay = 'Débito'
			break
		case 3:
			pay = 'Dinheiro'
	}
	const handleClickFinalizar = async () => {
		let type
		switch (mode) {
			case 0:
				type = 'P'
				break
			case 1:
				type = 'C'
				break
			case 2:
				type = 'T'
				break
			case 3:
				type = 'D'
		}
		let post = {
			pagamento: type,
			flag: type == 'D' || type == 'T' ? 'P' : 'A',
			id_local: 1,
			nome: pagador.nome,
			cpf_cnpj: pagador.cpf.replaceAll('.', '').replace('-', ''),
			vl_venda: total,
			itens: list,
		}
		try {
			await axios.post('nova-venda', post)
			toast.success('Venda realizada com sucesso!')
		} catch (error) {}
		formikForm.current?.resetForm()
		setEnd(false)
	}

	const ShowIcon = (name: string) => {
		switch (name) {
			case 'Crédito':
				return (
					<i className='bi bi-credit-card d-flex justify-content-center fs-1'></i>
				)
			case 'PIX':
				return (
					<i className='bi bi-qr-code d-flex justify-content-center fs-1'></i>
				)
			case 'Débito':
				return (
					<i className='bi bi-credit-card-fill d-flex justify-content-center fs-1'></i>
				)
			case 'Dinheiro':
				return (
					<i className='bi bi-cash d-flex justify-content-center fs-1'></i>
				)

			default:
				break
		}
	}

	return (
		<div
			className='w-100 h-100 d-flex justify-content-center align-items-center'
			style={{
				position: 'absolute',
				top: 0,
				zIndex: 999,
				backgroundColor: 'rgba(0,0,0,0.2)',
			}}>
			<div
				style={{ width: 500, backgroundColor: 'white' }}
				className='shadow-lg rounded-4 row py-3'>
				<div
					className='d-flex justify-content-end'
					style={{ height: 50 }}>
					<button
						className='btn btn-white'
						onClick={() => setEnd(false)}>
						<i className='bi bi-x-lg'></i>
					</button>
				</div>
				<div className='px-4'>
					<div className='row mb-4'>
						{ShowIcon(pay)}
						<h5
							className='d-flex justify-content-center mt-3'
							style={{ fontSize: 18 }}>
							Pagamento: {pay}
						</h5>
						<h4
							className='d-flex justify-content-center'
							style={{ fontSize: 30 }}>
							{formatValue({
								value: total.toString(),
								groupSeparator: '.',
								decimalSeparator: ',',
								prefix: 'R$ ',
								decimalScale: 2,
							})}
						</h4>
					</div>
					<div className='d-flex justify-content-between border-bottom mb-2'>
						<p className='mb-1'>{pagador.nome}</p>
						<p className='mb-1'>{`${day}/${month}/${year} ${hours}:${minutes}`}</p>
					</div>
					<div className='d-flex col-sm-12'>
						<p className='col-sm-1'>#</p>
						<p style={{ flex: 1 }}>Ingresso</p>
						<p className='col-sm-1 text-center'>Qtd</p>
						<p className='col-sm-3 text-end'>Subtotal</p>
					</div>
					{list.map((i: servicos, k: number) => (
						<div className='d-flex col-sm-12' key={k}>
							<p
								className='col-sm-1 mb-0'
								style={{ fontSize: 14 }}>
								{k + 1}
							</p>
							<p style={{ flex: 1, margin: 0, fontSize: 14 }}>
								{i.descricao}
							</p>
							<p className='col-sm-1 mb-0 text-center'>{i.qtd}</p>
							<p className='col-sm-3 mb-1 text-end'>
								{formatValue({
									value: (i.vl_ingresso * i.qtd).toString(),
									groupSeparator: '.',
									decimalSeparator: ',',
									prefix: 'R$ ',
									decimalScale: 2,
								})}
							</p>
						</div>
					))}
					<div className='border-top mt-2'>
						<div className={`d-flex justify-content-between my-2`}>
							<p className='m-0'>TOTAL</p>
							<p className='m-0'>
								{formatValue({
									value: total.toFixed(2),
									groupSeparator: '.',
									decimalSeparator: ',',
									prefix: 'R$ ',
									decimalScale: 2,
								})}
							</p>
						</div>
					</div>

					{pay == 'Dinheiro' && (
						<>
							<div className='d-flex justify-content-between mt-2 align-items-center border-top'>
								<p className='m-0'>DINHEIRO</p>
								<div className='d-flex col-sm-3'>
									<CurrencyInput
										name='myInput'
										required
										type='text'
										separator=','
										className='ms-2 form-control form-control-borderless text-end px-0 border-bottom rounded-0 py-1'
										onChange={(e: any, b: any) =>
											setTroco(b)
										}
										value={troco}
										autoFocus={true}
									/>
								</div>
							</div>
							<div
								className={`d-flex justify-content-between mt-2 mb-2 ${
									parseFloat(
										troco?.replaceAll(',', '.') || '0'
									) -
										total <
									0
										? 'total-dev px-2 py-1 rounded-3'
										: 'total-cre px-2 py-1 rounded-3'
								} `}>
								<p className='d-flex align-items-center mb-0'>
									TROCO
								</p>
								<p className='d-flex align-items-center mb-0'>
									{formatValue({
										value: (
											parseFloat(
												troco?.replaceAll(',', '.') ||
													'0'
											) - total
										).toFixed(2),
										groupSeparator: '.',
										decimalSeparator: ',',
										prefix: 'R$ ',
										decimalScale: 2,
									})}
								</p>
							</div>
						</>
					)}
				</div>

				{/* botao */}
				<div>
					{pay == 'PIX' && !cancel && (
						<button
							className='btn-original rounded-2 mx-2 text-white mt-2 py-3'
							style={{ width: 'calc(100% - 1rem)' }}
							onClick={handleClickFinalizar}>
							PAGAR COM QR CODE
						</button>
					)}
					{pay == 'PIX' && cancel && (
						<button
							className='btn btn-secondary rounded-2 mx-2 text-white mt-2 py-3'
							style={{ width: 'calc(100% - 1rem)' }}
							onClick={handleClickFinalizar}>
							CANCELAR VENDA
						</button>
					)}

					{(pay == 'Débito' || pay == 'Crédito') && (
						<button
							className='btn-original rounded-2 mx-2 text-white mt-2 py-3'
							style={{ width: 'calc(100% - 1rem)' }}
							onClick={handleClickFinalizar}>
							CONCLUIR VENDA
						</button>
					)}

					{pay == 'Dinheiro' && (
						<button
							className='btn-original rounded-2 mx-2 text-white mt-2 py-3'
							style={{ width: 'calc(100% - 1rem)' }}
							onClick={handleClickFinalizar}
							disabled={
								parseFloat(troco.replace(',', '.') || '0') < 0
							}>
							CONCLUIR VENDA
						</button>
					)}
				</div>
			</div>
		</div>
	)
}

export default ModalEnd
