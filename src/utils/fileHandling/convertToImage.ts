import { base64ToUint8Array } from "./base64ToUint8";

export async function convertToImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch("http://localhost:8000/convert-pdf", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        if (!data.success) return null;

        // Convert base64 to File
         const bytesArray = base64ToUint8Array(data.image);
         const arrayBuffer = bytesArray.buffer.slice(0);
        return new File([arrayBuffer], "form.png", { type: "image/png" });

    } catch (error) {
        console.error("Failed to convert PDF to images", error);
        return null;
    }
}