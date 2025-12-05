import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  QrCode,
  DollarSign,
  History,
  Settings,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  Store,
  Eye,
  RefreshCw,
  Filter,
  ArrowRight,
  LogOut,
  Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getVouchersEmitidos, VoucherEmitido } from "@/utils/voucherStorage";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/lib/supabase";

// Interface para vouchers processados pelo parceiro
interface VoucherParceiro {
  id: string;
  codigo: string;
  colaborador: string;
  cpf: string;
  valor: number;
  dataRecebimento: string;
  horaRecebimento: string;
  status: 'pendente' | 'validado' | 'rejeitado';
  dataValidacao?: string;
  motivoRejeicao?: string;
}

// Interface para estatísticas
interface Estatisticas {
  totalHoje: number;
  valorHoje: number;
  totalSemana: number;
  valorSemana: number;
  totalMes: number;
  valorMes: number;
  pendentes: number;
}

const PortalParceiro = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("Início");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [vouchers, setVouchers] = useState<VoucherParceiro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoggedIn } = useCurrentUser();

  // Botões de navegação do header
  const navigationButtons = [
    { name: "Início", icon: Home },
    { name: "Validar Voucher", icon: QrCode },
    { name: "Histórico", icon: History },
    { name: "Financeiro", icon: DollarSign },
    { name: "Configurações", icon: Settings }
  ];

  // Dados mockados para demonstração - Simula vouchers recebidos pelo parceiro
  const mockVouchers: VoucherParceiro[] = [
    {
      id: "VCH001",
      codigo: "VOU12345678",
      colaborador: "João Silva",
      cpf: "123.456.789-00",
      valor: 150.00,
      dataRecebimento: "02/12/2024",
      horaRecebimento: "10:30",
      status: "pendente"
    },
    {
      id: "VCH002",
      codigo: "VOU87654321",
      colaborador: "Maria Santos",
      cpf: "987.654.321-00",
      valor: 250.00,
      dataRecebimento: "02/12/2024",
      horaRecebimento: "09:15",
      status: "validado",
      dataValidacao: "02/12/2024 09:20"
    },
    {
      id: "VCH003",
      codigo: "VOU11223344",
      colaborador: "Pedro Oliveira",
      cpf: "111.222.333-44",
      valor: 80.00,
      dataRecebimento: "01/12/2024",
      horaRecebimento: "16:45",
      status: "validado",
      dataValidacao: "01/12/2024 16:50"
    },
    {
      id: "VCH004",
      codigo: "VOU55667788",
      colaborador: "Ana Costa",
      cpf: "555.666.777-88",
      valor: 300.00,
      dataRecebimento: "01/12/2024",
      horaRecebimento: "14:00",
      status: "rejeitado",
      motivoRejeicao: "Voucher já utilizado"
    },
    {
      id: "VCH005",
      codigo: "VOU99001122",
      colaborador: "Carlos Lima",
      cpf: "999.000.111-22",
      valor: 175.00,
      dataRecebimento: "30/11/2024",
      horaRecebimento: "11:30",
      status: "validado",
      dataValidacao: "30/11/2024 11:35"
    }
  ];

  // Carregar vouchers ao montar o componente
  useEffect(() => {
    const carregarVouchers = () => {
      setIsLoading(true);
      try {
        // Simula delay de carregamento da API
        setTimeout(() => {
          // Combina vouchers do localStorage com dados mockados
          const vouchersStorage = getVouchersEmitidos();
          const vouchersConvertidos: VoucherParceiro[] = vouchersStorage.map((v: VoucherEmitido) => ({
            id: v.id,
            codigo: v.id,
            colaborador: v.funcionario,
            cpf: v.cpf,
            valor: v.valor,
            dataRecebimento: v.dataResgate || new Date().toLocaleDateString('pt-BR'),
            horaRecebimento: v.horaResgate || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            status: v.status === 'resgatado' ? 'validado' : 'pendente' as 'pendente' | 'validado' | 'rejeitado'
          }));
          
          // Combina e remove duplicatas
          const todosVouchers = [...vouchersConvertidos, ...mockVouchers];
          const vouchersUnicos = todosVouchers.filter((voucher, index, self) =>
            index === self.findIndex((v) => v.id === voucher.id)
          );
          
          setVouchers(vouchersUnicos);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Erro ao carregar vouchers:', error);
        toast.error('Erro ao carregar vouchers');
        setVouchers(mockVouchers);
        setIsLoading(false);
      }
    };

    carregarVouchers();

    // Listener para novos vouchers emitidos
    const handleNovoVoucher = () => {
      carregarVouchers();
    };

    window.addEventListener('voucherEmitido', handleNovoVoucher);
    return () => window.removeEventListener('voucherEmitido', handleNovoVoucher);
  }, []);

  // Calcular estatísticas baseadas nos vouchers
  const calcularEstatisticas = (): Estatisticas => {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const dataAtual = new Date();
    const inicioSemana = new Date(dataAtual);
    inicioSemana.setDate(dataAtual.getDate() - dataAtual.getDay());
    const inicioMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);

    const vouchersValidados = vouchers.filter(v => v.status === 'validado');
    const vouchersHoje = vouchersValidados.filter(v => v.dataRecebimento === hoje);

    // Para simplificação, considera todos os vouchers validados para semana e mês
    // Em produção, seria necessário parsing de datas mais robusto
    const vouchersSemana = vouchersValidados.filter(v => {
      const partes = v.dataRecebimento.split('/');
      if (partes.length !== 3) return false;
      const dataVoucher = new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
      return dataVoucher >= inicioSemana;
    });

    const vouchersMes = vouchersValidados.filter(v => {
      const partes = v.dataRecebimento.split('/');
      if (partes.length !== 3) return false;
      const dataVoucher = new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
      return dataVoucher >= inicioMes;
    });

    return {
      totalHoje: vouchersHoje.length,
      valorHoje: vouchersHoje.reduce((sum, v) => sum + v.valor, 0),
      totalSemana: vouchersSemana.length,
      valorSemana: vouchersSemana.reduce((sum, v) => sum + v.valor, 0),
      totalMes: vouchersMes.length,
      valorMes: vouchersMes.reduce((sum, v) => sum + v.valor, 0),
      pendentes: vouchers.filter(v => v.status === 'pendente').length
    };
  };

  const stats = calcularEstatisticas();

  // Filtrar vouchers baseado na busca e filtro de status
  const vouchersFiltrados = vouchers.filter(voucher => {
    const matchBusca =
      voucher.colaborador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.cpf.includes(searchTerm);

    const matchStatus = filterStatus === "todos" || voucher.status === filterStatus;

    return matchBusca && matchStatus;
  });

  // Função para obter badge de status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case "validado":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Validado
          </Badge>
        );
      case "rejeitado":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeitado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Função para validar voucher
  const handleValidarVoucher = (voucherId: string) => {
    setVouchers(prev => prev.map(v =>
      v.id === voucherId
        ? { ...v, status: 'validado' as const, dataValidacao: new Date().toLocaleString('pt-BR') }
        : v
    ));
    toast.success('Voucher validado com sucesso!');
  };

  // Função para rejeitar voucher
  const handleRejeitarVoucher = (voucherId: string) => {
    setVouchers(prev => prev.map(v =>
      v.id === voucherId
        ? { ...v, status: 'rejeitado' as const, motivoRejeicao: 'Rejeitado pelo parceiro' }
        : v
    ));
    toast.error('Voucher rejeitado');
  };

  // Função para gerar iniciais do nome
  const getIniciais = (nome: string): string => {
    if (!nome) return 'U';
    const palavras = nome.trim().split(' ').filter(p => p.length > 0);
    if (palavras.length === 0) return 'U';
    if (palavras.length === 1) return palavras[0].substring(0, 2).toUpperCase();
    return (palavras[0][0] + palavras[palavras.length - 1][0]).toUpperCase();
  };

  // Função para ocultar parte do e-mail
  const ocultarEmail = (email: string): string => {
    if (!email || email === 'Sem email cadastrado') return email;

    const [localPart, domain] = email.split('@');
    if (!domain) return email;

    // Mostra os primeiros 3 caracteres e os últimos 2 do local part
    if (localPart.length <= 5) {
      return `${localPart[0]}***@${domain}`;
    }

    const inicio = localPart.substring(0, 3);
    const fim = localPart.substring(localPart.length - 2);

    return `${inicio}***${fim}@${domain}`;
  };

  // Obter dados do usuário
  const nomeUsuario = user?.nome || 'Usuário';
  const emailUsuario = user?.email || 'Sem email cadastrado';
  const cargoUsuario = 'Parceiro';
  const iniciaisUsuario = getIniciais(nomeUsuario);

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      // Fazer logout do Supabase
      await supabase.auth.signOut();

      // Limpar dados do localStorage
      localStorage.removeItem('colaboradorLogado');
      localStorage.removeItem('colaborador');

      // Redirecionar para a página de login
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation - Seguindo padrão de PortalBeneficio.tsx */}
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
                  if (button.name === "Validar Voucher") {
                    navigate('/scannerparceiro');
                  }
                }}
                aria-current={activeButton === button.name ? "page" : undefined}
              >
                {button.icon && <button.icon className="w-4 h-4 mr-2" aria-hidden="true" />}
                {button.name}
              </Button>
            ))}
          </nav>

          {/* Dropdown do Usuário */}
          <div className="hidden lg:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-3 pl-3 border-l border-white/30 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30">
                  <div className="text-right">
                    <p className="text-sm font-medium">{nomeUsuario}</p>
                    <p className="text-xs text-white/70">{cargoUsuario}</p>
                  </div>
                  <Avatar className="h-9 w-9 border-2 border-white/30">
                    <AvatarFallback className="bg-white/20 text-white font-semibold">{iniciaisUsuario}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{nomeUsuario}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {cargoUsuario}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>{ocultarEmail(emailUsuario)}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section - Boas vindas */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Portal do Parceiro Comercial
          </h1>
          <p className="text-gray-600 mb-6">
            Gerencie vouchers recebidos, valide transações e acompanhe seu faturamento
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              style={{ backgroundColor: "#1E3A8A" }}
              className="text-white hover:opacity-90"
              onClick={() => navigate('/scannerparceiro')}
            >
              <QrCode className="w-4 h-4 mr-2" aria-hidden="true" />
              Validar Novo Voucher
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveButton("Histórico")}
            >
              <History className="w-4 h-4 mr-2" aria-hidden="true" />
              Ver Histórico Completo
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <section aria-label="Estatísticas de vouchers">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card: Vouchers Pendentes */}
            <Card className="border-b-4" style={{ borderBottomColor: "#F59E0B" }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pendentes</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stats.pendentes}</p>
                    <p className="text-sm text-gray-500">Aguardando validação</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card: Processados Hoje */}
            <Card className="border-b-4" style={{ borderBottomColor: "#1E3A8A" }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Processados Hoje</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalHoje}</p>
                    <p className="text-sm text-gray-500">
                      R$ {stats.valorHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#1E3A8A" }}>
                    <Calendar className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card: Total Semana */}
            <Card className="border-b-4" style={{ borderBottomColor: "#10B981" }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Esta Semana</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalSemana}</p>
                    <p className="text-sm text-gray-500">
                      R$ {stats.valorSemana.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card: Total Mês */}
            <Card className="border-b-4" style={{ borderBottomColor: "#8B5CF6" }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Este Mês</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalMes}</p>
                    <p className="text-sm text-gray-500">
                      R$ {stats.valorMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Seção Principal com Tabs */}
        <section>
          <Tabs defaultValue="pendentes" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList className="grid w-full sm:w-auto grid-cols-3">
                <TabsTrigger value="pendentes" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Pendentes</span>
                  <Badge variant="secondary" className="ml-1">{stats.pendentes}</Badge>
                </TabsTrigger>
                <TabsTrigger value="historico" className="flex items-center gap-2">
                  <History className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Histórico</span>
                </TabsTrigger>
                <TabsTrigger value="todos" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Todos</span>
                </TabsTrigger>
              </TabsList>

              {/* Botão de atualizar */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Atualizar
              </Button>
            </div>

            {/* Tab: Vouchers Pendentes */}
            <TabsContent value="pendentes">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Vouchers Aguardando Validação</CardTitle>
                  <CardDescription>
                    Vouchers recebidos que precisam ser validados para confirmar o atendimento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filtros e Busca */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" aria-hidden="true" />
                      <Input
                        placeholder="Buscar por código, colaborador ou CPF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        aria-label="Buscar vouchers"
                      />
                    </div>
                  </div>

                  {/* Loading State */}
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <RefreshCw className="w-8 h-8 animate-spin text-gray-400" aria-hidden="true" />
                      <span className="ml-2 text-gray-500">Carregando vouchers...</span>
                    </div>
                  ) : (
                    <>
                      {/* Tabela de Vouchers Pendentes */}
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Código</TableHead>
                              <TableHead>Colaborador</TableHead>
                              <TableHead className="hidden md:table-cell">CPF</TableHead>
                              <TableHead>Valor</TableHead>
                              <TableHead className="hidden sm:table-cell">Data/Hora</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {vouchersFiltrados.filter(v => v.status === 'pendente').length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-400" aria-hidden="true" />
                                  <p>Nenhum voucher pendente de validação</p>
                                </TableCell>
                              </TableRow>
                            ) : (
                              vouchersFiltrados
                                .filter(v => v.status === 'pendente')
                                .map((voucher) => (
                                  <TableRow key={voucher.id}>
                                    <TableCell className="font-mono font-medium">{voucher.codigo}</TableCell>
                                    <TableCell>{voucher.colaborador}</TableCell>
                                    <TableCell className="hidden md:table-cell">{voucher.cpf}</TableCell>
                                    <TableCell className="font-semibold">
                                      R$ {voucher.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                      {voucher.dataRecebimento} às {voucher.horaRecebimento}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(voucher.status)}</TableCell>

                                  </TableRow>
                                ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Histórico */}
            <TabsContent value="historico">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Histórico de Transações</CardTitle>
                  <CardDescription>
                    Vouchers já processados (validados ou rejeitados)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filtros */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" aria-hidden="true" />
                      <Input
                        placeholder="Buscar por código, colaborador ou CPF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        aria-label="Buscar vouchers no histórico"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filtrar por status">
                        <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
                        <SelectValue placeholder="Filtrar status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="validado">Validados</SelectItem>
                        <SelectItem value="rejeitado">Rejeitados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tabela de Histórico */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Colaborador</TableHead>
                          <TableHead className="hidden md:table-cell">CPF</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead className="hidden sm:table-cell">Data/Hora</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden lg:table-cell">Processado em</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vouchersFiltrados.filter(v => v.status !== 'pendente').length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                              <History className="w-12 h-12 mx-auto mb-2 text-gray-300" aria-hidden="true" />
                              <p>Nenhum voucher no histórico</p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          vouchersFiltrados
                            .filter(v => v.status !== 'pendente')
                            .map((voucher) => (
                              <TableRow key={voucher.id}>
                                <TableCell className="font-mono font-medium">{voucher.codigo}</TableCell>
                                <TableCell>{voucher.colaborador}</TableCell>
                                <TableCell className="hidden md:table-cell">{voucher.cpf}</TableCell>
                                <TableCell className="font-semibold">
                                  R$ {voucher.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  {voucher.dataRecebimento} às {voucher.horaRecebimento}
                                </TableCell>
                                <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                                <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                                  {voucher.dataValidacao || voucher.motivoRejeicao || '-'}
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Todos os Vouchers */}
            <TabsContent value="todos">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Todos os Vouchers</CardTitle>
                  <CardDescription>
                    Visão completa de todos os vouchers recebidos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filtros */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" aria-hidden="true" />
                      <Input
                        placeholder="Buscar por código, colaborador ou CPF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        aria-label="Buscar todos os vouchers"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filtrar por status">
                        <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
                        <SelectValue placeholder="Filtrar status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="pendente">Pendentes</SelectItem>
                        <SelectItem value="validado">Validados</SelectItem>
                        <SelectItem value="rejeitado">Rejeitados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tabela Completa */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Colaborador</TableHead>
                          <TableHead className="hidden md:table-cell">CPF</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead className="hidden sm:table-cell">Data/Hora</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vouchersFiltrados.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                              <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" aria-hidden="true" />
                              <p>Nenhum voucher encontrado</p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          vouchersFiltrados.map((voucher) => (
                            <TableRow key={voucher.id}>
                              <TableCell className="font-mono font-medium">{voucher.codigo}</TableCell>
                              <TableCell>{voucher.colaborador}</TableCell>
                              <TableCell className="hidden md:table-cell">{voucher.cpf}</TableCell>
                              <TableCell className="font-semibold">
                                R$ {voucher.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {voucher.dataRecebimento} às {voucher.horaRecebimento}
                              </TableCell>
                              <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                              <TableCell className="text-right">
                                {voucher.status === 'pendente' ? (
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleValidarVoucher(voucher.id)}
                                      style={{ backgroundColor: "#10B981" }}
                                      className="text-white hover:opacity-90"
                                      aria-label={`Validar voucher ${voucher.codigo}`}
                                    >
                                      <CheckCircle className="w-4 h-4" aria-hidden="true" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleRejeitarVoucher(voucher.id)}
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                      aria-label={`Rejeitar voucher ${voucher.codigo}`}
                                    >
                                      <XCircle className="w-4 h-4" aria-hidden="true" />
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-400">-</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Acesso Rápido - Cards inferiores */}
        <section className="mt-8" aria-label="Acessos rápidos">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card: Validar Voucher */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/scannerparceiro')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1E3A8A20" }}>
                      <QrCode className="w-6 h-6" style={{ color: "#1E3A8A" }} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Validar Voucher</h3>
                      <p className="text-sm text-gray-600">Escaneie ou digite o código do voucher</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" aria-hidden="true" />
                </div>
              </CardContent>
            </Card>

            {/* Card: Relatório Financeiro */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveButton("Financeiro")}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Relatório Financeiro</h3>
                      <p className="text-sm text-gray-600">Acompanhe seus recebimentos</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" aria-hidden="true" />
                </div>
              </CardContent>
            </Card>

            {/* Card: Configurações */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveButton("Configurações")}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-6 h-6 text-gray-600" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Configurações</h3>
                      <p className="text-sm text-gray-600">Gerencie os dados do estabelecimento</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" aria-hidden="true" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PortalParceiro;

