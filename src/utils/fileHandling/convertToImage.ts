import { base64ToUint8Array } from "./base64ToUint8";

export async function convertToImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch("https://formhelper-backend.onrender.com/convert-pdf", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        if (!data.success) return null;

        // Convert base64 to File
        const bytesArray = base64ToUint8Array(data.image);
        return new File([bytesArray], "form.png", { type: "image/png" });
    } catch (error) {
        throw new Error(`Error making conversion: ${error}`)
    }
}