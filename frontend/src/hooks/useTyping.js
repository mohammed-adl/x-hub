import { useState, useEffect, useRef, useCallback } from "react";

export const useTyping = (setIsTyping, delay = 1500) => {
  const [value, setValue] = useState("");
  const typingTimeoutRef = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleChange = useCallback(
    (newValue) => {
      setValue(newValue);
      setIsTyping(true);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        if (mounted.current) setIsTyping(false);
      }, delay);
    },
    [setIsTyping, delay]
  );

  return { value, handleChange, setValue };
};
