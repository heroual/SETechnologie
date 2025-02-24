import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash,
  Shield,
  User
} from 'lucide-react';
import type { User } from '../../types';

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@setechnologie.ma',
    role: 'admin',
    created_at: '2024-02-24T10:00:00Z'
  },
  {
    id: '2',
    email: 'manager@setechnologie.ma',
    role: 'manager',
    created_at: '2024-02-24T11:00:00Z'
  },
  {
    id: '3',
    email: 'employee@setechnologie.ma',
    role: 'employee',
    created_at: '2024-02-24T12:00:00Z'
  }
];

const roleColors = {
  admin: 'text-red-400 bg-red-500/20',
  manager: 'text-blue-400 bg-blue-500/20',
  employee: 'text-green-400 bg-green-500/20'
};

const UserRow = ({ user }: { user: User }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-white/10 hover:bg-white/5"
    >
      <td className="py-4 px-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
            <User className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <p className="font-medium">{user.email}</p>
            <p className="text-sm text-gray-400">
              Créé le {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <span
          className={`px-3 py-1 rounded-full text-xs ${roleColors[user.role]}`}
        >
          {user.role}
        </span>
      </td>
      <td className="py-4 px-6 relative">
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
        {showActions && (
          <div className="absolute right-6 mt-2 w-48 rounded-lg bg-[#1A1A1F] border border-white/10 shadow-lg py-1 z-10">
            <button className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </button>
            <button className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Changer le rôle
            </button>
            <button className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center text-red-500">
              <Trash className="h-4 w-4 mr-2" />
              Supprimer
            </button>
          </div>
        )}
      </td>
    </motion.tr>
  );
};

const Users = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Gestion des Utilisateurs</h2>
        <button className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Nouvel Utilisateur
        </button>
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtres
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-effect rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left py-4 px-6 font-medium">Utilisateur</th>
                <th className="text-left py-4 px-6 font-medium">Rôle</th>
                <th className="text-left py-4 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;