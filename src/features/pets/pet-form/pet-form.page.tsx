import { usePet } from '@/core/services/hooks/usePet';
import Autocomplete from '@/shared/components/autocomplete/autocomplete.component';
import Button from '@/shared/components/button/button.component';
import Textfield from '@/shared/components/textfield/textfield.component';
import { PET_CATEGORIES, PET_STATUS_OPTIONS, PET_TAGS } from '@/shared/constants/pet.constants';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import './pet-form.page.css';

type PetStatus = 'available' | 'pending' | 'sold';

interface FormValues {
  name: string;
  category: string;
  tag: string;
  status: PetStatus;
}

const PetFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { pet, petLoading, createPet, updatePet, isCreating, isUpdating } = usePet(
    'available',
    id ? Number(id) : undefined,
  );

  const isEditMode = !!id;

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(globalThis.innerWidth <= 480);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      category: '',
      tag: '',
      status: 'available',
    },
  });

  useEffect(() => {
    if (isEditMode && pet) {
      reset({
        name: pet.name ?? '',
        category: pet.category?.name ?? '',
        tag: pet.tags?.[0]?.name ?? '',
        status: (pet.status as PetStatus) ?? 'available',
      });
    }
  }, [isEditMode, pet, reset]);

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

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);

    const payload = {
      ...(isEditMode && id ? { id: Number(id) } : {}),
      name: values.name,
      category: { id: 0, name: values.category },
      tags: [{ id: 0, name: values.tag }],
      photoUrls: [] as string[],
      status: values.status,
    };

    try {
      if (isEditMode) {
        await updatePet(payload);
        navigate('/pets', { state: { status: values.status } });
      } else {
        await createPet(payload);
        navigate('/dashboard');
      }
    } catch {
      const msg = isEditMode
        ? 'Failed to update pet. Please try again.'
        : 'Failed to add pet. Please try again.';

      setSubmitError(msg);
    }
  };

  const onCancel = () => navigate('/dashboard');

  const loading = isEditMode ? petLoading : false;
  const submitting = isCreating || isUpdating;

  return (
    <div className="pet-form-container">
      <div className="pet-form-content">
        <div className="header">
          <div className="header-text">
            <p className="subtitle">Pet Management</p>
            <h2 className="title">{isEditMode ? 'Update Pet' : 'Add New Pet'}</h2>
            <p className="desc">
              {isEditMode
                ? 'Edit the details below to update the pet information.'
                : "Fill in the details below to add a new pet to shop's inventory."}
            </p>
          </div>
        </div>

        <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-card">
            <div className="form-section">
              <h3 className="section-title">Basic Info</h3>
              <div className="fields">
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Name is required.' }}
                  render={({ field }) => (
                    <Textfield
                      label="Name"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="e.g. Buddy"
                    />
                  )}
                />
                {errors.name && <p className="field-error">{errors.name.message}</p>}

                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      label="Category"
                      value={field.value}
                      onChange={field.onChange}
                      options={PET_CATEGORIES}
                      placeholder="e.g. Dogs"
                    />
                  )}
                />

                <Controller
                  name="tag"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      label="Tag"
                      value={field.value}
                      onChange={field.onChange}
                      options={PET_TAGS}
                      placeholder="e.g. Vaccinated"
                    />
                  )}
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Status</h3>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="status-group">
                    {PET_STATUS_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={`status-option${field.value === option.value ? ' active' : ''}`}
                      >
                        <input
                          type="radio"
                          className="status-radio"
                          value={option.value}
                          checked={field.value === option.value}
                          onChange={() => field.onChange(option.value)}
                        />
                        <span className={`status-dot ${option.value}`} />
                        <span className="status-label">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>

          {submitError && <p className="submit-error">{submitError}</p>}

          <div className="actions">
            <Button
              label="Cancel"
              variant="outline"
              type="button"
              fullWidth={isMobile}
              onClick={onCancel}
            />
            <Button
              label={isEditMode ? 'Update Pet' : 'Add Pet'}
              variant="contained"
              icon={isEditMode ? 'mdi:pencil' : 'mdi:plus'}
              type="submit"
              fullWidth={isMobile}
              loading={submitting || loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetFormPage;
