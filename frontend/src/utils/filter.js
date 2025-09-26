export function filterConversations(conversations, searchTerm) {
  if (!searchTerm) return conversations;

  const term = searchTerm.toLowerCase();

  return conversations.filter((conv) => {
    const name = conv.partner.name.toLowerCase();
    const username = conv.partner.username.toLowerCase();
    return name.includes(term) || username.includes(term);
  });
}
