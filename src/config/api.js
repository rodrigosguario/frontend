import axios from 'axios';

// URL pública e correta do seu backend no Render
const API_BASE_URL = 'https://dr-rodrigo-backend.onrender.com'; 

// Cria a instância base do axios
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`
});

// --- CORREÇÃO FINAL ---
// Cria um objeto 'adminAPI' que contém as funções específicas
// que os seus componentes (AdminLogin, AdminDashboard) estão a tentar chamar.
export const adminAPI = {
  // A função 'login' que recebe as credenciais e faz a chamada POST
  login: (credentials) => api.post('/admin/login', credentials),

  // A função 'checkAuth' que faz a chamada GET
  checkAuth: () => api.get('/admin/check-auth')
};

// Exporta outros objetos de API se forem necessários noutras partes do site
export const blogAPI = {
  // CREATE - Criar novo post
  createPost: (postData) => api.post('/blog/posts', postData),
  
  // READ - Listar todos os posts
  getPosts: () => api.get('/blog/posts'),
  
  // READ - Buscar post específico por ID
  getPost: (id) => api.get(`/blog/posts/${id}`),
  
  // UPDATE - Atualizar post existente
  updatePost: (id, postData) => api.put(`/blog/posts/${id}`, postData),
  
  // DELETE - Deletar post
  deletePost: (id) => api.delete(`/blog/posts/${id}`)
};

// API para gerenciamento de conteúdo das seções do site
export const contentAPI = {
  // Listar todo o conteúdo
  getAllContent: () => api.get('/content'),
  
  // Buscar conteúdo de uma seção específica
  getSectionContent: (sectionId) => api.get(`/content/${sectionId}`),
  
  // Atualizar conteúdo de uma seção
  updateSectionContent: (sectionId, contentData) => api.put(`/content/${sectionId}`, { content_data: contentData })
};

// API para gerenciamento de configurações do site
export const settingsAPI = {
  // Listar todas as configurações
  getAllSettings: () => api.get('/settings'),
  
  // Buscar configuração específica
  getSetting: (settingKey) => api.get(`/settings/${settingKey}`),
  
  // Atualizar configuração
  updateSetting: (settingKey, value) => api.put(`/settings/${settingKey}`, { value })
};

// API para gerenciamento de avaliações
export const reviewsAPI = {
  // Listar todas as avaliações
  getReviews: () => api.get('/reviews'),
  
  // Adicionar nova avaliação
  addReview: (reviewData) => api.post('/reviews', reviewData),
  
  // Importar avaliações de fontes externas
  importReviews: (source) => api.post('/reviews/import', { source })
};

// APIs para editor visual completo
export const siteAPI = {
  // Buscar todas as seções do site
  getAllSections: async () => {
    const response = await fetch(`${API_BASE_URL}/api/site/sections`);
    if (!response.ok) throw new Error('Erro ao buscar seções');
    return response.json();
  },

  // Atualizar uma seção específica
  updateSection: async (sectionId, contentData) => {
    const response = await fetch(`${API_BASE_URL}/api/site/sections/${sectionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content_data: contentData })
    });
    if (!response.ok) throw new Error('Erro ao atualizar seção');
    return response.json();
  },

  // Gerenciar tema e cores
  getTheme: async () => {
    const response = await fetch(`${API_BASE_URL}/api/site/theme`);
    if (!response.ok) throw new Error('Erro ao buscar tema');
    return response.json();
  },

  updateTheme: async (themeData) => {
    const response = await fetch(`${API_BASE_URL}/api/site/theme`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(themeData)
    });
    if (!response.ok) throw new Error('Erro ao atualizar tema');
    return response.json();
  },

  // Criar backup antes de alterações
  createBackup: async () => {
    const response = await fetch(`${API_BASE_URL}/api/site/backup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Erro ao criar backup');
    return response.json();
  }
};

// Exporta a instância principal para o caso de ser usada diretamente
export default api;
