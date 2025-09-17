import React from 'react';
import AdvancedReportsPage from './AdvancedReportsPage';

const ReportsPage = ({ user, onLogout }) => {
  return <AdvancedReportsPage user={user} onLogout={onLogout} />;
};

export default ReportsPage;
