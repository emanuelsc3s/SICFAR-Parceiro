import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de autenticação será implementada posteriormente
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen flex">
      {/* Seção Esquerda - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-700 to-primary relative overflow-hidden">
        {/* Padrão de pontos decorativo */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
          <div className="grid grid-cols-12 gap-2 p-8">
            {Array.from({ length: 144 }).map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-white"
                style={{
                  opacity: Math.random() * 0.5 + 0.3,
                }}
              />
            ))}
          </div>
        </div>

        {/* Conteúdo da seção de branding */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          {/* Ilustração com formas geométricas */}
          <div className="mb-8 max-w-md w-full aspect-square relative">
            {/* Container principal com fundo e sombra */}
            <div className="w-full h-full rounded-2xl bg-white/10 backdrop-blur-sm shadow-2xl p-8 relative overflow-hidden">

              {/* Círculo grande superior esquerdo */}
              <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 opacity-60 animate-pulse"
                   style={{ animationDuration: '4s' }} />

              {/* Círculo médio inferior direito */}
              <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 opacity-50 animate-pulse"
                   style={{ animationDuration: '5s', animationDelay: '1s' }} />

              {/* Retângulo rotacionado centro-esquerda */}
              <div className="absolute top-1/4 left-12 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-40 rounded-xl transform rotate-12 animate-pulse"
                   style={{ animationDuration: '6s', animationDelay: '0.5s' }} />

              {/* Quadrado pequeno superior direito */}
              <div className="absolute top-16 right-20 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 opacity-50 rounded-lg transform -rotate-12" />

              {/* Círculo pequeno centro */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 opacity-70 animate-pulse"
                   style={{ animationDuration: '3s', animationDelay: '2s' }} />

              {/* Retângulo horizontal inferior centro */}
              <div className="absolute bottom-20 left-1/4 w-32 h-12 bg-gradient-to-r from-teal-400 to-cyan-500 opacity-40 rounded-full transform rotate-6" />

              {/* Quadrado médio centro-direita */}
              <div className="absolute top-1/3 right-16 w-20 h-20 bg-gradient-to-br from-rose-400 to-red-500 opacity-45 rounded-lg transform rotate-45 animate-pulse"
                   style={{ animationDuration: '5s', animationDelay: '1.5s' }} />

              {/* Círculo extra pequeno decorativo */}
              <div className="absolute bottom-1/3 left-20 w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 opacity-60" />

            </div>
          </div>

          {/* Texto de branding */}
          <div className="text-center max-w-lg">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Sua ponte de comunicação com o RH
              <span className="inline-flex items-center ml-2">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </span>
            </h1>
            <p className="text-lg text-white/90">
              Acesse informações, benefícios e recursos de forma rápida e segura
            </p>
          </div>
        </div>

        {/* Efeito de brilho animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      </div>

      {/* Seção Direita - Formulário de Login */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo e título */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center gap-2">
                <svg
                  className="w-10 h-10 text-primary"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                <h1 className="text-2xl font-bold text-foreground">SICFAR RH</h1>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Login com seu e-mail
            </h2>
            <p className="text-sm text-muted-foreground">
              Acesse o portal corporativo
            </p>
          </div>

          {/* Card do formulário */}
          <Card className="border-border/50 shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campo de E-mail */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    E-mail
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@email.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Campo de Senha */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="******"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Link Esqueceu a senha */}
                <div className="flex justify-end">
                  <Link
                    to="/esqueceu-senha"
                    className="text-sm text-primary hover:text-primary-700 hover:underline transition-colors"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>

                {/* Botão de Login */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-700 text-primary-foreground font-medium h-11"
                >
                  FAZER LOGIN
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informações adicionais */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Ao fazer login, você concorda com nossos{" "}
              <Link to="/termos" className="text-primary hover:underline">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link to="/privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

