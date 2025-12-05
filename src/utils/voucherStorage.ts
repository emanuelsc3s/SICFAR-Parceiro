/**
 * Utilitário para gerenciar vouchers no localStorage
 * Mantém compatibilidade com a estrutura de dados utilizada em BeneficioFaturas.tsx
 */

// Interface para os dados do voucher armazenado
export interface VoucherEmitido {
  id: string;                    // Número do voucher (ex: "VOU12345678")
  funcionario: string;           // Nome completo do funcionário
  cpf: string;                   // CPF formatado (XXX.XXX.XXX-XX)
  valor: number;                 // Valor total do voucher
  dataResgate: string;           // Data de resgate (DD/MM/YYYY) - vazio se ainda não resgatado
  horaResgate: string;           // Hora de resgate (HH:MM) - vazio se ainda não resgatado
  beneficios: string[];          // Lista de benefícios incluídos
  parceiro: string;              // Nome do parceiro/benefício principal
  status?: 'emitido' | 'resgatado' | 'expirado';  // Status do voucher (opcional)
  dataValidade?: string;         // Data de validade (opcional)
}

// Chave utilizada no localStorage
const VOUCHERS_KEY = 'vouchers_emitidos';

/**
 * Recupera todos os vouchers armazenados no localStorage
 * @returns Array de vouchers emitidos
 */
export const getVouchersEmitidos = (): VoucherEmitido[] => {
  try {
    const data = localStorage.getItem(VOUCHERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('❌ Erro ao carregar vouchers do localStorage:', error);
    return [];
  }
};

/**
 * Salva um novo voucher no localStorage
 * @param voucher - Dados do voucher a ser salvo
 * @returns true se salvou com sucesso, false caso contrário
 */
export const salvarVoucherEmitido = (voucher: VoucherEmitido): boolean => {
  try {
    // Validação dos dados obrigatórios
    if (!voucher.id || !voucher.funcionario || !voucher.cpf) {
      console.error('❌ Dados obrigatórios do voucher estão faltando:', voucher);
      return false;
    }

    // Recupera vouchers existentes
    const vouchers = getVouchersEmitidos();
    
    // Verifica se já existe um voucher com o mesmo ID
    const existeVoucher = vouchers.some(v => v.id === voucher.id);
    if (existeVoucher) {
      console.warn('⚠️ Voucher com ID já existe:', voucher.id);
      return false;
    }

    // Adiciona o novo voucher
    vouchers.push(voucher);
    
    // Salva no localStorage
    localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchers));
    
    console.log('✅ Voucher salvo com sucesso:', voucher.id);
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar voucher no localStorage:', error);
    return false;
  }
};

/**
 * Busca um voucher específico pelo ID
 * @param voucherId - ID do voucher a ser buscado
 * @returns Voucher encontrado ou undefined
 */
export const buscarVoucherPorId = (voucherId: string): VoucherEmitido | undefined => {
  try {
    const vouchers = getVouchersEmitidos();
    return vouchers.find(v => v.id === voucherId);
  } catch (error) {
    console.error('❌ Erro ao buscar voucher:', error);
    return undefined;
  }
};

/**
 * Busca vouchers por CPF do funcionário
 * @param cpf - CPF do funcionário
 * @returns Array de vouchers do funcionário
 */
export const buscarVouchersPorCPF = (cpf: string): VoucherEmitido[] => {
  try {
    const vouchers = getVouchersEmitidos();
    return vouchers.filter(v => v.cpf === cpf);
  } catch (error) {
    console.error('❌ Erro ao buscar vouchers por CPF:', error);
    return [];
  }
};

/**
 * Busca vouchers por parceiro
 * @param parceiro - Nome do parceiro
 * @returns Array de vouchers do parceiro
 */
export const buscarVouchersPorParceiro = (parceiro: string): VoucherEmitido[] => {
  try {
    const vouchers = getVouchersEmitidos();
    return vouchers.filter(v => v.parceiro.toLowerCase().includes(parceiro.toLowerCase()));
  } catch (error) {
    console.error('❌ Erro ao buscar vouchers por parceiro:', error);
    return [];
  }
};

/**
 * Atualiza o status de um voucher
 * @param voucherId - ID do voucher
 * @param novoStatus - Novo status do voucher
 * @returns true se atualizou com sucesso, false caso contrário
 */
export const atualizarStatusVoucher = (
  voucherId: string,
  novoStatus: 'emitido' | 'resgatado' | 'expirado'
): boolean => {
  try {
    const vouchers = getVouchersEmitidos();
    const index = vouchers.findIndex(v => v.id === voucherId);

    if (index === -1) {
      console.warn('⚠️ Voucher não encontrado:', voucherId);
      return false;
    }

    vouchers[index].status = novoStatus;
    localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchers));

    console.log('✅ Status do voucher atualizado:', voucherId, novoStatus);
    return true;
  } catch (error) {
    console.error('❌ Erro ao atualizar status do voucher:', error);
    return false;
  }
};

/**
 * Registra o resgate de um voucher
 * @param voucher - Dados completos do voucher a ser resgatado
 * @param valorResgatado - Valor resgatado
 * @returns true se registrou com sucesso, false caso contrário
 */
