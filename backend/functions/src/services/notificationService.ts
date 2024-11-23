// services/notificationService.ts
import * as admin from "firebase-admin";

interface PushTokenProps {
  token: string;
  title: string;
  message: string;
  data?: { [key: string]: unknown };
  scheduledTime?: Date;
}

export const sendPushNotification = async ({
  token,
  title,
  message,
  data,
  scheduledTime,
}: PushTokenProps) => {
  try {
    const fetch = (await import("node-fetch")).default;

    if (token.startsWith("ExponentPushToken")) {
      // Send via Expo
      const messagePayload = {
        to: token,
        sound: "default",
        title,
        body: message,
        data,
        ...(scheduledTime && {
          scheduledTime: scheduledTime.toISOString(),
        }),
      };

      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messagePayload),
      });

      await response.json();
    } else {
      // Send via Firebase
      const messagePayload = {
        notification: {
          title,
          body: message,
        },
        data: data as {[key: string]: string},
        token,
        ...(scheduledTime && {
          android: {
            ttl: scheduledTime.getTime() - Date.now(),
          },
          apns: {
            headers: {
              "apns-expiration": Math.floor(
                scheduledTime.getTime() / 1000
              ).toString(),
            },
          },
        }),
      };
      await admin.messaging().send(messagePayload);
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
