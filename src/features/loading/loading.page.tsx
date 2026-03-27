import Spinner from '@/shared/components/spinner/spinner.component';
import React from 'react';
import './loading.page.css';

const LoadingPage: React.FC = () => {
  return (
    <div className="loading-page">
      <Spinner size={40} />
    </div>
  );
};

export default LoadingPage;