export const registrarResgateVoucher = (
  voucher: {
    codigo: string;
    beneficiario: string;
    cpf?: string;
    valor: number;
    estabelecimento?: string;
    beneficios?: string[];
  },
  valorResgatado: number
): boolean => {
  try {
    const vouchers = getVouchersEmitidos();
    const index = vouchers.findIndex(v => v.id === voucher.codigo);

    const agora = new Date();
    const dataResgate = agora.toLocaleDateString('pt-BR');
    const horaResgate = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    if (index === -1) {
      // Voucher não existe, criar novo
      console.log('📝 Criando novo voucher no localStorage:', voucher.codigo);

      const novoVoucher: VoucherEmitido = {
        id: voucher.codigo,
        funcionario: voucher.beneficiario,
        cpf: voucher.cpf || 'Não informado',
        valor: valorResgatado,
        dataResgate: dataResgate,
        horaResgate: horaResgate,
        beneficios: voucher.beneficios || [],
        parceiro: voucher.estabelecimento || 'Estabelecimento',
        status: 'resgatado'
      };

      vouchers.push(novoVoucher);
    } else {
      // Voucher existe, atualizar
      console.log('🔄 Atualizando voucher existente:', voucher.codigo);

      vouchers[index].status = 'resgatado';
      vouchers[index].dataResgate = dataResgate;
      vouchers[index].horaResgate = horaResgate;
      vouchers[index].valor = valorResgatado;
    }

    localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchers));

    // Dispara evento customizado para notificar outras partes da aplicação
    window.dispatchEvent(new CustomEvent('voucherResgatado', {
      detail: { voucherId: voucher.codigo, voucher: vouchers[index >= 0 ? index : vouchers.length - 1] }
    }));

    console.log('✅ Resgate do voucher registrado:', voucher.codigo);
    return true;
  } catch (error) {
    console.error('❌ Erro ao registrar resgate do voucher:', error);
    return false;
  }
};

/**
 * Remove um voucher do localStorage
 * @param voucherId - ID do voucher a ser removido
 * @returns true se removeu com sucesso, false caso contrário
 */
export const removerVoucher = (voucherId: string): boolean => {
  try {
    const vouchers = getVouchersEmitidos();
    const vouchersFiltrados = vouchers.filter(v => v.id !== voucherId);
    
    if (vouchers.length === vouchersFiltrados.length) {
      console.warn('⚠️ Voucher não encontrado para remoção:', voucherId);
      return false;
    }

    localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchersFiltrados));
    
    console.log('✅ Voucher removido com sucesso:', voucherId);
    return true;
  } catch (error) {
    console.error('❌ Erro ao remover voucher:', error);
    return false;
  }
};

/**
 * Limpa todos os vouchers do localStorage
 * @returns true se limpou com sucesso, false caso contrário
 */
export const limparTodosVouchers = (): boolean => {
  try {
    localStorage.removeItem(VOUCHERS_KEY);
    console.log('✅ Todos os vouchers foram removidos do localStorage');
    return true;
  } catch (error) {
    console.error('❌ Erro ao limpar vouchers:', error);
    return false;
  }
};

/**
 * Obtém estatísticas dos vouchers armazenados
 * @returns Objeto com estatísticas dos vouchers
 */
export const getEstatisticasVouchers = () => {
  try {
    const vouchers = getVouchersEmitidos();
    
    return {
      total: vouchers.length,
      valorTotal: vouchers.reduce((sum, v) => sum + v.valor, 0),
      emitidos: vouchers.filter(v => v.status === 'emitido').length,
      resgatados: vouchers.filter(v => v.status === 'resgatado').length,
      expirados: vouchers.filter(v => v.status === 'expirado').length,
      porParceiro: vouchers.reduce((acc, v) => {
        acc[v.parceiro] = (acc[v.parceiro] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  } catch (error) {
    console.error('❌ Erro ao calcular estatísticas:', error);
    return {
      total: 0,
      valorTotal: 0,
      emitidos: 0,
      resgatados: 0,
      expirados: 0,
      porParceiro: {}
    };
  }
};

/**
 * Exporta todos os vouchers para formato JSON
 * @returns String JSON com todos os vouchers
 */
export const exportarVouchersJSON = (): string => {
  try {
    const vouchers = getVouchersEmitidos();
    return JSON.stringify(vouchers, null, 2);
  } catch (error) {
    console.error('❌ Erro ao exportar vouchers:', error);
    return '[]';
  }
};

/**
 * Importa vouchers de um JSON
 * @param jsonData - String JSON com os vouchers
 * @param substituir - Se true, substitui todos os vouchers existentes
 * @returns true se importou com sucesso, false caso contrário
 */
export const importarVouchersJSON = (jsonData: string, substituir: boolean = false): boolean => {
  try {
    const novosVouchers: VoucherEmitido[] = JSON.parse(jsonData);
    
    if (!Array.isArray(novosVouchers)) {
      console.error('❌ Dados inválidos: esperado um array de vouchers');
      return false;
    }

    if (substituir) {
      localStorage.setItem(VOUCHERS_KEY, JSON.stringify(novosVouchers));
    } else {
      const vouchersExistentes = getVouchersEmitidos();
      const vouchersCombinados = [...vouchersExistentes, ...novosVouchers];
      localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchersCombinados));
    }
    
    console.log('✅ Vouchers importados com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao importar vouchers:', error);
    return false;
  }
};

