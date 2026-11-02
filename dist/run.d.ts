import { type AuditSettings, type GateResult, type SiteAuditResult } from '@rankcli/agent-runtime';
import { type AuditSummary } from './action.js';
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
export type AnnotationLevel = 'error' | 'warning' | 'notice';
export interface ActionDeps {
    getInput(name: string): string;
    info(message: string): void;
    warning(message: string): void;
    setOutput(name: string, value: string | number | boolean): void;
    setFailed(message: string): void;
    validateApiKey(apiKey: string): Promise<ApiValidationResult>;
    /** The engine's site audit with these settings (`dir` already absolute). */
    runAudit(settings: AuditSettings & {
        url: string;
    }): Promise<SiteAuditResult | null>;
    writeJobSummary(summary: AuditSummary, gate: GateResult): Promise<void>;
    /** One annotation on the run; `file` when the finding maps to a file in the checkout. */
    annotate?: (level: AnnotationLevel, message: string, properties: {
        title: string;
        file?: string;
    }) => void;
    /** Create the PR comment, or update the one that carries COMMENT_MARKER. Undefined outside pull requests. */
    upsertPRComment?: (body: string, token: string) => Promise<'created' | 'updated'>;
    /** Write the JSON report where `report-file` says. */
    writeFile?: (path: string, content: string) => void;
    sendAlert(channel: 'slack' | 'discord', webhookUrl: string, payload: AlertPayload): Promise<void>;
    /** The workspace (default: process.cwd()). */
    cwd?: string;
}
export declare function runAction(deps: ActionDeps): Promise<void>;
