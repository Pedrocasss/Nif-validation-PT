# Validação de NIF Português / Portuguese NIF Validation

## English

This project aims to validate Portuguese Tax Identification Numbers (NIF) for individuals and entities. It can check if the provided NIF is valid and determine the type of taxpayer (individual, company, public administration, among others).

Additionally, the system stores the **date and time** of each validated NIF, allowing for tracking when validations occurred.

### Features

- **NIF Validation**: Checks if the NIF is correct and if the control digit matches the calculated one.
- **Type of NIF**: Determines the type of taxpayer based on the first two digits of the NIF (individual, company, non-resident, etc.).
- **NIF Storage**: Stores the date and time of each validated NIF for auditing purposes.
- **User Feedback**: Displays a message to the user indicating whether the NIF is valid or invalid.
- **Data Sending to Server**: Sends the validated NIFs and their types to a backend server for storage (e.g., in Redis).

### How It Works

1. **NIF Validation**: The NIF is validated by calculating the control digit using a specific algorithm for the Portuguese NIF.
2. **Taxpayer Type**: The taxpayer type is determined based on the first digits of the NIF. The system considers different categories, such as individuals, companies, non-residents, etc.
3. **Storage**: The validated NIFs are sent to the server, where they are stored along with the date and time of validation.

### Requirements

- Modern browser (for the validation interface).
- Backend server (such as Node.js or any other backend) for storing the data.
- A database like Redis (or another preferred storage system).

### How to Use

1. **Install the server dependencies**:
   - If using Node.js, create a `server.js` file with a simple endpoint to receive the validated NIFs and store them in Redis.
   
   Example simple server:
   ```javascript
   const express = require('express');
   const redis = require('redis');
   const app = express();
   const client = redis.createClient();
   
   app.use(express.json());

   app.post('/validate-nif', (req, res) => {
       const { nif, type } = req.body;
       const data = new Date();
       client.set(nif, JSON.stringify({ type, data: data.toISOString() }));
       res.json({ message: 'NIF validated and stored!' });
   });

   app.listen(3000, () => {
       console.log('Server running on port 3000');
   });

2. **Front-End**:
The validation interface is simple: the user inputs the NIF in a field and clicks a button to validate it.
The feedback (valid or invalid) is displayed below the input field.

3. **Running the Project**:
To run the front-end, open the HTML file in a browser.
To run the server, start the Node.js server with node server.js.



## Português

Este projeto tem como objetivo validar os números de identificação fiscal (NIF) de pessoas e entidades em Portugal. Ele é capaz de identificar se o NIF fornecido é válido e também determinar o tipo de contribuinte (pessoal, pessoa coletiva, administração pública, entre outros).

Além disso, o sistema guarda a **data hora, e posteriormente o tipo** de cada NIF validado, permitindo o rastreio de quando as validações ocorreram.

### Funcionalidades

- **Validação de NIF**: Verifica se o NIF está correto e se o dígito de controlo corresponde ao cálculo realizado.
- **Identificação do tipo de NIF**: Determina o tipo de contribuinte com base nos dois primeiros dígitos do NIF (pessoal, pessoa coletiva, não residente, etc.).
- **Armazenamento de NIFs**: Guarda a data e hora de cada NIF validado para fins de auditoria.
- **Feedback ao utilizador**: Exibe uma mensagem ao utilizador indicando se o NIF é válido ou inválido.
- **Envio de dados ao servidor**: Envia os NIFs validados e os seus tipos para um servidor backend para armazenamento (por exemplo, no Redis).

### Como Funciona

1. **Validação de NIF**: O NIF é validado através do cálculo do dígito de controlo, utilizando um algoritmo específico para o NIF português.
2. **Tipo de Contribuinte**: O tipo de contribuinte é determinado com base nos primeiros caracteres do NIF. O sistema considera diferentes categorias, como pessoas singulares, pessoas coletivas, não residentes, entre outros.
3. **Armazenamento**: Os NIFs validados são enviados para o servidor, onde são armazenados junto com a data e hora da validação.

### Requisitos

- Navegador moderno (para a interface de validação).
- Servidor backend (como Node.js ou outro backend) para o armazenamento dos dados.
- Banco de dados como Redis (ou outro sistema de armazenamento).

### Como Usar

1. **Instalar as dependências do servidor**:
   - Se estiver a usar Node.js, crie um arquivo `server.js` com um simples endpoint para receber os NIFs validados e armazená-los em Redis.
   
   Exemplo de servidor simples:
   ```javascript
   const express = require('express');
   const redis = require('redis');
   const app = express();
   const client = redis.createClient();
   
   app.use(express.json());

   app.post('/validar-nif', (req, res) => {
       const { nif, tipo } = req.body;
       const data = new Date();
       client.set(nif, JSON.stringify({ tipo, data: data.toISOString() }));
       res.json({ message: 'NIF validado e armazenado!' });
   });

   app.listen(3000, () => {
       console.log('Servidor a correr na porta 3000');
   });

2. **Front-End**:
A interface de validação é simples: o utilizador insere o NIF num campo de entrada e clica num botão para validá-lo.
O feedback (válido ou inválido) é exibido abaixo do campo de entrada.

3. **Executar o Projeto**:
Para correr o front-end, basta abrir o arquivo HTML no navegador.
Para correr o servidor, inicie o servidor Node.js com node server.js.
