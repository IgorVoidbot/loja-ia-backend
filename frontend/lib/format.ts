export const formatBRL = (value: number | null): string => {
  if (value === null) {
    return "";
  }
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const parsePrice = (
  value: string | number | null | undefined,
): number | null => {
  if (value === null || value === undefined) {
    return null;
  }
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
