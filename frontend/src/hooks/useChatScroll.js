import { useEffect, useCallback, useRef } from "react";

export function useChatScroll({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  messages,
  chatId,
}) {
  const containerRef = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight } = container;
    const isNearTop = scrollTop < 100;

    if (isNearTop) {
      const oldScrollHeight = scrollHeight;
      fetchNextPage().then(() => {
        if (mounted.current && container) {
          requestAnimationFrame(() => {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop = newScrollHeight - oldScrollHeight;
          });
        }
      });
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  const scrollToBottom = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 0);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container && messages.length > 0 && messages.length === 1) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, chatId]);

  return { containerRef, scrollToBottom };
}
