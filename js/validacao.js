export function valida(input) {
    const tipoDeInput = input.dataset.tipo
    
    if(validadores[tipoDeInput]) {
        validadores[tipoDeInput](input)
    }

    if(input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido')
        input.parentElement.querySelector('span').innerHTML = ''
    } else {
        input.parentElement.classList.add('input-container--invalido')
        input.parentElement.querySelector('span').innerHTML = pegaMensagemDeErro(tipoDeInput, input)
    }
}

const validadores = {
    dataNascimento: input => validaDataNascimento(input),
    cpf: input => validaCPF(input)
}

const tiposDeErro = [
    "valueMissing",
    "customError",
    "typeMismatch",
    "valueMissing",
    "tooShort"
]

const mensagensDeErro = {
    dataNascimento: {
        valueMissing: "A data não pode estar vazia",
        customError: "Você deve ser maior de 18 anos para se cadastrar"
    },
    email: {
        valueMissing: "O email não pode estar vazio",
        typeMismatch: "O email digitado não é válido"
    },
    senha: {
        valueMissing: "A senha não pode estar vazia",
        tooShort: "A senha é muito curta",
        typeMismatch: "A senha deve conter entre 8 e 12 caractéres e deve conter um número e uma letra maiúscula."
    },
    nome: {
        valueMissing: "O nome não pode estar vazio"
    }
}

function pegaMensagemDeErro(tipoDeInput, input) {
    let mensagem = ''    
    tiposDeErro.forEach(erro => {
        if(input.validity[erro]) {
            mensagem = mensagensDeErro[tipoDeInput][erro]
        }
    })
    return mensagem
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

function validaCPF(input) {
    const cpfFormatado = input.value.replace(/\D/g, '')

    if(checaCPFComNumerosRepetidos(cpfFormatado)) {
        input.setCustomValidity('')
        return
    } else {
        input.setCustomValidity('Este CPF é inválido')
        return
    }

}

function checaCPFComNumerosRepetidos(cpf) {
    const valoresRepetidos = [
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]

    let cpfValido = true

    valoresRepetidos.forEach(valor => {
        if(valor == cpf) {
            cpfValido = false
        } 
    })

    return cpfValido
}
