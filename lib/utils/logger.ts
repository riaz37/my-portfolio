type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logBuffer: LogEntry[] = [];
  private readonly maxBufferSize = 1000;
  private readonly environment = process.env.NODE_ENV || 'development';

  private constructor() {
    // Initialize logger
    if (typeof window === 'undefined') {
      // Server-side logging setup
      this.setupServerLogging();
    } else {
      // Client-side logging setup
      this.setupClientLogging();
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private setupServerLogging(): void {
    // Add server-specific logging setup
    // Could integrate with external logging services
  }

  private setupClientLogging(): void {
    // Add client-specific logging setup
    window.addEventListener('error', (event) => {
      this.error('Uncaught error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled promise rejection:', {
        reason: event.reason,
      });
    });
  }

  private formatLogEntry(level: LogLevel, message: string, data?: any, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(data && { data }),
      ...(error && { error }),
    };
  }

  private addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.environment === 'production') {
      return level !== 'debug';
    }
    return true;
  }

  public debug(message: string, data?: any): void {
    if (!this.shouldLog('debug')) return;
    const entry = this.formatLogEntry('debug', message, data);
    this.addToBuffer(entry);
    console.debug(`[DEBUG] ${message}`, data);
  }

  public info(message: string, data?: any): void {
    if (!this.shouldLog('info')) return;
    const entry = this.formatLogEntry('info', message, data);
    this.addToBuffer(entry);
    console.info(`[INFO] ${message}`, data);
  }

  public warn(message: string, data?: any): void {
    if (!this.shouldLog('warn')) return;
    const entry = this.formatLogEntry('warn', message, data);
    this.addToBuffer(entry);
    console.warn(`[WARN] ${message}`, data);
  }

  public error(message: string, error?: Error | any): void {
    if (!this.shouldLog('error')) return;
    const entry = this.formatLogEntry('error', message, undefined, error);
    this.addToBuffer(entry);
    console.error(`[ERROR] ${message}`, error);
  }

  public getRecentLogs(count = 100): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  public clearLogs(): void {
    this.logBuffer = [];
  }
}

export const logger = Logger.getInstance();
