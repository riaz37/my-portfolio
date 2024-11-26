export function html({ url, host }: { url: string; host: string }) {
  const backgroundColor = '#f9f9f9';
  const textColor = '#444444';
  const mainBackgroundColor = '#ffffff';
  const buttonBackgroundColor = '#346df1';
  const buttonBorderColor = '#346df1';
  const buttonTextColor = '#ffffff';

  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${host}</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="font-family: Helvetica, Arial, sans-serif;">
              <h1 style="margin: 0 0 15px 0; font-size: 24px; line-height: 48px; font-weight: bold;">
                Verify your email address
              </h1>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px;">
                Click the button below to verify your email address.
              </p>
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 5px;">
                    <a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold; background-color: ${buttonBackgroundColor};">
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 24px;">
                If you did not request this email, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
`
}

export function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n\n${url}\n\nIf you did not request this email, you can safely ignore it.`
}
