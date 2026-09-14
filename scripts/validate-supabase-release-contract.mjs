import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const RENAMES = [
  ['20260830084000_canonicalize_self_development_sphere.sql', '20260830094110_canonicalize_self_development_sphere.sql'],
  ['20260830095500_community_artifact_qa_hardening.sql', '20260830135150_community_artifact_qa_hardening.sql'],
  ['20260906163500_guest_board_read_v1.sql', '20260906143710_guest_board_read_v1.sql'],
  ['20260906183000_guest_board_interest_v1.sql', '20260906173725_guest_board_interest_v1.sql'],
  ['20260912131000_board_information_architecture_batch_a.sql', '20260912121109_board_information_architecture_batch_a.sql'],
  ['20260912141500_board_information_architecture_batch_a_security_hardening.sql', '20260912121255_board_information_architecture_batch_a_security_hardening.sql'],
  ['20260912143000_board_information_architecture_batch_b_subtypes.sql', '20260912123011_board_information_architecture_batch_b_subtypes.sql'],
  ['20260912144500_board_information_architecture_batch_b_default_hardening.sql', '20260912135107_board_information_architecture_batch_b_default_hardening.sql'],
  ['20260912153000_board_telegram_promotion_v1.sql', '20260912144034_board_telegram_promotion_v1.sql'],
  ['20260912153500_board_telegram_promotion_v1_worker_hardening.sql', '20260912144055_board_telegram_promotion_v1_worker_hardening.sql'],
  ['20260912170000_board_telegram_worker_scheduler_v1.sql', '20260912173340_board_telegram_worker_scheduler_v1.sql'],
  ['20260913154500_board_club_publisher_v1.sql', '20260913171431_board_club_publisher_v1.sql'],
  ['20260913155000_board_club_publisher_worker_grant_v1.sql', '20260913171437_board_club_publisher_worker_grant_v1.sql'],
];

function fail(message) {
  console.error(`[supabase-release-contract] FAIL: ${message}`);
  process.exit(1);
}

function migrationVersion(value) {
  const match = String(value || '').match(/\b(\d{14})\b/);
  return match ? match[1] : '';
}

export function parseMigrationStatus(text) {
  const rows = [];
  for (const rawLine of String(text).split(/\r?\n/)) {
    if (!rawLine.includes('│') && !rawLine.includes('|')) continue;
    const cells = rawLine.split(/[│|]/).map((cell) => cell.trim());
    if (cells.length < 2) continue;
    const local = migrationVersion(cells[0]);
    const remote = migrationVersion(cells[1]);
    if (!local && !remote) continue;
    rows.push({ local, remote, raw: rawLine });
  }

  if (!rows.length) throw new Error('No migration rows parsed from `supabase migration list` output.');

  const aligned = [];
  const pending = [];
  const remoteOnly = [];
  const mismatched = [];

  for (const row of rows) {
    if (row.local && row.remote) {
      if (row.local === row.remote) aligned.push(row.local);
      else mismatched.push(row);
    } else if (row.local) {
      pending.push(row.local);
    } else if (row.remote) {
      remoteOnly.push(row.remote);
    }
  }

  if (mismatched.length) {
    throw new Error(`Local/remote migration versions differ on the same row: ${mismatched.map((row) => `${row.local}/${row.remote}`).join(', ')}`);
  }
  if (remoteOnly.length) {
    throw new Error(`Remote-only migration history detected: ${remoteOnly.join(', ')}. Refusing automatic repair.`);
  }

  const remoteVersions = rows.map((row) => row.remote).filter(Boolean).sort();
  const maxRemote = remoteVersions.at(-1) || '';
  const outOfOrder = pending.filter((version) => maxRemote && version <= maxRemote);
  if (outOfOrder.length) {
    throw new Error(`Out-of-order pending migration(s): ${outOfOrder.join(', ')}; remote max is ${maxRemote}. Refusing --include-all/history repair.`);
  }

  return {
    aligned: [...new Set(aligned)].sort(),
    pending: [...new Set(pending)].sort(),
    maxRemote,
  };
}

function writeGitHubOutput(result) {
  if (!process.env.GITHUB_OUTPUT) return;
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `pending_count=${result.pending.length}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `pending_versions=${result.pending.join(',')}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `remote_max_version=${result.maxRemote}\n`);
}

