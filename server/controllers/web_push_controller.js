const webpush = require("web-push");
const express = require("express");

const Subscription = require("../models/push_notification_subscription_model");

const router = express.Router();

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails(
  "mailto:alemr905@gmail.com",
  publicVapidKey,
  privateVapidKey
);

router.post("/subscribe", async (req, res) => {
  try {
    console.log("body: ", req.body);
    const { subscription, userId } = req.body;
    console.log("subscription: ", subscription);
    console.log("userId: ", userId);

    const { endpoint, keys } = subscription;

    let existingSubscription = await Subscription.findOne({
      endpoint: endpoint,
    });

    // if (!existingSubscription) {
    //   const newSubscription = new Subscription({
    //     endpoint,
    //     keys: {
    //       p256dh: keys?.p256dh,
    //       auth: keys?.auth,
    //     },
    //   });
    //   await newSubscription.save();
    //   console.log("Subscription saved to MongoDB");
    // } else {
    //   console.log("Subscription already exists in MongoDB");
    //   return;
    // }

    await Subscription.findOneAndUpdate(
      { userId },
      { endpoint, keys: { p256dh: keys?.p256dh, auth: keys?.auth } },
      { upsert: true }
    );

    res.status(201).json({ message: "Subscription stored successfully" });
  } catch (err) {
    console.log("Subscription Error: ", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.post("/notify", async (req, res) => {
  const { userName, userId, title, body } = req.body;

  const subscriptions = await Subscription.findOne({ userId });
  console.log("subscription in notifying: ", subscriptions);
  const payload = JSON.stringify({
    // title: "New Notification",
    // body: "You have a new message!",
    title,
    body,
  });

  if (!subscriptions) {
    console.log("No subscriptions found for userId: ", userId);
    return res
      .status(404)
      .json({ msg: "No subscriptions found for this user" });
  }

  try {
    subscriptions.forEach((subscription) => {
      webpush.sendNotification(subscription, payload).catch(async (error) => {
        if (error.statusCode === 410) {
          // Subscription is no longer valid
          console.log(
            "Subscription is no longer valid, removing from database"
          );

          try {
            await Subscription.findOneAndDelete({
              endpoint: subscription.endpoint,
            });
            console.log("Subscription removed from database");
          } catch (err) {
            console.error("Error removing subscription from database:", err);
          }
        }
      });
    });
    res.status(200).json({ message: "Notification sent!" });
  } catch (err) {
    // console.log("Notify Error: ", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
