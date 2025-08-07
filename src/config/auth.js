// Sistema de autenticação robusto
class AuthManager {
  constructor() {
    this.authKey = 'dr_rodrigo_admin_auth';
    this.defaultCredentials = {
      username: 'admin',
      password: 'admin123'
    };
  }

  // Verificar se está autenticado
  isAuthenticated() {
    try {
      const authData = localStorage.getItem(this.authKey);
      if (!authData) return false;
      
      const parsed = JSON.parse(authData);
      return parsed && parsed.authenticated === true && parsed.expiresAt > Date.now();
    } catch (error) {
      console.warn('Erro ao verificar autenticação:', error);
      return false;
    }
  }

  // Fazer login
  login(credentials) {
    try {
      // Verificar credenciais (simplificado para desenvolvimento)
      const isValid = (
        credentials.username === this.defaultCredentials.username &&
        credentials.password === this.defaultCredentials.password
      );

      if (isValid) {
        const authData = {
          authenticated: true,
          user: {
            name: 'Dr. Rodrigo Sguario',
            role: 'admin',
            email: 'admin@sitecardiologia.com'
          },
          expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
          token: 'mock_token_' + Date.now()
        };
        
        localStorage.setItem(this.authKey, JSON.stringify(authData));
        return { success: true, data: authData };
      } else {
        return { success: false, message: 'Credenciais inválidas' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro interno' };
    }
  }

  // Fazer logout
  logout() {
    try {
      localStorage.removeItem(this.authKey);
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      return { success: false };
    }
  }

  // Obter dados do usuário autenticado
  getCurrentUser() {
    try {
      if (!this.isAuthenticated()) return null;
      
      const authData = JSON.parse(localStorage.getItem(this.authKey));
      return authData.user;
    } catch (error) {
      console.warn('Erro ao obter usuário:', error);
      return null;
    }
  }

  // Verificar autenticação (para compatibilidade com API)
  checkAuth() {
    try {
      const isAuth = this.isAuthenticated();
      const user = isAuth ? this.getCurrentUser() : null;
      
      return {
        success: true,
        data: {
          authenticated: isAuth,
          admin: user,
          user: user
        }
      };
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return {
        success: false,
        data: {
          authenticated: false,
          admin: null,
          user: null
        }
      };
    }
  }
}

// Instância global
export const authManager = new AuthManager();

// Funções de conveniência
export const isAuthenticated = () => authManager.isAuthenticated();
export const login = (credentials) => authManager.login(credentials);
export const logout = () => authManager.logout();
export const getCurrentUser = () => authManager.getCurrentUser();
export const checkAuth = () => authManager.checkAuth();
