import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase'; 

/**
 * Monitoring Service
 * Captures and reports runtime errors to Firestore for proactive debugging.
 */
class MonitoringService {
  static async reportError(error, context = {}) {
    if (typeof window === 'undefined') return;

    try {
      const errorData = {
        message: error?.message || String(error) || 'Unknown error',
        severity: context.severity || 'error',
        component: context.component || 'Global',
        url: window.location?.href || '',
        userAgent: navigator?.userAgent || '',
        stack: error?.stack || null,
        timestamp: new Date().toISOString()
      };

      if (db) {
        await addDoc(collection(db, 'runtime_errors'), errorData).catch(() => {
          // Quietly ignore network failures to avoid recursive error loops
        });
      }
    } catch {
      // Non-blocking: monitoring must NEVER cause a user-facing failure
    }
  }

  static initGlobalListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      try {
        this.reportError(event.error || { message: event.message }, { severity: 'error' });
      } catch {
        // Prevent recursive listener failures
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      try {
        this.reportError(event.reason instanceof Error ? event.reason : { message: String(event.reason) }, { 
          severity: 'fatal',
          info: 'Unhandled Promise Rejection'
        });
      } catch {
        // Prevent recursive listener failures
      }
    });
  }
}

export default MonitoringService;
