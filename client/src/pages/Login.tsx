import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Shield, TrendingUp, Users, Mail } from "lucide-react";
import GoogleButton from "react-google-button";
import ciklusIcon from "@assets/c11eb372-82af-4a16-8a4a-1618dcd39801_1752844410133.png";

export default function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  
  // Forgot password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check for Pedro Orlandi admin credentials
      if (loginEmail === 'pedro.orlandi@ciklus.com.br' && loginPassword === 'senha123') {
        const adminUser = {
          id: 'pedro-001',
          email: 'pedro.orlandi@ciklus.com.br',
          firstName: 'Pedro',
          lastName: 'Orlandi',
          role: 'administrador'
        };
        localStorage.setItem('ciklus-user', JSON.stringify(adminUser));
        window.location.href = '/dashboard';
        return;
      }
      
      // For any other valid email/password, create a regular user
      if (loginEmail && loginPassword) {
        const regularUser = {
          id: 'user-' + Date.now(),
          email: loginEmail,
          firstName: loginEmail.split('@')[0],
          lastName: 'User',
          role: 'cliente'
        };
        localStorage.setItem('ciklus-user', JSON.stringify(regularUser));
        window.location.href = '/dashboard';
        return;
      }
      
      alert('Por favor, preencha email e senha');
    } catch (error) {
      alert('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerPassword !== registerConfirmPassword) {
      alert('Senhas não coincidem');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: registerEmail,
          password: registerPassword,
          firstName: registerFirstName,
          lastName: registerLastName
        })
      });
      
      if (response.ok) {
        alert('Conta criada com sucesso! Faça login.');
        setActiveTab("login");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterConfirmPassword("");
        setRegisterFirstName("");
        setRegisterLastName("");
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao criar conta');
      }
    } catch (error) {
      alert('Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      
      if (response.ok) {
        setForgotSent(true);
      } else {
        alert('Email não encontrado');
      }
    } catch (error) {
      alert('Erro ao enviar email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = () => {
    setLoginEmail('pedro.orlandi@ciklus.com.br');
    setLoginPassword('senha123');
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleAppleLogin = () => {
    window.location.href = '/api/auth/apple';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-business-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Benefits */}
        <div className="hidden lg:block space-y-8">
          <div className="flex items-center space-x-3">
            <img src={ciklusIcon} alt="CIKLUS" className="h-12 w-12" />
            <div>
              <h1 className="text-3xl font-bold text-business-600">CIKLUS</h1>
              <p className="text-gray-600">Planejamento Financeiro Familiar</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Transforme o futuro financeiro da sua família
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-business-100 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-business-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Planejamento Inteligente</h3>
                  <p className="text-gray-600">Projeções financeiras baseadas em dados reais da sua família</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-business-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-business-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gestão Familiar</h3>
                  <p className="text-gray-600">Envolvimento de todos os membros no planejamento</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-business-100 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-business-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Segurança Total</h3>
                  <p className="text-gray-600">Seus dados protegidos com criptografia de nível bancário</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Authentication Forms */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto bg-business-100 p-3 rounded-full w-fit mb-4">
                <Shield className="h-6 w-6 text-business-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {activeTab === "login" && "Bem-vindo de volta"}
                {activeTab === "register" && "Criar conta"}
                {activeTab === "forgot" && "Recuperar senha"}
              </CardTitle>
              <CardDescription>
                {activeTab === "login" && "Entre na sua conta CIKLUS"}
                {activeTab === "register" && "Crie sua conta CIKLUS"}
                {activeTab === "forgot" && "Enviaremos um link de recuperação"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="register">Criar conta</TabsTrigger>
                </TabsList>
                
                {/* LOGIN TAB */}
                <TabsContent value="login" className="space-y-4 mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-gray-600">Lembrar de mim</span>
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setActiveTab("forgot")}
                        className="text-sm text-business-600 hover:text-business-700"
                      >
                        Esqueci minha senha
                      </button>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-business-600 hover:bg-business-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </TabsContent>
                
                {/* REGISTER TAB */}
                <TabsContent value="register" className="space-y-4 mt-6">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">Nome</Label>
                        <Input
                          id="first-name"
                          name="firstName"
                          type="text"
                          autoComplete="given-name"
                          required
                          value={registerFirstName}
                          onChange={(e) => setRegisterFirstName(e.target.value)}
                          placeholder="João"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Sobrenome</Label>
                        <Input
                          id="last-name"
                          name="lastName"
                          type="text"
                          autoComplete="family-name"
                          required
                          value={registerLastName}
                          onChange={(e) => setRegisterLastName(e.target.value)}
                          placeholder="Silva"
                          className="h-11"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <Input
                        id="register-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar senha</Label>
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-business-600 hover:bg-business-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Criando conta..." : "Criar conta"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              {/* FORGOT PASSWORD */}
              {activeTab === "forgot" && (
                <div className="space-y-4">
                  {!forgotSent ? (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email">Email</Label>
                        <Input
                          id="forgot-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="seu@email.com"
                          className="h-11"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-business-600 hover:bg-business-700"
                        disabled={isLoading}
                      >
                        {isLoading ? "Enviando..." : "Enviar link de recuperação"}
                      </Button>
                      
                      <Button 
                        type="button"
                        variant="ghost"
                        onClick={() => setActiveTab("login")}
                        className="w-full"
                      >
                        Voltar ao login
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="mx-auto bg-green-100 p-3 rounded-full w-fit">
                        <Mail className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Email enviado!</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Verifique sua caixa de entrada e siga as instruções para recuperar sua senha.
                        </p>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setActiveTab("login");
                          setForgotSent(false);
                          setForgotEmail("");
                        }}
                        className="w-full"
                      >
                        Voltar ao login
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {/* SOCIAL LOGIN */}
              {activeTab !== "forgot" && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">ou continue com</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <GoogleButton
                      onClick={handleGoogleLogin}
                      style={{ width: '100%', fontFamily: 'inherit' }}
                    />
                    
                    <Button 
                      onClick={handleAppleLogin}
                      variant="outline" 
                      className="w-full h-11 border-gray-300"
                      disabled={isLoading}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      Continuar com Apple
                    </Button>
                  </div>
                </>
              )}
              

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}