import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import SearchModal from './SearchModal';
import AuthModal from './AuthModal';
import MediaInspectorModal from './MediaInspectorModal';
import WaitlistModal from './WaitlistModal';
import CookiePrefsModal from './CookiePrefsModal';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ModalHost() {
  const { activeModal, closeModal } = useApp();
  const prevFocusRef = useRef(null);

  useEffect(() => {
    if (!activeModal) return undefined;

    prevFocusRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const frameId = window.requestAnimationFrame(() => {
      const dialog = document.querySelector('.hf-modal-backdrop [role="dialog"]');
      if (!dialog) return;
      const preferred =
        dialog.querySelector('[autofocus], input:not([disabled]), textarea:not([disabled]), select:not([disabled])') ||
        dialog.querySelector(FOCUSABLE_SELECTOR);
      if (preferred && typeof preferred.focus === 'function') {
        preferred.focus();
      }
    });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
        return;
      }
      if (event.key !== 'Tab') return;

      const dialog = document.querySelector('.hf-modal-backdrop [role="dialog"]');
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frameId);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      if (prevFocusRef.current && typeof prevFocusRef.current.focus === 'function') {
        prevFocusRef.current.focus();
      }
    };
  }, [activeModal, closeModal]);

  if (!activeModal) return null;

  switch (activeModal.type) {
    case 'search':
      return <SearchModal />;
    case 'auth':
      return <AuthModal initialMode={activeModal.mode || 'signup'} />;
    case 'inspector':
      return <MediaInspectorModal item={activeModal.item} />;
    case 'waitlist':
      return <WaitlistModal />;
    case 'cookiePrefs':
      return <CookiePrefsModal />;
    default:
      return null;
  }
}
