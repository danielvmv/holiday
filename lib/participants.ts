// Shared source of truth for participant names
// Used by both assignment generation and check-in system
// NO constraints or assignments here - just the participant list

export interface Participant {
  id: string;
  name: string;
}

export const participants: Participant[] = [
  { id: 'victor', name: 'Victor Bujanda' },
  { id: 'lizzeta', name: 'Lizzeta Madrigal' },
  { id: 'jose', name: 'Jose Andrés Bujanda Madrigal' },
  { id: 'juan', name: 'Juan Pablo Bujanda Madrigal' },
  { id: 'marcela', name: 'Marcela Madrigal Montalvo' },
  { id: 'daniel', name: 'Daniel Villanueva' },
  { id: 'ulani', name: 'Ulani Masso Madrigal' },
  { id: 'ricardo', name: 'Ricardo Villarreal' },
  { id: 'thelma', name: 'Thelma Montalvo Garcia' },
];

// Helper to validate participant IDs
export function isValidParticipantId(id: string): boolean {
  return participants.some(p => p.id === id);
}
