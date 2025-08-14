import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Modelos disponíveis da OpenAI
const AVAILABLE_MODELS = [
  { 
    value: "gpt-4.1-2025-04-14", 
    label: "GPT-4.1 (2025-04-14)", 
    description: "Modelo flagship - mais capaz e inteligente" 
  },
  { 
    value: "o3-2025-04-16", 
    label: "O3 (2025-04-16)", 
    description: "Modelo de raciocínio poderoso para problemas complexos" 
  },
  { 
    value: "o4-mini-2025-04-16", 
    label: "O4 Mini (2025-04-16)", 
    description: "Modelo de raciocínio rápido e eficiente" 
  },
  { 
    value: "gpt-4.1-mini-2025-04-14", 
    label: "GPT-4.1 Mini (2025-04-14)", 
    description: "Modelo mais leve com suporte a visão" 
  },
  { 
    value: "gpt-4o", 
    label: "GPT-4o", 
    description: "Modelo anterior mais poderoso" 
  }
];

export default function Configuracao() {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [trainingData, setTrainingData] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4.1-2025-04-14");
  const [isSaving, setIsSaving] = useState(false);

  // Carrega as configurações do localStorage ao montar o componente
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai_api_key");
    const savedTrainingData = localStorage.getItem("lis_training_data");
    const savedModel = localStorage.getItem("openai_model");
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    if (savedTrainingData) {
      setTrainingData(savedTrainingData);
    }
    if (savedModel) {
      setSelectedModel(savedModel);
    }
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error("Por favor, insira uma API key válida");
      return;
    }

    setIsSaving(true);
    
    try {
      // Salva no localStorage
      localStorage.setItem("openai_api_key", apiKey.trim());
      localStorage.setItem("lis_training_data", trainingData.trim());
      localStorage.setItem("openai_model", selectedModel);
      
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
      console.error("Erro:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    setApiKey("");
    setTrainingData("");
    setSelectedModel("gpt-4.1-2025-04-14");
    localStorage.removeItem("openai_api_key");
    localStorage.removeItem("lis_training_data");
    localStorage.removeItem("openai_model");
    toast.success("Configurações removidas com sucesso!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
            <div className="text-muted-foreground">/</div>
            <h1 className="text-xl font-semibold text-foreground">Configurações</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Configurações da IA
                </h2>
                <p className="text-muted-foreground">
                  Configure a API key da OpenAI e os dados de treinamento para a assistente virtual Lis.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key" className="text-sm font-medium">
                    API Key da OpenAI
                  </Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sua API key será armazenada localmente no navegador e não será compartilhada.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model-select" className="text-sm font-medium">
                    Modelo da IA
                  </Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger id="model-select">
                      <SelectValue placeholder="Selecione o modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_MODELS.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{model.label}</span>
                            <span className="text-xs text-muted-foreground">{model.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Escolha o modelo de IA que melhor atende às suas necessidades. GPT-4.1 é recomendado para uso geral.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="training-data" className="text-sm font-medium">
                    Dados de Treinamento da Lis
                  </Label>
                  <Textarea
                    id="training-data"
                    value={trainingData}
                    onChange={(e) => setTrainingData(e.target.value)}
                    placeholder="Insira aqui as informações que a Lis deve conhecer (políticas da empresa, procedimentos, FAQ, etc.)"
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Estes dados serão usados para treinar a assistente virtual Lis e personalizar suas respostas.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving || !apiKey.trim()}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Salvando..." : "Salvar"}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleClear}
                    disabled={!apiKey && !trainingData && selectedModel === "gpt-4.1-2025-04-14"}
                  >
                    Limpar
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium text-foreground mb-2">Como obter uma API key?</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Acesse <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.openai.com</a></li>
                  <li>Faça login ou crie uma conta</li>
                  <li>Vá para "API Keys" no menu</li>
                  <li>Clique em "Create new secret key"</li>
                  <li>Copie a chave e cole aqui</li>
                </ol>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}