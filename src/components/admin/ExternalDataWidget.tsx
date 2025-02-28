import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  ExternalLink,
  Clock,
  AlertTriangle,
  CheckCircle,
  Thermometer,
  DollarSign,
  Newspaper
} from 'lucide-react';
import { ExternalDataSource, ExternalDataPoint } from '../../types';
import {
  getExternalDataSources,
  getDataPointsBySource,
  syncExternalData
} from '../../services/externalDataService';
import toast from 'react-hot-toast';

const ExternalDataWidget: React.FC = () => {
  const [dataSources, setDataSources] = useState<ExternalDataSource[]>([]);
  const [dataPoints, setDataPoints] = useState<Record<string, ExternalDataPoint[]>>({});
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchDataSources();
  }, []);

  const fetchDataSources = async () => {
    setLoading(true);
    try {
      const sources = await getExternalDataSources();
      setDataSources(sources);
      
      // Fetch data points for each source
      const pointsPromises = sources.map(source => 
        getDataPointsBySource(source.id).then(points => ({
          sourceId: source.id,
          points
        }))
      );
      
      const results = await Promise.all(pointsPromises);
      
      const pointsMap: Record<string, ExternalDataPoint[]> = {};
      results.forEach(result => {
        pointsMap[result.sourceId] = result.points;
      });
      
      setDataPoints(pointsMap);
    } catch (error) {
      console.error('Error fetching external data sources:', error);
      toast.error('Erreur lors du chargement des sources de données');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (sourceId: string) => {
    setSyncing(prev => ({ ...prev, [sourceId]: true }));
    try {
      await syncExternalData(sourceId);
      
      // Refresh data points for this source
      const points = await getDataPointsBySource(sourceId);
      setDataPoints(prev => ({
        ...prev,
        [sourceId]: points
      }));
      
      // Update lastSync in dataSources
      setDataSources(prev => 
        prev.map(source => 
          source.id === sourceId 
            ? { ...source, lastSync: new Date().toISOString(), status: 'active' } 
            : source
        )
      );
      
      toast.success('Données synchronisées avec succès');
    } catch (error) {
      console.error('Error syncing data:', error);
      toast.error('Erreur lors de la synchronisation des données');
      
      // Update status to error
      setDataSources(prev => 
        prev.map(source => 
          source.id === sourceId 
            ? { ...source, status: 'error' } 
            : source
        )
      );
    } finally {
      setSyncing(prev => ({ ...prev, [sourceId]: false }));
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceIcon = (source: ExternalDataSource) => {
    if (source.name.toLowerCase().includes('météo')) {
      return <Thermometer className="h-5 w-5 text-blue-400" />;
    } else if (source.name.toLowerCase().includes('taux') || source.name.toLowerCase().includes('change')) {
      return <DollarSign className="h-5 w-5 text-green-400" />;
    } else if (source.name.toLowerCase().includes('actualité') || source.name.toLowerCase().includes('news')) {
      return <Newspaper className="h-5 w-5 text-orange-400" />;
    } else {
      return <ExternalLink className="h-5 w-5 text-purple-400" />;
    }
  };

  const getStatusIcon = (source: ExternalDataSource) => {
    if (syncing[source.id]) {
      return <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />;
    }
    
    switch (source.status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-400" />;
    }
  };

  const renderDataPointValue = (dataPoint: ExternalDataPoint) => {
    // Handle different types of values
    if (typeof dataPoint.value === 'number') {
      // For numeric values, check if it's a temperature or currency
      if (dataPoint.name.toLowerCase().includes('température')) {
        return (
          <div className="flex items-center">
            <span className="text-xl font-semibold">{dataPoint.value}</span>
            <span className="ml-1 text-sm text-gray-400">
              {dataPoint.metadata?.unit || '°C'}
            </span>
            {dataPoint.metadata?.condition && (
              <span className="ml-2 text-sm text-gray-400">
                ({dataPoint.metadata.condition})
              </span>
            )}
          </div>
        );
      } else if (dataPoint.name.includes('/')) {
        // Likely a currency exchange rate
        return (
          <div className="flex items-center">
            <span className="text-xl font-semibold">{dataPoint.value.toFixed(2)}</span>
          </div>
        );
      } else {
        // Generic number
        return <span className="text-xl font-semibold">{dataPoint.value.toLocaleString()}</span>;
      }
    } else if (typeof dataPoint.value === 'string') {
      // For string values, likely news or text content
      return (
        <div>
          <p className="text-sm line-clamp-2">{dataPoint.value}</p>
          {dataPoint.metadata?.url && (
            <a 
              href={dataPoint.metadata.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-[var(--primary)] hover:underline flex items-center mt-1"
            >
              Lire plus
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          )}
        </div>
      );
    } else {
      // Default fallback
      return <span>{JSON.stringify(dataPoint.value)}</span>;
    }
  };

  if (loading) {
    return (
      <div className="glass-effect rounded-xl p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6">Données Externes</h2>
      
      {dataSources.length > 0 ? (
        <div className="space-y-6">
          {dataSources.map((source) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {getSourceIcon(source)}
                  <h3 className="font-medium ml-2">{source.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">
                    Dernière sync: {formatTimestamp(source.lastSync)}
                  </span>
                  <button
                    onClick={() => handleSync(source.id)}
                    disabled={syncing[source.id]}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    title="Synchroniser"
                  >
                    {getStatusIcon(source)}
                  </button>
                </div>
              </div>
              
              {dataPoints[source.id] && dataPoints[source.id].length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dataPoints[source.id].map((dataPoint) => (
                    <div key={dataPoint.id} className="glass-effect rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">{dataPoint.name}</div>
                      {renderDataPointValue(dataPoint)}
                      <div className="text-xs text-gray-500 mt-1">
                        {formatTimestamp(dataPoint.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm">
                  Aucune donnée disponible
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <ExternalLink className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p>Aucune source de données externe configurée</p>
        </div>
      )}
    </div>
  );
};

export default ExternalDataWidget;