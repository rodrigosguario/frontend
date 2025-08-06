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

// Exporta a instância principal para o caso de ser usada diretamente
export default api;