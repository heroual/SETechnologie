import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, isDemoMode } from '../lib/firebase';
import { ShopSettings, EmailSettings, GeneralSettings } from '../types';

// Mock settings for demo mode
const mockShopSettings: ShopSettings = {
  general: {
    shopName: 'SE Technologie',
    shopEmail: 'contact@setechnologie.ma',
    shopPhone: '0808551720',
    shopAddress: 'Agadir, Maroc',
    shopCurrency: 'MAD',
    shopLanguage: 'fr',
  },
  shipping: {
    enableShipping: true,
    shippingMethods: [
      {
        id: 'standard',
        name: 'Livraison standard',
        price: 50,
        estimatedDelivery: '3-5 jours ouvrables',
        active: true
      },
      {
        id: 'express',
        name: 'Livraison express',
        price: 100,
        estimatedDelivery: '1-2 jours ouvrables',
        active: true
      }
    ],
    freeShippingThreshold: 1000
  },
  payment: {
    enablePayments: true,
    paymentMethods: [
      {
        id: 'card',
        name: 'Carte bancaire',
        description: 'Paiement sécurisé par carte bancaire',
        active: true
      },
      {
        id: 'transfer',
        name: 'Virement bancaire',
        description: 'Les détails du virement vous seront envoyés par email',
        active: true
      },
      {
        id: 'cash',
        name: 'Paiement à la livraison',
        description: 'Payez en espèces à la réception de votre commande',
        active: true
      }
    ],
    taxRate: 20
  },
  emails: {
    sendOrderConfirmation: true,
    sendShippingConfirmation: true,
    sendOrderCancellation: true,
    ccAdminOnOrders: true
  }
};

const mockEmailSettings: EmailSettings = {
  sender: 'contact@setechnologie.ma',
  replyTo: 'support@setechnologie.ma',
  bcc: ['admin@setechnologie.ma'],
  signature: 'L\'équipe SE Technologie',
  logo: true,
  footerText: '© 2025 SE Technologie. Tous droits réservés.',
  templates: [
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
      lastUpdated: new Date().toISOString()
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
      lastUpdated: new Date().toISOString()
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
      lastUpdated: new Date().toISOString()
    }
  ]
};

// Get shop settings
export const getShopSettings = async (): Promise<ShopSettings> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    return { ...mockShopSettings };
  }

  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'shop'));
    if (settingsDoc.exists()) {
      return settingsDoc.data() as ShopSettings;
    } else {
      // If no settings exist yet, create default settings
      await setDoc(doc(db, 'settings', 'shop'), mockShopSettings);
      return { ...mockShopSettings };
    }
  } catch (error) {
    console.error('Error fetching shop settings:', error);
    return { ...mockShopSettings };
  }
};

// Save shop settings
export const saveShopSettings = async (settings: ShopSettings): Promise<boolean> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    console.log('DEMO MODE: Saving shop settings', settings);
    Object.assign(mockShopSettings, settings);
    return true;
  }

  try {
    const settingsRef = doc(db, 'settings', 'shop');
    await setDoc(settingsRef, settings, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving shop settings:', error);
    return false;
  }
};

// Get email settings
export const getEmailSettings = async (): Promise<EmailSettings> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    return { ...mockEmailSettings };
  }

  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'email'));
    if (settingsDoc.exists()) {
      return settingsDoc.data() as EmailSettings;
    } else {
      // If no settings exist yet, create default settings
      await setDoc(doc(db, 'settings', 'email'), mockEmailSettings);
      return { ...mockEmailSettings };
    }
  } catch (error) {
    console.error('Error fetching email settings:', error);
    return { ...mockEmailSettings };
  }
};

// Save email settings
export const saveEmailSettings = async (settings: EmailSettings): Promise<boolean> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    console.log('DEMO MODE: Saving email settings', settings);
    Object.assign(mockEmailSettings, settings);
    return true;
  }

  try {
    const settingsRef = doc(db, 'settings', 'email');
    await setDoc(settingsRef, settings, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving email settings:', error);
    return false;
  }
};

