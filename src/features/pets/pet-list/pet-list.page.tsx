import { useAuth } from '@/core/services/hooks/useAuth';
import { usePet } from '@/core/services/hooks/usePet';
import Button from '@/shared/components/button/button.component';
import Card from '@/shared/components/card/card.component';
import ConfirmModal from '@/shared/components/confirm-modal/confirm-modal.component';
import Pagination from '@/shared/components/pagination/pagination.component';
import Spinner from '@/shared/components/spinner/spinner.component';
import type { Pet } from '@/shared/models/pet.model';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './pet-list.page.css';

const PAGE_SIZE = 12;
const DEFAULT_PHOTO = 'https://placehold.co/400x400?text=No+Photo';

const STATUS_TABS = [
  { label: 'Available', value: 'available', icon: 'mdi:paw', colorClass: 'text-available' },
  { label: 'Pending', value: 'pending', icon: 'mdi:timer-sand', colorClass: 'text-pending' },
  { label: 'Sold', value: 'sold', icon: 'mdi:check-circle-outline', colorClass: 'text-sold' },
];

const getPhotoUrl = (photoUrls: string[] | undefined | null): string => {
  if (!photoUrls?.length) return DEFAULT_PHOTO;
  const url = photoUrls[0].trim();
  return /^https?:\/\//i.test(url) ? url : DEFAULT_PHOTO;
};

const PetListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const isAdmin = user?.username === 'admin';

  const queryStatus = new URLSearchParams(location.search).get('status') || 'available';
  const [activeStatus, setActiveStatus] = useState(isAdmin ? queryStatus : 'available');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(globalThis.innerWidth <= 480);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { pets = [], petsLoading, petsError, deletePet } = usePet(activeStatus);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsMobile(globalThis.innerWidth <= 480), 150);
    };
    globalThis.addEventListener('resize', handleResize);
    return () => {
      globalThis.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus]);

  const pagedPets = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return pets.slice(start, start + PAGE_SIZE);
  }, [pets, currentPage]);

  const selectStatus = (status: string) => {
    if (!isAdmin || activeStatus === status) return;
    setActiveStatus(status);
    navigate(`/pets?status=${status}`);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    globalThis.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDetail = (id: number | undefined) => {
    if (!isAdmin || id === undefined) return;
    navigate(`/pets/update/${id}`);
  };

  const promptDeletePet = (e: React.MouseEvent, id: number | undefined) => {
    e.stopPropagation();
    if (!isAdmin || id === undefined) return;
    setPetToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (petToDelete === null) return;
    setDeletingId(petToDelete);
    try {
      await deletePet(petToDelete);
      enqueueSnackbar('Pet successfully deleted!', { variant: 'success' });
    } catch {
      console.error('Failed to delete pet.');
    } finally {
      setDeletingId(null);
      setIsDeleteModalOpen(false);
      setPetToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPetToDelete(null);
  };

  const renderListBody = () => {
    if (petsLoading) {
      return (
        <div className="center-state">
          <div className="loading-row">
            <Spinner size={12} />
            <p className="state-text">Loading pets...</p>
          </div>
        </div>
      );
    }

    if (petsError) {
      return (
        <div className="center-state">
          <p className="state-text error">Failed to load pets.</p>
        </div>
      );
    }

    if (pets.length === 0) {
      return (
        <div className="center-state">
          <div className="empty-state">
            <Icon icon="mdi:paw" className="empty-icon" />
            <p className="empty-text">No pets found for this status.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="pets-grid">
        {pagedPets.map((pet: Pet, i: number) => (
          <Card
            key={`${activeStatus}-${pet.id}-${i}`}
            padding="0"
            minWidth="0"
            customStyle={{ animationDelay: `${i * 50}ms` }}
          >
            <div
              className={`pet-card${isAdmin ? ' clickable' : ''}`}
              style={{ animationDelay: `${i * 50}ms` }}
              {...(isAdmin && {
                role: 'button',
                tabIndex: 0,
                onClick: () => navigateToDetail(pet.id),
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') navigateToDetail(pet.id);
                },
              })}
            >
              {isAdmin && (
                <button
                  className="delete-btn"
                  onClick={(e) => promptDeletePet(e, pet.id)}
                  aria-label="Delete pet"
                >
                  <Icon icon="mdi:trash-can-outline" />
                </button>
              )}

              <div className="pet-photo-wrapper">
                <img
                  className="pet-photo"
                  src={getPhotoUrl(pet.photoUrls)}
                  alt={pet.name}
                  loading="lazy"
                />
              </div>

              <div className="pet-info">
                <div className="pet-name-row">
                  <span className="pet-name">{pet.name}</span>
                  {pet.status && (
                    <span className={`pet-status-badge badge-${pet.status}`}>{pet.status}</span>
                  )}
                </div>
                {pet.category?.name && <span className="pet-category">{pet.category.name}</span>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="pet-list-container">
        <div className="pet-list-content">
          <div className="header-row">
            <div className="header-left">
              {isAdmin && (
                <button
                  className="back-btn"
                  onClick={() => navigate('/dashboard')}
                  aria-label="Back to dashboard"
                >
                  <Icon icon="mdi:arrow-left" className="back-icon" />
                  <span>Dashboard</span>
                </button>
              )}
              <div className="heading">
                <h2 className="page-title">Pets</h2>
                <p className="page-desc">
                  {isAdmin
                    ? 'Browse pets by their current status.'
                    : 'Find your perfect companion.'}
                </p>
              </div>
            </div>

            {isAdmin && (
              <Button
                label="Add Pet"
                variant="contained"
                icon="mdi:plus"
                padding="12px 16px"
                fullWidth={isMobile}
                onClick={() => navigate('/pets/create')}
              />
            )}
          </div>

          {isAdmin && (
            <div className="status-tabs" role="tablist">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  className={`tab-btn tab-${tab.value}${activeStatus === tab.value ? ' active' : ''}`}
                  role="tab"
                  aria-selected={activeStatus === tab.value}
                  onClick={() => selectStatus(tab.value)}
                >
                  <Icon icon={tab.icon} className={`tab-icon ${tab.colorClass}`} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="list-body">{renderListBody()}</div>

          <Pagination
            totalItems={pets.length}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      </div>

      {isAdmin && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          title="Delete Pet"
          message="Are you sure you want to delete this pet? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          type="danger"
          icon="mdi:trash-can-outline"
          loading={deletingId !== null}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
};

export default PetListPage;
