# 🧪 Exemplos de Testes - Edge Function de Email

## 📋 Índice

1. [Testes com curl](#testes-com-curl)
2. [Testes com JavaScript/TypeScript](#testes-com-javascripttypescript)
3. [Testes com Postman](#testes-com-postman)
4. [Testes Automatizados](#testes-automatizados)
5. [Testes de Carga](#testes-de-carga)

---

## 🔧 Testes com curl

### **Teste 1: Email Completo com Todos os Campos**

```bash
curl -X POST http://localhost:54321/functions/v1/send-voucher-email \
  -H "Content-Type: application/json" \
  -d '{
    "destinatario": "teste@email.com",
    "nomeDestinatario": "João Silva",
    "voucherNumber": "VOUCHER-2025-001",
    "beneficios": [
      {
        "title": "Vale Alimentação",
        "value": "R$ 500,00"
      },
      {
        "title": "Vale Transporte",
        "value": "R$ 200,00"
      },
      {
        "title": "Plano de Saúde",
        "value": "R$ 350,00"
      }
    ],
    "pdfBase64": "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSA1IDAgUj4+Pj4vTWVkaWFCb3hbMCAwIDYxMiA3OTJdL0NvbnRlbnRzIDQgMCBSPj4KZW5kb2JqCg=="
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Email enviado com sucesso",
  "messageId": "VOUCHER-2025-001-1699999999999"
}
```

---

### **Teste 2: Email Mínimo (Apenas Campos Obrigatórios)**

```bash
curl -X POST http://localhost:54321/functions/v1/send-voucher-email \
  -H "Content-Type: application/json" \
  -d '{
    "destinatario": "teste@email.com",
    "voucherNumber": "VOUCHER-MIN-001",
    "pdfBase64": "data:application/pdf;base64,JVBERi0xLjQK"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Email enviado com sucesso",
  "messageId": "VOUCHER-MIN-001-1699999999999"
}
```

---

### **Teste 3: Validação - Falta Destinatário**

```bash
curl -X POST http://localhost:54321/functions/v1/send-voucher-email \
  -H "Content-Type: application/json" \
  -d '{
    "voucherNumber": "VOUCHER-ERR-001",
    "pdfBase64": "data:application/pdf;base64,JVBERi0xLjQK"
  }'
```

**Resposta esperada:**
```json
{
  "success": false,
  "message": "Dados incompletos. Necessário: destinatario, voucherNumber e pdfBase64"
}
```

---

### **Teste 4: Validação - Falta Número do Voucher**

```bash
curl -X POST http://localhost:54321/functions/v1/send-voucher-email \
  -H "Content-Type: application/json" \
  -d '{
    "destinatario": "teste@email.com",
    "pdfBase64": "data:application/pdf;base64,JVBERi0xLjQK"
  }'
```

**Resposta esperada:**
```json
{
  "success": false,
  "message": "Dados incompletos. Necessário: destinatario, voucherNumber e pdfBase64"
}
```

---

### **Teste 5: Validação - Falta PDF**

```bash
curl -X POST http://localhost:54321/functions/v1/send-voucher-email \
  -H "Content-Type: application/json" \
  -d '{
    "destinatario": "teste@email.com",
    "voucherNumber": "VOUCHER-ERR-002"
  }'
```

**Resposta esperada:**
```json
{
  "success": false,
  "message": "Dados incompletos. Necessário: destinatario, voucherNumber e pdfBase64"
}
```

---

### **Teste 6: CORS Preflight**

```bash
curl -X OPTIONS http://localhost:54321/functions/v1/send-voucher-email \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type" \
  -v
```

**Resposta esperada:**
```
< HTTP/1.1 200 OK
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type
ok
```

---

### **Teste 7: Email com Múltiplos Benefícios**

```bash
curl -X POST http://localhost:54321/functions/v1/send-voucher-email \
  -H "Content-Type: application/json" \
  -d '{
    "destinatario": "teste@email.com",
    "nomeDestinatario": "Maria Santos",
    "voucherNumber": "VOUCHER-MULTI-001",
    "beneficios": [
      { "title": "Vale Alimentação", "value": "R$ 500,00" },
      { "title": "Vale Transporte", "value": "R$ 200,00" },
      { "title": "Plano de Saúde", "value": "R$ 350,00" },
      { "title": "Vale Refeição", "value": "R$ 400,00" },
      { "title": "Auxílio Creche", "value": "R$ 300,00" }
    ],
    "pdfBase64": "data:application/pdf;base64,JVBERi0xLjQK"
  }'
```

---

## 💻 Testes com JavaScript/TypeScript

### **Teste 1: Função de Teste Simples**

```typescript
// test-edge-function.ts

async function testSendEmail() {
  const response = await fetch('http://localhost:54321/functions/v1/send-voucher-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      destinatario: 'teste@email.com',
      nomeDestinatario: 'Teste Automatizado',
      voucherNumber: 'VOUCHER-AUTO-001',
      beneficios: [
        { title: 'Vale Alimentação', value: 'R$ 500,00' }
      ],
      pdfBase64: 'data:application/pdf;base64,JVBERi0xLjQK'
    })
  })

  const data = await response.json()
  console.log('Status:', response.status)
  console.log('Resposta:', data)
  
  if (data.success) {
    console.log('✅ Teste passou!')
  } else {
    console.error('❌ Teste falhou!')
  }
}

testSendEmail()
```

**Executar:**
```bash
deno run --allow-net test-edge-function.ts
```

---

### **Teste 2: Teste com Validação de Resposta**

```typescript
// test-validation.ts

interface TestCase {
  name: string
  payload: any
  expectedStatus: number
  expectedSuccess: boolean
}

const testCases: TestCase[] = [
  {
    name: 'Email válido completo',
    payload: {
      destinatario: 'teste@email.com',
      nomeDestinatario: 'João Silva',
      voucherNumber: 'VOUCHER-001',
      beneficios: [{ title: 'Vale', value: 'R$ 100' }],
      pdfBase64: 'data:application/pdf;base64,JVBERi0xLjQK'
    },
    expectedStatus: 200,
    expectedSuccess: true
  },
  {
    name: 'Falta destinatário',
    payload: {
      voucherNumber: 'VOUCHER-002',
      pdfBase64: 'data:application/pdf;base64,JVBERi0xLjQK'
    },
    expectedStatus: 400,
    expectedSuccess: false
  },
  {
    name: 'Falta voucher number',
    payload: {
      destinatario: 'teste@email.com',
      pdfBase64: 'data:application/pdf;base64,JVBERi0xLjQK'
    },
    expectedStatus: 400,
    expectedSuccess: false
  },
  {
    name: 'Falta PDF',
    payload: {
      destinatario: 'teste@email.com',
      voucherNumber: 'VOUCHER-003'
    },
    expectedStatus: 400,
    expectedSuccess: false
  }
]

async function runTests() {
  console.log('🧪 Iniciando testes...\n')
  
  let passed = 0
  let failed = 0

  for (const testCase of testCases) {
    console.log(`📝 Teste: ${testCase.name}`)
    
    try {
      const response = await fetch('http://localhost:54321/functions/v1/send-voucher-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCase.payload)
      })

      const data = await response.json()

      if (response.status === testCase.expectedStatus && data.success === testCase.expectedSuccess) {
        console.log(`✅ PASSOU\n`)
        passed++
      } else {
        console.log(`❌ FALHOU`)
        console.log(`   Esperado: status=${testCase.expectedStatus}, success=${testCase.expectedSuccess}`)
        console.log(`   Recebido: status=${response.status}, success=${data.success}\n`)
        failed++
      }
    } catch (error) {
      console.log(`❌ ERRO: ${error}\n`)
      failed++
    }
  }

  console.log('📊 Resultados:')
  console.log(`   ✅ Passou: ${passed}`)
  console.log(`   ❌ Falhou: ${failed}`)
  console.log(`   📈 Taxa de sucesso: ${(passed / (passed + failed) * 100).toFixed(1)}%`)
}

runTests()
```

**Executar:**
```bash
deno run --allow-net test-validation.ts
```

---

## 📮 Testes com Postman

### **Coleção Postman**

```json
{
  "info": {
    "name": "SICFAR - Edge Function Email",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Enviar Email Completo",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"destinatario\": \"teste@email.com\",\n  \"nomeDestinatario\": \"João Silva\",\n  \"voucherNumber\": \"VOUCHER-2025-001\",\n  \"beneficios\": [\n    {\n      \"title\": \"Vale Alimentação\",\n      \"value\": \"R$ 500,00\"\n    }\n  ],\n  \"pdfBase64\": \"data:application/pdf;base64,JVBERi0xLjQK\"\n}"
        },
        "url": {
          "raw": "http://localhost:54321/functions/v1/send-voucher-email",
          "protocol": "http",
          "host": ["localhost"],
          "port": "54321",
          "path": ["functions", "v1", "send-voucher-email"]
        }
      }
    },
    {
      "name": "Teste Validação - Sem Destinatário",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"voucherNumber\": \"VOUCHER-ERR-001\",\n  \"pdfBase64\": \"data:application/pdf;base64,JVBERi0xLjQK\"\n}"
        },
        "url": {
          "raw": "http://localhost:54321/functions/v1/send-voucher-email",
          "protocol": "http",
          "host": ["localhost"],
          "port": "54321",
          "path": ["functions", "v1", "send-voucher-email"]
        }
      }
    }
  ]
}
```

**Como usar:**
1. Copie o JSON acima
2. Abra o Postman
3. Clique em "Import" → "Raw text"
4. Cole o JSON
5. Execute os testes

---

## 🤖 Testes Automatizados

### **Script de Teste Completo**

```bash
#!/bin/bash
# test-edge-function.sh

echo "🧪 Iniciando testes da Edge Function..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Contador de testes
PASSED=0
FAILED=0

# Função para testar
test_endpoint() {
  local test_name=$1
  local payload=$2
  local expected_status=$3
  
  echo "📝 Teste: $test_name"
  
  response=$(curl -s -w "\n%{http_code}" -X POST \
    http://localhost:54321/functions/v1/send-voucher-email \
    -H "Content-Type: application/json" \
    -d "$payload")
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$http_code" -eq "$expected_status" ]; then
    echo -e "${GREEN}✅ PASSOU${NC} (Status: $http_code)"
    ((PASSED++))
  else
    echo -e "${RED}❌ FALHOU${NC} (Esperado: $expected_status, Recebido: $http_code)"
    echo "Resposta: $body"
    ((FAILED++))
  fi
  echo ""
}

# Teste 1: Email válido
test_endpoint "Email válido completo" \
  '{"destinatario":"teste@email.com","voucherNumber":"VOUCHER-001","pdfBase64":"data:application/pdf;base64,JVBERi0xLjQK"}' \
  200

# Teste 2: Falta destinatário
test_endpoint "Validação - Falta destinatário" \
  '{"voucherNumber":"VOUCHER-002","pdfBase64":"data:application/pdf;base64,JVBERi0xLjQK"}' \
  400

# Teste 3: Falta voucher number
test_endpoint "Validação - Falta voucher number" \
  '{"destinatario":"teste@email.com","pdfBase64":"data:application/pdf;base64,JVBERi0xLjQK"}' \
  400

# Teste 4: Falta PDF
test_endpoint "Validação - Falta PDF" \
  '{"destinatario":"teste@email.com","voucherNumber":"VOUCHER-003"}' \
  400

# Resultados
echo "📊 Resultados:"
echo -e "   ${GREEN}✅ Passou: $PASSED${NC}"
echo -e "   ${RED}❌ Falhou: $FAILED${NC}"
TOTAL=$((PASSED + FAILED))
SUCCESS_RATE=$(awk "BEGIN {printf \"%.1f\", ($PASSED/$TOTAL)*100}")
echo "   📈 Taxa de sucesso: $SUCCESS_RATE%"
```

**Executar:**
```bash
chmod +x test-edge-function.sh
./test-edge-function.sh
```

---

## 📈 Testes de Carga

### **Teste com Apache Bench**

```bash
# Instalar Apache Bench (se necessário)
sudo apt-get install apache2-utils  # Ubuntu/Debian
brew install httpd                   # macOS

# Teste de carga: 100 requisições, 10 concorrentes
ab -n 100 -c 10 -p payload.json -T application/json \
  http://localhost:54321/functions/v1/send-voucher-email
```

**Arquivo payload.json:**
```json
{
  "destinatario": "teste@email.com",
  "voucherNumber": "VOUCHER-LOAD-TEST",
  "pdfBase64": "data:application/pdf;base64,JVBERi0xLjQK"
}
```

---

## ✅ Checklist de Testes

Antes de fazer deploy em produção, execute todos estes testes:

- [ ] Email válido completo
- [ ] Email mínimo (apenas campos obrigatórios)
- [ ] Validação - Falta destinatário
- [ ] Validação - Falta voucher number
- [ ] Validação - Falta PDF
- [ ] CORS preflight
- [ ] Email com múltiplos benefícios
- [ ] Email sem nome do destinatário
- [ ] Email sem benefícios
- [ ] PDF com prefixo base64
- [ ] PDF sem prefixo base64
- [ ] Teste de carga (100 requisições)

---

**Última atualização:** 12/11/2025  
**Versão:** 1.0

