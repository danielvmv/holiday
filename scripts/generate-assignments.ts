import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { participants, type Participant } from '../lib/participants.js';

// Assignment type
interface Assignment {
  giver: Participant;
  receiver: Participant;
  slug: string;
}

// Define constraints: bidirectional pairs that cannot be matched
const constraints: [string, string][] = [
  // Couples
  ['victor', 'lizzeta'],
  ['marcela', 'daniel'],
  ['ulani', 'ricardo'],
  // Parents-children (Victor & Lizzeta with their sons)
  ['victor', 'jose'],
  ['victor', 'juan'],
  ['lizzeta', 'jose'],
  ['lizzeta', 'juan'],
  // Parents-children (Marcela & Daniel with Ulani)
  ['marcela', 'ulani'],
  ['daniel', 'ulani'],
];

/**
 * Check if assignment is valid (doesn't violate any constraint)
 */
function isValidAssignment(giverId: string, receiverId: string): boolean {
  // Can't give to yourself
  if (giverId === receiverId) return false;

  // Check all constraints
  for (const [id1, id2] of constraints) {
    if ((giverId === id1 && receiverId === id2) || (giverId === id2 && receiverId === id1)) {
      return false;
    }
  }

  return true;
}

/**
 * Generate a random derangement that satisfies all constraints
 * Uses backtracking algorithm
 */
function generateValidDerangement(participants: Participant[]): Map<string, string> | null {
  const n = participants.length;
  const assignment = new Map<string, string>();
  const used = new Set<string>();

  function backtrack(index: number): boolean {
    if (index === n) {
      return true; // All assignments made successfully
    }

    const giver = participants[index];
    // Create randomized list of potential receivers
    const receivers = [...participants].sort(() => Math.random() - 0.5);

    for (const receiver of receivers) {
      if (!used.has(receiver.id) && isValidAssignment(giver.id, receiver.id)) {
        assignment.set(giver.id, receiver.id);
        used.add(receiver.id);

        if (backtrack(index + 1)) {
          return true;
        }

        // Backtrack
        assignment.delete(giver.id);
        used.delete(receiver.id);
      }
    }

    return false; // No valid assignment found
  }

  if (backtrack(0)) {
    return assignment;
  }

  return null; // Failed to find valid derangement
}

/**
 * Validate that an assignment satisfies all constraints
 */
function validateAssignment(assignment: Map<string, string>): boolean {
  // Check that everyone gives to exactly one person
  if (assignment.size !== participants.length) {
    console.error('Not everyone has an assignment');
    return false;
  }

  // Check that everyone receives from exactly one person
  const receivers = new Set(assignment.values());
  if (receivers.size !== participants.length) {
    console.error('Not everyone receives a gift');
    return false;
  }

  // Check all constraints
  for (const [giverId, receiverId] of assignment.entries()) {
    if (!isValidAssignment(giverId, receiverId)) {
      console.error(`Invalid assignment: ${giverId} -> ${receiverId}`);
      return false;
    }
  }

  console.log('✓ Assignment is valid!');
  return true;
}

/**
 * Generate a cryptographically secure random slug
 */
function generateSlug(): string {
  return crypto.randomBytes(6).toString('base64url');
}

/**
 * Main function to generate and save assignments
 */
function main() {
  console.log('Generating Secret Santa assignments for Jolidays...\n');

  const dataDir = path.join(process.cwd(), 'data');
  const assignmentsPath = path.join(dataDir, 'assignments.json');

  // Check if assignments already exist (unless --force flag is used)
  const forceRegenerate = process.argv.includes('--force');
  if (fs.existsSync(assignmentsPath) && !forceRegenerate) {
    console.log('✓ Assignments already exist. Skipping generation.');
    console.log('  (Use --force to regenerate)\n');
    process.exit(0);
  }

  if (forceRegenerate) {
    console.log('⚠️  Force regeneration enabled. Creating new assignments...\n');
  }

  let assignment: Map<string, string> | null = null;
  let attempts = 0;
  const maxAttempts = 1000;

  // Try to generate a valid assignment
  while (!assignment && attempts < maxAttempts) {
    attempts++;
    assignment = generateValidDerangement(participants);
  }

  if (!assignment) {
    console.error(`Failed to generate valid assignment after ${maxAttempts} attempts`);
    process.exit(1);
  }

  console.log(`Generated valid assignment in ${attempts} attempt(s)\n`);

  // Validate the assignment
  if (!validateAssignment(assignment)) {
    console.error('Generated assignment is invalid!');
    process.exit(1);
  }

  // Create assignments with slugs
  const assignments: Assignment[] = [];
  const participantMap = new Map(participants.map(p => [p.id, p]));

  for (const [giverId, receiverId] of assignment.entries()) {
    const giver = participantMap.get(giverId)!;
    const receiver = participantMap.get(receiverId)!;
    const slug = generateSlug();

    assignments.push({
      giver,
      receiver,
      slug,
    });

    console.log(`${giver.name} → ${receiver.name} (${slug})`);
  }

  // Save assignments to data file
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(assignmentsPath, JSON.stringify(assignments, null, 2));
  console.log(`\n✓ Assignments saved to ${assignmentsPath}`);

  // Generate links document
  const linksPath = path.join(dataDir, 'PRIVATE_LINKS.md');
  let linksContent = '# 🎁 Jolidays - Enlaces Privados del Sorteo\n\n';
  linksContent += '**IMPORTANTE:** Estos enlaces son privados. Distribuye cada uno individualmente por WhatsApp.\n\n';
  linksContent += 'Cada persona solo podrá ver su propia asignación en su enlace único.\n\n';
  linksContent += '---\n\n';

  for (const { giver, slug } of assignments.sort((a, b) => a.giver.name.localeCompare(b.giver.name))) {
    linksContent += `**${giver.name}:**\n`;
    linksContent += `https://jolidays.vercel.app/r/${slug}\n\n`;
  }

  fs.writeFileSync(linksPath, linksContent);
  console.log(`✓ Private links saved to ${linksPath}\n`);

  console.log('Done! 🎄');
}

main();
