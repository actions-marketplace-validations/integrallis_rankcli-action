/**
 * The action's run order, with every side effect injected so it can be
 * tested. index.ts wires in @actions/core, @actions/github and the runtime.
 *
 * Order matters: the gate is decided right after the audit, and nothing
 * after that (job summary, PR comment, alerts) can change it. The PR
 * comment used to run first and throw on a read-only token (every fork
 * PR), so the action failed with "Resource not accessible by integration"
 * instead of reporting - or passing - the actual audit.
 */
import type { AuditReport } from '@rankcli/agent-runtime';
import { type AuditSummary, type GateResult } from './action.js';
export interface ApiValidationResult {
    valid: boolean;
    error?: string;
    errorCode?: 'rate_limited' | 'schedule_exceeded' | 'invalid_key' | 'no_access' | 'unavailable';
    tier?: string;
    nextAllowedAt?: string;
    upgradeUrl?: string;
    rateLimit?: {
        limit: number;
        remaining: number;
        resetsAt: string;
    };
}
export interface AlertPayload {
    url: string;
    score: number;
    issuesFound: number;
    errorCount: number;
    failed: boolean;
    failures: string[];
}
export interface ActionDeps {
    getInput(name: string): string;
    info(message: string): void;
    warning(message: string): void;
    setOutput(name: string, value: string | number | boolean): void;
    setFailed(message: string): void;
    validateApiKey(apiKey: string): Promise<ApiValidationResult>;
    runAudit(url: string): Promise<AuditReport>;
    writeJobSummary(summary: AuditSummary, gate: GateResult): Promise<void>;
    /** Undefined when the run isn't for a pull request. */
    postPRComment?: (body: string, token: string) => Promise<void>;
    sendAlert(channel: 'slack' | 'discord', webhookUrl: string, payload: AlertPayload): Promise<void>;
}
export declare function summarize(url: string, report: AuditReport): AuditSummary;
export declare function runAction(deps: ActionDeps): Promise<void>;
