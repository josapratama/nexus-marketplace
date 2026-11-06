export interface InvoiceOrder {
  id: number;
  orderNumber: string;
  status: string;
  createdAt: string | Date;
  subtotal: string;
  tax: string | null;
  total: string;
  discountAmount?: string | null;
  couponCode?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  shippingAddress?: string | null;
  paymentMethod?: string | null;
  items: string | null;
}

export function printOrderInvoice(order: InvoiceOrder) {
  let items: Array<{
    productName: string;
    quantity: number;
    price: string;
    slug?: string;
  }> = [];

  try {
    items = JSON.parse(order.items ?? "[]");
  } catch {
    items = [];
  }

  const dateFormatted = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subtotalNum = parseFloat(order.subtotal || "0");
  const discountNum = parseFloat(order.discountAmount || "0");
  const taxNum = parseFloat(order.tax || "0");
  const totalNum = parseFloat(order.total || "0");

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Pop-up blocked! Please allow pop-ups for this site to view the invoice.");
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${order.orderNumber} | NEXUS Marketplace</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      line-height: 1.5;
      padding: 32px;
    }
    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 24px;
      margin-bottom: 24px;
    }
    .logo-badge {
      display: inline-block;
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #0f172a;
      text-transform: uppercase;
    }
    .logo-badge span {
      color: #ff006e;
    }
    .tagline {
      font-size: 12px;
      color: #64748b;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-meta h2 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
    }
    .invoice-meta p {
      font-size: 13px;
      color: #64748b;
      margin-top: 2px;
    }
    .status-badge {
      display: inline-block;
      margin-top: 8px;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-radius: 9999px;
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #86efac;
    }
    .billing-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
      padding: 16px;
      background: #f1f5f9;
      border-radius: 8px;
    }
    .billing-col h4 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-bottom: 6px;
    }
    .billing-col p {
      font-size: 14px;
      font-weight: 500;
      color: #1e293b;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }
    th {
      text-align: left;
      padding: 12px 16px;
      background: #0f172a;
      color: #ffffff;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    th:last-child {
      text-align: right;
    }
    td {
      padding: 14px 16px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
      color: #334155;
    }
    td:last-child {
      text-align: right;
      font-weight: 600;
    }
    .summary-box {
      margin-left: auto;
      max-width: 320px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 14px;
      color: #475569;
    }
    .summary-row.discount {
      color: #16a34a;
      font-weight: 600;
    }
    .summary-row.total {
      border-top: 2px solid #0f172a;
      margin-top: 8px;
      padding-top: 12px;
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
    }
    .footer-note {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px dashed #cbd5e1;
      font-size: 12px;
      color: #64748b;
      text-align: center;
    }
    .print-bar {
      position: sticky;
      top: 0;
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    .btn {
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .btn-primary {
      background: #0f172a;
      color: #ffffff;
    }
    .btn-primary:hover {
      background: #ff006e;
    }
    .btn-secondary {
      background: #e2e8f0;
      color: #334155;
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .invoice-card { border: none; box-shadow: none; padding: 0; max-width: 100%; }
      .print-bar { display: none; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <button class="btn btn-primary" onclick="window.print()">🖨️ Print / Save as PDF</button>
    <button class="btn btn-secondary" onclick="window.close()">Close</button>
  </div>

  <div class="invoice-card">
    <div class="header-bar">
      <div>
        <div class="logo-badge">NEXUS<span>.IO</span></div>
        <div class="tagline">Digital Assets & Creator Marketplace</div>
      </div>
      <div class="invoice-meta">
        <h2>INVOICE</h2>
        <p><strong>#${order.orderNumber}</strong></p>
        <p>Date: ${dateFormatted}</p>
        <span class="status-badge">${order.status === "confirmed" ? "PAID & CONFIRMED" : order.status.toUpperCase()}</span>
      </div>
    </div>

    <div class="billing-grid">
      <div class="billing-col">
        <h4>Customer Details</h4>
        <p><strong>${order.customerName || "Customer"}</strong></p>
        <p>${order.customerEmail || "Registered NEXUS Account"}</p>
        <p style="margin-top: 4px; font-size: 12px; color: #64748b;">${order.shippingAddress || "Digital Delivery (Instant Cloud Access)"}</p>
      </div>
      <div class="billing-col" style="text-align: right;">
        <h4>Payment Method</h4>
        <p>${order.paymentMethod || "Instant Credit Card (Verified)"}</p>
        <p style="margin-top: 4px; font-size: 12px; color: #64748b;">Transaction: Instant Clearance</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Asset / Product Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            it => `
          <tr>
            <td>
              <strong>${it.productName}</strong>
              <div style="font-size: 11px; color: #64748b;">Digital License: Personal & Commercial Use</div>
            </td>
            <td style="text-align: center;">${it.quantity}</td>
            <td style="text-align: right;">$${parseFloat(it.price).toFixed(2)}</td>
            <td>$${(parseFloat(it.price) * it.quantity).toFixed(2)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <div class="summary-box">
      <div class="summary-row">
        <span>Subtotal</span>
        <span>$${subtotalNum.toFixed(2)}</span>
      </div>
      ${
        discountNum > 0
          ? `
      <div class="summary-row discount">
        <span>Discount (${order.couponCode || "VOUCHER"})</span>
        <span>-$${discountNum.toFixed(2)}</span>
      </div>
      `
          : ""
      }
      <div class="summary-row">
        <span>Platform & Tax (10%)</span>
        <span>$${taxNum.toFixed(2)}</span>
      </div>
      <div class="summary-row total">
        <span>Total Paid</span>
        <span>$${totalNum.toFixed(2)}</span>
      </div>
    </div>

    <div class="footer-note">
      <p>Thank you for purchasing on <strong>NEXUS Digital Marketplace</strong>.</p>
      <p style="margin-top: 4px;">You can download your asset packages anytime from your Purchase History.</p>
      <p style="margin-top: 4px;">Need assistance? Contact us at <strong>support@nexus.io</strong></p>
    </div>
  </div>

  <script>
    // Automatically trigger print dialog on desktop
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

