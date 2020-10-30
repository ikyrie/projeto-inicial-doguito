import { valida } from './validacao.js'

const inputs = document.querySelectorAll('input')

inputs.forEach( input => {
    input.addEventListener('blur', (e) => {
        valida(e.target)
    })
})
