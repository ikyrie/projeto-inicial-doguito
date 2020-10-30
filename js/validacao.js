const dataDeNascimento = document.querySelector('#nascimento')

function validaData(input) {
    const dataRecebida = new Date(input.value)

    if(maiorQue18(dataRecebida)) {
        return
    } else {
        dataDeNascimento.setCustomValidity('Você deve ser maior de 18 anos para se cadastrar')
    }
}

function maiorQue18(data) {
    const dataDeHoje = new Date()
    const data18Anos = new Date(
        data.getUTCFullYear()+18,
        data.getUTCMonth(),
        data.getUTCDate()
    )
    
    return data18Anos <= dataDeHoje
}
