type OtpEmailType = "EMAIL_VERIFY" | "PASSWORD_RESET";

const titles: Record<OtpEmailType, string> = {
  EMAIL_VERIFY: "Verify your email",
  PASSWORD_RESET: "Reset your password",
};

const expiryNotes: Record<OtpEmailType, string> = {
  EMAIL_VERIFY: "This code expires in 15 minutes.",
  PASSWORD_RESET: "This code expires in 10 minutes.",
};

export function otpEmailHtml(code: string, type: OtpEmailType): string {
  const title = titles[type];
  const expiry = expiryNotes[type];

  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f1f3f6;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:24px auto;background:#ffffff;border:1px solid #e0e0e0;">
      <tr>
        <td style="background:#2874f0;color:#ffffff;padding:20px 24px;font-size:20px;font-weight:bold;">
          Flipkart Clone
        </td>
      </tr>
      <tr>
        <td style="padding:24px;color:#212121;">
          <h1 style="margin:0 0 12px;font-size:18px;">${title}</h1>
          <p style="margin:0 0 16px;color:#878787;">Use the verification code below to continue.</p>
          <div style="background:#f1f3f6;border:1px dashed #2874f0;padding:16px;text-align:center;font-size:28px;letter-spacing:8px;font-weight:bold;color:#2874f0;">
            ${code}
          </div>
          <p style="margin:16px 0 0;color:#878787;font-size:13px;">${expiry}</p>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();
}

export function otpEmailText(code: string, type: OtpEmailType): string {
  return `${titles[type]}\n\nYour verification code is: ${code}\n\n${expiryNotes[type]}`;
}

type OrderEmailAddress = {
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
};

type OrderEmailItem = {
  title: string;
  quantity: number;
  pricePaise: number;
};

function formatInr(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export function orderConfirmationEmailHtml(params: {
  displayId: string;
  items: OrderEmailItem[];
  totalAmountPaise: number;
  estimatedDelivery: string;
  address: OrderEmailAddress;
}): string {
  const itemRows = params.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#212121;">
            ${item.title} × ${item.quantity}
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;color:#212121;">
            ${formatInr(item.pricePaise * item.quantity)}
          </td>
        </tr>
      `,
    )
    .join("");

  const addressLine = [
    params.address.line1,
    params.address.line2,
    params.address.city,
    params.address.state,
    params.address.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f1f3f6;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:24px auto;background:#ffffff;border:1px solid #e0e0e0;">
      <tr>
        <td style="background:#2874f0;color:#ffffff;padding:20px 24px;font-size:20px;font-weight:bold;">
          Flipkart Clone
        </td>
      </tr>
      <tr>
        <td style="padding:24px;color:#212121;">
          <h1 style="margin:0 0 8px;font-size:18px;">Order Confirmed — Order #${params.displayId}</h1>
          <p style="margin:0 0 16px;color:#878787;">Thank you for your order. Estimated delivery by ${params.estimatedDelivery}.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
            ${itemRows}
            <tr>
              <td style="padding:12px 0;font-weight:bold;">Total</td>
              <td style="padding:12px 0;text-align:right;font-weight:bold;">${formatInr(params.totalAmountPaise)}</td>
            </tr>
          </table>
          <div style="background:#f1f3f6;padding:12px;border-radius:4px;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:bold;">Deliver to</p>
            <p style="margin:0;color:#878787;font-size:13px;">
              ${params.address.name} · ${params.address.phone}<br />
              ${addressLine}
            </p>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();
}

export function orderConfirmationEmailText(params: {
  displayId: string;
  items: OrderEmailItem[];
  totalAmountPaise: number;
  estimatedDelivery: string;
  address: OrderEmailAddress;
}): string {
  const itemsText = params.items
    .map(
      (item) =>
        `- ${item.title} × ${item.quantity}: ${formatInr(item.pricePaise * item.quantity)}`,
    )
    .join("\n");

  const addressLine = [
    params.address.line1,
    params.address.line2,
    params.address.city,
    params.address.state,
    params.address.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return `Order Confirmed — Order #${params.displayId}

Estimated delivery by ${params.estimatedDelivery}

Items:
${itemsText}

Total: ${formatInr(params.totalAmountPaise)}

Deliver to:
${params.address.name} · ${params.address.phone}
${addressLine}`;
}
