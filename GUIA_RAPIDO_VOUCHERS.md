# 🚀 Guia Rápido - Sistema de Vouchers com localStorage

## 📖 Introdução

Este guia mostra como usar o sistema de vouchers implementado no SICFAR-RH, incluindo exemplos práticos de código que você pode usar em suas páginas.

---

## 🎯 Casos de Uso Comuns

### 1. Listar Todos os Vouchers

```typescript
import { getVouchersEmitidos } from '@/utils/voucherStorage';

// Em qualquer componente
const MeusVouchers = () => {
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    const todosVouchers = getVouchersEmitidos();
    setVouchers(todosVouchers);
  }, []);

  return (
    <div>
      <h2>Meus Vouchers ({vouchers.length})</h2>
      {vouchers.map(voucher => (
        <div key={voucher.id}>
          <p>Voucher: {voucher.id}</p>
          <p>Valor: R$ {voucher.valor.toFixed(2)}</p>
          <p>Data: {voucher.dataResgate}</p>
        </div>
      ))}
    </div>
  );
};
```

---

### 2. Buscar Vouchers de um Funcionário

```typescript
import { buscarVouchersPorCPF } from '@/utils/voucherStorage';

const VouchersDoFuncionario = ({ cpf }: { cpf: string }) => {
  const vouchers = buscarVouchersPorCPF(cpf);

  return (
    <div>
      <h3>Vouchers de {cpf}</h3>
      <p>Total: {vouchers.length}</p>
      <p>Valor Total: R$ {vouchers.reduce((sum, v) => sum + v.valor, 0).toFixed(2)}</p>
    </div>
  );
};
```

---

### 3. Exibir Estatísticas

```typescript
import { getEstatisticasVouchers } from '@/utils/voucherStorage';

const DashboardStats = () => {
  const stats = getEstatisticasVouchers();

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="card">
        <h3>Total de Vouchers</h3>
        <p className="text-3xl">{stats.total}</p>
      </div>
      
      <div className="card">
        <h3>Valor Total</h3>
        <p className="text-3xl">R$ {stats.valorTotal.toFixed(2)}</p>
      </div>
      
      <div className="card">
        <h3>Emitidos</h3>
        <p className="text-3xl text-green-600">{stats.emitidos}</p>
      </div>
      
      <div className="card">
        <h3>Resgatados</h3>
        <p className="text-3xl text-blue-600">{stats.resgatados}</p>
      </div>
    </div>
  );
};
```

---

### 4. Filtrar Vouchers por Parceiro

```typescript
import { buscarVouchersPorParceiro } from '@/utils/voucherStorage';

const VouchersPorParceiro = () => {
  const [parceiro, setParceiro] = useState('');
  const [vouchers, setVouchers] = useState([]);

  const handleBuscar = () => {
    const resultado = buscarVouchersPorParceiro(parceiro);
    setVouchers(resultado);
  };

  return (
    <div>
      <input 
        type="text" 
        value={parceiro}
        onChange={(e) => setParceiro(e.target.value)}
        placeholder="Nome do parceiro..."
      />
      <button onClick={handleBuscar}>Buscar</button>
      
      <div>
        <p>Encontrados: {vouchers.length} vouchers</p>
        {vouchers.map(v => (
          <div key={v.id}>{v.id} - R$ {v.valor.toFixed(2)}</div>
        ))}
      </div>
    </div>
  );
};
```

---

### 5. Atualizar Status de um Voucher

```typescript
import { atualizarStatusVoucher } from '@/utils/voucherStorage';

const MarcarComoResgatado = ({ voucherId }: { voucherId: string }) => {
  const handleResgatar = () => {
    const sucesso = atualizarStatusVoucher(voucherId, 'resgatado');
    
    if (sucesso) {
      toast.success('Voucher marcado como resgatado!');
    } else {
      toast.error('Erro ao atualizar voucher');
    }
  };

  return (
    <button onClick={handleResgatar}>
      Marcar como Resgatado
    </button>
  );
};
```

