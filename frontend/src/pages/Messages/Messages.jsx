import { useState } from "react";
import { send } from "../../assets/icons";
import styles from "./Messages.module.css";

const dummyConversations = [
  {
    id: 1,
    name: "Alice",
    username: "@alice",
    lastMessage: "Hey, are you free today?",
    avatar: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: 2,
    name: "Bob",
    username: "@bob",
    lastMessage: "Check this out!",
    avatar: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: 3,
    name: "Charlie",
    username: "@charlie",
    lastMessage: "Let's catch up soon.",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
];

const dummyMessages = {
  1: [
    { id: 1, sender: "me", text: "Hi Alice!", timestamp: "10:01 AM" },
    {
      id: 2,
      sender: "Alice",
      text: "Hey, are you free today?",
      timestamp: "10:02 AM",
    },
    { id: 3, sender: "me", text: "Yes, let's meet up.", timestamp: "10:03 AM" },
  ],
  2: [
    { id: 1, sender: "me", text: "Hey Bob, what's up?", timestamp: "11:15 AM" },
    { id: 2, sender: "Bob", text: "Check this out!", timestamp: "11:16 AM" },
  ],
  3: [
    {
      id: 1,
      sender: "Charlie",
      text: "Let's catch up soon.",
      timestamp: "9:30 AM",
    },
    { id: 2, sender: "me", text: "Sure!", timestamp: "9:32 AM" },
  ],
};

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.title}>Messages</div>
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
          />
        </div>

        {dummyConversations.map((conv) => (
          <div
            key={conv.id}
            className={`${styles.conversation} ${
              conv.id === selectedConversation ? styles.active : ""
            }`}
            onClick={() => setSelectedConversation(conv.id)}
          >
            <img src={conv.avatar} alt={conv.name} className={styles.avatar} />
            <div className={styles.info}>
              <div className={styles.name}>{conv.name}</div>
              <div className={styles.lastMessage}>{conv.lastMessage}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chatArea}>
        <div className={styles.header}>
          {dummyConversations.find((c) => c.id === selectedConversation)?.name}
        </div>

        <div className={styles.messages}>
          {dummyMessages[selectedConversation].map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${
                msg.sender === "me" ? styles.me : styles.other
              }`}
            >
              {msg.sender !== "me" && (
                <img
                  src={
                    dummyConversations.find(
                      (c) => c.id === selectedConversation
                    )?.avatar
                  }
                  alt="avatar"
                  className={styles.messageAvatar}
                />
              )}
              <div className={styles.textContainer}>
                <div className={styles.text}>{msg.text}</div>
                <div className={styles.timestamp}>{msg.timestamp}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.inputArea}>
          <input type="text" placeholder="Start a new message..." />
          <button>
            <img src={send} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
}
