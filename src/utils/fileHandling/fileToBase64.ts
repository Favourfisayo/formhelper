// Helper function to convert File to base64 string
export async function fileToBase64(file: File): Promise<string> {
 const arrayBuffer = await file.arrayBuffer();
  // Convert ArrayBuffer to Node.js Buffer, then to Base64 string
  return Buffer.from(arrayBuffer).toString("base64");
}