---

### 6. Exportar Vouchers para Backup

```typescript
import { exportarVouchersJSON } from '@/utils/voucherStorage';

const ExportarVouchers = () => {
  const handleExportar = () => {
    const jsonData = exportarVouchersJSON();
    
    // Criar arquivo para download
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vouchers_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Backup exportado com sucesso!');
  };

  return (
    <button onClick={handleExportar}>
      📥 Exportar Vouchers
    </button>
  );
};
```

---

### 7. Importar Vouchers de Backup

```typescript
import { importarVouchersJSON } from '@/utils/voucherStorage';

const ImportarVouchers = () => {
  const handleImportar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const jsonData = e.target?.result as string;
      const sucesso = importarVouchersJSON(jsonData, false);
      
      if (sucesso) {
        toast.success('Vouchers importados com sucesso!');
      } else {
        toast.error('Erro ao importar vouchers');
      }
    };
    reader.readAsText(file);
  };

  return (
    <input 
      type="file" 
      accept=".json"
      onChange={handleImportar}
    />
  );
};
```

---

### 8. Agrupar Vouchers por Mês

```typescript
import { getVouchersEmitidos } from '@/utils/voucherStorage';

const VouchersPorMes = () => {
  const vouchers = getVouchersEmitidos();
  
  // Agrupar por mês
  const vouchersPorMes = vouchers.reduce((acc, voucher) => {
    const [dia, mes, ano] = voucher.dataResgate.split('/');
    const chave = `${mes}/${ano}`;
    
    if (!acc[chave]) {
      acc[chave] = [];
    }
    acc[chave].push(voucher);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div>
      {Object.entries(vouchersPorMes).map(([mes, vouchersDoMes]) => (
        <div key={mes}>
          <h3>{mes}</h3>
          <p>Quantidade: {vouchersDoMes.length}</p>
          <p>Total: R$ {vouchersDoMes.reduce((sum, v) => sum + v.valor, 0).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};
```

---

### 9. Verificar Vouchers Próximos do Vencimento

```typescript
import { getVouchersEmitidos } from '@/utils/voucherStorage';

const VouchersProximosVencimento = () => {
  const vouchers = getVouchersEmitidos();
  const hoje = new Date();
  const diasAlerta = 7; // Alertar 7 dias antes

  const vouchersProximos = vouchers.filter(voucher => {
    if (!voucher.dataValidade) return false;
    
    const [dia, mes, ano] = voucher.dataValidade.split('/');
    const dataValidade = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    const diasRestantes = Math.floor((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    return diasRestantes >= 0 && diasRestantes <= diasAlerta;
  });

  return (
    <div>
      <h3>⚠️ Vouchers Próximos do Vencimento</h3>
      {vouchersProximos.length === 0 ? (
        <p>Nenhum voucher próximo do vencimento</p>
      ) : (
        vouchersProximos.map(v => (
          <div key={v.id} className="alert">
            <p>{v.id} - Vence em {v.dataValidade}</p>
          </div>
        ))
      )}
    </div>
  );
};
```

---

### 10. Limpar Vouchers Antigos

```typescript
import { getVouchersEmitidos, removerVoucher } from '@/utils/voucherStorage';

const LimparVouchersAntigos = () => {
  const handleLimpar = () => {
    const vouchers = getVouchersEmitidos();
    const hoje = new Date();
    let removidos = 0;

    vouchers.forEach(voucher => {
      if (!voucher.dataValidade) return;
      
      const [dia, mes, ano] = voucher.dataValidade.split('/');
      const dataValidade = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
      
      // Se expirado há mais de 30 dias
      if (dataValidade.getTime() < hoje.getTime() - (30 * 24 * 60 * 60 * 1000)) {
        if (removerVoucher(voucher.id)) {
          removidos++;
        }
      }
    });

    toast.success(`${removidos} vouchers antigos removidos`);
  };

  return (
    <button onClick={handleLimpar} className="btn-danger">
      🗑️ Limpar Vouchers Expirados
    </button>
  );
};
```

