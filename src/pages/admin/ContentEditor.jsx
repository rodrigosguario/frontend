import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RefreshCw, 
  Eye, 
  Edit3, 
  Type, 
  Image, 
  Link,
  Bold,
  Italic,
  List,
  Quote,
  Code
} from 'lucide-react';

const ContentEditor = () => {
  const [selectedPage, setSelectedPage] = useState('hero');
  const [selectedSection, setSelectedSection] = useState('title');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('text');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [pageContents, setPageContents] = useState({});

  const pages = [
    {
      id: 'hero',
      name: 'Seção Principal',
      sections: [
        { id: 'title', name: 'Título Principal', type: 'text' },
        { id: 'subtitle', name: 'Subtítulo', type: 'text' },
        { id: 'description', name: 'Descrição', type: 'text' },
        { id: 'cta_text', name: 'Texto do Botão', type: 'text' }
      ]
    },
    {
      id: 'about',
      name: 'Sobre o Médico',
      sections: [
        { id: 'title', name: 'Título da Seção', type: 'text' },
        { id: 'description', name: 'Descrição Principal', type: 'html' },
        { id: 'experience', name: 'Experiência', type: 'text' },
        { id: 'specialties', name: 'Especialidades', type: 'html' }
      ]
    },
    {
      id: 'services',
      name: 'Serviços',
      sections: [
        { id: 'title', name: 'Título da Seção', type: 'text' },
        { id: 'description', name: 'Descrição', type: 'text' },
        { id: 'transplant_title', name: 'Título - Transplante', type: 'text' },
        { id: 'transplant_desc', name: 'Descrição - Transplante', type: 'html' },
        { id: 'heart_failure_title', name: 'Título - Insuficiência', type: 'text' },
        { id: 'heart_failure_desc', name: 'Descrição - Insuficiência', type: 'html' }
      ]
    },
    {
      id: 'contact',
      name: 'Contato',
      sections: [
        { id: 'title', name: 'Título da Seção', type: 'text' },
        { id: 'description', name: 'Descrição', type: 'text' },
        { id: 'address', name: 'Endereço', type: 'text' },
        { id: 'phone', name: 'Telefone', type: 'text' },
        { id: 'email', name: 'Email', type: 'text' }
      ]
    }
  ];

  useEffect(() => {
    loadPageContents();
  }, []);

  useEffect(() => {
    if (pageContents[selectedPage] && pageContents[selectedPage][selectedSection]) {
      const sectionContent = pageContents[selectedPage][selectedSection];
      setContent(sectionContent.content || '');
      setContentType(sectionContent.content_type || 'text');
    } else {
      setContent('');
      setContentType('text');
    }
  }, [selectedPage, selectedSection, pageContents]);

  const loadPageContents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings/page-content');
      if (response.ok) {
        const contents = await response.json();
        
        // Organizar conteúdos por página e seção
        const organized = {};
        contents.forEach(item => {
          if (!organized[item.page_name]) {
            organized[item.page_name] = {};
          }
          organized[item.page_name][item.section_name] = item;
        });
        
        setPageContents(organized);
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdos:', error);
      setMessage('Erro ao carregar conteúdos');
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings/page-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_name: selectedPage,
          section_name: selectedSection,
          content: content,
          content_type: contentType,
          is_active: true
        }),
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        
        // Atualizar estado local
        setPageContents(prev => ({
          ...prev,
          [selectedPage]: {
            ...prev[selectedPage],
            [selectedSection]: result.content
          }
        }));
        
        setMessage('Conteúdo salvo com sucesso!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Erro ao salvar conteúdo');
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro ao salvar conteúdo');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSection = () => {
    const page = pages.find(p => p.id === selectedPage);
    return page?.sections.find(s => s.id === selectedSection);
  };

  const insertFormatting = (format) => {
    const textarea = document.getElementById('content-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = '';
    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'link':
        newText = `[${selectedText || 'texto do link'}](https://exemplo.com)`;
        break;
      case 'list':
        newText = `\n- ${selectedText || 'item da lista'}`;
        break;
      case 'quote':
        newText = `> ${selectedText || 'citação'}`;
        break;
      case 'code':
        newText = `\`${selectedText}\``;
        break;
      default:
        newText = selectedText;
    }
    
    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
    
    // Reposicionar cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  const currentSection = getCurrentSection();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Editor de Conteúdo
        </h1>
        <p className="text-muted-foreground">
          Edite o conteúdo das páginas do seu site
        </p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Seleção de Página/Seção */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-4 border border-border">
            <h3 className="font-semibold mb-4">Páginas e Seções</h3>
            
            {pages.map((page) => (
              <div key={page.id} className="mb-4">
                <h4 className="font-medium text-foreground mb-2">{page.name}</h4>
                <div className="space-y-1">
                  {page.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setSelectedPage(page.id);
                        setSelectedSection(section.id);
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        selectedPage === page.id && selectedSection === section.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {section.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Principal */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">
                  {currentSection?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {pages.find(p => p.id === selectedPage)?.name}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg text-sm"
                >
                  <option value="text">Texto Simples</option>
                  <option value="html">HTML</option>
                  <option value="markdown">Markdown</option>
                </select>
                
                <button
                  onClick={saveContent}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Salvar
                </button>
              </div>
            </div>

            {/* Barra de Ferramentas */}
            {(contentType === 'markdown' || contentType === 'html') && (
              <div className="flex items-center gap-2 mb-4 p-2 bg-muted rounded-lg">
                <button
                  onClick={() => insertFormatting('bold')}
                  className="p-2 hover:bg-background rounded transition-colors"
                  title="Negrito"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('italic')}
                  className="p-2 hover:bg-background rounded transition-colors"
                  title="Itálico"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('link')}
                  className="p-2 hover:bg-background rounded transition-colors"
                  title="Link"
                >
                  <Link className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('list')}
                  className="p-2 hover:bg-background rounded transition-colors"
                  title="Lista"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('quote')}
                  className="p-2 hover:bg-background rounded transition-colors"
                  title="Citação"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertFormatting('code')}
                  className="p-2 hover:bg-background rounded transition-colors"
                  title="Código"
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Área de Edição */}
            <div className="space-y-4">
              <textarea
                id="content-editor"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Digite o conteúdo para ${currentSection?.name}...`}
                className="w-full h-64 p-4 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
              />
              
              {/* Preview */}
              {content && (
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </h4>
                  <div className="p-4 bg-muted rounded-lg">
                    {contentType === 'html' ? (
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : contentType === 'markdown' ? (
                      <div className="prose prose-sm max-w-none">
                        {content.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{content}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dicas */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Dicas de Formatação:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                {contentType === 'markdown' && (
                  <>
                    <p>• **texto** para negrito</p>
                    <p>• *texto* para itálico</p>
                    <p>• [texto](url) para links</p>
                    <p>• - item para listas</p>
                    <p>• &gt; texto para citações</p>
                  </>
                )}
                {contentType === 'html' && (
                  <>
                    <p>• &lt;strong&gt;texto&lt;/strong&gt; para negrito</p>
                    <p>• &lt;em&gt;texto&lt;/em&gt; para itálico</p>
                    <p>• &lt;a href="url"&gt;texto&lt;/a&gt; para links</p>
                    <p>• &lt;ul&gt;&lt;li&gt;item&lt;/li&gt;&lt;/ul&gt; para listas</p>
                  </>
                )}
                {contentType === 'text' && (
                  <p>• Texto simples sem formatação especial</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
