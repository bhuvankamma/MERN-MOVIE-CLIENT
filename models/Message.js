import mongoose from 'mongoose';

// Message Schema to handle Admin and User messages
const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: [true, 'User reference is required'], // Ensure user is associated with the message
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'], // Subject is mandatory for a message
      trim: true, // Remove extra spaces around subject
      maxlength: [200, 'Subject cannot exceed 200 characters'], // Limit subject length
    },
    message: {
      type: String,
      required: [true, 'Message content is required'], // Message content is mandatory
      trim: true, // Remove unnecessary spaces around the message
      maxlength: [5000, 'Message content cannot exceed 5000 characters'], // Limit message length
    },
    reply: {
      type: String,
      default: '', // If there's no reply, it's an empty string
      trim: true, // Ensure there are no spaces at the beginning/end of the reply
    },
    isReplied: {
      type: Boolean,
      default: false, // Default value is false, meaning no reply yet
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Export the Message model based on the schema
const Message = mongoose.model('Message', messageSchema);
export default Message;
