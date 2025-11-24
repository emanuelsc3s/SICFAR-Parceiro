import { useState, useEffect } from "react";
import { Home, Plus, Users, QrCode, Download, DollarSign, Eye, ArrowLeft, ArrowRight, Flame, Pill, Car, Heart, Bus, Fuel, LogOut, Settings, User as UserIcon, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { toast } from "sonner";
import { generateVoucherPDF } from "@/utils/pdfGenerator";
import { salvarVoucherEmitido, type VoucherEmitido } from "@/utils/voucherStorage";

// Interface para os dados do colaborador
interface ColaboradorData {
  matricula: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  loginTimestamp: string;
}

const SolicitarBeneficio = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("Solicitar Voucher");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBeneficios, setSelectedBeneficios] = useState<string[]>([]);
  const [showVoucher, setShowVoucher] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [colaborador, setColaborador] = useState<ColaboradorData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentVoucherNumber, setCurrentVoucherNumber] = useState<string>("");

  // Form data for step 2
  const [formData, setFormData] = useState({
    justificativa: "",
    urgencia: "",
    informacoesAdicionais: ""
  });

  // Função para obter as iniciais do nome
  const getInitials = (nome: string): string => {
    if (!nome) return "??";
    const names = nome.trim().split(" ");
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  // Função para formatar o nome (Primeiro nome + inicial do sobrenome)
  const formatDisplayName = (nome: string): string => {
    if (!nome) return "Usuário";
    const names = nome.trim().split(" ");
    if (names.length === 1) {
      return names[0];
    }
    const primeiroNome = names[0];
    const inicialSobrenome = names[names.length - 1][0].toUpperCase();
    return `${primeiroNome} ${inicialSobrenome}.`;
  };

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem('colaboradorLogado');
    navigate('/login');
  };

  // Carregar dados do colaborador do localStorage
  useEffect(() => {
    const colaboradorData = localStorage.getItem('colaboradorLogado');
    if (colaboradorData) {
      try {
        const data = JSON.parse(colaboradorData);
        setColaborador(data);
      } catch (error) {
        console.error('Erro ao carregar dados do colaborador:', error);
        navigate('/login');
      }
    } else {
      // Se não houver dados do colaborador, redirecionar para login
      navigate('/login');
    }
  }, [navigate]);

  const navigationButtons = [
    { name: "Início", icon: Home },
    { name: "Solicitar Voucher", icon: Plus },
    { name: "Dashboard RH", icon: Users },
    { name: "Scanner Parceiro", icon: QrCode },
    { name: "Resgates", icon: Download },
    { name: "Faturas", icon: DollarSign },
    { name: "Auditoria", icon: Eye }
  ];

  const beneficios = [
    {
      id: "vale-gas",
      title: "Vale Gás",
      description: "Benefício para compra de gás de cozinha",
      value: "R$ 125,00",
      icon: Flame
    },
    {
      id: "vale-farmacia-santa-cecilia",
      title: "Vale Farmácia Santa Cecília",
      description: "Benefício para compras na Farmácia Santa Cecília",
      value: "Máx R$ 300,00",
      icon: Pill
    },
    {
      id: "vale-farmacia-gentil",
      title: "Vale Farmácia Gentil",
      description: "Benefício para compras na Farmácia Gentil",
      value: "Máx R$ 300,00",
      icon: Pill
    },
    {
      id: "vale-combustivel",
      title: "Vale Combustível",
      description: "Benefício para abastecimento de veículos",
      value: "Consultar valor",
      icon: Fuel
    },
    {
      id: "plano-saude",
      title: "Plano de Saúde",
      description: "Cobertura de assistência médica e hospitalar",
      value: "R$ 79,00",
      icon: Heart
    },
    {
      id: "vale-transporte",
      title: "Vale Transporte",
      description: "Auxílio para deslocamento urbano",
      value: "R$ 35,00",
      icon: Bus
    }
  ];

  const steps = [
    { number: 1, title: "Escolher Programa", subtitle: "Selecione o tipo de voucher", active: currentStep === 1 },
    { number: 2, title: "Preencher Detalhes", subtitle: "Informações adicionais", active: currentStep === 2 },
    { number: 3, title: "Revisar e Confirmar", subtitle: "Conferir dados antes do envio", active: currentStep === 3 }
  ];

  const handleBeneficioToggle = (beneficioId: string) => {
    setSelectedBeneficios(prev => {
      if (prev.includes(beneficioId)) {
        return prev.filter(id => id !== beneficioId);
      } else {
        return [...prev, beneficioId];
      }
    });
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateVoucherNumber = () => {
    return `VOU${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
  };

  const generateQRCode = async (voucherNumber: string) => {
    const qrData = JSON.stringify({
      voucher: voucherNumber,
      beneficios: selectedBeneficios,
      data: new Date().toISOString(),
      empresa: "Farmace Benefícios"
    });
    
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1E3A8A',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  // Função para salvar voucher no localStorage usando o utilitário
  const saveVoucherToLocalStorage = (voucherData: VoucherEmitido): boolean => {
    const sucesso = salvarVoucherEmitido(voucherData);

    if (!sucesso) {
      toast.error("Erro ao salvar voucher localmente", {
        description: "O voucher foi gerado mas não foi salvo no histórico local.",
        duration: 5000
      });
    } else {
      // Disparar evento customizado para notificar outras páginas
      window.dispatchEvent(new CustomEvent('voucherEmitido', {
        detail: voucherData
      }));
      console.log('📢 Evento voucherEmitido disparado para:', voucherData.id);
    }

    return sucesso;
  };

  const handleConfirmSolicitation = async () => {
    console.log('🚀 Iniciando handleConfirmSolicitation...');

    // Validação 1: Verifica se há dados do colaborador
    if (!colaborador) {
      console.error('❌ Validação falhou: Colaborador não encontrado');
      toast.error("Dados do colaborador não encontrados. Por favor, faça login novamente.");
      navigate('/login');
      return;
    }
    console.log('✅ Validação 1 passou: Colaborador encontrado', colaborador);

    // Validação 2: Verifica se o e-mail está disponível
    if (!colaborador.email || colaborador.email.trim() === '') {
      console.error('❌ Validação falhou: E-mail não encontrado');
      toast.error("E-mail do colaborador não encontrado. Não é possível enviar o voucher.", {
        description: "Entre em contato com o RH para atualizar seu e-mail no cadastro.",
        duration: 5000
      });
      return;
    }
    console.log('✅ Validação 2 passou: E-mail encontrado', colaborador.email);

    // Validação 3: Verifica se há benefícios selecionados
    if (selectedBeneficios.length === 0) {
      console.error('❌ Validação falhou: Nenhum benefício selecionado');
      toast.error("Nenhum benefício selecionado. Por favor, selecione pelo menos um benefício.");
      return;
    }
    console.log('✅ Validação 3 passou: Benefícios selecionados', selectedBeneficios);

    console.log('⏳ Iniciando processamento...');
    setIsProcessing(true);

    try {
      // 1. Gera o número do voucher
      console.log('📝 Passo 1: Gerando número do voucher...');
      const voucherNumber = generateVoucherNumber();
      setCurrentVoucherNumber(voucherNumber);
      console.log('✅ Voucher gerado:', voucherNumber);

      // 2. Gera o QR Code
      console.log('📱 Passo 2: Gerando QR Code...');
      await generateQRCode(voucherNumber);
      console.log('✅ QR Code gerado');

      // Aguarda um pouco para garantir que o QR Code foi gerado
      await new Promise(resolve => setTimeout(resolve, 500));

      // 3. Prepara os dados dos benefícios selecionados
      console.log('📦 Passo 3: Preparando dados dos benefícios...');
      const beneficiosSelecionados = selectedBeneficios
        .map(id => {
          const beneficio = beneficios.find(b => b.id === id);
          return beneficio ? {
            id: beneficio.id,
            title: beneficio.title,
            description: beneficio.description,
            value: beneficio.value,
            icon: beneficio.icon
          } : null;
        })
        .filter((b): b is NonNullable<typeof b> => b !== null);
      console.log('✅ Benefícios preparados:', beneficiosSelecionados);

      // 4. Calcula o valor total dos benefícios
      console.log('💰 Passo 4: Calculando valor total...');
      const valorTotal = beneficiosSelecionados.reduce((total, beneficio) => {
        // Extrai o valor numérico do campo value (ex: "R$ 125,00" -> 125.00)
        const valorMatch = beneficio.value.match(/[\d.,]+/);
        if (valorMatch) {
          const valorNumerico = parseFloat(valorMatch[0].replace(',', '.'));
          return total + (isNaN(valorNumerico) ? 0 : valorNumerico);
        }
        return total;
      }, 0);
      console.log('✅ Valor total calculado: R$', valorTotal);

      // 5. Prepara dados do voucher para salvar no localStorage
      console.log('💾 Passo 5: Preparando dados para localStorage...');
      const now = new Date();
      const dataValidade = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 dias de validade

      const voucherDataToSave: VoucherEmitido = {
        id: voucherNumber,
        funcionario: colaborador.nome,
        cpf: colaborador.cpf,
        valor: valorTotal,
        dataResgate: "", // Em branco - voucher ainda não foi resgatado
        horaResgate: "", // Em branco - voucher ainda não foi resgatado
        beneficios: beneficiosSelecionados.map(b => b.title),
        parceiro: beneficiosSelecionados.length > 0 ? beneficiosSelecionados[0].title : 'Múltiplos Benefícios',
        status: 'emitido',
        dataValidade: dataValidade.toLocaleDateString('pt-BR')
      };
      console.log('✅ Dados preparados:', voucherDataToSave);

      // 6. Salva o voucher no localStorage
      console.log('💾 Passo 6: Salvando no localStorage...');
      const salvouComSucesso = saveVoucherToLocalStorage(voucherDataToSave);
      console.log(salvouComSucesso ? '✅ Salvo no localStorage com sucesso' : '❌ Erro ao salvar no localStorage');

      // 7. Gera o PDF do voucher
      console.log('📄 Passo 7: Gerando PDF do voucher...');
      const pdfBase64 = await generateVoucherPDF({
        voucherNumber,
        beneficios: beneficiosSelecionados,
        formData,
        qrCodeUrl: qrCodeUrl || '',
        colaborador: {
          nome: colaborador.nome,
          matricula: colaborador.matricula,
          email: colaborador.email
        }
      });
      console.log('✅ PDF gerado com sucesso');

      // 8. Envia o email com o PDF anexado
      console.log('📧 Passo 8: Enviando e-mail...');
      toast.loading("Enviando voucher por e-mail...", { id: 'sending-email' });

      try {
        console.log('🌐 Enviando requisição para o servidor backend...');
        const response = await fetch('http://localhost:3001/api/send-voucher-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            destinatario: colaborador.email,
            nomeDestinatario: colaborador.nome,
            voucherNumber,
            beneficios: beneficiosSelecionados,
            pdfBase64,
            formData
          }),
        });
        console.log('📡 Resposta recebida do servidor:', response.status, response.statusText);

        // Verifica se a resposta HTTP foi bem-sucedida
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📦 Resultado do servidor:', result);

        if (result.success) {
          toast.success("Voucher enviado por e-mail com sucesso! 🎉", {
            id: 'sending-email',
            description: `E-mail enviado para: ${colaborador.email}`,
            duration: 5000
          });
          console.log('✅ E-mail enviado com sucesso para:', colaborador.email);
          setShowVoucher(true);
        } else {
          throw new Error(result.message || 'Erro ao enviar e-mail');
        }

      } catch (emailError) {
        // Tratamento específico para erros de envio de e-mail
        console.error('❌ Erro ao enviar e-mail:', emailError);

        // Verifica se é erro de conexão com o servidor
        if (emailError instanceof TypeError && emailError.message.includes('fetch')) {
          console.warn('⚠️ Servidor backend não está acessível');
          toast.error("Servidor de e-mail indisponível", {
            id: 'sending-email',
            description: "O voucher será exibido, mas não foi enviado por e-mail. Verifique se o servidor backend está rodando.",
            duration: 7000
          });
        } else {
          console.warn('⚠️ Erro ao processar e-mail no servidor');
          toast.error("Erro ao enviar e-mail", {
            id: 'sending-email',
            description: "O voucher será exibido, mas não foi enviado por e-mail. Tente novamente mais tarde.",
            duration: 7000
          });
        }

        // Mesmo com erro no e-mail, mostra o voucher
        console.log('📄 Exibindo voucher mesmo com erro no e-mail');
        setShowVoucher(true);
      }

    } catch (error) {
      // Tratamento de erros gerais (geração de voucher, QR Code, PDF)
      console.error('❌ Erro GERAL ao processar solicitação:', error);
      toast.error("Erro ao processar solicitação", {
        description: "Ocorreu um erro ao gerar o voucher. Por favor, tente novamente.",
        duration: 5000
      });
    } finally {
      console.log('🏁 Finalizando processamento...');
      setIsProcessing(false);
      console.log('✅ handleConfirmSolicitation concluído');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="text-white px-6 py-2" style={{
        backgroundColor: "#1E3A8A"
      }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/farmace-logo.png" alt="Farmace Logo" className="object-contain h-8" style={{
              width: "149.98px",
              height: "68.97px"
            }} />
          </div>

          <nav className="hidden md:flex items-center space-x-2 ml-12">
            {navigationButtons.map((button, index) => {
              const IconComponent = button.icon;
              return (
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
                    if (button.name === "Faturas") {
                      navigate("/beneficiofaturas");
                    } else if (button.name === "Início") {
                      navigate("/");
                    }
                  }}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {button.name}
                </Button>
              );
            })}
          </nav>

          {/* Seção de Perfil do Usuário */}
          {colaborador && (
            <div className="hidden md:flex items-center space-x-3 ml-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-3 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30">
                    {/* Avatar */}
                    <Avatar className="h-10 w-10 border-2 border-white/30">
                      <AvatarFallback className="bg-primary-700 text-white font-semibold text-sm">
                        {getInitials(colaborador.nome)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Nome e Badge */}
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-white leading-tight">
                        {formatDisplayName(colaborador.nome)}
                      </span>
                      <Badge variant="secondary" className="mt-0.5 text-xs bg-white/20 text-white border-white/30 hover:bg-white/30">
                        Colaborador
                      </Badge>
                    </div>

                    {/* Ícone de dropdown */}
                    <ChevronDown className="h-4 w-4 text-white/70" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{colaborador.nome}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {colaborador.email || 'Sem email cadastrado'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        Matrícula: {colaborador.matricula}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/configuracao')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/configuracao')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </header>

      {showVoucher ? (
        /* Voucher Screen */
        <div className="max-w-4xl mx-auto p-4 print:p-2">
          <div className="mb-4 print:hidden">
            <Button 
              variant="ghost" 
              onClick={() => setShowVoucher(false)}
              className="flex items-center text-gray-600 hover:text-gray-800 p-0 h-auto font-normal"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>

          {/* Voucher Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none print:rounded-none">
            {/* Header - Blue gradient like the primary theme */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white print:px-4 print:py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center print:w-8 print:h-8">
                    <Plus className="w-5 h-5 text-white print:w-4 print:h-4" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold print:text-lg">Voucher Gerado</h1>
                    <p className="text-blue-100 text-sm">Farmace Benefícios</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-xs">Data de geração</p>
                  <p className="text-sm font-semibold">{new Date().toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
            </div>

            {/* Voucher Details */}
            <div className="p-6 print:p-4">
              <div className="text-center mb-6 print:mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2 print:text-lg print:mb-1">
                  Parabéns! Seu voucher foi aprovado!
                </h2>
                <p className="text-gray-600 text-sm">
                  Utilize as informações abaixo para resgatar seus benefícios
                </p>
              </div>

              {/* Main Voucher Info - Compact Layout */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200 mb-6 print:mb-4 print:p-3">
                <div className="flex items-start justify-between gap-4">
                  {/* Left side - Voucher info */}
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Número do Voucher</p>
                    <p className="text-2xl font-bold text-blue-600 mb-3 print:text-xl">{currentVoucherNumber}</p>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Benefícios:</span>
                        <span className="font-semibold text-gray-900 ml-2">{selectedBeneficios.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                          Aprovado
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Validade:</span>
                        <span className="font-semibold text-gray-900 ml-2">
                          {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - QR Code */}
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 print:p-1">
                      {qrCodeUrl ? (
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code do Voucher" 
                          className="w-24 h-24 print:w-20 print:h-20"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-lg print:w-20 print:h-20">
                          <QrCode className="w-12 h-12 text-gray-400 print:w-10 print:h-10" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      Escaneie para validar
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits List - Compact */}
              <div className="mb-6 print:mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 print:text-base print:mb-2">Benefícios Aprovados</h3>
                <div className="space-y-2">
                  {selectedBeneficios.map((beneficioId) => {
                    const beneficio = beneficios.find(b => b.id === beneficioId);
                    if (!beneficio) return null;
                    const IconComponent = beneficio.icon;
                    
                    return (
                      <div key={beneficioId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg print:p-2">
                        <div className="flex items-center space-x-3 print:space-x-2">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center print:w-6 print:h-6">
                            <IconComponent className="w-4 h-4 text-white print:w-3 print:h-3" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{beneficio.title}</p>
                            <p className="text-xs text-gray-600 print:hidden">{beneficio.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600 text-sm">{beneficio.value}</p>
                          <p className="text-xs text-gray-500">Disponível</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Request Details - Compact */}
              {(formData.justificativa || formData.urgencia || formData.informacoesAdicionais) && (
                <div className="border-t border-gray-200 pt-4 mb-6 print:pt-3 print:mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3 print:text-sm print:mb-2">Detalhes da Solicitação</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {formData.urgencia && (
                      <div>
                        <p className="text-gray-600 mb-1">Urgência:</p>
                        <p className="text-gray-900 font-medium">{formData.urgencia}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600 mb-1">Data:</p>
                      <p className="text-gray-900 font-medium">{new Date().toLocaleDateString("pt-BR")}</p>
                    </div>
                    {formData.justificativa && (
                      <div className="col-span-2 print:hidden">
                        <p className="text-gray-600 mb-1">Justificativa:</p>
                        <p className="text-gray-900 text-xs">{formData.justificativa}</p>
                      </div>
                    )}
                    {formData.informacoesAdicionais && (
                      <div className="col-span-2 print:hidden">
                        <p className="text-gray-600 mb-1">Informações Adicionais:</p>
                        <p className="text-gray-900 text-xs">{formData.informacoesAdicionais}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.print()}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Imprimir Voucher
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/portalbeneficio")}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Portal
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowVoucher(false);
                    setCurrentStep(1);
                    setSelectedBeneficios([]);
                    setFormData({
                      justificativa: "",
                      urgencia: "",
                      informacoesAdicionais: ""
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Solicitação
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto p-6">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/portalbeneficio')}
                className="flex items-center text-gray-600 hover:text-gray-800 p-0 h-auto font-normal"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Solicitar Voucher
            </h1>
            <p className="text-gray-600 mb-8">
              Siga os passos abaixo para solicitar um novo voucher
            </p>
          </div>

          {/* Steps Header */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                      step.active ? 'bg-blue-600' : currentStep > step.number ? 'bg-gray-400' : 'bg-gray-300'
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="text-center">
                    <p className={`font-semibold text-sm ${step.active ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-gray-400 text-xs">{step.subtitle}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 h-px bg-gray-300 ml-8 mr-8 mt-[-40px]"></div>
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Escolher Programa */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Escolha o Programa</h2>
              
              <div className="space-y-4">
                {beneficios.map((beneficio) => (
                  <Card 
                    key={beneficio.id}
                    className={`border transition-all cursor-pointer ${
                      selectedBeneficios.includes(beneficio.id) 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleBeneficioToggle(beneficio.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            selectedBeneficios.includes(beneficio.id) ? 'bg-blue-600' : 'bg-gray-100'
                          }`}>
                            <beneficio.icon className={`w-6 h-6 ${
                              selectedBeneficios.includes(beneficio.id) ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{beneficio.title}</h3>
                            <p className="text-sm text-blue-600 mb-2">{beneficio.description}</p>
                            <p className="font-bold text-gray-900">Valor: {beneficio.value}</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          selectedBeneficios.includes(beneficio.id)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedBeneficios.includes(beneficio.id) && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/portalbeneficio')}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                
                <Button 
                  onClick={handleNextStep}
                  disabled={selectedBeneficios.length === 0}
                  className="flex items-center text-white"
                  style={{ backgroundColor: "#1E3A8A" }}
                >
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Detalhes da Solicitação */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Detalhes da Solicitação</h2>
              
              <div className="space-y-6">
                {/* Justificativa */}
                <div className="space-y-2">
                  <Label htmlFor="justificativa" className="text-sm font-medium text-gray-900">
                    Justificativa para Solicitação Mensal Excedente
                  </Label>
                  <Textarea
                    id="justificativa"
                    placeholder="Explique o motivo da solicitação..."
                    value={formData.justificativa}
                    onChange={(e) => setFormData({...formData, justificativa: e.target.value})}
                    className="min-h-[120px] resize-none bg-gray-50 border-gray-200"
                  />
                </div>

                {/* Urgência */}
                <div className="space-y-2">
                  <Label htmlFor="urgencia" className="text-sm font-medium text-gray-900">
                    Urgência
                  </Label>
                  <Select value={formData.urgencia} onValueChange={(value) => setFormData({...formData, urgencia: value})}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Normal" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Informações Adicionais */}
                <div className="space-y-2">
                  <Label htmlFor="informacoesAdicionais" className="text-sm font-medium text-gray-900">
                    Informações Adicionais
                  </Label>
                  <Textarea
                    id="informacoesAdicionais"
                    placeholder="Informações complementares (opcional)..."
                    value={formData.informacoesAdicionais}
                    onChange={(e) => setFormData({...formData, informacoesAdicionais: e.target.value})}
                    className="min-h-[120px] resize-none bg-gray-50 border-gray-200"
                  />
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8">
                <Button 
                  variant="ghost" 
                  onClick={handlePrevStep}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                
                <Button 
                  onClick={handleNextStep}
                  className="flex items-center text-white"
                  style={{ backgroundColor: "#1E3A8A" }}
                >
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Revisar e Confirmar */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Header Card - Fatura Style */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Resumo da Solicitação</h2>
                    <p className="text-blue-100">Olá! Sua solicitação está quase pronta!</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-sm">Data da solicitação</p>
                    <p className="font-semibold">{new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>

              {/* Main Summary Card */}
              <div className="bg-white rounded-lg border-2 border-blue-200 p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Benefícios Solicitados</h3>
                    <div className="space-y-3">
                      {selectedBeneficios.map(beneficioId => {
                        const beneficio = beneficios.find(b => b.id === beneficioId);
                        if (!beneficio) return null;
                        const IconComponent = beneficio.icon;
                        return (
                          <div key={beneficioId} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{beneficio.title}</p>
                              <p className="text-sm text-blue-600">{beneficio.value}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Total de benefícios</p>
                      <p className="text-3xl font-bold text-gray-900">{selectedBeneficios.length}</p>
                      <p className="text-sm text-gray-500">itens selecionados</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                        <p className="text-sm font-medium text-gray-900">Status da solicitação</p>
                      </div>
                      <p className="text-sm text-gray-600">Aguardando confirmação</p>
                    </div>
                  </div>
                </div>

                {/* Form Data Summary */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Detalhes da Solicitação</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Justificativa:</p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {formData.justificativa || "Não informado"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Urgência:</p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {formData.urgencia || "Normal"}
                      </p>
                    </div>
                  </div>
                  {formData.informacoesAdicionais && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Informações Adicionais:</p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {formData.informacoesAdicionais}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    onClick={handlePrevStep}
                    className="flex items-center text-gray-600 hover:text-gray-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar e Editar
                  </Button>
                  
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/portalbeneficio')}
                      className="flex items-center"
                    >
                      Cancelar
                    </Button>
                    
                    <Button
                      className="flex items-center text-white px-8"
                      style={{ backgroundColor: "#1E3A8A" }}
                      onClick={handleConfirmSolicitation}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Processando...
                        </>
                      ) : (
                        <>
                          Confirmar Solicitação
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SolicitarBeneficio;
