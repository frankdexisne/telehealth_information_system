import { ChangeEvent } from "react";
import { useState, useCallback } from "react";
import { useDebouncedValue } from "@mantine/hooks";

const useFilter = <T extends Record<string, string>>() => {
  const [parameters, setParameters] = useState<T>({} as T);

  const inputChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setParameters((prevParameters) => ({
        ...prevParameters,
        [name]: value,
      }));

      if (value === "") {
        const { [name as keyof T]: _, ...rest } = parameters;
        setParameters(rest as T);
      } else {
        setParameters((prevParameters) => ({
          ...prevParameters,
          [name]: value,
        }));
      }
    },
    [parameters]
  );

  const selectChangeHandler = useCallback(
    (name: string, value: string | null) => {
      if (!value) {
        const { [name as keyof T]: _, ...rest } = parameters;
        setParameters(rest as T);
      } else {
        setParameters((prevParameters) => ({
          ...prevParameters,
          [name]: value,
        }));
      }
    },
    [parameters]
  );

  const [debouncedParameters] = useDebouncedValue(parameters, 500);

  return {
    setParameters,
    parameters,
    inputChangeHandler,
    selectChangeHandler,
    debouncedParameters,
  };
};

export default useFilter;
