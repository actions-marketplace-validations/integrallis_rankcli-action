/**
 * GitHub Action logic: inputs, the summary, the PR comment. Pure functions - run.ts does the
 * I/O, and the gate itself is the engine's (`evaluateGate`), the same one `rankcli audit`
 * applies.
 */
import type { AuditIssue, GateResult, HealthScore, SiteAuditResult } from '@rankcli/agent-runtime';
/**
 * Alert triggers the action implements:
 * - error: the audit found at least one error-severity issue
 * - failure: the action failed (gate tripped, or the site couldn't be audited)
 */
export type AlertTrigger = 'error' | 'failure';
export type CommentMode = 'regressions' | 'always' | 'never';
/**
 * Inputs the action used to declare but never implemented. Still declared
 * in action.yml (with a deprecationMessage) so an existing workflow gets a
 * warning instead of an "Unexpected input" error.
 */
export declare const REMOVED_INPUTS: readonly ["create-pr", "pr-threshold-errors", "pr-threshold-score", "pr-base-branch", "checks"];
/** The marker that identifies the action's PR comment, so a later run updates it instead of adding another. */
export declare const COMMENT_MARKER = "<!-- rankcli-audit -->";
export interface ActionInputs {
    url?: string;
    dir?: string;
    /** Gate rules in the `--fail-on` syntax; the legacy inputs are folded in. */
    failOn: string[];
    baseline?: string;
    config?: string;
    maxPages?: string;
    /** "Name: value" lines. */
    headers: string[];
    reportFile?: string;
    apiKey?: string;
    githubToken?: string;
    commentOnPr: CommentMode;
    annotations: boolean;
    slackWebhook?: string;
    discordWebhook?: string;
    alertOn: AlertTrigger[];
    /** Human-readable warnings about inputs (removed, unsupported values). */
    warnings: string[];
}
export interface CategorySummary {
    score: number;
    issues: number;
}
export interface AuditSummary {
    url: string;
    score: number;
    issuesCount: number;
    errorsCount: number;
    warningsCount: number;
    noticesCount: number;
    pagesAudited: number;
    categories: Record<string, CategorySummary>;
    healthScores?: Partial<HealthScore>;
    /** Set when the page itself couldn't be audited (unreachable / 4xx / 5xx). */
    pageFailure?: string;
    /** Set when a baseline was applied. */
    baseline?: {
        file: string;
        added: AuditIssue[];
        fixed: AuditIssue[];
        unchanged: number;
        scoreBefore?: number;
    };
    ignoredCount: number;
    /** The build directory, when one was audited. */
    dir?: string;
}
type GetInputFn = (name: string) => string;
/**
 * Parses action inputs from the GitHub Actions environment
 */
export declare function parseInputs(getInput: GetInputFn): ActionInputs;
/** The audit, as the summary, the comment and the outputs see it. */
export declare function summarize(url: string, result: SiteAuditResult, issues: AuditIssue[], extras: Pick<AuditSummary, 'baseline' | 'ignoredCount' | 'dir'>): AuditSummary;
/** Whether this run posts (or updates) the PR comment. */
export declare function shouldComment(mode: CommentMode, summary: AuditSummary, gate: GateResult): boolean;
/** A finding as one Markdown list line: the code, the title, the pages. */
export declare function issueLine(issue: AuditIssue): string;
/**
 * Formats the audit summary as a PR comment. Starts with COMMENT_MARKER so the next run finds
 * and updates it.
 */
export declare function formatPRComment(summary: AuditSummary, gate?: GateResult): string;
export {};
