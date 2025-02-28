import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  RefreshCw,
  DollarSign,
  Truck,
  CreditCard,
  Settings,
  Globe,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Trash,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getShopSettings, saveShopSettings } from '../../services/shopSettingsService';
import { ShopSettings } from '../../types';

const ShopSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState<ShopSettings>({
    general: {
      shopName: '',
      shopEmail: '',
      shopPhone: '',
      shopAddress: '',
      shopCurrency: 'MAD',
      shopLanguage: 'fr',
    },
    shipping: {
      enableShipping: true,
      shippingMethods: [],
      freeShippingThreshold: 0
    },
    payment: {
      enablePayments: true,
      paymentMethods: [],
      taxRate: 0
    },
    emails: {
      sendOrderConfirmation: true,
      sendShippingConfirmation: true,
      sendOrderCancellation: true,
      ccAdminOnOrders: true
    }
  });

  // New shipping method state
  const [newShippingMethod, setNewShippingMethod] = useState({
    name: '',
    price: 0,
    estimatedDelivery: ''
  });

  // New payment method state
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const shopSettings = await getShopSettings();
        setSettings(shopSettings);
      } catch (error) {
        console.error('Error fetching shop settings:', error);
        toast.error('Erreur lors du chargement des paramètres');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      general: {
        ...settings.general,
        [name]: value
      }
    });
  };

  const handleShippingToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      shipping: {
        ...settings.shipping,
        enableShipping: e.target.checked
      }
    });
  };

  const handleShippingMethodChange = (id: string, field: string, value: any) => {
    setSettings({
      ...settings,
      shipping: {
        ...settings.shipping,
        shippingMethods: settings.shipping.shippingMethods.map(method => 
          method.id === id ? { ...method, [field]: value } : method
        )
      }
    });
  };

  const handleFreeShippingThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      shipping: {
        ...settings.shipping,
        freeShippingThreshold: parseFloat(e.target.value) || 0
      }
    });
  };

  const handlePaymentToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      payment: {
        ...settings.payment,
        enablePayments: e.target.checked
      }
    });
  };

  const handlePaymentMethodChange = (id: string, field: string, value: any) => {
    setSettings({
      ...settings,
      payment: {
        ...settings.payment,
        paymentMethods: settings.payment.paymentMethods.map(method => 
          method.id === id ? { ...method, [field]: value } : method
        )
      }
    });
  };

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      payment: {
        ...settings.payment,
        taxRate: parseFloat(e.target.value) || 0
      }
    });
  };

  const handleEmailSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings({
      ...settings,
      emails: {
        ...settings.emails,
        [name]: checked
      }
    });
  };

  const handleAddShippingMethod = () => {
    if (!newShippingMethod.name || !newShippingMethod.estimatedDelivery) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const newMethod = {
      id: `shipping-${Date.now()}`,
      name: newShippingMethod.name,
      price: newShippingMethod.price,
      estimatedDelivery: newShippingMethod.estimatedDelivery,
      active: true
    };

    setSettings({
      ...settings,
      shipping: {
        ...settings.shipping,
        shippingMethods: [...settings.shipping.shippingMethods, newMethod]
      }
    });

    setNewShippingMethod({
      name: '',
      price: 0,
      estimatedDelivery: ''
    });

    toast.success('Méthode de livraison ajoutée');
  };

  const handleRemoveShippingMethod = (id: string) => {
    setSettings({
      ...settings,
      shipping: {
        ...settings.shipping,
        shippingMethods: settings.shipping.shippingMethods.filter(method => method.id !== id)
      }
    });
    toast.success('Méthode de livraison supprimée');
  };

  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.name || !newPaymentMethod.description) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const newMethod = {
      id: `payment-${Date.now()}`,
      name: newPaymentMethod.name,
      description: newPaymentMethod.description,
      active: true
    };

    setSettings({
      ...settings,
      payment: {
        ...settings.payment,
        paymentMethods: [...settings.payment.paymentMethods, newMethod]
      }
    });

    setNewPaymentMethod({
      name: '',
      description: ''
    });

    toast.success('Méthode de paiement ajoutée');
  };

  const handleRemovePaymentMethod = (id: string) => {
    setSettings({
      ...settings,
      payment: {
        ...settings.payment,
        paymentMethods: settings.payment.paymentMethods.filter(method => method.id !== id)
      }
    });
    toast.success('Méthode de paiement supprimée');
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      const success = await saveShopSettings(settings);
      if (success) {
        toast.success('Paramètres de la boutique sauvegardés');
      } else {
        toast.error('Erreur lors de la sauvegarde des paramètres');
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde des paramètres');
      console.error(error);
    } finally {
      setSaving(false);
    }
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
          <ShoppingBag className="h-6 w-6 mr-2 text-[var(--primary)]" />
          Paramètres de la Boutique
        </h2>
        <button
          onClick={handleSaveSettings}
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

      {/* Tabs */}
      <div className="flex border-b border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === 'general'
              ? 'border-b-2 border-[var(--primary)] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Settings className="h-4 w-4 inline-block mr-1" />
          Général
        </button>
        <button
          onClick={() => setActiveTab('shipping')}
          className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === 'shipping'
              ? 'border-b-2 border-[var(--primary)] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Truck className="h-4 w-4 inline-block mr-1" />
          Livraison
        </button>
        <button
          onClick={() => setActiveTab('payment')}
          className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === 'payment'
              ? 'border-b-2 border-[var(--primary)] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <CreditCard className="h-4 w-4 inline-block mr-1" />
          Paiement
        </button>
        <button
          onClick={() => setActiveTab('emails')}
          className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === 'emails'
              ? 'border-b-2 border-[var(--primary)] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Globe className="h-4 w-4 inline-block mr-1" />
          Emails
        </button>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Paramètres généraux</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom de la boutique
                </label>
                <input
                  type="text"
                  name="shopName"
                  value={settings.general.shopName}
                  onChange={handleGeneralChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email de la boutique
                </label>
                <input
                  type="email"
                  name="shopEmail"
                  value={settings.general.shopEmail}
                  onChange={handleGeneralChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="shopPhone"
                  value={settings.general.shopPhone}
                  onChange={handleGeneralChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  name="shopAddress"
                  value={settings.general.shopAddress}
                  onChange={handleGeneralChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Devise
                </label>
                <select
                  name="shopCurrency"
                  value={settings.general.shopCurrency}
                  onChange={handleGeneralChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="MAD">Dirham marocain (MAD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="USD">Dollar américain (USD)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Langue
                </label>
                <select
                  name="shopLanguage"
                  value={settings.general.shopLanguage}
                  onChange={handleGeneralChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="ar">Arabe</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Settings */}
      {activeTab === 'shipping' && (
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Paramètres de livraison</h3>
            <div className="flex items-center">
              <span className="mr-2 text-sm">Activer la livraison</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.shipping.enableShipping}
                  onChange={handleShippingToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
              </label>
            </div>
          </div>
          
          <div className={settings.shipping.enableShipping ? '' : 'opacity-50 pointer-events-none'}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Seuil de livraison gratuite ({settings.general.shopCurrency})
              </label>
              <input
                type="number"
                value={settings.shipping.freeShippingThreshold}
                onChange={handleFreeShippingThresholdChange}
                min="0"
                step="1"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
              />
              <p className="text-sm text-gray-400 mt-1">
                Définissez à 0 pour désactiver la livraison gratuite
              </p>
            </div>
            
            <h4 className="font-medium mb-4">Méthodes de livraison</h4>
            
            <div className="space-y-4 mb-6">
              {settings.shipping.shippingMethods.map(method => (
                <div key={method.id} className="glass-effect rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={method.active}
                        onChange={(e) => handleShippingMethodChange(method.id, 'active', e.target.checked)}
                        className="mr-3 rounded bg-white/5 border border-white/10 focus:ring-[var(--primary)] text-[var(--primary)]"
                      />
                      <input
                        type="text"
                        value={method.name}
                        onChange={(e) => handleShippingMethodChange(method.id, 'name', e.target.value)}
                        className="font-medium bg-transparent border-b border-white/10 focus:outline-none focus:border-[var(--primary)]"
                      />
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                      <input
                        type="number"
                        value={method.price}
                        onChange={(e) => handleShippingMethodChange(method.id, 'price', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="1"
                        className="w-20 bg-transparent border-b border-white/10 focus:outline-none focus:border-[var(--primary)] text-right"
                      />
                      <button
                        onClick={() => handleRemoveShippingMethod(method.id)}
                        className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Délai de livraison estimé
                    </label>
                    <input
                      type="text"
                      value={method.estimatedDelivery}
                      onChange={(e) => handleShippingMethodChange(method.id, 'estimatedDelivery', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                      placeholder="ex: 3-5 jours ouvrables"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="glass-effect rounded-lg p-4">
              <h4 className="font-medium mb-4">Ajouter une méthode de livraison</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom de la méthode
                  </label>
                  <input
                    type="text"
                    value={newShippingMethod.name}
                    onChange={(e) => setNewShippingMethod({...newShippingMethod, name: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    placeholder="ex: Livraison standard"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Prix ({settings.general.shopCurrency})
                  </label>
                  <input
                    type="number"
                    value={newShippingMethod.price}
                    onChange={(e) => setNewShippingMethod({...newShippingMethod, price: parseFloat(e.target.value) || 0})}
                    min="0"
                    step="1"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Délai de livraison estimé
                </label>
                <input
                  type="text"
                  value={newShippingMethod.estimatedDelivery}
                  onChange={(e) => setNewShippingMethod({...newShippingMethod, estimatedDelivery: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="ex: 3-5 jours ouvrables"
                />
              </div>
              <button
                onClick={handleAddShippingMethod}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter cette méthode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Paramètres de paiement</h3>
            <div className="flex items-center">
              <span className="mr-2 text-sm">Activer les paiements</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.payment.enablePayments}
                  onChange={handlePaymentToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
              </label>
            </div>
          </div>
          
          <div className={settings.payment.enablePayments ? '' : 'opacity-50 pointer-events-none'}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Taux de TVA (%)
              </label>
              <input
                type="number"
                value={settings.payment.taxRate}
                onChange={handleTaxRateChange}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            
            <h4 className="font-medium mb-4">Méthodes de paiement</h4>
            
            <div className="space-y-4 mb-6">
              {settings.payment.paymentMethods.map(method => (
                <div key={method.id} className="glass-effect rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={method.active}
                        onChange={(e) => handlePaymentMethodChange(method.id, 'active', e.target.checked)}
                        className="mr-3 rounded bg-white/5 border border-white/10 focus:ring-[var(--primary)] text-[var(--primary)]"
                      />
                      <input
                        type="text"
                        value={method.name}
                        onChange={(e) => handlePaymentMethodChange(method.id, 'name', e.target.value)}
                        className="font-medium bg-transparent border-b border-white/10 focus:outline-none focus:border-[var(--primary)]"
                      />
                    </div>
                    <button
                      onClick={() => handleRemovePaymentMethod(method.id)}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={method.description}
                      onChange={(e) => handlePaymentMethodChange(method.id, 'description', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                      placeholder="ex: Paiement sécurisé par carte bancaire"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="glass-effect rounded-lg p-4">
              <h4 className="font-medium mb-4">Ajouter une méthode de paiement</h4>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom de la méthode
                </label>
                <input
                  type="text"
                  value={newPaymentMethod.name}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="ex: Carte bancaire"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newPaymentMethod.description}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="ex: Paiement sécurisé par carte bancaire"
                />
              </div>
              <button
                onClick={handleAddPaymentMethod}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter cette méthode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Settings */}
      {activeTab === 'emails' && (
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Paramètres des emails</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 glass-effect rounded-lg">
              <div>
                <h4 className="font-medium">Confirmation de commande</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Envoyer un email de confirmation après chaque commande
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="sendOrderConfirmation"
                  checked={settings.emails.sendOrderConfirmation}
                  onChange={handleEmailSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 glass-effect rounded-lg">
              <div>
                <h4 className="font-medium">Confirmation d'expédition</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Envoyer un email lorsqu'une commande est expédiée
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="sendShippingConfirmation"
                  checked={settings.emails.sendShippingConfirmation}
                  onChange={handleEmailSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 glass-effect rounded-lg">
              <div>
                <h4 className="font-medium">Annulation de commande</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Envoyer un email lorsqu'une commande est annulée
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="sendOrderCancellation"
                  checked={settings.emails.sendOrderCancellation}
                  onChange={handleEmailSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 glass-effect rounded-lg">
              <div>
                <h4 className="font-medium">Copie à l'administrateur</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Envoyer une copie de tous les emails de commande à l'administrateur
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="ccAdminOnOrders"
                  checked={settings.emails.ccAdminOnOrders}
                  onChange={handleEmailSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
              </label>
            </div>
            
            <div className="p-4 bg-yellow-500/10 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-500">Remarque</p>
                  <p className="text-gray-300 mt-1">
                    Pour personnaliser les modèles d'emails, veuillez vous rendre dans la section "Configuration des Emails" du tableau de bord.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopSettingsPage;