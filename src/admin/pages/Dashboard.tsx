
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { catalogApi } from '../../data/catalogApi';

export const Dashboard: React.FC = () => {
  const [counts, setCounts] = useState({ draft: 0, published: 0, archived: 0 });

  useEffect(() => {
    catalogApi.getProductCounts().then(setCounts);
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl text-white font-light">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard label="Draft Products" count={counts.draft} color="text-yellow-400" />
        <DashboardCard label="Published" count={counts.published} color="text-green-400" />
        <DashboardCard label="Archived" count={counts.archived} color="text-gray-400" />
      </div>

      <div className="p-8 bg-[#141821] border border-white/5">
        <h2 className="text-lg text-white mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link to="/admin/products/new" className="px-6 py-3 bg-white text-black font-medium hover:bg-gray-200">
            Add New Product
          </Link>
          <Link to="/admin/collections" className="px-6 py-3 border border-white/10 text-white hover:bg-white/5">
            Manage Collections
          </Link>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ label, count, color }: { label: string, count: number, color: string }) => (
  <div className="bg-[#141821] p-6 border border-white/5">
    <div className="text-xs text-[#9FA3B0] uppercase tracking-wider mb-2">{label}</div>
    <div className={`text-4xl font-light ${color}`}>{count}</div>
  </div>
);
