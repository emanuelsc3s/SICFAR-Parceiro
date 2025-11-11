# 🔗 Exemplo de Integração: Vouchers localStorage → BeneficioFaturas

## 📋 Objetivo

Este documento mostra como integrar os vouchers salvos no localStorage com a página `BeneficioFaturas.tsx`, permitindo que as faturas sejam geradas automaticamente a partir dos vouchers emitidos.

---

## 🎯 Estratégia de Integração

### Opção 1: Faturas Geradas Automaticamente (Recomendado)

Agrupar vouchers por parceiro e período para criar faturas automaticamente.

### Opção 2: Faturas Manuais com Vouchers do localStorage

Manter faturas mockadas mas buscar vouchers reais do localStorage.

---

## 💡 EXEMPLO 1: Faturas Automáticas a partir do localStorage

### Modificações em `BeneficioFaturas.tsx`:

```typescript
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVouchersEmitidos, getEstatisticasVouchers } from "@/utils/voucherStorage";
// ... outros imports

const BeneficioFaturas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFaturaId, setSelectedFaturaId] = useState<number | null>(null);

  // Estado para faturas geradas a partir dos vouchers
  const [faturas, setFaturas] = useState<any[]>([]);

  // Função para agrupar vouchers por parceiro e gerar faturas
  const gerarFaturasDeVouchers = () => {
    const vouchers = getVouchersEmitidos();
    
    // Agrupar vouchers por parceiro
    const vouchersPorParceiro = vouchers.reduce((acc, voucher) => {
      const parceiro = voucher.parceiro;
      if (!acc[parceiro]) {
        acc[parceiro] = [];
      }
      acc[parceiro].push(voucher);
      return acc;
    }, {} as Record<string, any[]>);

    // Criar faturas a partir dos grupos
    const faturasGeradas = Object.entries(vouchersPorParceiro).map(([parceiro, vouchersGrupo], index) => {
      const valorTotal = vouchersGrupo.reduce((sum, v) => sum + v.valor, 0);
      const datasCriacao = vouchersGrupo.map(v => v.dataResgate);
      const dataMaisRecente = datasCriacao.sort().reverse()[0];

      return {
        id: index + 1,
        parceiro: parceiro,
        referencia: new Date().toISOString().slice(0, 7), // YYYY-MM
        qtdVouchers: vouchersGrupo.length,
        valorTotal: valorTotal,
        status: "Em Revisão",
        dataCriacao: dataMaisRecente,
        vouchers: vouchersGrupo // Adiciona os vouchers à fatura
      };
    });

    return faturasGeradas;
  };

  // Carregar faturas ao montar o componente
  useEffect(() => {
    const faturasGeradas = gerarFaturasDeVouchers();
    setFaturas(faturasGeradas);
  }, []);

  // Função para recarregar faturas (útil após emitir novos vouchers)
  const recarregarFaturas = () => {
    const faturasGeradas = gerarFaturasDeVouchers();
    setFaturas(faturasGeradas);
  };

  const stats = {
    totalFaturas: faturas.length,
    valorTotal: faturas.reduce((sum, fatura) => sum + fatura.valorTotal, 0),
    contestadas: faturas.filter(f => f.status === "Contestada").length,
    aprovadas: faturas.filter(f => f.status === "Aprovada").length
  };

  // ... resto do componente
};
```

---

## 💡 EXEMPLO 2: Híbrido (Faturas Mockadas + Vouchers Reais)

### Modificações em `BeneficioFaturaDetalhe.tsx`:

```typescript
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarVouchersPorParceiro } from "@/utils/voucherStorage";
// ... outros imports

const BeneficioFaturaDetalhe = () => {
  const { faturaId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [vouchers, setVouchers] = useState<any[]>([]);

  // Dados mockados da fatura específica
  const faturaInfo = {
    1: {
      parceiro: "Farmacia Santa Cecilia",
      referencia: "2024-01",
      valorTotal: 1500.00,
      status: "Em Revisão",
      dataCriacao: "31/01/2024"
    },
    // ... outras faturas
  };

  // Carregar vouchers reais do localStorage baseado no parceiro
  useEffect(() => {
    const fatura = faturaInfo[faturaId as keyof typeof faturaInfo];
    if (fatura) {
      // Buscar vouchers do parceiro específico
      const vouchersReais = buscarVouchersPorParceiro(fatura.parceiro);
      
      // Se não houver vouchers reais, usar dados mockados
      if (vouchersReais.length > 0) {
        setVouchers(vouchersReais);
      } else {
        // Fallback para dados mockados
        setVouchers(vouchersPorFatura[faturaId as keyof typeof vouchersPorFatura] || []);
      }
    }
  }, [faturaId]);

  // ... resto do componente
};
```

---

## 💡 EXEMPLO 3: Dashboard de Vouchers em Tempo Real

### Novo Componente: `DashboardVouchers.tsx`

```typescript
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVouchersEmitidos, getEstatisticasVouchers } from "@/utils/voucherStorage";

const DashboardVouchers = () => {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Carregar vouchers e estatísticas
    const vouchersData = getVouchersEmitidos();
    const statsData = getEstatisticasVouchers();
    
    setVouchers(vouchersData);
    setStats(statsData);
  }, []);

  // Atualizar a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const vouchersData = getVouchersEmitidos();
      const statsData = getEstatisticasVouchers();
      setVouchers(vouchersData);
      setStats(statsData);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard de Vouchers</h1>
      
      {/* Cards de Estatísticas */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total de Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              R$ {stats.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emitidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.emitidos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resgatados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.resgatados}</div>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por Parceiro */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vouchers por Parceiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.porParceiro).map(([parceiro, quantidade]) => (
              <div key={parceiro} className="flex items-center justify-between">
                <span className="font-medium">{parceiro}</span>
                <span className="text-2xl font-bold">{quantidade as number}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Vouchers Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Vouchers Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vouchers.slice(0, 10).map((voucher) => (
              <div key={voucher.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{voucher.id}</p>
                  <p className="text-sm text-gray-600">{voucher.funcionario}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">
                    R$ {voucher.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500">{voucher.dataResgate}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardVouchers;
```

