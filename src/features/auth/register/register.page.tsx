import { useAuth } from '@/core/services/hooks/useAuth';
import Button from '@/shared/components/button/button.component';
import Card from '@/shared/components/card/card.component';
import Textfield from '@/shared/components/textfield/textfield.component';
import React, { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import './register.page.css';

const CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

type FormValues = {
  username: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage: React.FC = () => {
  const { register: registerUser, isRegisterPending } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = useWatch({
    control,
    name: 'password',
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      await registerUser({ username: data.username, password: data.password });
    } catch {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <Card minWidth="30vw" customStyle={CARD_STYLE}>
        <div className="content-container">
          <p className="register-subtitle">Create your account</p>
          <h2 className="register-title">Get Started!</h2>
        </div>

        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
          <div className="content-container">
            <Controller
              name="username"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Textfield label="Username" value={field.value} onChange={field.onChange} />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Textfield
                  label="Password"
                  type="password"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: true,
                validate: (value) => value === password,
              }}
              render={({ field }) => (
                <Textfield
                  label="Confirm Password"
                  type="password"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {errors.confirmPassword && <p className="error">Passwords do not match</p>}
            {error && <p className="error">{error}</p>}
          </div>

          <Button
            label="Sign Up"
            type="submit"
            variant="contained"
            fullWidth
            loading={isRegisterPending}
            disabled={!isValid || isRegisterPending}
            fontSize="16px"
            fontWeight="500"
            padding="14px 20px"
          />
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
