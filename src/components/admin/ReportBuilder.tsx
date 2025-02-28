import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash, FileText, Download, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReportBuilderProps {
  onClose: () => void;
  onSave: (template: ReportTemplate) => void;
}

interface ReportField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'chart' | 'table';
  source: string;
  width: 'full' | 'half' | 'third';
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  fields: ReportField[];
}

const ReportBuilder: React.FC<ReportBuilderProps> = ({ onClose, onSave }) => {
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [fields, setFields] = useState<ReportField[]>([
    {
      id: '1',
      name: 'Revenus mensuels',
      type: 'chart',
      source: 'monthly_revenue',
      width: 'full'
    }
  ]);

  const handleAddField = () => {
    const newField: ReportField = {
      id: Date.now().toString(),
      name: 'Nouveau champ',
      type: 'text',
      source: '',
      width: 'full'
    };
    
    setFields([...fields, newField]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleFieldChange = (id: string, key: keyof ReportField, value: any) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  const handleSaveTemplate = () => {
    if (!templateName) {
      toast.error('Veuillez donner un nom au modèle de rapport');
      return;
    }
    
    if (fields.length === 0) {
      toast.error('Veuillez ajouter au moins un champ au rapport');
      return;
    }
    
    const template: ReportTemplate = {
      id: Date.now().toString(),
      name: templateName,
      description: templateDescription,
      fields
    };
    
    onSave(template);
    toast.success('Modèle de rapport enregistré avec succès');
    onClose();
  };

  const handlePreview = () => {
    toast.success('Aperçu du rapport généré');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0A0A0F] border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2 text-[var(--primary)]" />
            Créateur de rapports personnalisés
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Template Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom du modèle *
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                placeholder="ex: Rapport mensuel des ventes"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                placeholder="ex: Rapport détaillé des ventes mensuelles par produit"
              />
            </div>
          </div>
          
          {/* Fields */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Champs du rapport</h3>
              <button
                onClick={handleAddField}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter un champ
              </button>
            </div>
            
            <div className="space-y-4">
              {fields.map((field) => (
                <div 
                  key={field.id} 
                  className="glass-effect rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Champ #{field.id}</h4>
                    <button
                      onClick={() => handleRemoveField(field.id)}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nom du champ
                      </label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => handleFieldChange(field.id, 'name', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Type
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) => handleFieldChange(field.id, 'type', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                      >
                        <option value="text">Texte</option>
                        <option value="number">Nombre</option>
                        <option value="date">Date</option>
                        <option value="chart">Graphique</option>
                        <option value="table">Tableau</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Source de données
                      </label>
                      <select
                        value={field.source}
                        onChange={(e) => handleFieldChange(field.id, 'source', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                      >
                        <option value="">Sélectionner une source</option>
                        <option value="monthly_revenue">Revenus mensuels</option>
                        <option value="top_products">Produits les plus vendus</option>
                        <option value="inventory">Inventaire</option>
                        <option value="users">Utilisateurs</option>
                        <option value="services">Services</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Largeur
                      </label>
                      <select
                        value={field.width}
                        onChange={(e) => handleFieldChange(field.id, 'width', e.target.value as 'full' | 'half' | 'third')}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                      >
                        <option value="full">Pleine largeur</option>
                        <option value="half">Demi largeur</option>
                        <option value="third">Tiers de largeur</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              
              {fields.length === 0 && (
                <div className="text-center py-8 text-gray-400 border border-dashed border-white/10 rounded-lg">
                  Aucun champ ajouté. Cliquez sur "Ajouter un champ" pour commencer.
                </div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
            <button
              onClick={handlePreview}
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition-colors flex items-center"
            >
              <Download className="h-5 w-5 mr-2" />
              Aperçu
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSaveTemplate}
              className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center"
            >
              <Save className="h-5 w-5 mr-2" />
              Enregistrer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportBuilder;