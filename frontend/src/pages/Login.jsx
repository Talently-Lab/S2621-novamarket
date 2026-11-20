import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import Notice from '../components/ui/Notice';
import useAuth from '../hooks/useAuth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELDS = ['email', 'password'];

// Vuelve a la ruta protegida desde la que llegó el usuario; si no hay, a la Home.
function getRedirectPath(from) {
  if (!from?.pathname || ['/login', '/register'].includes(from.pathname)) {
    return '/';
  }

  return `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`;
}

function validate({ email, password }) {
  const errors = {};

  if (!email.trim()) {
    errors.email = 'Ingresá tu email.';
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Ingresá un email válido, por ejemplo nombre@dominio.com.';
  }

  if (!password) {
    errors.password = 'Ingresá tu contraseña.';
  }

  return errors;
}

function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [values, setValues] = useState({
    email: location.state?.email ?? '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <Loader label="Verificando sesión..." />;
  }

  // También cubre el login exitoso: al guardarse la sesión, este render redirige.
  if (isAuthenticated) {
    return <Navigate to={getRedirectPath(location.state?.from)} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const errors = validate(values);
    const firstInvalid = FIELDS.find((field) => errors[field]);

    setFieldErrors(errors);
    setFormError('');

    if (firstInvalid) {
      form.elements.namedItem(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);

    try {
      await login({ email: values.email.trim(), password: values.password });
    } catch (error) {
      const apiFieldErrors = Object.fromEntries(
        FIELDS.filter((field) => error.fields?.[field]).map((field) => [
          field,
          error.fields[field],
        ]),
      );

      if (Object.keys(apiFieldErrors).length > 0) {
        setFieldErrors(apiFieldErrors);
      } else {
        setFormError(error.message);
      }

      setSubmitting(false);
    }
  };

  let notice = null;

  if (location.state?.reason === 'session-expired') {
    notice = (
      <Notice>Tu sesión expiró. Ingresá de nuevo para continuar.</Notice>
    );
  } else if (location.state?.registered) {
    notice = (
      <Notice variant="success">
        Tu cuenta se creó correctamente. Ingresá con tu email y contraseña.
      </Notice>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-card border border-border bg-white p-6 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-ink">Ingresar</h1>
        <p className="text-muted">Ingresá con tu email y tu contraseña.</p>
      </div>

      {notice}
      {formError && <ErrorMessage message={formError} />}

      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          error={fieldErrors.email}
          required
        />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          error={fieldErrors.password}
          required
        />
        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>

      <p className="text-center text-muted">
        ¿No tenés cuenta?{' '}
        <Link
          to="/register"
          state={{ from: location.state?.from }}
          className="focus-ring rounded-control font-semibold text-ink underline"
        >
          Creá una
        </Link>
      </p>
    </section>
  );
}

export default Login;
