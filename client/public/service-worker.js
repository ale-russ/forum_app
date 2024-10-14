self.addEventListener("push", function (event) {
  const data = event.data.json();
  const title = data.title;
  const options = {
    body: body.data,
    icon: "./assets/Logo.svg",
  };

  event.waitUntil(
    self.ServiceWorkerRegistration.showNotification(title, options)
  );
});