// Save email template
export const saveEmailTemplate = async (templateId: string, template: any): Promise<boolean> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    console.log('DEMO MODE: Saving email template', templateId, template);
    const templateIndex = mockEmailSettings.templates.findIndex(t => t.id === templateId);
    if (templateIndex !== -1) {
      mockEmailSettings.templates[templateIndex] = {
        ...template,
        lastUpdated: new Date().toISOString()
      };
    } else {
      mockEmailSettings.templates.push({
        ...template,
        id: templateId,
        lastUpdated: new Date().toISOString()
      });
    }
    return true;
  }

  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'email'));
    if (settingsDoc.exists()) {
      const emailSettings = settingsDoc.data() as EmailSettings;
      const templates = emailSettings.templates || [];
      
      const templateIndex = templates.findIndex(t => t.id === templateId);
      if (templateIndex !== -1) {
        templates[templateIndex] = {
          ...template,
          lastUpdated: new Date().toISOString()
        };
      } else {
        templates.push({
          ...template,
          id: templateId,
          lastUpdated: new Date().toISOString()
        });
      }
      
      await updateDoc(doc(db, 'settings', 'email'), { templates });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error saving email template:', error);
    return false;
  }
};

// Get general settings
export const getGeneralSettings = async (): Promise<GeneralSettings> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    return {
      siteName: 'SE Technologie',
      siteDescription: 'Solutions IoT, réseau et IT innovantes pour votre entreprise et votre maison',
      contactEmail: 'contact@setechnologie.ma',
      contactPhone: '0808551720',
      address: 'Agadir, Maroc',
      socialLinks: {
        facebook: 'https://facebook.com/setechnologie',
        twitter: 'https://twitter.com/setechnologie',
        instagram: 'https://instagram.com/setechnologie',
        linkedin: 'https://linkedin.com/company/setechnologie'
      },
      logo: '',
      favicon: '',
      metaTags: {
        keywords: 'IoT, réseau, IT, technologie, Maroc',
        author: 'SE Technologie',
        ogImage: ''
      }
    };
  }

  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
    if (settingsDoc.exists()) {
      return settingsDoc.data() as GeneralSettings;
    } else {
      // If no settings exist yet, create default settings
      const defaultSettings = {
        siteName: 'SE Technologie',
        siteDescription: 'Solutions IoT, réseau et IT innovantes pour votre entreprise et votre maison',
        contactEmail: 'contact@setechnologie.ma',
        contactPhone: '0808551720',
        address: 'Agadir, Maroc',
        socialLinks: {
          facebook: 'https://facebook.com/setechnologie',
          twitter: 'https://twitter.com/setechnologie',
          instagram: 'https://instagram.com/setechnologie',
          linkedin: 'https://linkedin.com/company/setechnologie'
        },
        logo: '',
        favicon: '',
        metaTags: {
          keywords: 'IoT, réseau, IT, technologie, Maroc',
          author: 'SE Technologie',
          ogImage: ''
        }
      };
      await setDoc(doc(db, 'settings', 'general'), defaultSettings);
      return defaultSettings;
    }
  } catch (error) {
    console.error('Error fetching general settings:', error);
    return {
      siteName: 'SE Technologie',
      siteDescription: 'Solutions IoT, réseau et IT innovantes pour votre entreprise et votre maison',
      contactEmail: 'contact@setechnologie.ma',
      contactPhone: '0808551720',
      address: 'Agadir, Maroc',
      socialLinks: {
        facebook: 'https://facebook.com/setechnologie',
        twitter: 'https://twitter.com/setechnologie',
        instagram: 'https://instagram.com/setechnologie',
        linkedin: 'https://linkedin.com/company/setechnologie'
      },
      logo: '',
      favicon: '',
      metaTags: {
        keywords: 'IoT, réseau, IT, technologie, Maroc',
        author: 'SE Technologie',
        ogImage: ''
      }
    };
  }
};

// Save general settings
export const saveGeneralSettings = async (settings: GeneralSettings): Promise<boolean> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    console.log('DEMO MODE: Saving general settings', settings);
    return true;
  }

  try {
    const settingsRef = doc(db, 'settings', 'general');
    await setDoc(settingsRef, settings, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving general settings:', error);
    return false;
  }
};