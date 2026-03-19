// path: src/utils/logger.ts

/**
 * Centralizes structured console logging for test execution.
 */
export class Logger {
  /**
   * Writes an informational log message.
   */
  public static info(message: string): void {
    Logger.write('INFO', message);
  }

  /**
   * Writes a warning log message.
   */
  public static warn(message: string): void {
    Logger.write('WARN', message);
  }

  /**
   * Writes an error log message.
   */
  public static error(message: string): void {
    Logger.write('ERROR', message);
  }

  private static write(level: 'INFO' | 'WARN' | 'ERROR', message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }
}