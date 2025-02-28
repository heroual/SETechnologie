import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  Download,
  Trash,
  Edit,
  BarChart3,
  Clock,
  X,
  Save,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import ReportBuilder from '../../components/admin/ReportBuilder';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  fields: any[];
  createdAt?: string;
}

interface ScheduledReport {
  id: string;
  templateId: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  nextRun: string;
  format: 'pdf' | 'excel' | 'csv';
  recipients: string[];
  createdAt: string;
}

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([
    {
      id: '1',
      name: 'Rapport des ventes mensuelles',
      description: 'Rapport détaillé des ventes par produit et par catégorie',
      fields: [
        { id: '1', name: 'Revenus mensuels', type: 'chart', source: 'monthly_revenue', width: 'full' },
        { id: '2', name: 'Produits les plus vendus', type: 'table', source: 'top_products', width: 'half' }
      ],
      createdAt: '2025-03-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'Rapport d\'inventaire',
      description: 'État des stocks et prévisions de réapprovisionnement',
      fields: [
        { id: '1', name: 'État des stocks', type: 'table', source: 'inventory', width: 'full' },
        { id: '2', name: 'Produits à réapprovisionner', type: 'table', source: 'low_inventory', width: 'half' }
      ],
      createdAt: '2025-03-05T14:30:00Z'
    }
  ]);
  
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: '1',
      templateId: '1',
      name: 'Rapport des ventes mensuelles',
      frequency: 'monthly',
      nextRun: '2025-04-01',
      format: 'pdf',
      recipients: ['admin@setechnologie.ma'],
      createdAt: '2025-03-01T10:30:00Z'
    }
  ]);
  
  const [newSchedule, setNewSchedule] = useState<Partial<ScheduledReport>>({
    frequency: 'monthly',
    format: 'pdf',
    recipients: []
  });
  
  const [recipient, setRecipient] = useState('');
  const [activeTab, setActiveTab] = useState('templates');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'template' | 'schedule' } | null>(null);

  const handleSaveTemplate = (template: ReportTemplate) => {
    // Check if it's an update or a new template
    if (reportTemplates.some(t => t.id === template.id)) {
      setReportTemplates(reportTemplates.map(t => 
        t.id === template.id ? { ...template, createdAt: t.createdAt } : t
      ));
    } else {
      setReportTemplates([
        ...reportTemplates, 
        { ...template, createdAt: new Date().toISOString() }
      ]);
    }
  };

  const handleEditTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setShowReportBuilder(true);
  };

  const handleScheduleReport = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setNewSchedule({
      templateId: template.id,
      name: template.name,
      frequency: 'monthly',
      format: 'pdf',
      recipients: []
    });
    setShowScheduleModal(true);
  };

  const handleAddRecipient = () => {
    if (!recipient) return;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipient)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }
    
    setNewSchedule({
      ...newSchedule,
      recipients: [...(newSchedule.recipients || []), recipient]
    });
    setRecipient('');
  };

  const handleRemoveRecipient = (email: string) => {
    setNewSchedule({
      ...newSchedule,
      recipients: (newSchedule.recipients || []).filter(r => r !== email)
    });
  };

  const handleSaveSchedule = () => {
    if (!newSchedule.frequency || !newSchedule.format) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if ((newSchedule.recipients || []).length === 0) {
      toast.error('Veuillez ajouter au moins un destinataire');
      return;
    }
    
    // Calculate next run date based on frequency
    const now = new Date();
    let nextRun = new Date();
    
    switch (newSchedule.frequency) {
      case 'daily':
        nextRun.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        nextRun.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        nextRun.setMonth(now.getMonth() + 1);
        break;
      default:
        nextRun.setDate(now.getDate() + 30);
    }
    
    const newScheduledReport: ScheduledReport = {
      id: Date.now().toString(),
      templateId: newSchedule.templateId || '',
      name: newSchedule.name || '',
      frequency: newSchedule.frequency as 'daily' | 'weekly' | 'monthly' | 'custom',
      nextRun: nextRun.toISOString().split('T')[0],
      format: newSchedule.format as 'pdf' | 'excel' | 'csv',
      recipients: newSchedule.recipients || [],
      createdAt: new Date().toISOString()
    };
    
    setScheduledReports([...scheduledReports, newScheduledReport]);
    setShowScheduleModal(false);
    toast.success('Rapport programmé avec succès');
  };

  const handleGenerateReport = (templateId: string) => {
    const template = reportTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    toast.success(`Génération du rapport "${template.name}" en cours...`);
    
    // Simulate report generation
    setTimeout(() => {
      toast.success('Rapport généré avec succès');
    }, 1500);
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'template') {
      setReportTemplates(reportTemplates.filter(t => t.id !== itemToDelete.id));
      
      // Also delete any scheduled reports using this template
      setScheduledReports(scheduledReports.filter(r => r.templateId !== itemToDelete.id));
      
      toast.success('Modèle de rapport supprimé avec succès');
    } else {
      setScheduledReports(scheduledReports.filter(r => r.id !== itemToDelete.id));
      toast.success('Rapport programmé supprimé avec succès');
    }
    
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const handleDeleteItem = (id: string, type: 'template' | 'schedule') => {
    setItemToDelete({ id, type });
    setShowDeleteConfirm(true);
  };

  const filteredTemplates = reportTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSchedules = scheduledReports.filter(schedule =>
    schedule.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold flex items-center">
          <FileText className="h-6 w-6 mr-2 text-[var(--primary)]" />
          Rapports
        </h2>
        <button 
          onClick={() => {
            setSelectedTemplate(null);
            setShowReportBuilder(true);
          }}
          className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau modèle
        </button>
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
          Modèles de rapports
        </button>
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === 'scheduled'
              ? 'border-b-2 border-[var(--primary)] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Rapports programmés
        </button>
      </div>

      {/* Search */}
      <div className="glass-effect rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Rechercher des ${activeTab === 'templates' ? 'modèles' : 'rapports programmés'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {filteredTemplates.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-effect rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{template.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(template.id, 'template')}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-white/5 text-xs flex items-center">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      {template.fields.length} champs
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-xs flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(template.createdAt || '').toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => handleGenerateReport(template.id)}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Générer
                    </button>
                    <button
                      onClick={() => handleScheduleReport(template)}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Programmer
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              {searchTerm ? 'Aucun modèle ne correspond à votre recherche' : 'Aucun modèle de rapport créé'}
            </div>
          )}
        </div>
      )}

      {/* Scheduled Reports Tab */}
      {activeTab === 'scheduled' && (
        <div className="glass-effect rounded-xl overflow-hidden">
          {filteredSchedules.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left py-4 px-6 font-medium">Nom</th>
                    <th className="text-left py-4 px-6 font-medium">Fréquence</th>
                    <th className="text-left py-4 px-6 font-medium">Prochaine exécution</th>
                    <th className="text-left py-4 px-6 font-medium">Format</th>
                    <th className="text-left py-4 px-6 font-medium">Destinataires</th>
                    <th className="text-left py-4 px-6 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((schedule) => (
                    <motion.tr
                      key={schedule.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <td className="py-4 px-6">{schedule.name}</td>
                      <td className="py-4 px-6">
                        {schedule.frequency === 'daily' ? 'Quotidien' : 
                         schedule.frequency === 'weekly' ? 'Hebdomadaire' : 
                         schedule.frequency === 'monthly' ? 'Mensuel' : 'Personnalisé'}
                      </td>
                      <td className="py-4 px-6">{schedule.nextRun}</td>
                      <td className="py-4 px-6">{schedule.format.toUpperCase()}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {schedule.recipients.map((email, index) => (
                            <span key={index} className="px-2 py-1 bg-white/5 rounded-full text-xs">
                              {email}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleGenerateReport(schedule.templateId)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(schedule.id, 'schedule')}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              {searchTerm ? 'Aucun rapport programmé ne correspond à votre recherche' : 'Aucun rapport programmé'}
            </div>
          )}
        </div>
      )}

      {/* Report Builder Modal */}
      {showReportBuilder && (
        <ReportBuilder 
          onClose={() => setShowReportBuilder(false)} 
          onSave={handleSaveTemplate}
        />
      )}

      {/* Schedule Modal */}
      {showScheduleModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0A0A0F] border border-white/10 rounded-xl w-full max-w-md"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold">Programmer un rapport</h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Modèle de rapport
                </label>
                <input
                  type="text"
                  value={selectedTemplate.name}
                  disabled
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 opacity-70"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fréquence
                </label>
                <select
                  value={newSchedule.frequency}
                  onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="daily">Quotidien</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuel</option>
                  <option value="custom">Personnalisé</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Format
                </label>
                <select
                  value={newSchedule.format}
                  onChange={(e) => setNewSchedule({ ...newSchedule, format: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Destinataires
                </label>
                <div className="flex">
                  <input
                    type="email"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-l-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    placeholder="email@example.com"
                  />
                  <button
                    onClick={handleAddRecipient}
                    className="px-4 py-2 rounded-r-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {(newSchedule.recipients || []).map((email, index) => (
                    <div key={index} className="flex items-center bg-white/10 px-3 py-1 rounded-full">
                      <span className="text-sm">{email}</span>
                      <button
                        onClick={() => handleRemoveRecipient(email)}
                        className="ml-2 text-gray-400 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveSchedule}
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Programmer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && itemToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0A0A0F] border border-white/10 rounded-xl w-full max-w-md"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-red-500 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Confirmation de suppression
              </h2>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setItemToDelete(null);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-300 mb-6">
                {itemToDelete.type === 'template' 
                  ? 'Êtes-vous sûr de vouloir supprimer ce modèle de rapport ? Cette action supprimera également tous les rapports programmés associés.'
                  : 'Êtes-vous sûr de vouloir supprimer ce rapport programmé ?'
                }
              </p>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Reports;