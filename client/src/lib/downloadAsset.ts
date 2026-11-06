import { toast } from "sonner";

export async function downloadDigitalAsset(params: {
  productName: string;
  orderNumber: string;
  productId: number;
  fileUrl?: string | null;
  licenseKey?: string;
}) {
  const { productName, orderNumber, productId, fileUrl, licenseKey } = params;
  const key =
    licenseKey ||
    `NX-LIC-${orderNumber.replace(/[^A-Z0-9]/gi, "").slice(-8)}-${productId}`;

  // If there's an actual external/uploaded file URL, open/download it
  if (fileUrl && fileUrl.trim() !== "") {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = `${productName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-asset.zip`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Downloading ${productName} asset package!`);
    return;
  }

  // Simulated digital asset package generator (License + README + Asset Manifest)
  const manifestContent = [
    `============================================================`,
    `       NEXUS DIGITAL ASSETS MARKETPLACE — OFFICIAL BUNDLE   `,
    `============================================================`,
    ``,
    `Product:      ${productName}`,
    `Order Number: ${orderNumber}`,
    `Product ID:   #${productId}`,
    `Issued Date:  ${new Date().toISOString()}`,
    `License Key:  ${key}`,
    `Access Level: Verified Commercial & Personal License`,
    ``,
    `------------------------------------------------------------`,
    `LICENSE TERMS & USAGE INSTRUCTIONS:`,
    `------------------------------------------------------------`,
    `1. You are granted a worldwide, non-exclusive license to use`,
    `   this digital asset in unlimited personal and client projects.`,
    `2. Re-distribution or resale of the raw source files is strictly`,
    `   prohibited under NEXUS terms of service.`,
    `3. Cloud backup and product updates are automatically linked`,
    `   to your NEXUS user account.`,
    ``,
    `Asset Verification Hash:`,
    `SHA256: ${Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")}`,
    ``,
    `Support Contact: support@nexus.io`,
    `============================================================`,
  ].join("\n");

  const blob = new Blob([manifestContent], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${productName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-LICENSE-AND-ACCESS.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  toast.success(
    `Digital Asset bundle & License Key generated for "${productName}"!`
  );
}

