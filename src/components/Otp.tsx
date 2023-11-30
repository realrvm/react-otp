import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  FC,
  useCallback,
  useMemo,
} from "react";

import styles from "./styles.module.scss";
import { DIGIT_REG } from "../const";

type OtpProps = {
  value: string;
  onChange: (value: string) => void;
  valueLength?: number;
};

export const Otp: FC<OtpProps> = ({ value, valueLength = 4, onChange }) => {
  const items = useMemo(() => {
    const valueArray = [...value];
    const itemsArray: string[] = [];

    Array.from({ length: valueLength }, (_, i) => {
      const char = valueArray[i];

      DIGIT_REG.test(char) ? itemsArray.push(char) : itemsArray.push("");
    });

    return itemsArray;
  }, [value, valueLength]);

  const focusToNextInput = useCallback((target: HTMLElement) => {
    const nextElementSibling =
      target.nextElementSibling as HTMLInputElement | null;

    if (nextElementSibling) {
      nextElementSibling.focus();
    }
  }, []);

  const focusToPrevInput = useCallback((target: HTMLElement) => {
    const prevElementSibling =
      target.previousElementSibling as HTMLInputElement | null;

    if (prevElementSibling) {
      prevElementSibling.focus();
    }
  }, []);

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, index: number) => {
      const target = e.target;
      let targetValue = target.value.trim();
      const isTargetValueDigit = DIGIT_REG.test(targetValue);

      if (!isTargetValueDigit && targetValue !== "") return;

      const nextInput = target.nextElementSibling as HTMLInputElement | null;

      if (!isTargetValueDigit && nextInput && nextInput.value !== "") {
        return;
      }

      targetValue = isTargetValueDigit ? targetValue : " ";

      const targetValueLen = targetValue.length;

      if (targetValueLen === 1) {
        const newValue =
          value.substring(0, index) + targetValue + value.substring(index + 1);

        onChange(newValue);

        if (!isTargetValueDigit) {
          return;
        }

        focusToNextInput(target);
      } else if (targetValueLen === valueLength) {
        onChange(targetValue);

        target.blur();
      }
    },
    [DIGIT_REG, onChange, focusToNextInput, value],
  );

  const handleOnFocus = useCallback((e: FocusEvent<HTMLInputElement>) => {
    const { target } = e;

    const prevInput = target.previousElementSibling as HTMLInputElement | null;

    if (prevInput && prevInput.value === "") {
      return prevInput.focus();
    }

    target.setSelectionRange(0, target.value.length);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;
      const target = e.target as HTMLInputElement;

      if (key === "ArrowRight" || key === "ArrowDown") {
        e.preventDefault();
        return focusToNextInput(target);
      }

      if (key === "ArrowLeft" || key === "ArrowUp") {
        e.preventDefault();
        return focusToPrevInput(target);
      }

      const targetValue = target.value;

      target.setSelectionRange(0, targetValue.length);

      if (e.key !== "Backspace" || targetValue !== "") {
        return;
      }

      focusToPrevInput(target);
    },
    [focusToNextInput, focusToPrevInput],
  );

  return (
    <div className={styles.otp_container}>
      {items.map((digit, index: number) => (
        <input
          key={index}
          type="text"
          value={digit}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{1}"
          maxLength={valueLength}
          className={styles.otp_input}
          onChange={(e) => handleOnChange(e, index)}
          onFocus={handleOnFocus}
          onKeyDown={handleKeyDown}
        />
      ))}
    </div>
  );
};