---

## 🔄 Sincronização entre Páginas

### Evento Customizado para Atualização em Tempo Real

```typescript
// Em SolicitarBeneficio.tsx, após salvar o voucher:
const saveVoucherToLocalStorage = (voucherData: VoucherEmitido): boolean => {
  const sucesso = salvarVoucherEmitido(voucherData);
  
  if (sucesso) {
    // Disparar evento customizado para notificar outras páginas
    window.dispatchEvent(new CustomEvent('voucherEmitido', { 
      detail: voucherData 
    }));
  }
  
  return sucesso;
};

// Em BeneficioFaturas.tsx, escutar o evento:
useEffect(() => {
  const handleVoucherEmitido = (event: CustomEvent) => {
    console.log('Novo voucher emitido:', event.detail);
    // Recarregar faturas
    recarregarFaturas();
  };

  window.addEventListener('voucherEmitido', handleVoucherEmitido as EventListener);

  return () => {
    window.removeEventListener('voucherEmitido', handleVoucherEmitido as EventListener);
  };
}, []);
```

---

## 📊 Exemplo de Agrupamento por Período

```typescript
// Função para agrupar vouchers por mês
const agruparVouchersPorMes = () => {
  const vouchers = getVouchersEmitidos();
  
  const vouchersPorMes = vouchers.reduce((acc, voucher) => {
    // Extrair mês da data (formato DD/MM/YYYY)
    const [dia, mes, ano] = voucher.dataResgate.split('/');
    const chave = `${ano}-${mes}`; // YYYY-MM
    
    if (!acc[chave]) {
      acc[chave] = [];
    }
    acc[chave].push(voucher);
    return acc;
  }, {} as Record<string, any[]>);

  return vouchersPorMes;
};

// Gerar faturas mensais por parceiro
const gerarFaturasMensaisPorParceiro = () => {
  const vouchers = getVouchersEmitidos();
  
  const faturas = vouchers.reduce((acc, voucher) => {
    const [dia, mes, ano] = voucher.dataResgate.split('/');
    const mesAno = `${ano}-${mes}`;
    const chave = `${voucher.parceiro}_${mesAno}`;
    
    if (!acc[chave]) {
      acc[chave] = {
        parceiro: voucher.parceiro,
        referencia: mesAno,
        vouchers: [],
        valorTotal: 0,
        qtdVouchers: 0
      };
    }
    
    acc[chave].vouchers.push(voucher);
    acc[chave].valorTotal += voucher.valor;
    acc[chave].qtdVouchers += 1;
    
    return acc;
  }, {} as Record<string, any>);

  return Object.values(faturas);
};
```

---

## 🎨 Exemplo de Filtros Avançados

```typescript
// Filtrar vouchers por múltiplos critérios
const filtrarVouchers = (filtros: {
  parceiro?: string;
  status?: string;
  dataInicio?: string;
  dataFim?: string;
  valorMinimo?: number;
  valorMaximo?: number;
}) => {
  let vouchers = getVouchersEmitidos();

  if (filtros.parceiro) {
    vouchers = vouchers.filter(v => 
      v.parceiro.toLowerCase().includes(filtros.parceiro!.toLowerCase())
    );
  }

  if (filtros.status) {
    vouchers = vouchers.filter(v => v.status === filtros.status);
  }

  if (filtros.dataInicio) {
    vouchers = vouchers.filter(v => {
      const dataVoucher = converterDataBR(v.dataResgate);
      const dataInicio = converterDataBR(filtros.dataInicio!);
      return dataVoucher >= dataInicio;
    });
  }

  if (filtros.dataFim) {
    vouchers = vouchers.filter(v => {
      const dataVoucher = converterDataBR(v.dataResgate);
      const dataFim = converterDataBR(filtros.dataFim!);
      return dataVoucher <= dataFim;
    });
  }

  if (filtros.valorMinimo !== undefined) {
    vouchers = vouchers.filter(v => v.valor >= filtros.valorMinimo!);
  }

  if (filtros.valorMaximo !== undefined) {
    vouchers = vouchers.filter(v => v.valor <= filtros.valorMaximo!);
  }

  return vouchers;
};

// Função auxiliar para converter data BR para Date
const converterDataBR = (dataBR: string): Date => {
  const [dia, mes, ano] = dataBR.split('/');
  return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
};
```

---

## 🚀 Próximos Passos

1. **Escolher a estratégia de integração** (Automática, Híbrida ou Manual)
2. **Implementar a estratégia escolhida** em `BeneficioFaturas.tsx`
3. **Testar a integração** emitindo novos vouchers
4. **Adicionar filtros e buscas** conforme necessário
5. **Implementar sincronização** com backend (futuro)

---

## 📝 Notas Importantes

- Os exemplos acima são **sugestões** e podem ser adaptados conforme necessário
- Mantenha sempre a **compatibilidade** com a estrutura de dados existente
- Adicione **validações** apropriadas antes de processar os dados
- Implemente **tratamento de erros** em todas as operações
- Considere adicionar **loading states** durante o carregamento dos dados

---

**Data:** 11/11/2025  
**Versão:** 1.0.0

