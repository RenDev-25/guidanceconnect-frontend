
import { useState } from "react";

const validateField = (value, rules = []) => {
  const validators = Array.isArray(rules) ? rules : [rules];

  for (const validator of validators) {
    if (typeof validator !== "function") continue;

    const error = validator(value);

    if (error) return error;
  }

  return "";
};

export default function useForm(initialValues = {}, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const validateAll = (currentValues = values) => {
    const nextErrors = {};

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(
        currentValues[field],
        validationRules[field]
      );

      if (error) nextErrors[field] = error;
    });

    setErrors(nextErrors);
    return nextErrors;
  };

  const handleChange = (eventOrName, suppliedValue) => {
    const field =
      typeof eventOrName === "string"
        ? eventOrName
        : eventOrName.target.name;

    const value =
      typeof eventOrName === "string"
        ? suppliedValue
        : eventOrName.target.type === "checkbox"
          ? eventOrName.target.checked
          : eventOrName.target.type === "file"
            ? eventOrName.target.files?.[0] ?? null
            : eventOrName.target.value;

    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSubmitError("");
    setSubmitSuccess("");

    // Validate while typing if the user has already touched the field.
    if (touched[field]) {
      const error = validateField(value, validationRules[field]);

      setErrors((previous) => ({
        ...previous,
        [field]: error,
      }));
    }
  };

  const handleBlur = (eventOrName) => {
    const field =
      typeof eventOrName === "string"
        ? eventOrName
        : eventOrName.target.name;

    setTouched((previous) => ({
      ...previous,
      [field]: true,
    }));

    const error = validateField(values[field], validationRules[field]);

    setErrors((previous) => ({
      ...previous,
      [field]: error,
    }));
  };

  const handleSubmit = (onSubmit) => async (event) => {
    event?.preventDefault();

    setSubmitError("");
    setSubmitSuccess("");

    // Mark all fields as touched so their errors become visible.
    setTouched(
      Object.keys(validationRules).reduce((result, field) => {
        result[field] = true;
        return result;
      }, {})
    );

    const validationErrors = validateAll();

    if (Object.keys(validationErrors).length > 0) {
      setSubmitError(
        "Please correct the highlighted fields before submitting."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values);
      setSubmitSuccess("Your form was submitted successfully.");
    } catch (error) {
      setSubmitError(
        error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitError("");
    setSubmitSuccess("");
  };

  return {
    values,
    setValues,
    errors,
    touched,
    isSubmitting,
    submitError,
    submitSuccess,
    handleChange,
    handleBlur,
    handleSubmit,
    validateAll,
    resetForm,
    setSubmitError,
    setSubmitSuccess,
  };
}
