const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const config = require('./config'); // Import your Twilio configuration
// config.js (or use environment variables)
module.exports = {
    twilioAccountSid: 'AC940909084e8473a35968252cd3266c27',
    twilioAuthToken: 'b0c975b3a80c1fffa75e09c17c24393c',
    twilioPhoneNumber: '+16264157845',
  };
  

// Initialize Twilio client
const twilioClient = new twilio(config.twilioAccountSid, config.twilioAuthToken);

// Route for sending SMS reminders
router.post('/send-sms-reminder', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    // Use Twilio to send the SMS
    await twilioClient.messages.create({
      to: phoneNumber,
      from: config.twilioPhoneNumber,
      body: message,
    });

    res.status(200).json({ success: true, message: 'SMS reminder sent successfully.' });
  } catch (error) {
    console.error(`Error sending SMS: ${error.message}`);
    res.status(500).json({ success: false, error: 'Failed to send SMS reminder.' });
  }
});

module.exports = router;

