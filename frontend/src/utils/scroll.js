export const scrollToBottom = () => {
  const container = document.querySelector("[data-messages-container]");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};
