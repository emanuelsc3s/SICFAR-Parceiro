# 🧪 Guia de Testes - Sistema de Envio de E-mail para Vouchers

## 📋 Pré-requisitos

Antes de iniciar os testes, certifique-se de que:

- ✅ Node.js está instalado
- ✅ Dependências foram instaladas (`npm install`)
- ✅ Arquivo `.env` está configurado com credenciais SMTP válidas
- ✅ Arquivo `data/funcionarios.json` contém funcionários com e-mails cadastrados

---

## 🚀 Iniciando o Sistema

### Opção 1: Iniciar Frontend e Backend Separadamente

**Terminal 1 - Backend:**
```bash
npm run server
```

**Saída esperada:**
```
🚀 Servidor de email rodando na porta 3001
📧 Configuração SMTP: smtplw.com.br:465
✅ Servidor SMTP pronto para enviar emails
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Saída esperada:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Opção 2: Iniciar Ambos Simultaneamente

```bash
npm run dev:all
```

---

## ✅ Casos de Teste

### Teste 1: Verificar Health Check do Servidor

**Objetivo:** Confirmar que o servidor de e-mail está funcionando

**Passos:**
1. Acesse no navegador: `http://localhost:3001/health`

**Resultado Esperado:**
```json
{
  "status": "ok",
  "message": "Servidor de email está funcionando"
}
```

**Status:** [ ] Passou  [ ] Falhou

---

### Teste 2: Login com Usuário Válido

**Objetivo:** Verificar se o e-mail é armazenado na sessão após login

**Passos:**
1. Acesse `http://localhost:5173/login`
2. Digite uma matrícula ou CPF válido (ex: `00001` ou CPF de um funcionário)
3. Digite a senha correta (3 últimos dígitos do CPF + DDMM de nascimento)
4. Clique em "FAZER LOGIN"
5. Abra o Console do navegador (F12)
6. Digite: `JSON.parse(localStorage.getItem('colaboradorLogado'))`

**Resultado Esperado:**
- Redirecionamento para `/solicitarbeneficio`
- Console mostra objeto com:
  ```javascript
  {
    matricula: "00001",
    nome: "Nome do Funcionário",
    cpf: "12345678901",
    dataNascimento: "01.01.1990 00:00",
    email: "funcionario@email.com",  // ✅ E-mail presente
    loginTimestamp: "2025-11-11T..."
  }
  ```

**Status:** [ ] Passou  [ ] Falhou

---

### Teste 3: Validação de E-mail Ausente

**Objetivo:** Verificar comportamento quando usuário não tem e-mail cadastrado

**Preparação:**
1. Edite `data/funcionarios.json`
2. Remova ou deixe vazio o campo `EMAIL` de um funcionário
3. Salve o arquivo

**Passos:**
1. Faça login com o funcionário sem e-mail
2. Navegue até "Solicitar Voucher"
3. Selecione benefícios
4. Preencha detalhes
5. Clique em "Confirmar Solicitação"

**Resultado Esperado:**
- Toast de erro: "E-mail do colaborador não encontrado. Não é possível enviar o voucher."
- Descrição: "Entre em contato com o RH para atualizar seu e-mail no cadastro."
- Processo é interrompido
- Voucher NÃO é gerado

**Status:** [ ] Passou  [ ] Falhou

---

### Teste 4: Fluxo Completo - Envio de E-mail com Sucesso

**Objetivo:** Testar o fluxo completo de emissão de voucher com envio de e-mail

**Passos:**
1. Faça login com usuário que tenha e-mail válido
2. Clique em "Solicitar Voucher"
3. **Etapa 1:** Selecione 2-3 benefícios (ex: Vale Alimentação, Vale Transporte)
4. Clique em "Próximo"
5. **Etapa 2:** Preencha os campos:
   - Justificativa: "Teste de envio de e-mail"
   - Urgência: "Normal"
   - Informações Adicionais: "Teste automatizado"
6. Clique em "Próximo"
7. **Etapa 3:** Revise as informações
8. Clique em "Confirmar Solicitação"
9. Aguarde o processamento

