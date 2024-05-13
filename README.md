# Projeto Job Platform


### 1ª Clone o projeto
> git clone **<projeto_link>** 

ou caso não tenha o git 
> Baixar zip e descompactar

### 2º Navegue a pasta do projeto

> cd job-platform

### 3º Preparar ambiente

**Obs**: Certifique que possua o NodeJS instalado em sua versão LTS: https://nodejs.org/en 

> npm -v

### 4º Preparar prencha as informações das variaveis de ambiente 

Altere o arquivo **.env** da pasta **./server**

Path arquivo do banco local, não a necessidade de alterar o caminho
> * DATABASE_URL='file:./dev.db'

Porta de execução do server, não a necessidade de alterar
> * PORT=4000

### 5ª instale as dependecias e inicie o projeto

> npm run start:app

------

# Passos opcionais:

### 6ª Pausar a aplicação

> npm run stop:app

### 7ª Restartar a aplicação

> npm run restart:app

### 8ª Finalizar os processos da aplicação

> npm run delete:app
