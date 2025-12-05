import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  Scan,
  QrCode,
  User,
  Calendar,
  Building2,
  Banknote,
  Printer,
  RotateCcw,
  Loader2,
  Sparkles,
  Receipt,
  DollarSign,
  Barcode,
  Home,
  History,
  DollarSign as FinanceIcon,
  Settings,
  Store,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { registrarResgateVoucher } from '@/utils/voucherStorage';

interface VoucherData {
  codigo: string;
  beneficiario: string;
  valor: number;
  estabelecimento: string;
  dataValidade: string;
  status: 'ativo' | 'usado' | 'expirado';
  cpf?: string;
  beneficios?: string[];
}

const ScannerParceiro = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [codigo, setCodigo] = useState<string>('');
  const [voucherData, setVoucherData] = useState<VoucherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [valorFornecido, setValorFornecido] = useState<string>('');
  const [etapa, setEtapa] = useState<'entrada' | 'dados' | 'valor' | 'finalizado'>('entrada');
  const [isConfirming, setIsConfirming] = useState(false);
  const [activeButton, setActiveButton] = useState("Validar Voucher");

  // Botões de navegação do header (mesmo padrão do PortalParceiro)
  const navigationButtons = [
    { name: "Início", icon: Home, path: '/portalparceiro' },
    { name: "Validar Voucher", icon: QrCode, path: '/scannerparceiro' },
    { name: "Histórico", icon: History, path: '/portalparceiro' },
    { name: "Financeiro", icon: FinanceIcon, path: '/portalparceiro' },
    { name: "Configurações", icon: Settings, path: '/portalparceiro' }
  ];

  // Auto-focus no input quando a página carrega ou quando reseta
  useEffect(() => {
    if (etapa === 'entrada' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [etapa]);

  // Simulação de dados do voucher para demonstração
  const simulateVoucherLookup = (codigo: string): VoucherData | null => {
    const mockVouchers: { [key: string]: VoucherData } = {
      // Vouchers Pendentes
      'VOU12345678': {
        codigo: 'VOU12345678',
        beneficiario: 'João Silva',
        cpf: '123.456.789-00',
        valor: 150.00,
        estabelecimento: 'Farmácia Central',
        dataValidade: '2024-12-31',
        status: 'ativo',
        beneficios: ['Vale Farmácia', 'Medicamentos']
      },
      'VOU22334455': {
        codigo: 'VOU22334455',
        beneficiario: 'Fernanda Almeida',
        cpf: '222.333.444-55',
        valor: 120.00,
        estabelecimento: 'Farmácia Central',
        dataValidade: '2024-12-31',
        status: 'ativo',
        beneficios: ['Vale Farmácia']
      },
      'VOU33445566': {
        codigo: 'VOU33445566',
        beneficiario: 'Juliana Ferreira',
        cpf: '333.444.555-66',
        valor: 95.00,
        estabelecimento: 'Farmácia Central',
        dataValidade: '2024-12-31',
        status: 'ativo',
        beneficios: ['Vale Farmácia', 'Medicamentos']
      },
      'VOU55443322': {
        codigo: 'VOU55443322',
        beneficiario: 'Camila Barbosa',
        cpf: '554.433.222-11',
        valor: 220.00,
        estabelecimento: 'Farmácia Central',
        dataValidade: '2024-12-31',
        status: 'ativo',
        beneficios: ['Vale Farmácia']
      },
      'VOU11009988': {
        codigo: 'VOU11009988',
        beneficiario: 'Larissa Martins',
        cpf: '110.099.888-77',
        valor: 280.00,
        estabelecimento: 'Farmácia Central',
        dataValidade: '2024-12-31',
        status: 'ativo',
        beneficios: ['Vale Farmácia', 'Medicamentos']
      },
      // Vouchers Validados (já usados)
      'VOU87654321': {
        codigo: 'VOU87654321',
        beneficiario: 'Maria Santos',
        cpf: '987.654.321-00',
        valor: 250.00,
        estabelecimento: 'Farmácia Central',
        dataValidade: '2024-12-31',
        status: 'usado',
        beneficios: ['Vale Farmácia']
      },
      'VOU11223344': {
        codigo: 'VOU11223344',
        beneficiario: 'Pedro Oliveira',
        cpf: '111.222.333-44',
        valor: 80.00,
        estabelecimento: 'Farmácia Central',
        dataValidade: '2024-12-31',
        status: 'usado',
        beneficios: ['Vale Farmácia', 'Medicamentos']
      },
      'VOU99001122': {
        codigo: 'VOU99001122',
        beneficiario: 'Carlos Lima',
        cpf: '999.000.111-22',
        valor: 175.00,
        estabelecimento: 'Farmácia Central',
        dataValidade: '2024-12-31',
        status: 'usado',
        beneficios: ['Vale Farmácia']
      },
      'VOU66778899': {
        codigo: 'VOU66778899',
        beneficiario: 'Roberto Mendes',
        cpf: '666.777.888-99',
        valor: 200.00,
        estabelecimento: 'Farmácia Central',
        dataValidade: '2024-12-31',
        status: 'usado',
        beneficios: ['Vale Farmácia', 'Medicamentos']
      },
      'VOU77889900': {
        codigo: 'VOU77889900',
        beneficiario: 'Ricardo Souza',
        cpf: '777.888.999-00',
        valor: 180.00,
        estabelecimento: 'Farmácia Central',
        dataValidade: '2024-12-31',
        status: 'usado',
        beneficios: ['Vale Farmácia']
      },
      'VOU88990011': {
        codigo: 'VOU88990011',
        beneficiario: 'Marcos Pereira',
        cpf: '888.999.000-11',
        valor: 145.00,
        estabelecimento: 'Farmácia Central',
        dataValidade: '2024-12-31',
        status: 'usado',
        beneficios: ['Vale Farmácia', 'Medicamentos']
      },
      'VOU99887766': {
        codigo: 'VOU99887766',
        beneficiario: 'Bruno Cardoso',
        cpf: '998.877.666-55',
        valor: 165.00,
        estabelecimento: 'Farmácia Central',
        dataValidade: '2024-12-31',
        status: 'usado',
        beneficios: ['Vale Farmácia']
      },
      'VOU66554433': {
        codigo: 'VOU66554433',
        beneficiario: 'Thiago Nascimento',
        cpf: '665.544.333-22',
        valor: 190.00,
        estabelecimento: 'Farmácia Central',
        dataValidade: '2024-12-31',
        status: 'usado',
        beneficios: ['Vale Farmácia', 'Medicamentos']
      },
      // Vouchers Rejeitados
      'VOU55667788': {
        codigo: 'VOU55667788',
        beneficiario: 'Ana Costa',
        cpf: '555.666.777-88',
        valor: 300.00,
        estabelecimento: 'Farmácia Central',
        dataValidade: '2024-12-31',
        status: 'usado',
        beneficios: ['Vale Farmácia']
      },
      'VOU44556677': {
        codigo: 'VOU44556677',
        beneficiario: 'Patrícia Rocha',
        cpf: '444.555.666-77',
        valor: 350.00,
        estabelecimento: 'Farmácia Central',
        dataValidade: '2024-12-31',
        status: 'usado',
        beneficios: ['Vale Farmácia', 'Medicamentos']
      }
    };

    return mockVouchers[codigo] || null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigo.trim()) {
      processVoucherCode(codigo.trim());
    }
  };

  const processVoucherCode = async (codigo: string) => {
    setIsLoading(true);

    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const voucher = simulateVoucherLookup(codigo);

      if (voucher) {
        setVoucherData(voucher);
        setEtapa('dados');
        if (voucher.status === 'ativo') {
          toast.success('Voucher válido encontrado!', {
            description: `Beneficiário: ${voucher.beneficiario}`,
            duration: 4000
          });
        } else if (voucher.status === 'usado') {
          toast.error('Voucher já foi utilizado!', {
            description: 'Este voucher já foi processado anteriormente.',
            duration: 4000
          });
        } else {
          toast.error('Voucher expirado!', {
            description: 'A validade deste voucher já passou.',
            duration: 4000
          });
        }
      } else {
        toast.error('Voucher não encontrado!', {
          description: 'Verifique o código e tente novamente.',
          duration: 4000
        });
        setVoucherData(null);
      }
    } catch (error) {
      toast.error('Erro ao consultar voucher');
    } finally {
      setIsLoading(false);
    }
  };



  const handleConfirmarDados = () => {
    setEtapa('valor');
  };

  const handleFinalizarAtendimento = async () => {
    if (!voucherData || !valorFornecido) return;

    setIsConfirming(true);

    try {
      // Simular confirmação de uso
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Atualizar o status do voucher
      setVoucherData({
        ...voucherData,
        status: 'usado'
      });

      // Registrar o resgate no localStorage
      const valorResgate = parseFloat(valorFornecido);
      const dadosVoucher = {
        codigo: voucherData.codigo,
        beneficiario: voucherData.beneficiario,
        cpf: voucherData.cpf,
        valor: voucherData.valor,
        estabelecimento: voucherData.estabelecimento,
        beneficios: voucherData.beneficios
      };

      const sucesso = registrarResgateVoucher(dadosVoucher, valorResgate);

      if (sucesso) {
        console.log('✅ Voucher resgatado e salvo no localStorage:', voucherData.codigo);
      } else {
        console.warn('⚠️ Não foi possível salvar o resgate no localStorage');
      }

      setEtapa('finalizado');
      toast.success('Atendimento finalizado com sucesso! 🎉', {
        description: `Valor: R$ ${parseFloat(valorFornecido).toFixed(2)}`,
        duration: 5000
      });
    } catch (error) {
      toast.error('Erro ao confirmar atendimento');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleImprimir = () => {
    window.print();
    toast.success('Voucher enviado para impressão');
  };

  const resetScanner = () => {
    setCodigo('');
    setVoucherData(null);
    setValorFornecido('');
    setEtapa('entrada');
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ativo':
        return {
          color: 'bg-emerald-500',
          bgLight: 'bg-emerald-50',
          textColor: 'text-emerald-700',
          borderColor: 'border-emerald-200',
          icon: <CheckCircle className="w-5 h-5" />,
          label: 'Ativo'
        };
      case 'usado':
        return {
          color: 'bg-gray-500',
          bgLight: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          icon: <XCircle className="w-5 h-5" />,
          label: 'Utilizado'
        };
      case 'expirado':
        return {
          color: 'bg-red-500',
          bgLight: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          icon: <XCircle className="w-5 h-5" />,
          label: 'Expirado'
        };
      default:
        return {
          color: 'bg-gray-500',
          bgLight: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          icon: <XCircle className="w-5 h-5" />,
          label: 'Desconhecido'
        };
    }
  };

  // Indicador de progresso das etapas
  const etapas = [
    { id: 'entrada', label: 'Entrada do Código', numero: 1 },
    { id: 'dados', label: 'Verificar Dados', numero: 2 },
    { id: 'valor', label: 'Informar Valor', numero: 3 },
    { id: 'finalizado', label: 'Finalizado', numero: 4 }
  ];

  const getEtapaNumero = () => {
    const idx = etapas.findIndex(e => e.id === etapa);
    return idx >= 0 ? idx + 1 : 1;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation - Seguindo padrão de PortalParceiro.tsx */}
      <header
        className="text-white px-6 py-2"
        style={{ backgroundColor: "#1E3A8A" }}
        role="banner"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="/farmace-logo.png"
              alt="Farmace Logo"
              className="object-contain h-8"
              style={{ width: "149.98px", height: "68.97px" }}
            />
          </div>

          {/* Navegação desktop */}
          <nav
            className="hidden md:flex items-center space-x-2 ml-12"
            role="navigation"
            aria-label="Menu principal do parceiro"
          >
            {navigationButtons.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`transition-colors px-3 py-2 text-sm ${
                  activeButton === button.name
                    ? "bg-white/30 text-white border-b-2 border-white/60"
                    : "text-white hover:bg-white/20 hover:text-white"
                }`}
                onClick={() => {
                  setActiveButton(button.name);
                  navigate(button.path);
                }}
                aria-current={activeButton === button.name ? "page" : undefined}
              >
                {button.icon && <button.icon className="w-4 h-4 mr-2" aria-hidden="true" />}
                {button.name}
              </Button>
            ))}
          </nav>

          {/* Indicador de parceiro logado */}
          <div className="hidden lg:flex items-center space-x-2">
            <Store className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm font-medium">Farmácia Central</span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Indicador de Etapas */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            {etapas.map((e, index) => (
              <React.Fragment key={e.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      getEtapaNumero() > e.numero
                        ? 'bg-emerald-500 text-white'
                        : getEtapaNumero() === e.numero
                        ? 'bg-[#1E3A8A] text-white ring-4 ring-[#1E3A8A]/20'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {getEtapaNumero() > e.numero ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      e.numero
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium hidden sm:block ${
                    getEtapaNumero() >= e.numero ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {e.label}
                  </span>
                </div>
                {index < etapas.length - 1 && (
                  <div className={`w-8 sm:w-16 h-1 rounded-full transition-all duration-300 ${
                    getEtapaNumero() > e.numero ? 'bg-emerald-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-[#1E3A8A] animate-spin" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center">
                  <Scan className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">Consultando Voucher</p>
                <p className="text-sm text-gray-500">Aguarde enquanto verificamos os dados...</p>
              </div>
            </div>
          </Card>
        )}

        {/* Etapa 1: Entrada do Código */}
        {!isLoading && etapa === 'entrada' && (
          <div className="space-y-6">
            {/* Hero Card */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-700 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                    <Barcode className="w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Processar Voucher</h1>
                    <p className="text-blue-100">Use o leitor de código de barras ou digite manualmente</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Formulário de Entrada */}
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="relative mx-auto w-24 h-24 mb-4">
                    <div className="absolute inset-0 bg-[#1E3A8A]/5 rounded-3xl animate-pulse" />
                    <div className="absolute inset-2 bg-[#1E3A8A]/10 rounded-2xl flex items-center justify-center">
                      <Scan className="w-12 h-12 text-[#1E3A8A]" />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Código do Voucher
                  </h2>
                  <p className="text-gray-500">
                    Escaneie com o leitor ou digite o código
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="codigo" className="text-base font-medium">
                    Código
                  </Label>
                  <div className="relative">
                    <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <Input
                      ref={inputRef}
                      id="codigo"
                      placeholder="Ex: VCH123456"
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                      className="font-mono text-xl h-16 pl-14 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-[#1E3A8A] text-center"
                      autoComplete="off"
                    />
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    O leitor de código de barras preencherá automaticamente
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                  disabled={!codigo.trim() || isLoading}
                >
                  <Scan className="w-5 h-5 mr-2" />
                  Consultar Voucher
                </Button>
              </form>

              {/* Dicas */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-sm flex-1">
                    <p className="font-medium text-blue-900 mb-2">Dica para Testes - Códigos de Voucher</p>
                    <div className="text-blue-700 space-y-1.5">
                      <p>
                        <strong>Pendentes:</strong>{' '}
                        <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs">VOU12345678</code>{' '}
                        <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs">VOU22334455</code>{' '}
                        <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs">VOU33445566</code>{' '}
                        <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs">VOU55443322</code>{' '}
                        <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs">VOU11009988</code>
                      </p>
                      <p>
                        <strong>Validados:</strong>{' '}
                        <code className="bg-green-100 px-2 py-0.5 rounded font-mono text-xs text-green-700">VOU87654321</code>{' '}
                        <code className="bg-green-100 px-2 py-0.5 rounded font-mono text-xs text-green-700">VOU11223344</code>{' '}
                        <code className="bg-green-100 px-2 py-0.5 rounded font-mono text-xs text-green-700">VOU99001122</code>{' '}
                        <code className="bg-green-100 px-2 py-0.5 rounded font-mono text-xs text-green-700">VOU66778899</code>{' '}
                        <code className="bg-green-100 px-2 py-0.5 rounded font-mono text-xs text-green-700">VOU77889900</code>{' '}
                        <code className="bg-green-100 px-2 py-0.5 rounded font-mono text-xs text-green-700">VOU88990011</code>{' '}
                        <code className="bg-green-100 px-2 py-0.5 rounded font-mono text-xs text-green-700">VOU99887766</code>{' '}
                        <code className="bg-green-100 px-2 py-0.5 rounded font-mono text-xs text-green-700">VOU66554433</code>
                      </p>
                      <p>
                        <strong>Rejeitados:</strong>{' '}
                        <code className="bg-red-100 px-2 py-0.5 rounded font-mono text-xs text-red-700">VOU55667788</code>{' '}
                        <code className="bg-red-100 px-2 py-0.5 rounded font-mono text-xs text-red-700">VOU44556677</code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Etapa 2: Dados do Voucher */}
        {!isLoading && etapa === 'dados' && voucherData && (
          <div className="space-y-6">
            {/* Card de Status */}
            <Card className={`overflow-hidden border-2 ${getStatusConfig(voucherData.status).borderColor}`}>
              <div className={`p-4 ${getStatusConfig(voucherData.status).bgLight}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${getStatusConfig(voucherData.status).color} flex items-center justify-center text-white`}>
                      {getStatusConfig(voucherData.status).icon}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${getStatusConfig(voucherData.status).textColor}`}>
                        Status do Voucher
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {getStatusConfig(voucherData.status).label}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getStatusConfig(voucherData.status).color} text-white px-4 py-2 text-sm`}>
                    {voucherData.codigo}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Informações do Colaborador */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#1E3A8A]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Dados do Colaborador</CardTitle>
                    <CardDescription>Verifique se os dados correspondem ao beneficiário</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-500">Nome Completo</Label>
                    <p className="text-lg font-semibold text-gray-900">{voucherData.beneficiario}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-500">CPF</Label>
                    <p className="text-lg font-semibold text-gray-900 font-mono">
                      {voucherData.cpf || '•••.•••.•••-••'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações do Voucher */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Detalhes do Voucher</CardTitle>
                    <CardDescription>Informações sobre o benefício</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                    <Label className="text-xs uppercase tracking-wide text-emerald-600">Valor Disponível</Label>
                    <p className="text-3xl font-bold text-emerald-700 mt-1">
                      R$ {voucherData.valor.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1 p-4 bg-gray-50 rounded-xl">
                    <Label className="text-xs uppercase tracking-wide text-gray-500">Validade</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <p className="text-lg font-semibold text-gray-900">{voucherData.dataValidade}</p>
                    </div>
                  </div>
                  <div className="space-y-1 p-4 bg-gray-50 rounded-xl">
                    <Label className="text-xs uppercase tracking-wide text-gray-500">Estabelecimento</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <p className="text-lg font-semibold text-gray-900">{voucherData.estabelecimento}</p>
                    </div>
                  </div>
                </div>

                {/* Benefícios */}
                {voucherData.beneficios && voucherData.beneficios.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <Label className="text-xs uppercase tracking-wide text-gray-500 mb-3 block">
                      Benefícios Inclusos
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {voucherData.beneficios.map((beneficio, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1.5">
                          {beneficio}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ações */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleImprimir}
                  className="flex-1"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Imprimir Voucher
                </Button>

                {voucherData.status === 'ativo' ? (
                  <Button
                    size="lg"
                    onClick={handleConfirmarDados}
                    className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Confirmar Dados
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={resetScanner}
                    className="flex-1"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Novo Voucher
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Etapa 3: Informar Valor */}
        {!isLoading && etapa === 'valor' && voucherData && (
          <div className="space-y-6">
            {/* Resumo do Voucher */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Voucher</p>
                    <p className="text-2xl font-bold">{voucherData.codigo}</p>
                    <p className="text-blue-100 mt-1">{voucherData.beneficiario}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-sm">Valor Disponível</p>
                    <p className="text-3xl font-bold">R$ {voucherData.valor.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Input de Valor */}
            <Card className="p-8">
              <div className="max-w-md mx-auto space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Informe o Valor</h2>
                  <p className="text-gray-500 mt-2">
                    Digite o valor total fornecido ao colaborador
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="valor" className="text-base font-medium">
                    Valor Fornecido (R$)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-400">
                      R$
                    </span>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      min="0"
                      max={voucherData.valor}
                      placeholder="0,00"
                      value={valorFornecido}
                      onChange={(e) => setValorFornecido(e.target.value)}
                      className="text-3xl font-bold h-20 pl-16 text-center bg-gray-50 border-2 focus:bg-white focus:border-[#1E3A8A]"
                    />
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Máximo: R$ {voucherData.valor.toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setEtapa('dados')}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleFinalizarAtendimento}
                    disabled={!valorFornecido || parseFloat(valorFornecido) <= 0 || parseFloat(valorFornecido) > voucherData.valor || isConfirming}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isConfirming ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Finalizando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Finalizar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Etapa 4: Finalizado */}
        {!isLoading && etapa === 'finalizado' && voucherData && (
          <div className="space-y-6">
            {/* Card de Sucesso */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8 text-white text-center">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Atendimento Finalizado!</h1>
                <p className="text-emerald-100">
                  O voucher foi processado com sucesso
                </p>
              </div>
            </Card>

            {/* Resumo da Transação */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-gray-400" />
                  Resumo da Transação
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-4 divide-y">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Código do Voucher</span>
                    <span className="font-mono font-semibold">{voucherData.codigo}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-gray-500">Colaborador</span>
                    <span className="font-semibold">{voucherData.beneficiario}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-gray-500">Data/Hora</span>
                    <span className="font-semibold">{new Date().toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-gray-500">Valor Fornecido</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      R$ {parseFloat(valorFornecido).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleImprimir}
                  className="flex-1"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Imprimir Comprovante
                </Button>
                <Button
                  size="lg"
                  onClick={resetScanner}
                  className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Processar Novo Voucher
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScannerParceiro;