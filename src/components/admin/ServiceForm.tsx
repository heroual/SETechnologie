import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Star } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { ServiceFormData } from '../../types';

interface ServiceFormProps {
  initialData?: ServiceFormData & { id?: string };
  onSubmit: (data: ServiceFormData, file?: File) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    category: '',
    description: '',
    pricing_type: 'fixed',
    price: 0,
    status: 'available',
    featured: false
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setImagePreview(URL.createObjectURL(acceptedFiles[0]));
      }
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (name === 'price') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.description) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // If pricing type is fixed, price is required
    if (formData.pricing_type === 'fixed' && !formData.price) {
      toast.error('Veuillez spécifier un prix pour ce service');
      return;
    }
    
    try {
      await onSubmit(formData, file || undefined);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Une erreur est survenue lors de la soumission du formulaire');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0A0A0F] border border-white/10 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">
            {initialData?.id ? 'Modifier le service' : 'Ajouter un service'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom du service *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Catégorie *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="Réseau">Réseau</option>
                <option value="Sécurité">Sécurité</option>
                <option value="Support">Support</option>
                <option value="Installation">Installation</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type de tarification *
              </label>
              <select
                name="pricing_type"
                value={formData.pricing_type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                required
              >
                <option value="fixed">Prix fixe</option>
                <option value="quote">Sur devis</option>
              </select>
            </div>
            
            {formData.pricing_type === 'fixed' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prix (MAD) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Statut *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                required
              >
                <option value="available">Disponible</option>
                <option value="unavailable">Indisponible</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 rounded bg-white/5 border border-white/10 focus:ring-[var(--primary)]"
            />
            <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-300 flex items-center">
              Mettre en avant ce service
              <Star className="h-4 w-4 ml-1 text-yellow-500" />
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image du service
            </label>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors cursor-pointer"
            >
              <input {...getInputProps()} />
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-400">
                Glissez-déposez une image ici, ou cliquez pour sélectionner un fichier
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Formats acceptés: JPG, PNG, WEBP
              </p>
            </div>
            
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : initialData?.id ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ServiceForm;