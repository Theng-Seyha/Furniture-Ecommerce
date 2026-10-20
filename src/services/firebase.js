import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

let app = null;
let dbInstance = null;
let authInstance = null;

try {
  const firebaseConfig = {
    projectId: "balmy-haven-5vxch",
    appId: "1:943077997436:web:1b81c0ece704f384e382f9",
    apiKey: "AIzaSyAmOrj3Elh5VTiZYXUcuHN_DrV3kS1qKJc",
    authDomain: "balmy-haven-5vxch.firebaseapp.com",
    firestoreDatabaseId: "ai-studio-finalfurmodernfu-38ab0f63-9663-4b8f-a78e-47bacf2579a5",
    storageBucket: "balmy-haven-5vxch.firebasestorage.app",
    messagingSenderId: "943077997436"
  };

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  const databaseId = "ai-studio-finalfurmodernfu-38ab0f63-9663-4b8f-a78e-47bacf2579a5";
  dbInstance = getFirestore(app, databaseId);
  authInstance = getAuth(app);
} catch (err) {
  console.warn('Firebase initialization notice:', err);
}

export const db = dbInstance;
export const auth = authInstance;

/**
 * Persist an order to Firestore
 */
export async function saveOrder(orderData) {
  if (!db || !orderData?.orderId) return null;
  try {
    const orderRef = doc(db, 'orders', orderData.orderId);
    const payload = {
      orderId: orderData.orderId,
      customerName: orderData.customerName || 'Valued Customer',
      phoneNumber: orderData.phoneNumber || '',
      telegramUsername: orderData.telegramUsername || '',
      address: orderData.address || '',
      deliveryCity: orderData.deliveryCity || 'Phnom Penh',
      notes: orderData.notes || '',
      paymentMethod: orderData.paymentMethod || 'ABA / KHQR',
      items: (orderData.items || []).map((item) => ({
        id: item.product?.id || item.id || '',
        name: item.product?.name || item.name || 'Furniture Piece',
        price: item.product?.price || item.price || 0,
        quantity: item.quantity || 1,
        selectedColor: item.selectedColor || 'Standard',
        includeAssembly: Boolean(item.includeAssembly)
      })),
      subtotal: Number(orderData.subtotal) || 0,
      assemblyFee: Number(orderData.assemblyFee) || 0,
      discount: Number(orderData.discount) || 0,
      shipping: Number(orderData.shipping) || 0,
      total: Number(orderData.total) || 0,
      promoCode: orderData.promoCode || '',
      orderDate: orderData.orderDate || new Date().toISOString(),
      currentStage: orderData.currentStage || 1,
      progressPercent: orderData.progressPercent || 20,
      status: orderData.status || 'Received',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(orderRef, payload, { merge: true });
    return payload;
  } catch (err) {
    console.warn('Firestore saveOrder notice:', err);
    return null;
  }
}

/**
 * Fetch an order from Firestore for real-time tracking
 */
export async function fetchOrder(orderId) {
  if (!db || !orderId) return null;
  try {
    const cleanId = String(orderId).trim().toUpperCase();
    const orderRef = doc(db, 'orders', cleanId);
    const snap = await getDoc(orderRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.warn('Firestore fetchOrder notice:', err);
    return null;
  }
}

/**
 * Save customer inquiry to Firestore
 */
export async function saveInquiry(inquiryData) {
  if (!db) return null;
  try {
    const docRef = await addDoc(collection(db, 'inquiries'), {
      name: inquiryData.name || '',
      emailOrPhone: inquiryData.emailOrPhone || '',
      subject: inquiryData.subject || 'Workshop Inquiry',
      message: inquiryData.message || '',
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (err) {
    console.warn('Firestore saveInquiry notice:', err);
    return null;
  }
}

/**
 * Save newsletter subscriber to Firestore
 */
export async function saveNewsletterSubscriber(email) {
  if (!db || !email) return null;
  try {
    const cleanEmail = email.trim().toLowerCase();
    const docRef = await addDoc(collection(db, 'newsletter_subscribers'), {
      email: cleanEmail,
      subscribedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (err) {
    console.warn('Firestore saveNewsletterSubscriber notice:', err);
    return null;
  }
}

// Attach to window for diagnostics
if (typeof window !== 'undefined') {
  window.firebaseDb = db;
}
