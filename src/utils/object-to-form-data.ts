export function objectToFormData<
  T extends Record<
    string,
    string | number | boolean | File | object | null | undefined
  >,
>(obj: T): FormData {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value instanceof FileList) {
        Array.from(value).forEach((file) => formData.append(key, file));
      } else if (
        Array.isArray(value) &&
        value.every((v) => v instanceof File)
      ) {
        (value as File[]).forEach((file) => formData.append(key, file));
      } else if (Array.isArray(value)) {
        // Handle arrays - can be simple arrays or arrays of objects
        value.forEach((item, index) => {
          if (typeof item === "object" && item !== null && !(item instanceof File)) {
            // Nested object in array: documents[0].id, documents[0].file, etc.
            Object.entries(item).forEach(([nestedKey, nestedValue]) => {
              if (nestedValue !== null && nestedValue !== undefined) {
                if (nestedValue instanceof File) {
                  formData.append(`${key}[${index}].${nestedKey}`, nestedValue);
                } else {
                  formData.append(`${key}[${index}].${nestedKey}`, String(nestedValue));
                }
              }
            });
          } else {
            // Simple array values
            formData.append(`${key}[${index}]`, String(item));
          }
        });
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        if (String(value) !== "") {
          formData.append(key, String(value));
        }
      }
    }
  });

  return formData;
}