**Resultado Esperado:**
- Toast de loading: "Enviando voucher por e-mail..."
- Toast de sucesso: "Voucher enviado por e-mail com sucesso! 🎉"
- Descrição: "E-mail enviado para: [email do usuário]"
- Voucher é exibido na tela com:
  - Número do voucher
  - QR Code
  - Lista de benefícios
  - Dados do colaborador
- Console mostra: `✅ E-mail enviado com sucesso para: [email]`
- **E-mail recebido** na caixa de entrada com:
  - Assunto: "✅ Voucher de Benefício Gerado - [número]"
  - PDF anexado: `Voucher_[número].pdf`
  - Template HTML formatado

**Status:** [ ] Passou  [ ] Falhou

---

### Teste 5: Servidor Backend Offline

**Objetivo:** Verificar comportamento quando servidor de e-mail está indisponível

**Preparação:**
1. Pare o servidor backend (Ctrl+C no terminal do backend)

**Passos:**
1. Com o frontend ainda rodando, faça login
2. Solicite um voucher seguindo o fluxo completo
3. Clique em "Confirmar Solicitação"

**Resultado Esperado:**
- Toast de erro: "Servidor de e-mail indisponível"
- Descrição: "O voucher será exibido, mas não foi enviado por e-mail. Verifique se o servidor backend está rodando."
- Voucher é exibido na tela (fallback funciona)
- Console mostra erro de conexão

**Status:** [ ] Passou  [ ] Falhou

---

### Teste 6: Credenciais SMTP Inválidas

**Objetivo:** Verificar comportamento quando credenciais SMTP estão incorretas

**Preparação:**
1. Edite o arquivo `.env`
2. Altere `EMAIL_API_SENHA` para uma senha incorreta
3. Reinicie o servidor backend

**Passos:**
1. Verifique a saída do servidor backend ao iniciar
2. Tente enviar um voucher

**Resultado Esperado (ao iniciar servidor):**
```
❌ Erro na configuração SMTP: [mensagem de erro]
⚠️  O servidor continuará funcionando, mas emails podem falhar.
💡 Verifique as credenciais SMTP no arquivo .env
```

**Resultado Esperado (ao enviar voucher):**
- Toast de erro: "Erro ao enviar e-mail"
- Descrição: "O voucher será exibido, mas não foi enviado por e-mail. Tente novamente mais tarde."
- Voucher é exibido na tela (fallback funciona)

**Status:** [ ] Passou  [ ] Falhou

---

### Teste 7: Validação de Benefícios Não Selecionados

**Objetivo:** Verificar validação quando nenhum benefício é selecionado

**Passos:**
1. Faça login
2. Navegue para "Solicitar Voucher"
3. **NÃO selecione nenhum benefício**
4. Tente avançar para próxima etapa ou confirmar

**Resultado Esperado:**
- Toast de erro: "Nenhum benefício selecionado. Por favor, selecione pelo menos um benefício."
- Processo é interrompido

**Status:** [ ] Passou  [ ] Falhou

---

### Teste 8: Validação de Sessão Expirada

**Objetivo:** Verificar comportamento quando sessão não existe

**Passos:**
1. Acesse `http://localhost:5173/solicitarbeneficio` diretamente (sem fazer login)
2. OU: Faça login, depois execute no console: `localStorage.removeItem('colaboradorLogado')`
3. Tente solicitar um voucher

**Resultado Esperado:**
- Redirecionamento automático para `/login`
- OU Toast de erro: "Dados do colaborador não encontrados. Por favor, faça login novamente."

**Status:** [ ] Passou  [ ] Falhou

---

### Teste 9: Verificar Conteúdo do E-mail

**Objetivo:** Validar que o e-mail contém todas as informações necessárias

**Passos:**
1. Envie um voucher com sucesso (Teste 4)
2. Abra o e-mail recebido
3. Verifique o conteúdo

