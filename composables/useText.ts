export function useText() {
  const truncateMiddleText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }

    const start = text.substring(0, maxLength / 2 - 2);
    const end = text.substring(text.length - maxLength / 2 + 2);
    return `${start}...${end}`;
  };

  return {
    truncateMiddleText,
  };
}
