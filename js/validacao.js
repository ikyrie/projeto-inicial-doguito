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
    cpf: input => validaCPF(input),
    cep: input => recuperarCep(input)
}

const tiposDeErro = [
    "valueMissing",
    "customError",
    "typeMismatch",
    "tooShort",
    "patternMismatch"
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
        patternMismatch: "A senha deve conter entre 8 e 12 caractéres e deve conter um número e uma letra maiúscula."
    },
    nome: {
        valueMissing: "O nome não pode estar vazio"
    },
    cpf: {
        valueMissing: "O CPF não pode estar vazio",
        customError: "O CPF não é válido"
    },
    cep: {
        valueMissing: "O CEP não pode estar vazio",
        patternMismatch: "O CEP não é válido"
    },
    logradouro: {
        valueMissing: "O logradouro não pode estar vazio"
    },
    cidade: {
        valueMissing: "A cidade não pode estar vazia"
    },
    estado: {
        valueMissing: "O estado não pode estar vazio"
    },
    preco: {
        valueMissing: "O preço não pode estar vazio"
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
    let mensagem = ''

    if(!maiorQue18(dataRecebida)) {
        mensagem = 'Você deve ser maior de 18 anos para se cadastrar'
    }
    
    input.setCustomValidity(mensagem)
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
    let mensagem = ''

    if(!checaCPFComNumerosRepetidos(cpfFormatado) || !checaEstruturaDeCPF(cpfFormatado)) {
        mensagem = 'Este CPF é inválido'
    } 

    input.setCustomValidity(mensagem)
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

function checaEstruturaDeCPF(cpf) {
    let valido = false
    const multiplicador = 10

    valido = checaDigitoVerificadorCPF(cpf, multiplicador)
    
    return valido
}

function checaDigitoVerificadorCPF(cpf, multiplicador) {
    if(multiplicador >= 12) {
        return true
    }

    let soma = 0
    let contador = 0
    const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('')
    const digitoVerificador = cpf.charAt(multiplicador - 1)
    for(; multiplicador > 1 ; multiplicador--) {
        soma = soma + cpfSemDigitos[contador] * multiplicador
        contador++
    }

    if(confirmaDigito(soma) == digitoVerificador) {
        return checaDigitoVerificadorCPF(cpf, multiplicador + 1)
    }

    return false
}

function confirmaDigito(soma) {
    if(soma % 11 > 9) {
        return 0
    }
    return 11 - (soma % 11)
}

function recuperarCep(input) {
    const cep = input.value.replace(/\D/g, '')
    const url = `https://viacep.com.br/ws/${cep}/json/`
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }

    if(input.validity.valid) {
        fetch(url, options).then(
            response => response.json()
        ).then(
            data => {
                if(data.erro) {
                    input.setCustomValidity('O CEP não é válido')
                    return
                }

                preencheCamposComCep(data)
                input.setCustomValidity('')
                return
            }
        )
    }
}

function preencheCamposComCep(data) {
    const logradouro = document.querySelector('[data-tipo="logradouro"]')
    const cidade = document.querySelector('[data-tipo="cidade"]')
    const estado = document.querySelector('[data-tipo="estado"]')

    logradouro.value = data.logradouro
    cidade.value = data.localidade
    estado.value = data.uf
}