function validateLiveStatus(file, requireClean) {
  const result = parseMigrationStatus(fs.readFileSync(file, 'utf8'));
  console.log(`[supabase-release-contract] aligned=${result.aligned.length}`);
  console.log(`[supabase-release-contract] remote_max=${result.maxRemote || 'none'}`);
  console.log(`[supabase-release-contract] pending=${result.pending.length ? result.pending.join(', ') : 'none'}`);
  if (requireClean && result.pending.length) {
    fail(`Post-apply ledger is not clean; pending: ${result.pending.join(', ')}`);
  }
  writeGitHubOutput(result);
}

function selfTestParser() {
  const aligned = parseMigrationStatus(`LOCAL │ REMOTE │ TIME (UTC)\n20260913171431 │ 20260913171431 │ x\n20260913171437 │ 20260913171437 │ x`);
  if (aligned.pending.length !== 0 || aligned.maxRemote !== '20260913171437') fail('parser aligned fixture failed');

  const pending = parseMigrationStatus(`LOCAL │ REMOTE │ TIME (UTC)\n20260913171437 │ 20260913171437 │ x\n20260914090000 │                │ x`);
  if (pending.pending.join(',') !== '20260914090000') fail('parser pending fixture failed');

  let outOfOrderFailed = false;
  try {
    parseMigrationStatus(`LOCAL │ REMOTE │ TIME (UTC)\n20260913171437 │ 20260913171437 │ x\n20260913162500 │                │ x`);
  } catch {
    outOfOrderFailed = true;
  }
  if (!outOfOrderFailed) fail('parser must reject out-of-order pending migration');

  let remoteOnlyFailed = false;
  try {
    parseMigrationStatus(`LOCAL │ REMOTE │ TIME (UTC)\n               │ 20260913171437 │ x`);
  } catch {
    remoteOnlyFailed = true;
  }
  if (!remoteOnlyFailed) fail('parser must reject remote-only history');
}

function validateRepositoryContract() {
  selfTestParser();

  const migrationsDir = path.join(ROOT, 'supabase', 'migrations');
  for (const [oldName, newName] of RENAMES) {
    if (fs.existsSync(path.join(migrationsDir, oldName))) fail(`stale migration filename remains: ${oldName}`);
    if (!fs.existsSync(path.join(migrationsDir, newName))) fail(`reconciled migration missing: ${newName}`);
  }

  const workflowPath = path.join(ROOT, '.github', 'workflows', 'deploy-supabase-production.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const requiredWorkflowTokens = [
    'name: Deploy Dementor Supabase Production',
    'workflow_dispatch:',
    'release_confirmation:',
    'ref: dementor-club-production',
    'CANONICAL_SUPABASE_PROJECT_REF: mmekfydwbvptbdatwitj',
    'version: 2.117.0',
    'Configured project ref is not the canonical Dementor production project',
    'supabase migration list --linked',
    'supabase db push --linked --dry-run',
    'supabase db push --linked',
    'telegram-outbox-worker',
    '--no-verify-jwt',
  ];
  for (const token of requiredWorkflowTokens) {
    if (!workflow.includes(token)) fail(`backend workflow missing required token: ${token}`);
  }

  const forbiddenWorkflowTokens = [
    'version: latest',
    'supabase db reset',
    'supabase migration repair',
    '--include-all',
    '--prune',
  ];
  for (const token of forbiddenWorkflowTokens) {
    if (workflow.includes(token)) fail(`backend workflow contains forbidden operation/config: ${token}`);
  }

  if (/\bon\s*:\s*\n(?:.|\n)*?\bpush\s*:/m.test(workflow)) fail('backend workflow must not deploy on push');

  const config = fs.readFileSync(path.join(ROOT, 'supabase', 'config.toml'), 'utf8');
  if (!config.includes('[functions.telegram-outbox-worker]')) fail('telegram worker config section missing');
  if (!/verify_jwt\s*=\s*false/.test(config)) fail('telegram worker verify_jwt=false is not pinned');

  console.log('[supabase-release-contract] PASS');
}

const args = process.argv.slice(2);
const statusIndex = args.indexOf('--migration-status');
if (statusIndex >= 0) {
  const file = args[statusIndex + 1];
  if (!file) fail('--migration-status requires a file path');
  validateLiveStatus(file, args.includes('--require-clean'));
} else {
  validateRepositoryContract();
}
