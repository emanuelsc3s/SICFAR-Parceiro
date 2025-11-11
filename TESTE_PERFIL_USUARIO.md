# 🧪 Guia de Teste - Seção de Perfil de Usuário

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

### 2️⃣ Fazer Login

**Acessar:**
```
http://localhost:8080/login
```

**Credenciais de teste:**
- **Matrícula:** `8` (ou `000008`)
- **Senha:** `8681106`

**Passos:**
1. Digite `8` no campo "Matrícula ou CPF"
2. Digite `8681106` no campo "Senha"
3. Clique em "FAZER LOGIN"

**Resultado esperado:**
- ✅ Redirecionamento automático para `/solicitarbeneficio`

---

### 3️⃣ Verificar Seção de Perfil no Header

Após o login, verifique o **lado direito do header**:

#### Elementos Visíveis:

**1. Avatar:**
- ✅ Círculo azul com borda branca
- ✅ Iniciais "FT" (Francisco Temoteo) em branco
- ✅ Tamanho: 40x40 pixels

**2. Nome do Usuário:**
- ✅ Texto: "FRANCISCO SILVANO TEMOTEO"
- ✅ Cor: Branco
- ✅ Fonte: Média, tamanho pequeno

**3. Badge de Perfil:**
- ✅ Texto: "Colaborador"
- ✅ Fundo: Branco semi-transparente
- ✅ Borda: Branca semi-transparente

**4. Ícone de Dropdown:**
- ✅ Chevron down (seta para baixo)
- ✅ Cor: Branco semi-transparente

---

### 4️⃣ Testar Efeitos Visuais

#### Hover (Passar o mouse)
**Ação:** Passe o mouse sobre a seção de perfil

**Resultado esperado:**
- ✅ Fundo muda para branco semi-transparente (`bg-white/10`)
- ✅ Cursor muda para pointer
- ✅ Transição suave

#### Focus (Navegação por teclado)
**Ação:** Use a tecla Tab para navegar até a seção de perfil

**Resultado esperado:**
- ✅ Anel de foco branco aparece ao redor do botão
- ✅ Anel tem 2px de largura
- ✅ Cor: Branco semi-transparente

---

### 5️⃣ Testar Dropdown Menu

#### Abrir o Menu
**Ação:** Clique na seção de perfil (avatar/nome/badge)

**Resultado esperado:**
- ✅ Menu dropdown aparece abaixo do botão
- ✅ Alinhamento: Lado direito (align="end")
- ✅ Largura: 224px (w-56)
- ✅ Animação de entrada suave

#### Conteúdo do Menu

**Cabeçalho (Label):**
```
FRANCISCO SILVANO TEMOTEO
silvanotemoteo2018@gmail.com
Matrícula: 000008
```

**Separador 1:**
- ✅ Linha horizontal cinza

**Opção 1: Meu Perfil**
- ✅ Ícone: Usuário (UserIcon)
- ✅ Texto: "Meu Perfil"
- ✅ Hover: Fundo cinza claro

**Opção 2: Configurações**
- ✅ Ícone: Engrenagem (Settings)
- ✅ Texto: "Configurações"
- ✅ Hover: Fundo cinza claro

**Separador 2:**
- ✅ Linha horizontal cinza

**Opção 3: Sair**
- ✅ Ícone: Logout (LogOut)
- ✅ Texto: "Sair"
- ✅ Cor: Vermelho (`text-red-600`)
- ✅ Hover: Fundo vermelho claro

---

### 6️⃣ Testar Navegação do Menu

#### Teste 1: Clicar em "Meu Perfil"
**Ação:** Clique em "Meu Perfil"

**Resultado esperado:**
- ✅ Tentativa de navegação para `/configuracao`
- ⚠️ Página pode não existir ainda (404)

#### Teste 2: Clicar em "Configurações"
**Ação:** Clique em "Configurações"

**Resultado esperado:**
- ✅ Tentativa de navegação para `/configuracao`
- ⚠️ Página pode não existir ainda (404)

#### Teste 3: Clicar em "Sair"
**Ação:** Clique em "Sair"

**Resultado esperado:**
- ✅ Redirecionamento para `/login`
- ✅ Dados removidos do localStorage
- ✅ Console mostra: (vazio para `colaboradorLogado`)

---

### 7️⃣ Verificar Dados no localStorage

**Antes do Logout:**

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

**Depois do Logout:**
- ✅ Chave `colaboradorLogado` não existe mais

---

### 8️⃣ Testar Proteção de Rota

#### Teste 1: Acessar sem login
**Ação:** 
1. Faça logout (se estiver logado)
2. Tente acessar diretamente: `http://localhost:8080/solicitarbeneficio`

**Resultado esperado:**
- ✅ Redirecionamento automático para `/login`
- ✅ Mensagem no console: (nenhuma)

#### Teste 2: Acessar com login
**Ação:**
1. Faça login
2. Acesse: `http://localhost:8080/solicitarbeneficio`

**Resultado esperado:**
- ✅ Página carrega normalmente
- ✅ Seção de perfil visível no header

---

### 9️⃣ Testar Responsividade

#### Desktop (≥768px)
**Ação:** Redimensione a janela para largura ≥768px

**Resultado esperado:**
- ✅ Seção de perfil visível
- ✅ Todos os elementos alinhados corretamente