---

## 🔍 Debugging e Inspeção

### Ver Todos os Dados no Console

```javascript
// Abra o console do navegador (F12) e execute:

// Ver todos os vouchers
const vouchers = JSON.parse(localStorage.getItem('vouchers_emitidos'));
console.table(vouchers);

// Ver estatísticas
import { getEstatisticasVouchers } from '@/utils/voucherStorage';
console.log(getEstatisticasVouchers());

// Ver vouchers de um CPF específico
import { buscarVouchersPorCPF } from '@/utils/voucherStorage';
console.log(buscarVouchersPorCPF('123.456.789-00'));
```

---

## 🎨 Componente Completo de Exemplo

```typescript
import { useState, useEffect } from 'react';
import { 
  getVouchersEmitidos, 
  getEstatisticasVouchers,
  buscarVouchersPorCPF,
  atualizarStatusVoucher 
} from '@/utils/voucherStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const GerenciadorVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [stats, setStats] = useState(null);
  const [filtro, setFiltro] = useState('todos');

  const carregarDados = () => {
    const todosVouchers = getVouchersEmitidos();
    const estatisticas = getEstatisticasVouchers();
    
    setVouchers(todosVouchers);
    setStats(estatisticas);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const vouchersFiltrados = vouchers.filter(v => {
    if (filtro === 'todos') return true;
    return v.status === filtro;
  });

  const handleMarcarResgatado = (voucherId: string) => {
    if (atualizarStatusVoucher(voucherId, 'resgatado')) {
      carregarDados();
      toast.success('Voucher atualizado!');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gerenciador de Vouchers</h1>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Valor Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                R$ {stats.valorTotal.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Emitidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {stats.emitidos}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resgatados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {stats.resgatados}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={filtro === 'todos' ? 'default' : 'outline'}
          onClick={() => setFiltro('todos')}
        >
          Todos
        </Button>
        <Button 
          variant={filtro === 'emitido' ? 'default' : 'outline'}
          onClick={() => setFiltro('emitido')}
        >
          Emitidos
        </Button>
        <Button 
          variant={filtro === 'resgatado' ? 'default' : 'outline'}
          onClick={() => setFiltro('resgatado')}
        >
          Resgatados
        </Button>
      </div>

      {/* Lista de Vouchers */}
      <div className="space-y-3">
        {vouchersFiltrados.map(voucher => (
          <Card key={voucher.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{voucher.id}</p>
                  <p className="text-sm text-gray-600">{voucher.funcionario}</p>
                  <p className="text-xs text-gray-500">{voucher.cpf}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    R$ {voucher.valor.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {voucher.dataResgate} às {voucher.horaResgate}
                  </p>
                  <Badge variant={voucher.status === 'emitido' ? 'default' : 'secondary'}>
                    {voucher.status}
                  </Badge>
                </div>
                
                {voucher.status === 'emitido' && (
                  <Button 
                    size="sm"
                    onClick={() => handleMarcarResgatado(voucher.id)}
                  >
                    Marcar como Resgatado
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GerenciadorVouchers;
```

---

## 📝 Dicas Importantes

1. **Sempre use try-catch** ao trabalhar com localStorage
2. **Valide os dados** antes de processar
3. **Use TypeScript** para garantir tipagem correta
4. **Adicione logs** para facilitar debugging
5. **Teste em diferentes navegadores** (Chrome, Firefox, Safari)
6. **Considere limites de armazenamento** (localStorage tem limite de ~5-10MB)
7. **Faça backups regulares** dos dados importantes

---

**Última Atualização:** 11/11/2025  
**Versão:** 1.0.0

