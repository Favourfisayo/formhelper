"use client"

export default function FormElement({
    fieldType,
    id,
    options,
    value
}: {
    fieldType: "text" | "textarea" | "radio" | "checkbox" | "select" | "date" | "number" | "email" | "phone",
    id: string
    options?: string[]
    value: string
}) {
    switch (fieldType) {
        case "text":
            return <input type="text" name={id} defaultValue={value} />;
        case "textarea":
            return <textarea name={id} defaultValue={value} />;
        case "radio":
            return (
                <>
                    {options?.map((option, idx) => (
                        <label key={idx}>
                            <input
                                type="radio"
                                name={id}
                                value={option}
                                defaultChecked={value === option}
                            />
                            {option}
                        </label>
                    ))}
                </>
            );
        case "checkbox":
            return (
                <>
                    {options?.map((option, idx) => (
                        <label key={idx}>
                            <input
                                type="checkbox"
                                name={id}
                                value={option}
                                defaultChecked={value.split(",").includes(option)}
                            />
                            {option}
                        </label>
                    ))}
                </>
            );
        case "select":
            return (
                <select name={id} defaultValue={value}>
                    {options?.map((option, idx) => (
                        <option key={idx} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            );
        case "date":
            return <input type="date" name={id} defaultValue={value} />;
        case "number":
            return <input type="number" name={id} defaultValue={value} />;
        case "email":
            return <input type="email" name={id} defaultValue={value} />;
        case "phone":
            return <input type="tel" name={id} defaultValue={value} />;
        default:
            return null;
    }
}