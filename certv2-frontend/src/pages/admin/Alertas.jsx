

// src/pages/admin/Alertas.jsx
import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import AlertTable from '../../components/AlertTable';

const Alertas = () => {
  return (
    <DashboardLayout>
      <AlertTable />
    </DashboardLayout>
  );
};

export default Alertas;