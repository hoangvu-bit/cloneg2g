import React from 'react';

export default function ChatDrawer({
  showChatDrawer,
  setShowChatDrawer,
  chats,
  activeChatId,
  setActiveChatId,
  chatInputText,
  setChatInputText,
  handleSendChatMessage,
}) {
  if (!showChatDrawer) return null;

  const currentChat = chats.find((c) => c.id === activeChatId);

  return (
    <div className="chat-widget" onClick={(e) => e.stopPropagation()}>
      <div className="chat-widget-header">
        <div className="chat-partner-profile">
          <div className="avatar-fallback-mini">
            {currentChat ? currentChat.avatarText : 'G2'}
          </div>
          <div>
            <span className="chat-partner-name">
              {currentChat ? currentChat.partnerName : 'Chăm Sóc Khách Hàng'}
            </span>
            <div className="chat-partner-sub">
              Hỗ trợ: {currentChat ? currentChat.game : 'Chợ G2G'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="chat-minimize-btn" onClick={() => setShowChatDrawer(false)}>
            _
          </span>
        </div>
      </div>

      <div className="chat-widget-body">
        {/* Sidebar list of conversations */}
        <div className="chat-sidebar-threads">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-thread-item ${activeChatId === chat.id ? 'active' : ''}`}
              onClick={() => setActiveChatId(chat.id)}
            >
              <span className="thread-avatar">{chat.avatarText}</span>
              <div className="thread-meta">
                <div className="thread-name">{chat.partnerName}</div>
                <div className="thread-last-msg">{chat.game}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Conversation Messages logs */}
        <div className="chat-active-conversation">
          {activeChatId ? (
            <>
              <div className="chat-message-list">
                {currentChat?.messages.map((msg, index) => (
                  <div key={index} className={`chat-message-bubble ${msg.sender}`}>
                    <div className="message-text">{msg.text}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChatMessage} className="chat-input-bar">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn chat tại đây..."
                  className="chat-input-field"
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                />
                <button type="submit" className="chat-send-btn">
                  Gửi
                </button>
              </form>
            </>
          ) : (
            <div className="chat-no-active">
              Chọn một cuộc trò chuyện để bắt đầu trao đổi chi tiết sản phẩm.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
