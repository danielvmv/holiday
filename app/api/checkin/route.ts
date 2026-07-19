import { NextRequest, NextResponse } from 'next/server';
import { participants, isValidParticipantId } from '@/lib/participants';

// Use mock KV for local development, real KV for production
const useRealKV = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

let kvClient: any;

if (useRealKV) {
  // Production: use real Vercel KV
  const { kv } = await import('@vercel/kv');
  kvClient = kv;
  console.log('[KV] Using real Vercel KV');
} else {
  // Development: use in-memory mock
  const { kvMock } = await import('@/lib/kv-mock');
  kvClient = kvMock;
  console.log('[KV] Using in-memory mock for local development');
}

// NOTE: This file has ZERO dependency on data/assignments.json
// It only tracks which participants have checked in, not gift assignments

interface CheckinData {
  timestamp: number;
}

interface CheckinStatus {
  participantId: string;
  name: string;
  checkedIn: boolean;
  timestamp?: number;
}

// POST /api/checkin - Mark a participant as checked in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { participantId } = body;

    // Validate participant ID against whitelist
    if (!participantId || !isValidParticipantId(participantId)) {
      return NextResponse.json(
        { error: 'Invalid participant ID' },
        { status: 400 }
      );
    }

    // Check if already checked in
    const existing = await kvClient.get(`checkin:${participantId}`) as CheckinData | null;
    if (existing) {
      return NextResponse.json(
        {
          error: 'Ya te registraste anteriormente',
          timestamp: existing.timestamp
        },
        { status: 400 }
      );
    }

    // Save check-in to KV
    const checkinData: CheckinData = {
      timestamp: Date.now(),
    };

    await kvClient.set(`checkin:${participantId}`, checkinData);

    return NextResponse.json({
      success: true,
      participantId,
      timestamp: checkinData.timestamp,
    });
  } catch (error) {
    console.error('Error in POST /api/checkin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/checkin - Get check-in status for all participants
export async function GET() {
  try {
    const statuses: CheckinStatus[] = [];

    // Check status for each participant
    for (const participant of participants) {
      const checkinData = await kvClient.get(`checkin:${participant.id}`) as CheckinData | null;

      statuses.push({
        participantId: participant.id,
        name: participant.name,
        checkedIn: !!checkinData,
        timestamp: checkinData?.timestamp,
      });
    }

    return NextResponse.json({ statuses });
  } catch (error) {
    console.error('Error in GET /api/checkin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
