import Message from '../models/Message.js';

// 🟢 USER sends a message (via Contact Us)
export const sendMessage = async (req, res) => {
  try {
    const { subject, message, senderId } = req.body;
    const userId = req.user?._id || senderId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User not identified' });
    }

    if (!subject?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    const newMessage = await Message.create({
      user: userId,
      subject: subject.trim(),
      message: message.trim(),
    });

    console.log("✅ Message successfully saved:", newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Error in sendMessage:", error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// 🟢 ADMIN gets all messages from all users
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('user', 'name email');
    res.json(messages);
  } catch (error) {
    console.error("❌ Error in getAllMessages:", error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// 🟢 ADMIN replies to a user message
export const replyMessage = async (req, res) => {
  try {
    const { reply } = req.body;
    const messageRecord = await Message.findById(req.params.id);

    if (!messageRecord) {
      return res.status(404).json({ error: 'Message not found' });
    }

    messageRecord.reply = reply;
    messageRecord.isReplied = true;
    await messageRecord.save();

    console.log("✅ Reply sent successfully:", messageRecord);
    res.json({ message: 'Reply sent successfully', updated: messageRecord });
  } catch (error) {
    console.error("❌ Error in replyMessage:", error);
    res.status(500).json({ error: 'Failed to reply to message' });
  }
};

// 🆕 USER views their own messages + admin replies
export const getUserMessages = async (req, res) => {
  try {
    const userId = req.user?._id;
    const messages = await Message.find({ user: userId }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error("❌ Error in getUserMessages:", error);
    res.status(500).json({ error: 'Failed to fetch your messages' });
  }
};

// 🧨 ADMIN deletes all user messages
export const deleteAllMessages = async (req, res) => {
  try {
    await Message.deleteMany({});
    console.log("🗑️ All messages deleted by admin.");
    res.status(200).json({ message: 'All messages have been deleted successfully.' });
  } catch (error) {
    console.error("❌ Error in deleteAllMessages:", error);
    res.status(500).json({ error: 'Failed to delete all messages' });
  }
};
