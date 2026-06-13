// ─────────────────────────────────────────────────────
// @termuijs/core — Benchmark runner
// ─────────────────────────────────────────────────────
//
// Runs all benchmarks and aggregates results into a single JSON output.
// Each benchmark outputs a line prefixed with `BENCH_RESULT_JSON:` which
// this script collects and combines.
//
// Output:
//   - human-readable summary on stdout
//   - one JSON line prefixed with `BENCH_RESULT_JSON:` for CI parsing

import { spawn } from 'node:child_process';

interface BenchmarkResult {
    benchmark: string;
    version: number;
    runMs: number;
    node: string;
    bun: string | null;
    results: any[];
}

interface AggregatedResults {
    version: 1;
    benchmarks: BenchmarkResult[];
    node: string;
    bun: string | null;
}

const BENCHMARKS = [
    'render-loop.ts',
    'layout-computation.ts',
    'style-merge.ts',
    'input-parsing.ts',
    'border-merge.ts',
];

async function runBenchmark(benchmarkFile: string): Promise<BenchmarkResult> {
    return new Promise((resolve, reject) => {
        const proc = spawn('bun', [benchmarkFile], {
            cwd: new URL('.', import.meta.url),
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';

        proc.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        proc.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        proc.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Benchmark ${benchmarkFile} failed with code ${code}: ${stderr}`));
                return;
            }

            // Extract the JSON line
            const lines = stdout.split('\n');
            for (const line of lines) {
                if (line.startsWith('BENCH_RESULT_JSON:')) {
                    try {
                        const jsonStr = line.replace('BENCH_RESULT_JSON: ', '');
                        const result = JSON.parse(jsonStr);
                        resolve(result);
                        return;
                    } catch (e) {
                        reject(new Error(`Failed to parse benchmark result from ${benchmarkFile}: ${e}`));
                        return;
                    }
                }
            }
            reject(new Error(`No BENCH_RESULT_JSON line found in output from ${benchmarkFile}`));
        });
    });
}

async function main(): Promise<void> {
    console.log('Running all benchmarks...\n');

    const results: BenchmarkResult[] = [];
    const benchmarkDir = new URL('.', import.meta.url);

    for (const benchmarkFile of BENCHMARKS) {
        const fullPath = new URL(benchmarkFile, benchmarkDir);
        console.log(`Running ${benchmarkFile}...`);
        try {
            const result = await runBenchmark(fullPath.pathname);
            results.push(result);
            console.log(`  ✓ ${result.benchmark} completed\n`);
        } catch (error) {
            console.error(`  ✗ ${benchmarkFile} failed:`, error);
            process.exit(1);
        }
    }

    console.log('\n=== Benchmark Summary ===\n');
    for (const result of results) {
        console.log(`${result.benchmark}:`);
        console.log(`  Node: ${result.node}`);
        console.log(`  Bun: ${result.bun ?? 'n/a'}`);
        console.log(`  Run time: ${result.runMs}ms per iteration`);
        console.log(`  Results: ${result.results.length} data points`);
        console.log('');
    }

    const payload: AggregatedResults = {
        version: 1,
        benchmarks: results,
        node: process.versions.node,
        bun: process.versions.bun ?? null,
    };

    console.log(`BENCH_RESULT_JSON: ${JSON.stringify(payload)}`);
}

main().catch((error) => {
    console.error('Benchmark runner failed:', error);
    process.exit(1);
});
