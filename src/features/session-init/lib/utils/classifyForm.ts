export async function classifyForm(file: File) {
    const pyform = new FormData()
    pyform.append("file", file)

    try {
    const res = await fetch("https://formhelper-backend.onrender.com/classify", {
        method: "POST",
        body: pyform
    })

    return await res.json()
    }catch(error) {
        throw new Error(`Error classifying form: ${error}`)
    }
}