#### Tablet/Mobile (<768px)
**Ação:** Redimensione a janela para largura <768px

**Resultado esperado:**
- ✅ Seção de perfil oculta (`hidden md:flex`)
- ✅ Logo e navegação ainda visíveis

---

### 🔟 Testar Diferentes Usuários

#### Usuário 1: FRANCISCO SILVANO TEMOTEO
- **Matrícula:** `8`
- **Senha:** `8681106`
- **Iniciais esperadas:** `FT`

#### Usuário 2: MARGARIDA DA SILVA LIMA
- **Matrícula:** `11`
- **Senha:** `8051006`
- **Iniciais esperadas:** `ML`

#### Usuário 3: MARIA ARIANE GRANGEIRO
- **Matrícula:** `14`
- **Senha:** `7292306`
- **Iniciais esperadas:** `MG`

#### Usuário 4: MARIA LUCIA LUDGERIO DE SOUZA
- **Matrícula:** `15`
- **Senha:** `3491604`
- **Iniciais esperadas:** `MS`

**Para cada usuário:**
1. Faça login
2. Verifique se as iniciais estão corretas
3. Verifique se o nome completo está correto
4. Verifique se o email está correto no dropdown

---

## 🐛 Troubleshooting

### Problema 1: Seção de perfil não aparece
**Possíveis causas:**
- Não está logado
- Tela muito pequena (mobile)
- Dados do localStorage corrompidos

**Solução:**
1. Verifique se está logado
2. Redimensione a janela para ≥768px
3. Limpe o localStorage e faça login novamente

### Problema 2: Iniciais incorretas
**Possíveis causas:**
- Nome com formato inesperado
- Função `getInitials` com bug

**Solução:**
1. Verifique o nome no localStorage
2. Verifique a função `getInitials` no código

### Problema 3: Dropdown não abre
**Possíveis causas:**
- Componente DropdownMenu não instalado
- Conflito de z-index

**Solução:**
1. Verifique se `@radix-ui/react-dropdown-menu` está instalado
2. Inspecione o elemento no DevTools

### Problema 4: Logout não funciona
**Possíveis causas:**
- Erro na função `handleLogout`
- Navegação bloqueada

**Solução:**
1. Verifique o console para erros
2. Verifique se a rota `/login` existe

---

## ✅ Checklist de Testes

### Testes Visuais
- [ ] Avatar circular visível
- [ ] Iniciais corretas no avatar
- [ ] Nome completo visível
- [ ] Badge "Colaborador" visível
- [ ] Ícone de dropdown visível
- [ ] Cores consistentes com o tema
- [ ] Alinhamento correto no header

### Testes de Interação
- [ ] Hover muda o fundo
- [ ] Focus mostra anel de foco
- [ ] Clique abre o dropdown
- [ ] Dropdown alinhado à direita
- [ ] Opções do menu visíveis
- [ ] Hover nas opções funciona
- [ ] Clique em "Meu Perfil" navega
- [ ] Clique em "Configurações" navega
- [ ] Clique em "Sair" faz logout

### Testes de Dados
- [ ] Dados carregados do localStorage
- [ ] Nome exibido corretamente
- [ ] Email exibido corretamente
- [ ] Matrícula exibida corretamente
- [ ] Iniciais calculadas corretamente
- [ ] Logout remove dados do localStorage

### Testes de Segurança
- [ ] Redirecionamento se não logado
- [ ] Dados removidos no logout
- [ ] Tratamento de erros no parsing
- [ ] Fallback para dados vazios

### Testes de Responsividade
- [ ] Visível em desktop (≥768px)
- [ ] Oculto em mobile (<768px)
- [ ] Layout não quebra em diferentes tamanhos

---

## 📸 Screenshots Esperados

### 1. Header com Seção de Perfil
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] [Início] [Solicitar] [Dashboard] ... [Avatar FT]        │
│                                              FRANCISCO SILVANO   │
│                                              [Colaborador]  ▼   │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Dropdown Menu Aberto
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] [Início] [Solicitar] [Dashboard] ... [Avatar FT]        │
│                                              FRANCISCO SILVANO   │
│                                              [Colaborador]  ▼   │
│                                         ┌────────────────────┐  │
│                                         │ FRANCISCO SILVANO  │  │
│                                         │ email@email.com    │  │
│                                         │ Matrícula: 000008  │  │
│                                         ├────────────────────┤  │
│                                         │ 👤 Meu Perfil      │  │
│                                         │ ⚙️  Configurações   │  │
│                                         ├────────────────────┤  │
│                                         │ 🚪 Sair (vermelho) │  │
│                                         └────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Resultado Final Esperado

Após todos os testes:
- ✅ Seção de perfil visível no header
- ✅ Avatar com iniciais corretas
- ✅ Nome e badge exibidos
- ✅ Dropdown menu funcional
- ✅ Navegação funcionando
- ✅ Logout funcionando
- ✅ Proteção de rota funcionando
- ✅ Responsividade funcionando
- ✅ Sem erros no console
- ✅ Build sem erros

---

**Boa sorte com os testes! 🚀**

**Dúvidas?** Consulte o arquivo `PERFIL_USUARIO_IMPLEMENTACAO.md` para mais detalhes técnicos.

