export async function fileToBase64(file: File): Promise<string> {
 const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
}