**Checklist do E-mail:**
- [ ] Assunto: "✅ Voucher de Benefício Gerado - [número]"
- [ ] Remetente: "SICFAR - Farmace Benefícios <sicfar@farmace.com.br>"
- [ ] Destinatário: E-mail correto do colaborador
- [ ] Template HTML formatado e profissional
- [ ] Mensagem de parabéns
- [ ] Número do voucher visível
- [ ] Lista de benefícios selecionados
- [ ] Instruções de uso
- [ ] PDF anexado: `Voucher_[número].pdf`
- [ ] PDF abre corretamente
- [ ] PDF contém QR Code
- [ ] PDF contém dados do colaborador

**Status:** [ ] Passou  [ ] Falhou

---

### Teste 10: Verificar Conteúdo do PDF

**Objetivo:** Validar que o PDF gerado está correto

**Passos:**
1. Envie um voucher com sucesso
2. Baixe o PDF anexado ao e-mail
3. Abra o PDF

**Checklist do PDF:**
- [ ] Logo "SICFAR - Farmace Benefícios" no topo
- [ ] Título: "Voucher de Benefício"
- [ ] Número do voucher em destaque
- [ ] Data de geração
- [ ] Mensagem: "Parabéns! Seu voucher foi aprovado!"
- [ ] QR Code visível e escaneável
- [ ] Dados do colaborador:
  - [ ] Nome completo
  - [ ] Matrícula
  - [ ] E-mail
- [ ] Lista de benefícios selecionados com:
  - [ ] Título do benefício
  - [ ] Descrição
  - [ ] Valor
- [ ] Detalhes da solicitação:
  - [ ] Justificativa
  - [ ] Urgência
  - [ ] Informações adicionais
- [ ] Instruções de uso
- [ ] Footer com copyright

**Status:** [ ] Passou  [ ] Falhou

---

## 📊 Resumo dos Testes

| # | Teste | Status | Observações |
|---|-------|--------|-------------|
| 1 | Health Check | [ ] | |
| 2 | Login e Armazenamento de E-mail | [ ] | |
| 3 | Validação E-mail Ausente | [ ] | |
| 4 | Fluxo Completo - Sucesso | [ ] | |
| 5 | Servidor Offline | [ ] | |
| 6 | Credenciais SMTP Inválidas | [ ] | |
| 7 | Benefícios Não Selecionados | [ ] | |
| 8 | Sessão Expirada | [ ] | |
| 9 | Conteúdo do E-mail | [ ] | |
| 10 | Conteúdo do PDF | [ ] | |

---

## 🐛 Registro de Bugs

Se encontrar algum problema durante os testes, registre aqui:

### Bug #1
- **Teste:** 
- **Descrição:** 
- **Passos para Reproduzir:** 
- **Resultado Esperado:** 
- **Resultado Obtido:** 
- **Severidade:** [ ] Crítico  [ ] Alto  [ ] Médio  [ ] Baixo

---

## ✅ Critérios de Aceitação

Para considerar a funcionalidade aprovada, os seguintes critérios devem ser atendidos:

- [ ] Todos os 10 testes passaram com sucesso
- [ ] E-mail é armazenado corretamente na sessão após login
- [ ] E-mail é enviado com sucesso quando voucher é emitido
- [ ] PDF é gerado corretamente e anexado ao e-mail
- [ ] Validações de e-mail ausente funcionam corretamente
- [ ] Tratamento de erros funciona (servidor offline, credenciais inválidas)
- [ ] Fallback funciona (voucher é exibido mesmo com erro no e-mail)
- [ ] Feedback visual ao usuário é claro e informativo
- [ ] Nenhum bug crítico ou de alta severidade foi encontrado

---

## 📞 Suporte

Em caso de problemas durante os testes:

1. Verifique se o servidor backend está rodando (`http://localhost:3001/health`)
2. Verifique as credenciais SMTP no arquivo `.env`
3. Verifique os logs do console do navegador (F12)
4. Verifique os logs do terminal do backend
5. Certifique-se de que o colaborador possui e-mail cadastrado em `data/funcionarios.json`

---

**Desenvolvido para SICFAR-RH** 🚀
**Data:** 11/11/2025

