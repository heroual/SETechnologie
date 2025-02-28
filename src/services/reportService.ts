import { DashboardStats, AdvancedAnalytics } from '../types';
import { getDashboardStats, getAdvancedAnalytics } from './dashboardService';
import { getProducts } from './productService';
import { getServices } from './serviceService';
import { getUsers } from './userService';
import { isDemoMode } from '../lib/firebase';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  fields: ReportField[];
  createdAt?: string;
}

export interface ReportField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'chart' | 'table';
  source: string;
  width: 'full' | 'half' | 'third';
}

export interface ScheduledReport {
  id: string;
  templateId: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  nextRun: string;
  format: 'pdf' | 'excel' | 'csv';
  recipients: string[];
  createdAt: string;
}

export interface ReportData {
  timestamp: string;
  stats: DashboardStats | null;
  analytics: AdvancedAnalytics | null;
  products: any[] | null;
  services: any[] | null;
  users: any[] | null;
}

// Mock report templates for demo mode
const mockReportTemplates: ReportTemplate[] = [
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
];

// Mock scheduled reports for demo mode
const mockScheduledReports: ScheduledReport[] = [
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
];

// Get all report templates
export const getReportTemplates = async (): Promise<ReportTemplate[]> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    return mockReportTemplates;
  }

  // In a real implementation, you would fetch this from your database
  // For now, we'll return the mock data
  return mockReportTemplates;
};

// Get a report template by ID
export const getReportTemplateById = async (id: string): Promise<ReportTemplate | null> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    return mockReportTemplates.find(template => template.id === id) || null;
  }

  // In a real implementation, you would fetch this from your database
  return mockReportTemplates.find(template => template.id === id) || null;
};

// Create a new report template
export const createReportTemplate = async (template: Omit<ReportTemplate, 'id' | 'createdAt'>): Promise<string> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    const newId = `demo-template-${Date.now()}`;
    mockReportTemplates.push({
      id: newId,
      ...template,
      createdAt: new Date().toISOString()
    });
    return newId;
  }

  // In a real implementation, you would save this to your database
  const newId = `template-${Date.now()}`;
  mockReportTemplates.push({
    id: newId,
    ...template,
    createdAt: new Date().toISOString()
  });
  return newId;
};

// Update a report template
export const updateReportTemplate = async (id: string, template: Omit<ReportTemplate, 'id' | 'createdAt'>): Promise<void> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    const index = mockReportTemplates.findIndex(t => t.id === id);
    if (index !== -1) {
      mockReportTemplates[index] = {
        ...mockReportTemplates[index],
        ...template
      };
    }
    return;
  }

  // In a real implementation, you would update this in your database
  const index = mockReportTemplates.findIndex(t => t.id === id);
  if (index !== -1) {
    mockReportTemplates[index] = {
      ...mockReportTemplates[index],
      ...template
    };
  }
};

// Delete a report template
export const deleteReportTemplate = async (id: string): Promise<void> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    const index = mockReportTemplates.findIndex(t => t.id === id);
    if (index !== -1) {
      mockReportTemplates.splice(index, 1);
    }
    return;
  }

  // In a real implementation, you would delete this from your database
  const index = mockReportTemplates.findIndex(t => t.id === id);
  if (index !== -1) {
    mockReportTemplates.splice(index, 1);
  }
};

// Get all scheduled reports
export const getScheduledReports = async (): Promise<ScheduledReport[]> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    return mockScheduledReports;
  }

  // In a real implementation, you would fetch this from your database
  return mockScheduledReports;
};

// Create a new scheduled report
export const createScheduledReport = async (report: Omit<ScheduledReport, 'id' | 'createdAt'>): Promise<string> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    const newId = `demo-schedule-${Date.now()}`;
    mockScheduledReports.push({
      id: newId,
      ...report,
      createdAt: new Date().toISOString()
    });
    return newId;
  }

  // In a real implementation, you would save this to your database
  const newId = `schedule-${Date.now()}`;
  mockScheduledReports.push({
    id: newId,
    ...report,
    createdAt: new Date().toISOString()
  });
  return newId;
};

// Delete a scheduled report
export const deleteScheduledReport = async (id: string): Promise<void> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    const index = mockScheduledReports.findIndex(r => r.id === id);
    if (index !== -1) {
      mockScheduledReports.splice(index, 1);
    }
    return;
  }

  // In a real implementation, you would delete this from your database
  const index = mockScheduledReports.findIndex(r => r.id === id);
  if (index !== -1) {
    mockScheduledReports.splice(index, 1);
  }
};

// Generate a report based on a template
export const generateReport = async (templateId: string): Promise<ReportData> => {
  // Get the template
  const template = await getReportTemplateById(templateId);
  if (!template) {
    throw new Error('Report template not found');
  }

  // Gather all the data needed for the report
  const stats = await getDashboardStats();
  const analytics = await getAdvancedAnalytics();
  const products = await getProducts();
  const services = await getServices();
  const users = await getUsers();

  // Return the data
  return {
    timestamp: new Date().toISOString(),
    stats,
    analytics,
    products,
    services,
    users
  };
};

// Export a report to a specific format
export const exportReport = async (data: ReportData, format: 'pdf' | 'excel' | 'csv'): Promise<string> => {
  // In a real implementation, you would generate the file and return a URL
  // For now, we'll just return a mock URL
  return `https://example.com/reports/report-${Date.now()}.${format}`;
};

// Calculate the next run date for a scheduled report
export const calculateNextRunDate = (frequency: 'daily' | 'weekly' | 'monthly' | 'custom'): string => {
  const now = new Date();
  let nextRun = new Date();
  
  switch (frequency) {
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
  
  return nextRun.toISOString().split('T')[0];
};

// Predict future trends based on historical data
export const predictTrends = async (dataSource: string, periods: number): Promise<any[]> => {
  // In a real implementation, you would use a proper forecasting algorithm
  // For now, we'll just generate some random data
  
  const analytics = await getAdvancedAnalytics();
  
  if (dataSource === 'monthly_revenue' && analytics) {
    const historicalData = analytics.monthly_revenue;
    
    // Simple linear regression for prediction
    const predictions = [];
    const lastValue = historicalData[historicalData.length - 1];
    const secondLastValue = historicalData[historicalData.length - 2];
    const trend = lastValue - secondLastValue;
    
    for (let i = 1; i <= periods; i++) {
      predictions.push(Math.max(0, lastValue + trend * i * (0.8 + Math.random() * 0.4)));
    }
    
    return predictions;
  }
  
  // Default random predictions
  return Array.from({ length: periods }, () => Math.floor(Math.random() * 100000));
};

// Detect anomalies in data
export const detectAnomalies = async (dataSource: string, threshold: number = 2): Promise<any[]> => {
  // In a real implementation, you would use a proper anomaly detection algorithm
  // For now, we'll just identify values that are significantly different from the mean
  
  const analytics = await getAdvancedAnalytics();
  
  if (dataSource === 'monthly_revenue' && analytics) {
    const data = analytics.monthly_revenue;
    
    // Calculate mean and standard deviation
    const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
    const stdDev = Math.sqrt(
      data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length
    );
    
    // Identify anomalies (values that are more than threshold standard deviations from the mean)
    const anomalies = [];
    
    for (let i = 0; i < data.length; i++) {
      const zScore = Math.abs((data[i] - mean) / stdDev);
      
      if (zScore > threshold) {
        anomalies.push({
          index: i,
          value: data[i],
          zScore,
          month: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'][i]
        });
      }
    }
    
    return anomalies;
  }
  
  return [];
};