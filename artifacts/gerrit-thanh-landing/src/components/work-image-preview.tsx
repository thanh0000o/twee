import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type WorkImagePreviewProps = {
  src: string;
  alt: string;
  label: string;
  children: ReactNode;
};

/** Same image presentation as Visualisations, without leaving the project page. */
export function WorkImagePreview({ src, alt, label, children }: WorkImagePreviewProps) {
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth + (parseFloat(getComputedStyle(document.body).paddingRight) || 0)}px`;
    }
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      } else if (event.key === 'Tab') {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      if (openerRef.current?.isConnected) openerRef.current.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <button type="button" className="works-cover-button" ref={openerRef} aria-label={label} aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {children}
      </button>
      {open && createPortal(
        <div
          className="viz-lightbox works-image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="viz-lightbox-stage">
            <img src={src} alt={alt} className="viz-lightbox-image" />
            <button type="button" className="viz-lightbox-close" ref={closeRef} onClick={() => setOpen(false)}>
              {`{close}`}
            </button>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
