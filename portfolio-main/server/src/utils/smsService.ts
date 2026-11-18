/**
 * High-reliability SMS dispatch service for Yusuf CMS Security.
 * Supports Twilio REST API natively via standard HTTPS fetch (zero external dependencies).
 * Features automatic fallback for development and environments without configured Twilio credentials.
 */

interface SendSmsParams {
  to: string;
  message: string;
}

interface SendSmsResult {
  success: boolean;
  provider: 'twilio' | 'dev-fallback';
  messageId?: string;
  error?: string;
}

export const sendSms = async ({ to, message }: SendSmsParams): Promise<SendSmsResult> => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const fromPhone = process.env.TWILIO_PHONE_NUMBER?.trim();

  // Normalize phone number (strip spaces, hyphens, parentheses)
  let cleanTo = to.replace(/[\s\-\(\)]/g, '');
  if (!cleanTo.startsWith('+')) {
    cleanTo = `+${cleanTo}`;
  }

  // If Twilio credentials are configured in environment (Production mode)
  if (accountSid && authToken && fromPhone) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

      const params = new URLSearchParams();
      params.append('To', cleanTo);
      params.append('From', fromPhone);
      params.append('Body', message);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await response.json() as any;

      if (!response.ok) {
        console.error('❌ Twilio API Error Response:', data);
        return {
          success: false,
          provider: 'twilio',
          error: data?.message || `Twilio HTTP ${response.status}`,
        };
      }

      console.log(`✅ [SMS Gateway] Successfully sent security SMS to ${cleanTo}. SID: ${data.sid}`);
      return {
        success: true,
        provider: 'twilio',
        messageId: data.sid,
      };
    } catch (err: any) {
      console.error('❌ Network error during Twilio dispatch:', err);
      return {
        success: false,
        provider: 'twilio',
        error: err.message || 'Network error connecting to Twilio API',
      };
    }
  }

  // Developer / Local Preview Fallback
  console.log('\n======================================================');
  console.log(`📱 [SMS DISPATCH PREVIEW - NO TWILIO CREDENTIALS CONFIGURED]`);
  console.log(`➡️  To: ${cleanTo}`);
  console.log(`💬  Message:\n${message}`);
  console.log('======================================================\n');

  return {
    success: true,
    provider: 'dev-fallback',
    messageId: `dev-${Date.now()}`,
  };
};

export const hasTwilioConfigured = (): boolean => {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID?.trim() &&
    process.env.TWILIO_AUTH_TOKEN?.trim() &&
    process.env.TWILIO_PHONE_NUMBER?.trim()
  );
};
