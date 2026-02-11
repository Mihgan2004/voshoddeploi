
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { catalogApi } from '../data/catalogApi';

export const RequireAdmin: React.FC = () => {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await catalogApi.getSession();
      if (!session) {
        setAuthorized(false);
        return;
      }
      const isAdmin = await catalogApi.isAdmin();
      setAuthorized(isAdmin);
    };
    check();
  }, [location.pathname]);

  if (authorized === null) {
    return <div className="h-screen flex items-center justify-center bg-[#0B0D10] text-[#9FA3B0]">Verifying credentials...</div>;
  }

  if (!authorized) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
