# Sistema de Gerenciamento de Drones

## 📋 Sobre o Projeto

O Sistema de Gerenciamento de Drones é uma aplicação web completa desenvolvida em Java Spring Boot que permite o controle e monitoramento de drones para missões de entrega de suprimentos. O sistema oferece funcionalidades para cadastro de drones, criação de missões, gerenciamento de suprimentos e autenticação de usuários.

## 🚀 Funcionalidades

### 🤖 Gerenciamento de Drones
- Cadastro de novos drones com diferentes tipos e capacidades
- Listagem paginada com filtros
- Busca por ID específico
- Atualização de dados do drone
- Exclusão de drones

### 🎯 Gerenciamento de Missões
- Criação de missões com associação de drones e suprimentos
- Listagem paginada de todas as missões
- Busca de missão por ID
- Atualização de missões existentes
- Conclusão de missões
- Exclusão de missões

### 📦 Gerenciamento de Suprimentos
- Cadastro de suprimentos com nome, descrição e peso
- Listagem paginada de suprimentos
- Busca por ID específico
- Atualização de dados do suprimento
- Exclusão de suprimentos

### 👤 Autenticação e Autorização
- Registro de novos usuários
- Login com autenticação JWT
- Proteção de endpoints com Bearer Token

## 🛠️ Tecnologias Utilizadas

- **Backend**: Java 17, Spring Boot 3.5.0
- **Banco de Dados**: Oracle Database
- **Segurança**: Spring Security com JWT
- **Documentação**: Swagger/OpenAPI 3
- **Cache**: Spring Cache
- **Validação**: Jakarta Validation
- **Build**: Maven

## 🔗 Links do Projeto

### Repositórios

- **Backend**: [Link do repositório GitHub BACKEND: https://github.com/CarlosCampos84/drone-manager-api-dotnet.git]

- **Frontend**: [Link do repositório GitHub MOBILE: https://github.com/CarlosCampos84/drone-manager-api-mobile.git]

- **Documentação**: http://localhost:8080/swagger-ui.html


## 🚀 Como Executar o Projeto

### Pré-requisitos
- Java 17 ou superior
- Maven 3.6+
- Oracle Database

### Instalação e Execução

1. **Clone o repositório**
```bash
git clone [URL_DO_REPOSITORIO]
cd PASTA_PROJETO
```

2. **Configure o banco de dados**
```properties
# application.properties
spring.datasource.url=jdbc:[DATABASE_URL]
spring.datasource.username=[USERNAME]
spring.datasource.password=[PASSWORD]
```

3. **Instale as dependências**
```bash
npm install
```
npx expo install react-dom react-native-web



4. **Execute a aplicação**
```bash
npx expo start
```

## ⚠️ Configuração opcional no server.ts

Alteração da variável para garantir que a API do backend está sendo consumida corretamente.

A aplicação estará disponível em `http://localhost:8080`

## 📝 Como Testar a API

### 1. Registrar um usuário
```bash
POST /usuario
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

### 2. Fazer login
```bash
POST /usuario/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "123456"
}
```

### 3. Cadastrar um drone
```bash
POST /drone
Authorization: Bearer [TOKEN]
Content-Type: application/json

{
  "nome": "Drone de carga"
  "tipo": "CARGA",
  "capacidadeKg": 15.0
}
```

### 4. Cadastrar um suprimento
```bash
POST /suprimento
Authorization: Bearer [TOKEN]
Content-Type: application/json

{
  "nome": "Medicamento",
  "descricao": "Antibiótico",
  "pesoKg": 0.5
}
```

### 5. Criar uma missão
```bash
POST /missao
Authorization: Bearer [TOKEN]
Content-Type: application/json

{
  "descricao": "Entrega de medicamentos",
  "droneId": 1,
  "suprimentos": [
    {
      "suprimentoId": 1,
      "quantidade": 2
    }
  ]
}
```

## 📊 Documentação da API

A documentação completa da API está disponível através do Swagger UI:
- **Local**: http://localhost:8080/swagger-ui.html

## 🎥 Demonstrações

Link do video: 

## 🔒 Segurança

O sistema implementa as seguintes medidas de segurança:
- Autenticação JWT para todos os endpoints protegidos
- Validação de entrada de dados
- Criptografia de senhas

## 📈 Funcionalidades Avançadas

- **Cache**: Implementação de cache para melhorar performance
- **Paginação**: Listagens com paginação para otimizar carregamento
- **Filtros**: Sistema de filtros para busca de drones
- **Transações**: Controle transacional para operações críticas
- **Validação**: Validação robusta de dados de entrada

## 👥 Equipe de Desenvolvimento

- **[Carlos Ferraz Campos]** - RM 555223 - 2TDSPJ
- **[Mateus Pierro]** - RM 555125 - 2TDSPJ
