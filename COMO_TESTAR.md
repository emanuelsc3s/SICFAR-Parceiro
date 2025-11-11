# 🧪 Como Testar a Autenticação - SICFAR RH

## 🚀 Passo a Passo para Testar

### 1️⃣ Iniciar o Servidor de Desenvolvimento

```bash
cd /home/emanuel/SICFAR-RH
npm run dev
```

**Resultado esperado:**
```
VITE v5.4.19  ready in XXX ms

➜  Local:   http://localhost:8080/
➜  Network: use --host to expose
```

---

### 2️⃣ Acessar a Página de Login

Abra seu navegador e acesse:
```
http://localhost:8080/login
```

---

### 3️⃣ Testar Login com Matrícula

#### Teste 1: Matrícula com zeros à esquerda
**Dados:**
- **Matrícula:** `000008`
- **Senha:** `8681106`

**Passos:**
1. Digite `000008` no campo "Matrícula ou CPF"
2. Digite `8681106` no campo "Senha"
3. Clique em "FAZER LOGIN"

**Resultado esperado:**
- ✅ Redirecionamento para `/solicitarbeneficio`
- ✅ Console mostra: `✅ Login bem-sucedido: FRANCISCO SILVANO TEMOTEO | Email: silvanotemoteo2018@gmail.com | Tipo de login: Matrícula`

---

#### Teste 2: Matrícula sem zeros à esquerda
**Dados:**
- **Matrícula:** `8`
- **Senha:** `8681106`

**Passos:**
1. Digite `8` no campo "Matrícula ou CPF"
2. Digite `8681106` no campo "Senha"
3. Clique em "FAZER LOGIN"

**Resultado esperado:**
- ✅ Redirecionamento para `/solicitarbeneficio`
- ✅ Console mostra: `✅ Login bem-sucedido: FRANCISCO SILVANO TEMOTEO | Email: silvanotemoteo2018@gmail.com | Tipo de login: Matrícula`

---

### 4️⃣ Testar Login com CPF

#### Teste 3: CPF sem formatação
**Dados:**
- **CPF:** `85903973868`
- **Senha:** `8681106`

**Passos:**
1. Digite `85903973868` no campo "Matrícula ou CPF"
2. Digite `8681106` no campo "Senha"
3. Clique em "FAZER LOGIN"

**Resultado esperado:**
- ✅ Redirecionamento para `/solicitarbeneficio`
- ✅ Console mostra: `✅ Login bem-sucedido: FRANCISCO SILVANO TEMOTEO | Email: silvanotemoteo2018@gmail.com | Tipo de login: CPF`

---

#### Teste 4: CPF com formatação
**Dados:**
- **CPF:** `859.039.738-68`
- **Senha:** `8681106`

**Passos:**
1. Digite `859.039.738-68` no campo "Matrícula ou CPF"
2. Digite `8681106` no campo "Senha"
3. Clique em "FAZER LOGIN"

**Resultado esperado:**
- ✅ Redirecionamento para `/solicitarbeneficio`
- ✅ Console mostra: `✅ Login bem-sucedido: FRANCISCO SILVANO TEMOTEO | Email: silvanotemoteo2018@gmail.com | Tipo de login: CPF`

---

### 5️⃣ Testar Erros de Autenticação

#### Teste 5: Matrícula inexistente
**Dados:**
- **Matrícula:** `999999`
- **Senha:** `123456`

**Passos:**
1. Digite `999999` no campo "Matrícula ou CPF"
2. Digite `123456` no campo "Senha"
3. Clique em "FAZER LOGIN"

**Resultado esperado:**
- ❌ Modal de erro exibido
- ❌ Título: "Erro de Autenticação"
- ❌ Mensagem: "Matrícula/CPF ou senha incorreta. Por favor, verifique suas credenciais e tente novamente."
- ❌ Botão "OK" para fechar o modal

---

#### Teste 6: Senha incorreta
**Dados:**
- **Matrícula:** `000008`
- **Senha:** `123456`

**Passos:**
1. Digite `000008` no campo "Matrícula ou CPF"
2. Digite `123456` no campo "Senha"
3. Clique em "FAZER LOGIN"

**Resultado esperado:**
- ❌ Modal de erro exibido
- ❌ Console mostra: `❌ Senha incorreta. Esperada: 8681106 Digitada: 123456`

---

### 6️⃣ Verificar Dados no localStorage

Após um login bem-sucedido:

1. Abra o DevTools (F12)
2. Vá para a aba "Application" (Chrome) ou "Storage" (Firefox)
3. Expanda "Local Storage"
4. Clique em `http://localhost:8080`
5. Procure pela chave `colaboradorLogado`

