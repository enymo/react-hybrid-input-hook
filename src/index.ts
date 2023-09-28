import React, { useCallback } from "react";
import { RegisterOptions, useController, useFormContext } from "react-hook-form";
import { NativeSyntheticEvent, TextInputFocusEventData } from "react-native";

export default function useHybridInput<T, U extends React.FocusEvent | NativeSyntheticEvent<TextInputFocusEventData>>({name = "", externalOnChange, externalOnBlur, externalValue, defaultValue, options}: {
    name?: string,
    externalOnChange?: (value: T) => void | Promise<void>,
    externalOnBlur?: (e: U) => void,
    externalValue?: T,
    defaultValue?: T,
    options?: RegisterOptions
}) {
    const form = useFormContext();
    const {field: {onChange: internalOnChange, onBlur: internalOnBlur, value: internalValue}, fieldState: {error}} = useController({name, control: form?.control, rules: options, defaultValue})
    const value: T = (form && name) ? internalValue : externalValue;

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