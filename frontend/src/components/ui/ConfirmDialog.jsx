import { useEffect, useId, useRef } from 'react';
import { CircleAlert } from 'lucide-react';
import Button from './Button';

// Diálogo modal nativo (<dialog> + showModal): atrapa el foco, cierra con Escape y deja el fondo inerte.
// El foco inicial va a "Cancelar" y al cerrar vuelve al elemento que abrió el diálogo.
function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
  error,
}) {
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open && !dialog.open) {
      openerRef.current = document.activeElement;
      dialog.showModal();
      dialog.querySelector('[data-autofocus]')?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleCancelEvent = (event) => {
    // Escape: mientras se confirma no se puede cerrar; si no, se cancela desde React.
    event.preventDefault();

    if (!loading) {
      onCancel();
    }
  };

  const handleClose = () => {
    const opener = openerRef.current;
    openerRef.current = null;

    if (opener instanceof HTMLElement && opener.isConnected) {
      opener.focus();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={handleCancelEvent}
      onClose={handleClose}
      className="w-[calc(100%-2rem)] max-w-md rounded-card border border-border bg-white p-0 text-ink shadow-xl backdrop:bg-ink/60"
    >
      {open && (
        <div className="flex flex-col gap-4 p-6">
          <h2 id={titleId} className="text-xl font-semibold text-ink">
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className="text-muted">
              {description}
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-control border border-error p-3 text-error"
            >
              <CircleAlert aria-hidden="true" className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </p>
          )}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              data-autofocus
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            <Button variant="danger" onClick={onConfirm} loading={loading}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      )}
    </dialog>
  );
}

export default ConfirmDialog;
