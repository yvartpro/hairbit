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
    const sub = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    };

    await webpush.sendNotification(sub, JSON.stringify(payload));
    console.log(`[PUSH] Sent notification to ${subscription.endpoint}`);
  } catch (error) {
    if (error.statusCode === 404 || error.statusCode === 410) {
      console.log('[PUSH] Subscription expired or no longer valid.');
      // Ideally delete subscription from DB here
    } else {
      console.error('[PUSH] Error sending notification:', error);
    }
  }
};
