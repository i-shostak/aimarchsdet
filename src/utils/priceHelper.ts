/**
 * Centralizes parsing of price strings rendered in the UI.
 */
export class PriceHelper {
  /**
   * Parses a currency string such as "$29.99" into a number.
   */
  public static parseCurrency(value: string): number {
    const normalizedValue = value.trim().replace('$', '');
    const parsedValue = Number.parseFloat(normalizedValue);

    if (Number.isNaN(parsedValue)) {
      throw new Error(`Unable to parse currency value: "${value}"`);
    }

    return parsedValue;
  }
}