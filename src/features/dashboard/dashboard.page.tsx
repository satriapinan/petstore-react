import { usePet } from '@/core/services/hooks/usePet';
import Button from '@/shared/components/button/button.component';
import Card from '@/shared/components/card/card.component';
import Spinner from '@/shared/components/spinner/spinner.component';
import type { PetInventory } from '@/shared/models/inventory.model';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.page.css';

interface InventoryCard {
  label: string;
  key: keyof PetInventory;
  icon: string;
}

const DASHBOARD_CARDS: InventoryCard[] = [
  { label: 'Available', key: 'available', icon: '🐾' },
  { label: 'Pending', key: 'pending', icon: '⏳' },
  { label: 'Sold', key: 'sold', icon: '✅' },
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { inventory, inventoryLoading, inventoryError } = usePet();
  const [isMobile, setIsMobile] = useState(globalThis.innerWidth <= 480);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsMobile(globalThis.innerWidth <= 480);
      }, 150);
    };

    globalThis.addEventListener('resize', handleResize);
    return () => {
      globalThis.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, []);

  const navigateToStatus = (status: string) => {
    navigate(`/pets?status=${status}`);
  };

  const navigateToAddPet = () => {
    navigate('/pets/create');
  };

  const renderContent = () => {
    if (inventoryLoading) {
      return (
        <div className="loading-row">
          <Spinner size={12} />
          <p className="state-text">Loading inventory...</p>
        </div>
      );
    }

    if (inventoryError) {
      return <p className="state-text error">Failed to load inventory data.</p>;
    }

    return (
      <div className="cards-row">
        {DASHBOARD_CARDS.map((card) => (
          <Card key={card.key} minWidth="0" padding="0">
            <button className="inventory-card" onClick={() => navigateToStatus(card.key)}>
              <span className="card-icon">{card.icon}</span>
              <span className="card-label">{card.label}</span>
              <span className="card-value">{inventory?.[card.key] ?? 0}</span>
            </button>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="greetings-row">
          <div className="greetings">
            <p className="greetings-subtitle">Good to see you again 👋</p>
            <h2 className="greetings-title">Dashboard</h2>
            <p className="greetings-desc">Here's a quick overview of your pet inventory.</p>
          </div>
          <Button
            label="Add Pet"
            variant="contained"
            icon="mdi:plus"
            fullWidth={isMobile}
            padding="12px 16px"
            onClick={navigateToAddPet}
          />
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardPage;
