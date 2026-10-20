import { useEffect } from 'react';

let lockCount = 0;
let originalBodyOverflow = '';
let originalDocOverflow = '';
let originalPaddingRight = '';

/**
 * useBodyScrollLock
 * Locks the document body & HTML element scrolling when a modal/popup/drawer is open,
 * adds backdrop scroll containment, and compensates for scrollbar width to prevent layout shift.
 *
 * @param {boolean} isLocked - Whether the body scroll should be locked
 */
export function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked || typeof window === 'undefined') return;

    if (lockCount === 0) {
      originalBodyOverflow = document.body.style.overflow;
      originalDocOverflow = document.documentElement.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;

      // Calculate scrollbar width to prevent horizontal page jumping
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';
      document.body.classList.add('modal-scroll-locked');
      document.documentElement.classList.add('modal-scroll-locked');
    }
    lockCount++;

    return () => {
      lockCount--;
      if (lockCount <= 0) {
        lockCount = 0;
        document.body.style.overflow = originalBodyOverflow || '';
        document.body.style.overscrollBehavior = '';
        document.documentElement.style.overflow = originalDocOverflow || '';
        document.documentElement.style.overscrollBehavior = '';
        document.body.style.paddingRight = originalPaddingRight || '';
        document.body.classList.remove('modal-scroll-locked');
        document.documentElement.classList.remove('modal-scroll-locked');
      }
    };
  }, [isLocked]);
}
