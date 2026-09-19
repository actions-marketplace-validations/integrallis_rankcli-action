/**
 * GitHub Action logic: inputs, the pass/fail gate, and the PR comment.
 * Pure functions - run.ts does the I/O.
 */
/**
 * Alert triggers the action implements:
 * - error: the audit found at least one error-severity issue
 * - failure: the action failed (gate tripped, or the site couldn't be audited)
 */
export type AlertTrigger = 'error' | 'failure';
/**
 * Inputs the action used to declare but never implemented. Still declared
 * in action.yml (with a deprecationMessage) so an existing workflow gets a
 * warning instead of an "Unexpected input" error.
 */
export declare const REMOVED_INPUTS: readonly ["create-pr", "pr-threshold-errors", "pr-threshold-score", "pr-base-branch", "checks"];
export interface ActionInputs {
    url: string;
    apiKey?: string;
    githubToken?: string;
    commentOnPr: boolean;
    failOnError: boolean;
    scoreThreshold: number;
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
    categories: Record<string, CategorySummary>;
    /** Set when the page itself couldn't be audited (unreachable / 4xx / 5xx). */
    pageFailure?: string;
}
export interface GateResult {
    passed: boolean;
    failures: string[];
}
type GetInputFn = (name: string) => string;
/**
 * Parses action inputs from the GitHub Actions environment
 */
export declare function parseInputs(getInput: GetInputFn): ActionInputs;
/**
 * The action's pass/fail decision. A page that couldn't be audited always
 * fails - it scores 0 and a green check would say the site is fine - the
 * other two conditions are the opt-in fail-on-error / score-threshold.
 */
export declare function evaluateGate(inputs: Pick<ActionInputs, 'failOnError' | 'scoreThreshold'>, summary: AuditSummary): GateResult;
/**
 * Determines if the action should fail based on inputs and results
 */
export declare function shouldFail(inputs: Pick<ActionInputs, 'failOnError' | 'scoreThreshold'>, summary: AuditSummary): boolean;
/**
 * Formats the audit summary as a PR comment
 */
export declare function formatPRComment(summary: AuditSummary, gate?: GateResult): string;
export {};
