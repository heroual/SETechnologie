import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Save,
  RefreshCw,
  Check,
  AlertTriangle,
  Copy,
  Edit,
  Trash,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  lastUpdated: string;
}

interface EmailConfig {
  sender: string;
  replyTo: string;
  bcc: string[];
  signature: string;
  logo: boolean;
  footerText: string;
}

const EmailSettings = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    sender: 'contact@setechnologie.ma',
    replyTo: 'support@setechnologie.ma',
    bcc: ['admin@setechnologie.ma'],
    signature: 'L\'équipe SE Technologie',
    logo: true,
    footerText: '© 2025 SE Technologie. Tous droits réservés.'
  });
  
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: 'order-confirmation',
      name: 'Confirmation de commande',
      subject: 'Confirmation de votre commande {{orderNumber}}',
      body: `Cher(e) {{customerName}},

Nous vous remercions pour votre commande sur SE Technologie.

Détails de la commande:
Numéro de commande: {{orderNumber}}
Date: {{orderDate}}
Total: {{orderTotal}} MAD

{{orderItems}}

Votre commande sera traitée dans les plus brefs délais.

Cordialement,
L'équipe SE Technologie`,
      variables: ['customerName', 'orderNumber', 'orderDate', 'orderTotal', 'orderItems'],
      lastUpdated: '2025-03-10T14:30:00Z'
    },
    {
      id: 'shipping-confirmation',
      name: 'Confirmation d\'expédition',
      subject: 'Votre commande {{orderNumber}} a été expédiée',
      body: `Cher(e) {{customerName}},

Nous sommes heureux de vous informer que votre commande a été expédiée.

Détails de l'expédition:
Numéro de commande: {{orderNumber}}
Numéro de suivi: {{trackingNumber}}
Transporteur: {{shippingCarrier}}

Vous pouvez suivre votre colis en utilisant le lien suivant: {{trackingLink}}

Cordialement,
L'équipe SE Technologie`,
      variables: ['customerName', 'orderNumber', 'trackingNumber', 'shippingCarrier', 'trackingLink'],
      lastUpdated: '2025-03-12T10:15:00Z'
    },
    {
      id: 'quote-request',
      name: 'Demande de devis',
      subject: 'Confirmation de votre demande de devis',
      body: `Cher(e) {{customerName}},

Nous avons bien reçu votre demande de devis pour {{serviceType}}.

Notre équipe va étudier votre demande et vous contactera dans les plus brefs délais.

Détails de votre demande:
Service: {{serviceType}}
Date de la demande: {{requestDate}}

Cordialement,
L'équipe SE Technologie`,
      variables: ['customerName', 'serviceType', 'requestDate'],
      lastUpdated: '2025-03-15T09:45:00Z'
    }
  ]);
  
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [testEmail, setTestEmail] = useState('');
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setEmailConfig({
        ...emailConfig,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setEmailConfig({
        ...emailConfig,
        [name]: value
      });
    }
  };

  const handleAddBcc = (email: string) => {
    if (!email) return;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }
    
    if (!emailConfig.bcc.includes(email)) {
      setEmailConfig({
        ...emailConfig,
        bcc: [...emailConfig.bcc, email]
      });
    }
    
    setTestEmail('');
  };

  const handleRemoveBcc = (email: string) => {
    setEmailConfig({
      ...emailConfig,
      bcc: emailConfig.bcc.filter(e => e !== email)
    });
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configuration des emails sauvegardée');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!selectedTemplate) return;
    
    if (!testEmail) {
      toast.error('Veuillez entrer une adresse email');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }
    
    setTesting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Email de test envoyé à ${testEmail}`);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'email de test');
      console.error(error);
    } finally {
      setTesting(false);
    }
  };

  const handleEditTemplate = () => {
    if (selectedTemplate) {
      setEditingTemplate({ ...selectedTemplate });
    }
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;
    
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update templates list
      setTemplates(templates.map(template => 
        template.id === editingTemplate.id 
          ? { ...editingTemplate, lastUpdated: new Date().toISOString() } 
          : template
      ));
      
      // Update selected template
      setSelectedTemplate({ ...editingTemplate, lastUpdated: new Date().toISOString() });
      
      toast.success('Modèle d\'email sauvegardé');
      setEditingTemplate(null);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold flex items-center">
          <Mail className="h-6 w-6 mr-2 text-[var(--primary)]" />
          Configuration des Emails
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === 'templates'
              ? 'border-b-2 border-[var(--primary)] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Modèles d'emails
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === 'settings'
              ? 'border-b-2 border-[var(--primary)] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Paramètres généraux
        </button>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Templates List */}
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Modèles disponibles</h3>
            <div className="space-y-2">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setEditingTemplate(null);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'bg-[var(--primary)]/20 border border-[var(--primary)]/50'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Mis à jour le {formatDate(template.lastUpdated)}
                  </div>
                </button>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 rounded-lg border border-dashed border-white/20 hover:border-white/40 transition-colors flex items-center justify-center text-sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un modèle
            </button>
          </div>

          {/* Template Preview/Editor */}
          <div className="lg:col-span-2">
            {selectedTemplate ? (
              <div className="glass-effect rounded-xl p-6">
                {editingTemplate ? (
                  /* Template Editor */
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Modifier le modèle</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 rounded-lg border border-white/20 hover:bg-white/5 transition-colors text-sm"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleSaveTemplate}
                          disabled={saving}
                          className="px-3 py-1 rounded-lg bg-[var(--primary)] text-white text-sm flex items-center"
                        >
                          {saving ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-1" />
                          )}
                          Sauvegarder
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nom du modèle
                        </label>
                        <input
                          type="text"
                          value={editingTemplate.name}
                          onChange={(e) => setEditingTemplate({
                            ...editingTemplate,
                            name: e.target.value
                          })}
                          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Sujet
                        </label>
                        <input
                          type="text"
                          value={editingTemplate.subject}
                          onChange={(e) => setEditingTemplate({
                            ...editingTemplate,
                            subject: e.target.value
                          })}
                          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Contenu
                        </label>
                        <textarea
                          rows={12}
                          value={editingTemplate.body}
                          onChange={(e) => setEditingTemplate({
                            ...editingTemplate,
                            body: e.target.value
                          })}
                          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)] font-mono text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Variables disponibles
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {editingTemplate.variables.map(variable => (
                            <div
                              key={variable}
                              className="px-3 py-1 rounded-full bg-white/10 text-xs flex items-center"
                            >
                              <span>{'{{' + variable + '}}'}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText('{{' + variable + '}}');
                                  toast.success('Variable copiée');
                                }}
                                className="ml-2 p-1 hover:bg-white/10 rounded-full"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Template Preview */
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">{selectedTemplate.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleEditTemplate}
                          className="px-3 py-1 rounded-lg border border-white/20 hover:bg-white/5 transition-colors text-sm flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </button>
                        <button
                          className="px-3 py-1 rounded-lg border border-white/20 hover:bg-white/5 transition-colors text-sm flex items-center text-red-400"
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Sujet</h4>
                        <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                          {selectedTemplate.subject}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Contenu</h4>
                        <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 whitespace-pre-wrap font-mono text-sm">
                          {selectedTemplate.body}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Variables</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTemplate.variables.map(variable => (
                            <div
                              key={variable}
                              className="px-3 py-1 rounded-full bg-white/10 text-xs flex items-center"
                            >
                              <span>{'{{' + variable + '}}'}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText('{{' + variable + '}}');
                                  toast.success('Variable copiée');
                                }}
                                className="ml-2 p-1 hover:bg-white/10 rounded-full"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-white/10">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Envoyer un email de test</h4>
                        <div className="flex">
                          <input
                            type="email"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            placeholder="Adresse email"
                            className="flex-1 px-4 py-2 rounded-l-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                          />
                          <button
                            onClick={handleSendTestEmail}
                            disabled={testing || !testEmail}
                            className="px-4 py-2 rounded-r-lg bg-[var(--primary)] text-white disabled:opacity-50 flex items-center"
                          >
                            {testing ? (
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Mail className="h-4 w-4 mr-1" />
                            )}
                            Tester
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-effect rounded-xl p-6 flex flex-col items-center justify-center h-full">
                <Mail className="h-16 w-16 text-gray-500 mb-4" />
                <p className="text-gray-400">Sélectionnez un modèle pour le prévisualiser ou le modifier</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="glass-effect rounded-xl p-6">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSaveConfig();
          }}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Adresse d'expédition
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="sender"
                      value={emailConfig.sender}
                      onChange={handleConfigChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Adresse de réponse
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="replyTo"
                      value={emailConfig.replyTo}
                      onChange={handleConfigChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Adresses en copie cachée (BCC)
                </label>
                <div className="flex">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="Ajouter une adresse email"
                      className="w-full pl-10 pr-4 py-2 rounded-l-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddBcc(testEmail);
                        }
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddBcc(testEmail)}
                    className="px-4 py-2 rounded-r-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {emailConfig.bcc.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-white/10 px-3 py-1 rounded-full"
                    >
                      <span className="text-sm">{email}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBcc(email)}
                        className="ml-2 text-gray-400 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Signature
                </label>
                <textarea
                  name="signature"
                  value={emailConfig.signature}
                  onChange={handleConfigChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Texte de pied de page
                </label>
                <input
                  type="text"
                  name="footerText"
                  value={emailConfig.footerText}
                  onChange={handleConfigChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="logo"
                  name="logo"
                  checked={emailConfig.logo}
                  onChange={handleConfigChange}
                  className="w-4 h-4 rounded bg-white/5 border border-white/10 focus:ring-[var(--primary)] text-[var(--primary)]"
                />
                <label htmlFor="logo" className="ml-2 text-sm text-gray-300">
                  Inclure le logo dans les emails
                </label>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Sauvegarder les paramètres
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmailSettings;