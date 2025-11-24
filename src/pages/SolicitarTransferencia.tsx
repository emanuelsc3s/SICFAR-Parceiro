import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRightLeft, Send, User, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import BirthdayCard from "@/components/BirthdayCard";
import AnnouncementsCard from "@/components/AnnouncementsCard";
import SystemStatus from "@/components/SystemStatus";
import NewsCard from "@/components/NewsCard";
import { toast } from "sonner";

const SolicitarTransferencia = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    departamentoAtual: "",
    departamentoDesejado: "",
    colaborador: "",
    justificativa: "",
  });

  const departamentos = [
    { value: "recursos-humanos", label: "Recursos Humanos" },
    { value: "tecnologia", label: "Tecnologia da Informação" },
    { value: "financeiro", label: "Financeiro" },
    { value: "comercial", label: "Comercial" },
    { value: "operacoes", label: "Operações" },
    { value: "marketing", label: "Marketing" },
    { value: "juridico", label: "Jurídico" },
    { value: "administrativo", label: "Administrativo" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.departamentoAtual) {
      toast.error("Por favor, selecione o departamento atual.");
      return;
    }

    if (!formData.departamentoDesejado) {
      toast.error("Por favor, selecione o departamento desejado.");
      return;
    }

    if (formData.departamentoAtual === formData.departamentoDesejado) {
      toast.error("O departamento desejado deve ser diferente do atual.");
      return;
    }

    if (!formData.colaborador) {
      toast.error("Por favor, informe o nome do colaborador.");
      return;
    }

    if (!formData.justificativa.trim()) {
      toast.error("Por favor, justifique o motivo da transferência.");
      return;
    }

    // Aqui seria feita a integração com o backend
    console.log("Dados da solicitação:", formData);

    toast.success("Solicitação de transferência enviada com sucesso!");

    // Limpar formulário
    setFormData({
      departamentoAtual: "",
      departamentoDesejado: "",
      colaborador: "",
      justificativa: "",
    });

    // Redirecionar após 2 segundos
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Breadcrumb / Voltar */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center text-muted-foreground hover:text-foreground p-0 h-auto font-normal"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o início
          </Button>
        </div>

        {/* Título da página */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <ArrowRightLeft className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Solicitar Transferência
              </h1>
              <p className="text-muted-foreground">
                Preencha o formulário abaixo para solicitar mudança de departamento
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content - Formulário */}
          <div className="lg:col-span-3 space-y-6">
            {/* Formulário */}
            <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Dados da Solicitação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Busca de Colaborador */}
              <div className="space-y-2">
                <Label htmlFor="colaborador" className="text-sm font-medium">
                  Colaborador *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="colaborador"
                    type="text"
                    placeholder="Digite o nome do colaborador"
                    value={formData.colaborador}
                    onChange={(e) =>
                      setFormData({ ...formData, colaborador: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Por enquanto, digite manualmente. Em breve será carregado automaticamente.
                </p>
              </div>

              {/* Seleção de Departamento Atual */}
              <div className="space-y-2">
                <Label htmlFor="departamentoAtual" className="text-sm font-medium">
                  Departamento Atual *
                </Label>
                <Select
                  value={formData.departamentoAtual}
                  onValueChange={(value) =>
                    setFormData({ ...formData, departamentoAtual: value })
                  }
                >
                  <SelectTrigger id="departamentoAtual">
                    <SelectValue placeholder="Selecione o departamento atual" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Seleção de Departamento Desejado */}
              <div className="space-y-2">
                <Label htmlFor="departamentoDesejado" className="text-sm font-medium">
                  Departamento Desejado *
                </Label>
                <Select
                  value={formData.departamentoDesejado}
                  onValueChange={(value) =>
                    setFormData({ ...formData, departamentoDesejado: value })
                  }
                >
                  <SelectTrigger id="departamentoDesejado">
                    <SelectValue placeholder="Selecione o departamento desejado" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Campo de Justificativa */}
              <div className="space-y-2">
                <Label htmlFor="justificativa" className="text-sm font-medium">
                  Justificativa da Transferência *
                </Label>
                <Textarea
                  id="justificativa"
                  placeholder="Descreva detalhadamente o motivo da solicitação de transferência..."
                  value={formData.justificativa}
                  onChange={(e) =>
                    setFormData({ ...formData, justificativa: e.target.value })
                  }
                  className="min-h-[120px] resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.justificativa.length}/500 caracteres
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Solicitação
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

            {/* Card Informativo */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Informações Importantes
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>A solicitação será enviada para aprovação do RH e dos gestores envolvidos</li>
                  <li>Você receberá uma notificação quando a solicitação for analisada</li>
                  <li>Certifique-se de justificar adequadamente o motivo da transferência</li>
                  <li>O processo de transferência pode levar alguns dias para ser concluído</li>
                  <li>Em caso de dúvidas, entre em contato diretamente com o RH</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <BirthdayCard />
            <AnnouncementsCard />
            <SystemStatus />
            <NewsCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SolicitarTransferencia;

