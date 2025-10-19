import { ref, computed, type Ref } from 'vue';
import { formValidators } from '@shared/lib/utils';

export interface UseFieldReturn<T> {
  value: Ref<T>;
  error: Ref<string | null>;
  touched: Ref<boolean>;
  validate: () => Promise<boolean>;
  reset: () => void;
  onBlur: () => void;
  onFocus: () => void;
}

export type FormFields<T extends Record<string, unknown>> = {
  [K in keyof T]: UseFieldReturn<T[K]>;
};

export const useForm = <T extends Record<keyof T, T[keyof T]>>(fields: FormFields<T>) => {
  const isSubmitting = ref(false);

  const values = computed<T>(() => {
    const result = {} as T;

    for (const key in fields) {
      result[key] = fields[key].value.value;
    }

    return result;
  });

  const isValid = computed(() =>
    (Object.values(fields) as UseFieldReturn<T[keyof T]>[]).every((f) => f.error.value === null)
  );

  const validate = async (): Promise<boolean> => {
    const results = await Promise.all(
      (Object.values(fields) as UseFieldReturn<T[keyof T]>[]).map((f) => {
        return f.validate();
      })
    );

    return results.every(Boolean);
  };

  const reset = (): void => {
    (Object.values(fields) as UseFieldReturn<T[keyof T]>[]).forEach((f) => f.reset());
  };

  const handleSubmit = async (submit: (data: typeof values.value) => Promise<void>): Promise<void> => {
    if (!(await validate())) return;

    await submit(values.value);

    reset();
  };

  return {
    fields,
    values,
    isValid,
    isSubmitting,
    validate,
    reset,
    handleSubmit,
  };
};

export const defineField = <T>(options: {
  initialValue: T;
  validators?: ((v: T) => string | null)[] | ((validFn: typeof formValidators) => ((v: T) => string | null)[]);
}): UseFieldReturn<T> => {
  const value = ref(options.initialValue) as unknown as Ref<T>;
  const error = ref<string | null>(null);
  const touched = ref(false);

  const setTouched = (value: boolean): void => {
    touched.value = value;
  };

  const validate = async (): Promise<boolean> => {
    setTouched(true);
    const validators =
      typeof options.validators === 'function' ? options.validators(formValidators) : (options.validators ?? []);

    for (const validator of validators) {
      const err = validator(value.value);
      if (err) {
        error.value = err;
        return false;
      }
    }
    error.value = null;
    return true;
  };

  const reset = (): void => {
    value.value = options.initialValue;
    error.value = null;
    setTouched(false);
  };

  const onBlur = async () => {
    await validate();
  };

  const onFocus = (): void => {
    setTouched(false);
  };

  return {
    value,
    error,
    touched,
    validate,
    reset,
    onBlur,
    onFocus,
  };
};
