import { addLayout, configure, getLogger } from 'log4js';
import moment from 'moment';

export default class Logger {
    constructor(traceId) {
        this.traceId = traceId;

        addLayout('logback', () => this.formatLog());
        const loggerLayout = (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'test') ? 'coloured' : 'logback';
        this.configuration = {
            appenders: {
                default: {
                    type: 'console'
                },
                gql: {
                    type: 'console',
                    layout: {
                        type: loggerLayout
                    }
                }
            },
            categories: {
                default: {
                    appenders: ['default'],
                    level: process.env.LOG_LEVEL || 'info'
                }
            }
        };
        if (traceId) {
            // Note: new instances are generated on a per-request basis, using the zipkin trace id as the category name
            this.configuration.categories[traceId] = {
                appenders: ['gql'],
                level: process.env.LOG_LEVEL || 'info'
            };
        }
        configure(this.configuration);
        this.logger = getLogger(traceId || 'gql-express-server');
    }

    formatLog = () => (logEvent) => {
        const logbackFormattedLog = {
            message: logEvent.data,
            severity: logEvent.level.levelStr,
            timestamp: moment.utc().format(),
            trace: this.traceId,
            ...logEvent
        };
        delete logbackFormattedLog.data;
        delete logbackFormattedLog.level;
        return JSON.stringify(logbackFormattedLog, null, null);
    }

    trace = (...args) => {
        if (this.logger.isTraceEnabled()) {
            this.logger.trace(...args);
        }
    }

    debug = (...args) => {
        if (this.logger.isDebugEnabled()) {
            this.logger.debug(...args);
        }
    }

    info = (...args) => {
        if (this.logger.isInfoEnabled()) {
            this.logger.info(...args);
        }
    }

    warn = (...args) => {
        if (this.logger.isWarnEnabled()) {
            this.logger.warn(...args);
        }
    }

    error = (...args) => {
        if (this.logger.isErrorEnabled()) {
            this.logger.error(...args);
        }
    }

    fatal = (...args) => {
        if (this.logger.isFatalEnabled()) {
            this.logger.fatal(...args);
        }
    }

    getLogger = () => this;
}
