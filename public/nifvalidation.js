document.addEventListener('DOMContentLoaded', () => {
    atualizarHistorico();
    document.getElementById('loadingMessage').style.display = 'none';
});

function validarContribuinte() {
    const numeroContribuinte = document.getElementById("nifInput").value;
    let divFeedback = document.getElementById("feedback");
    let erroEncontrado = 0;
    let tipoContribuinte = 'Desconhecido'; // Inicializa o tipo de contribuinte como desconhecido

    // Lógica de validação de NIF
    if (
        numeroContribuinte.length !== 9 || isNaN(numeroContribuinte) ||
        (numeroContribuinte.substr(0, 1) != '1' &&
         numeroContribuinte.substr(0, 1) != '2' &&
         numeroContribuinte.substr(0, 1) != '3' &&
         numeroContribuinte.substr(0, 2) != '45' && 
         numeroContribuinte.substr(0, 1) != '5' &&
         numeroContribuinte.substr(0, 1) != '6' &&
         numeroContribuinte.substr(0, 2) != '70' &&
         numeroContribuinte.substr(0, 2) != '71' &&
         numeroContribuinte.substr(0, 2) != '72' &&
         numeroContribuinte.substr(0, 2) != '77' &&
         numeroContribuinte.substr(0, 2) != '79' &&
         numeroContribuinte.substr(0, 1) != '8' &&
         numeroContribuinte.substr(0, 2) != '90' &&
         numeroContribuinte.substr(0, 2) != '91' &&
         numeroContribuinte.substr(0, 2) != '98' &&
         numeroContribuinte.substr(0, 2) != '99')
    ) {
        erroEncontrado = 1;
    } else {
        // Determinação do tipo de NIF
        if (numeroContribuinte.substr(0, 1) === '1' || numeroContribuinte.substr(0, 1) === '2' || numeroContribuinte.substr(0, 1) === '3') {
            tipoContribuinte = 'Pessoal';
        } else if (numeroContribuinte.substr(0, 2) === '45') {
            tipoContribuinte = 'Pessoal Não Residente';
        } else if (numeroContribuinte.substr(0, 1) === '5') {
            tipoContribuinte = 'Pessoa Coletiva';
        } else if (numeroContribuinte.substr(0, 1) === '6') {
            tipoContribuinte = 'Administração Pública';
        } else if (numeroContribuinte.substr(0, 2) === '70') {
            tipoContribuinte = 'Herança Indivisa';
        } else if (numeroContribuinte.substr(0, 2) === '71') {
            tipoContribuinte = 'Pessoa Coletiva Não Residente';
        } else if (numeroContribuinte.substr(0, 2) === '72') {
            tipoContribuinte = 'Fundos de Investimento';
        } else if (numeroContribuinte.substr(0, 2) === '77') {
            tipoContribuinte = 'Atribuição Oficiosa';
        } else if (numeroContribuinte.substr(0, 2) === '79') {
            tipoContribuinte = 'Regime Excepcional';
        } else if (numeroContribuinte.substr(0, 1) === '8') {
            tipoContribuinte = 'Empresário em Nome Individual (Extinto)';
        } else if (numeroContribuinte.substr(0, 2) === '90' || numeroContribuinte.substr(0, 2) === '91') {
            tipoContribuinte = 'Condomínios e Sociedades Irregulares';
        } else if (numeroContribuinte.substr(0, 2) === '98') {
            tipoContribuinte = 'Não Residentes';
        } else if (numeroContribuinte.substr(0, 2) === '99') {
            tipoContribuinte = 'Sociedades Civis';
        }
    }

    // Cálculo do dígito de verificação
    let digito1 = numeroContribuinte.substr(0, 1) * 9;
    let digito2 = numeroContribuinte.substr(1, 1) * 8;
    let digito3 = numeroContribuinte.substr(2, 1) * 7;
    let digito4 = numeroContribuinte.substr(3, 1) * 6;
    let digito5 = numeroContribuinte.substr(4, 1) * 5;
    let digito6 = numeroContribuinte.substr(5, 1) * 4;
    let digito7 = numeroContribuinte.substr(6, 1) * 3;
    let digito8 = numeroContribuinte.substr(7, 1) * 2;

    let soma = digito1 + digito2 + digito3 + digito4 + digito5 + digito6 + digito7 + digito8;
    let divisao = soma / 11;
    let modulo11 = soma - parseInt(divisao) * 11;
    let verificador = (modulo11 === 1 || modulo11 === 0) ? 0 : 11 - modulo11;

    let ultimoDigito = numeroContribuinte.substr(8, 1) * 1;
    if (ultimoDigito !== verificador) {
        erroEncontrado = 1;
    }

    if (erroEncontrado === 1) {
        divFeedback.textContent = 'O número de contribuinte parece estar errado';
        divFeedback.className = 'invalid';
    } else {
        divFeedback.textContent = 'O número de contribuinte é válido';
        divFeedback.className = 'valid';

        // Enviar NIF validado ao servidor para armazenar no Redis
        fetch('http://localhost:3000/validar-nif', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nif: numeroContribuinte, tipo: tipoContribuinte }) // Inclui o tipo no corpo
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
        })
        .catch(error => {
            divFeedback.textContent = 'Erro ao enviar NIF ao servidor';
            divFeedback.className = 'invalid';
            console.error('Erro:', error);
        });
    }
}


function atualizarHistorico() {
    fetch('http://localhost:3000/historico-nifs')
    .then(response => response.json())
    .then(nifs => {
        const historicoDiv = document.getElementById("nifHistory");
        historicoDiv.innerHTML = "";
        nifs.forEach((nif, index) => {
            const divItem = document.createElement("div");
            divItem.textContent = `${index + 1}. ${nif}`;
            divItem.className = 'history-item';
            historicoDiv.appendChild(divItem);
        });
    })
    .catch(error => console.error('Erro ao carregar histórico:', error));
}

function limpar() {
    document.getElementById("nifInput").value = "";
    document.getElementById("feedback").textContent = "";
    document.getElementById("feedback").className = "";

    // Enviar solicitação ao backend para limpar o histórico
    fetch('http://localhost:3000/limpar-historico', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Histórico limpo:', data.message);
        atualizarHistorico();
    })
    .catch(error => console.error('Erro ao limpar histórico:', error));
}
