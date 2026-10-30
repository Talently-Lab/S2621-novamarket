import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import useAuth from '../hooks/useAuth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Misma regla que el contrato: mínimo 8 caracteres, al menos una letra y un número.
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const PASSWORD_HINT =
  'Mínimo 8 caracteres, con al menos una letra y un número.';
const FIELDS = ['name', 'lastName', 'email', 'password', 'confirmPassword'];
const INITIAL_VALUES = {
  name: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Ingresá tu nombre.';
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Ingresá tu apellido.';
  }

  if (!values.email.trim()) {
    errors.email = 'Ingresá tu email.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Ingresá un email válido, por ejemplo nombre@dominio.com.';
  }

  if (!values.password) {
    errors.password = 'Ingresá una contraseña.';
  } else if (!PASSWORD_PATTERN.test(values.password)) {
    errors.password =
      'La contraseña debe tener al menos 8 caracteres, una letra y un número.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Repetí la contraseña.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  return errors;
}

function Register() {
  const { register, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <Loader label="Verificando sesión..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
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

    const email = values.email.trim();
    setSubmitting(true);

    try {
      await register({
        name: values.name.trim(),
        lastName: values.lastName.trim(),
        email,
        password: values.password,
      });
      // La API no devuelve token: no hay login automático.
      navigate('/login', {
        state: { registered: true, email, from: location.state?.from },
      });
    } catch (error) {
      setSubmitting(false);

      if (error.code === 'EMAIL_ALREADY_EXISTS') {
        setFieldErrors({
          email: (
            <>
              Ya existe una cuenta con este email.{' '}
              <Link
                to="/login"
                state={{ email, from: location.state?.from }}
                className="focus-ring rounded-control font-semibold underline"
              >
                Ingresá con tu cuenta
              </Link>
              .
            </>
          ),
        });
        form.elements.namedItem('email')?.focus();
        return;
      }

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
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-card border border-border bg-white p-6 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-ink">Crear cuenta</h1>
        <p className="text-muted">Todos los campos son obligatorios.</p>
      </div>

      {formError && <ErrorMessage message={formError} />}

      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Nombre"
            name="name"
            autoComplete="given-name"
            value={values.name}
            onChange={handleChange}
            error={fieldErrors.name}
            required
          />
          <Input
            label="Apellido"
            name="lastName"
            autoComplete="family-name"
            value={values.lastName}
            onChange={handleChange}
            error={fieldErrors.lastName}
            required
          />
        </div>
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
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          error={fieldErrors.password}
          hint={PASSWORD_HINT}
          required
        />
        <Input
          label="Repetir contraseña"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
          required
        />
        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </form>

      <p className="text-center text-muted">
        ¿Ya tenés cuenta?{' '}
        <Link
          to="/login"
          state={{ from: location.state?.from }}
          className="focus-ring rounded-control font-semibold text-ink underline"
        >
          Ingresá
        </Link>
      </p>
    </section>
  );
}

export default Register;
