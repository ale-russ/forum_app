export const estimatedMessageHeight = (message) => {
  const baseHeight = 60;
  const lineHeight = 30;
  const contentHeight = Math.ceil(message.content.length / 30);
  return baseHeight + lineHeight * contentHeight;
};
