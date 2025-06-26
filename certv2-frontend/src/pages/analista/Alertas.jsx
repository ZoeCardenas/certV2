// src/pages/analista/Alertas.jsx
import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import AlertTable from '../../components/AlertTable';

const AlertasAnalista = () => {
  return (
    <DashboardLayout>
      <AlertTable />
    </DashboardLayout>
  );
};

export default AlertasAnalista;
