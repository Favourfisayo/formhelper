export async function convertToImage(file: File) {
    if(!file) return 

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch("http://localhost:8000/convert-pdf", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        if (!data.success) return null;

        // Convert base64 to File
        const byteString = atob(data.image);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new File([ab], "form.png", { type: "image/png" });

    } catch (error) {
        console.error("Failed to convert PDF to images", error);
        return null;
    }
}