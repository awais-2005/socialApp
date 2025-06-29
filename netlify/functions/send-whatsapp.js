const twilio = require('twilio');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  let orderDetails, ocrText;
  try {
    ({ orderDetails, ocrText } = JSON.parse(event.body));
  } catch (parseErr) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body: ' + parseErr.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Twilio environment variables.' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  const whatsappFrom = TWILIO_WHATSAPP_FROM;
  const whatsappTo = 'whatsapp:+923475522903';

  try {
    // Send order details and OCR text as a single WhatsApp message
    const body = `Order Details:\n${orderDetails}\n\nTransaction OCR Text:\n${ocrText || 'No OCR text extracted.'}`;
    await client.messages.create({
      body,
      from: whatsappFrom,
      to: whatsappTo,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};
