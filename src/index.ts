import React from "react";
import { RegisterOptions, useController, useForm, useFormContext } from "react-hook-form";

export default function useHybridInput<T>({name, externalOnChange, externalOnBlur, externalValue, defaultValue, options}: {
    name?: string,
    externalOnChange?: (value: T) => void,
    externalOnBlur?: (e: React.FocusEvent) => void,
    externalValue?: T,
    defaultValue?: T,
    options?: RegisterOptions
}) {
    const {control: fallbackControl} = useForm();
    const form = useFormContext();
    const {field: {onChange: internalOnChange, onBlur: internalOnBlur, value: internalValue}, fieldState: {error}} = useController({name, control: form?.control ?? fallbackControl, rules: options, defaultValue})
    const value: T = form ? internalValue : externalValue;

    function onChange(value: T) {
        externalOnChange?.(value);
        internalOnChange?.(value);
    }

    function onBlur(e?: React.FocusEvent) {
        externalOnBlur?.(e);
        internalOnBlur?.();
    }

    return {value, onChange, onBlur, error};
}