**Dados esperados:**
```json
{
  "matricula": "000008",
  "nome": "FRANCISCO SILVANO TEMOTEO",
  "cpf": "85903973868",
  "dataNascimento": "11.06.1955 00:00",
  "email": "silvanotemoteo2018@gmail.com",
  "loginTimestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## 📊 Mais Funcionários para Testar

### Funcionário 2
- **Nome:** MARGARIDA DA SILVA LIMA
- **Matrícula:** `11` ou `000011`
- **CPF:** `13498934805` ou `134.989.348-05`
- **Data Nascimento:** `10.06.1958`
- **Senha:** `8051006`

### Funcionário 3
- **Nome:** MARIA ARIANE GRANGEIRO
- **Matrícula:** `14` ou `000014`
- **CPF:** `01800548729` ou `018.005.487-29`
- **Data Nascimento:** `23.06.1961`
- **Senha:** `7292306`

### Funcionário 4
- **Nome:** MARIA LUCIA LUDGERIO DE SOUZA
- **Matrícula:** `15` ou `000015`
- **CPF:** `58465499349` ou `584.654.993-49`
- **Data Nascimento:** `16.04.1960`
- **Senha:** `3491604`

---

## 🔍 Como Calcular a Senha

### Fórmula:
**Senha = 3 últimos dígitos do CPF + DDMM (dia e mês de nascimento)**

### Exemplo 1:
- **CPF:** `85903973868`
- **3 últimos dígitos:** `868`
- **Data de nascimento:** `11.06.1955`
- **Dia e mês:** `1106`
- **Senha:** `868` + `1106` = `8681106`

### Exemplo 2:
- **CPF:** `13498934805`
- **3 últimos dígitos:** `805`
- **Data de nascimento:** `10.06.1958`
- **Dia e mês:** `1006`
- **Senha:** `805` + `1006` = `8051006`

### Exemplo 3:
- **CPF:** `01800548729`
- **3 últimos dígitos:** `729`
- **Data de nascimento:** `23.06.1961`
- **Dia e mês:** `2306`
- **Senha:** `729` + `2306` = `7292306`

---

## 🐛 Troubleshooting

### Problema: "Cannot find module '../../data/funcionarios.json'"
**Solução:** Verifique se o arquivo `/data/funcionarios.json` existe no projeto.

### Problema: Modal de erro não aparece
**Solução:** Verifique se o componente Dialog está instalado:
```bash
npm install @radix-ui/react-dialog
```

### Problema: Redirecionamento não funciona
**Solução:** Verifique se a rota `/solicitarbeneficio` está configurada em `src/App.tsx`.

### Problema: Dados não são salvos no localStorage
**Solução:** Verifique se o navegador permite localStorage (modo anônimo pode bloquear).

---

## ✅ Checklist de Testes

- [ ] Login com matrícula (com zeros à esquerda)
- [ ] Login com matrícula (sem zeros à esquerda)
- [ ] Login com CPF (sem formatação)
- [ ] Login com CPF (com formatação)
- [ ] Erro com matrícula inexistente
- [ ] Erro com senha incorreta
- [ ] Redirecionamento para `/solicitarbeneficio`
- [ ] Dados salvos no localStorage
- [ ] Logs no console
- [ ] Modal de erro funcional
- [ ] Botão "Mostrar/Ocultar senha" funcional

---

## 📸 Screenshots Esperados

### Tela de Login
- Campo "Matrícula ou CPF" com ícone de usuário
- Campo "Senha" com ícone de cadeado
- Placeholder da senha: "3 últimos dígitos CPF + Dia Mês Nascimento"
- Botão "FAZER LOGIN"

### Modal de Erro
- Ícone de alerta vermelho
- Título: "Erro de Autenticação"
- Mensagem clara
- Botão "OK"

### Console (Login Bem-Sucedido)
```
✅ Login bem-sucedido: FRANCISCO SILVANO TEMOTEO | Email: silvanotemoteo2018@gmail.com | Tipo de login: Matrícula
```

### Console (Senha Incorreta)
```
❌ Senha incorreta. Esperada: 8681106 Digitada: 123456
```

---

## 🎯 Resultado Final Esperado

Após todos os testes:
- ✅ Todos os casos de teste passaram
- ✅ Autenticação funciona com matrícula e CPF
- ✅ Normalização de inputs funciona corretamente
- ✅ Modal de erro é exibido quando necessário
- ✅ Redirecionamento funciona após login bem-sucedido
- ✅ Dados são salvos corretamente no localStorage

---

**Boa sorte com os testes! 🚀**

