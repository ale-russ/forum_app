const webpush = require("web-push");
const express = require("express");

const Subscription = require("../models/push_notification_subscription_model");
const User = require("../models/user_models");

const router = express.Router();

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails(
  "mailto:alemr905@gmail.com",
  publicVapidKey,
  privateVapidKey
);

function sendSubscriptions(subscriptions, payload, res) {
  webpush.sendNotification(subscriptions, payload).catch(async (error) => {
    if (error.statusCode === 410) {
      // console.log("Subscription is no longer valid, removing from database");

      try {
        await Subscription.findOneAndDelete({
          endpoint: subscriptions.endpoint,
        });
        // console.log("Subscription removed from database");
      } catch (err) {
        // console.error("Error removing subscription from database:", err);
        res.status(500).json({ msg: "Internal Server Error" });
      }
    }
  });
}

router.post("/subscribe", async (req, res) => {
  try {
    // console.log("body: ", req.body);
    const { subscription, userId } = req.body;
    console.log("subscription: ", subscription);

    if (!userId) {
      return res.status(400).json({ msg: "UserId is required" });
    }
    console.log("userId: ", userId);

    const { endpoint, keys } = subscription;

    if (!keys) {
      return res.status(400).json({ msg: "Subscription keys are required" });
    }

    const existingSubscription = await Subscription.findOne({ userId });
    console.log("existingSubscription: ", existingSubscription);

    if (existingSubscription) {
      existingSubscription.endpoint = endpoint;
      existingSubscription.keys = {
        p256dh: keys.p256dh,
        auth: keys.auth,
      };
      await existingSubscription.save();
      console.log("existingSubscription");
    } else {
      const newSubscription = new Subscription({
        userId,
        endpoint,
        keys: {
          p256dh: keys.p256dh,
          auth: keys.auth,
        },
      });
      await newSubscription.save();
      console.log("new subscription: ", newSubscription);
    }

    // const newSubscription = await Subscription.findOneAndUpdate(
    //   { userId },
    //   { endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } },
    //   { upsert: true }
    // );

    res.status(201).json({ message: "Subscription stored successfully" });
  } catch (err) {
    console.log("Subscription Error: ", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.post("/private-message-notification", async (req, res) => {
  const { userId, title, body } = req.body;

  const subscriptions = await Subscription.findOne({ userId });

  const payload = JSON.stringify({
    title,
    body,
  });

  if (!subscriptions) {
    return res
      .status(404)
      .json({ msg: "No subscriptions found for this user" });
  }

  try {
    if (subscriptions) {
      sendSubscriptions(subscriptions, payload, res);
    }
    res.status(200).json({ message: "Notification sent!" });
  } catch (err) {
    // console.log("Notify Error: ", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.post("/post-create-notification", async (req, res) => {
  const { userId, title, body } = req.body;

  try {
    const subscriptions = await Subscription.find({ userId });

    if (!subscriptions) {
      return res
        .status(404)
        .json({ msg: "No subscriptions found for this user" });
    }
    const payload = JSON.stringify({
      title,
      body,
    });
    if (subscriptions) {
      subscriptions.forEach(async (subscription) => {
        sendSubscriptions(subscription, payload, res);
      });
      res.status(200).json({ message: "Notification sent!" });
    }
  } catch (err) {
    console.log("Notify Error: ", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
