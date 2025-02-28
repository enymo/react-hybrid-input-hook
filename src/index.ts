import React, { useCallback } from "react";
import { RegisterOptions, useController, useForm, useFormContext } from "react-hook-form";
import { NativeSyntheticEvent, TextInputFocusEventData } from "react-native";

export default function useHybridInput<T, U extends React.FocusEvent | NativeSyntheticEvent<TextInputFocusEventData>>({
    name = "",
    externalOnChange,
    externalOnBlur,
    externalValue,
    externalError,
    defaultValue,
    options
}: {
    name?: string,
    externalOnChange?: (value: T) => void | Promise<void>,
    externalOnBlur?: (e: U) => void,
    externalValue?: T,
    externalError?: string,
    defaultValue?: T,
    options?: RegisterOptions
}) {
    const form = useFormContext();
    const { control: fallbackControl } = useForm();
    const {field: {onChange: internalOnChange, onBlur: internalOnBlur, value: internalValue}, fieldState: {error: internalError}} = useController({name, control: form?.control ?? fallbackControl, rules: options, defaultValue})
    const value: T = (form && name) ? internalValue : externalValue;
    const error = (form && name) ? internalError?.message : externalError

    const onChange = useCallback((value: T) => {
        internalOnChange?.(value);
        return externalOnChange?.(value);
    }, [externalOnChange, internalOnChange]);

    const onBlur = useCallback((e: U) => {
        externalOnBlur?.(e);
        internalOnBlur?.();
    }, [externalOnBlur, internalOnBlur]);

    return {value, onChange, onBlur, error};
}