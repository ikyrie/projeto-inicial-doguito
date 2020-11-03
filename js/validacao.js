export function valida(input) {
    const tipoDeInput = input.dataset.tipo
    
    if(validadores[tipoDeInput]) {
        validadores[tipoDeInput](input)
    }

    if(input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido')
    } else {
        input.parentElement.classList.add('input-container--invalido')
    }
}

const validadores = {
    dataNascimento: input => validaDataNascimento(input)
}

function validaDataNascimento(input) {
    const dataRecebida = new Date(input.value)

    if(maiorQue18(dataRecebida)) {
        input.setCustomValidity('')
        return
    } else {
        input.setCustomValidity('Você deve ser maior de 18 anos para se cadastrar')
        return
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
