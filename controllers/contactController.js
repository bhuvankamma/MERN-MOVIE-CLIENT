export const submitContactForm = async (req, res) => {
    try {
      const { name, email, message } = req.body;
  
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // You can later add logic here to:
      // - Save to MongoDB
      // - Send email notification to admin
      // - Store in a "ContactMessages" model
  
      console.log(`Contact Form Submission:
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `);
  
      return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      res.status(500).json({ error: 'Server error while submitting contact form' });
    }
  };
  