"use client"

interface FormElementProps {
    fieldType: "text" | "textarea" | "radio" | "checkbox" | "select" | "date" | "number" | "email" | "phone"
    id: string
    options?: string[]
    value: string
}

export default function FormElement({ fieldType, id, options, value }: FormElementProps) {
    const commonInputProps = {
        name: id,
        id: id,
        className: "form-input-base",
        "aria-required": true,
    };

    switch (fieldType) {
        case "text":
        case "email":
        case "phone":
        case "number":
        case "date":
            return (
                <div className="form-group">
                    <input
                        {...commonInputProps}
                        type={fieldType === "phone" ? "tel" : fieldType}
                        defaultValue={value}
                    />
                </div>
            );

        case "textarea":
            return (
                <div className="form-group">
                    <textarea
                        {...commonInputProps}
                        defaultValue={value}
                        rows={4}
                    />
                </div>
            );

        case "radio":
        case "checkbox":
            return (
                <div className="form-group">
                    <div className="input-group" role={fieldType === "radio" ? "radiogroup" : "group"}>
                        {options?.map((option, idx) => (
                            <label key={idx} className="option-wrapper">
                                <input
                                    type={fieldType}
                                    name={id}
                                    value={option}
                                    defaultChecked={
                                        fieldType === "checkbox"
                                            ? value.split(",").includes(option)
                                            : value === option
                                    }
                                    className="input-control"
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                </div>
            );

        case "select":
            return (
                <div className="form-group">
                    <select
                        {...commonInputProps}
                        defaultValue={value}
                    >
                        <option value="" disabled>Select an option</option>
                        {options?.map((option, idx) => (
                            <option key={idx} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            );

        default:
            return null;
    }
}