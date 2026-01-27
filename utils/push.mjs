import webpush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

if (vapidKeys.publicKey && vapidKeys.privateKey) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:admin@hairbit.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
}

/**
 * Send Web Push Notification
 */
export const sendPushNotification = async (subscription, payload) => {
  if (!vapidKeys.publicKey) {
    console.warn('[PUSH] VAPID keys not configured. Skipping notification.');
    return;
  }

  try {
    console.log(`[PUSH] Attempting to send notification to ${subscription.endpoint}`);
    const sub = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    };

    const response = await webpush.sendNotification(sub, JSON.stringify(payload));
    console.log(`[PUSH] Success! Sent notification to ${subscription.endpoint}. Status: ${response.statusCode}`);
  } catch (error) {
    if (error.statusCode === 404 || error.statusCode === 410) {
      console.warn(`[PUSH] Subscription expired or no longer valid for ${subscription.endpoint}`);
      // Ideally delete subscription from DB here
    } else {
      console.error('[PUSH] CRITICAL: Error sending notification:', error.message || error);
    }
  }
};
