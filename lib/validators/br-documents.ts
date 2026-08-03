export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digits = cpf.split("").map(Number);

  const calcCheckDigit = (length: number): number => {
    const sum = digits
      .slice(0, length)
      .reduce((acc, digit, index) => acc + digit * (length + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return calcCheckDigit(9) === digits[9] && calcCheckDigit(10) === digits[10];
}

export function isValidCnpj(value: string): boolean {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  const digits = cnpj.split("").map(Number);
  const weightsFirst = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weightsSecond = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const calcCheckDigit = (base: number[], weights: number[]): number => {
    const sum = base.reduce((acc, digit, index) => acc + digit * weights[index], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calcCheckDigit(digits.slice(0, 12), weightsFirst);
  const secondDigit = calcCheckDigit(digits.slice(0, 13), weightsSecond);

  return firstDigit === digits[12] && secondDigit === digits[13];
}

export function formatCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  let result = d.slice(0, 3);
  if (d.length > 3) result += "." + d.slice(3, 6);
  if (d.length > 6) result += "." + d.slice(6, 9);
  if (d.length > 9) result += "-" + d.slice(9, 11);
  return result;
}

export function formatCnpj(value: string): string {
  const d = onlyDigits(value).slice(0, 14);
  let result = d.slice(0, 2);
  if (d.length > 2) result += "." + d.slice(2, 5);
  if (d.length > 5) result += "." + d.slice(5, 8);
  if (d.length > 8) result += "/" + d.slice(8, 12);
  if (d.length > 12) result += "-" + d.slice(12, 14);
  return result;
}

export function formatDocument(value: string, type: "cpf" | "cnpj"): string {
  return type === "cpf" ? formatCpf(value) : formatCnpj(value);
}
