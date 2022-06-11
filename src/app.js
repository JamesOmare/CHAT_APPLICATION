//dom queries
const chatList = document.querySelector('.chat-list')

//class instance
const chatUI = new ChatUI(chatlist)
const chatroom = new Chatroom('general', 'michael')

//get chats and render
chatroom.getChats((data) => {
    chatUI.render(data)
}) 