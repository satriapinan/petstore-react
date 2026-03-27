import { useAuth } from '@/core/services/hooks/useAuth';
import Button from '@/shared/components/button/button.component';
import Card from '@/shared/components/card/card.component';
import Textfield from '@/shared/components/textfield/textfield.component';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import './login.page.css';

const CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

interface FormValues {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { login, isLoginPending } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>({
    defaultValues: { username: '', password: '' },
    mode: 'onChange',
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    try {
      await login(values);
    } catch {
      setSubmitError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <Card minWidth="30vw" customStyle={CARD_STYLE}>
        <div className="content-container">
          <p className="login-subtitle">Please enter your details</p>
          <h2 className="login-title">Welcome Back!</h2>
        </div>

        <form className="form-container" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="content-container">
            <Controller
              name="username"
              control={control}
              rules={{ required: true, validate: (v) => !!v.trim() }}
              render={({ field }) => (
                <Textfield label="Username" value={field.value} onChange={field.onChange} />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{ required: true, validate: (v) => !!v.trim() }}
              render={({ field }) => (
                <Textfield
                  label="Password"
                  type="password"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {submitError && <p className="error">{submitError}</p>}
          </div>

          <Button
            label="Sign In"
            type="submit"
            variant="contained"
            fullWidth
            loading={isLoginPending}
            disabled={!isValid || isLoginPending}
            fontSize="16px"
            fontWeight="500"
            padding="14px 20px"
          />
        </form>

        <p className="register-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
