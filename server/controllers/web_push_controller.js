const webpush = require("web-push");
const express = require("express");

const Subscription = require("../models/push_notification_subscription_model");

const router = express.Router();

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails(
  "mailto:alemr905@example.com",
  publicVapidKey,
  privateVapidKey
);

// let subscriptions = [];

router.post("/subscribe", async (req, res) => {
  try {
    const subscription = req.body;
    let existingSubscription = await Subscription.findOne({
      endpoint: subscription.endpoint,
    });

    // subscriptions.push(subscription);
    if (existingSubscription) {
      const newSubscription = new Subscription(subscription);
      await newSubscription.save();
    }
    res.status(201).json({ message: "Subscription stored successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.post("/notify", async (req, res) => {
  const subscriptions = await Subscription.find({});
  const payload = JSON.stringify({
    title: "New Notification",
    body: "You have a new message!",
  });

  try {
    subscriptions.forEach((subscription) => {
      webpush
        .sendNotification(subscription, payload)
        .catch((error) => console.error("Error sending notification", error));
    });
    res.status(200).json({ message: "Notification sent!" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
