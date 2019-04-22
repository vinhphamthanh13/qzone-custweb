import { QZ_COGNITO_IDENTITY_KEY } from './auth';

// Loading session when start up
export const loadSession = () => {
  try {
    const identity = localStorage.getItem(QZ_COGNITO_IDENTITY_KEY);
    if (identity === null) return undefined;
    return JSON.parse(identity);
  } catch (e) {
    return undefined;
  }
};

// Saving session
export const saveSession = (session) => {
  try {
    const serializeIdentity = JSON.stringify(session);
    localStorage.setItem(QZ_COGNITO_IDENTITY_KEY, serializeIdentity);
  } catch (e) {
    // ignore when writing localStorage error
  }
};

export const cachedBookingData = (data) => {
  try {
    const serializeData = JSON.stringify(data);
    localStorage.setItem('BOOKING_DATA', serializeData);
  } catch (e) {
    // ignore when writting localStorage error
  }
};
