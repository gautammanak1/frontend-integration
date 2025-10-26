import { NextRequest, NextResponse } from 'next/server';

// Get configuration from environment variables
const UAGENT_ADDRESS = process.env.UAGENT_ADDRESS || 'agent1qg74awmzslm46e84rhucndmpsjesxcdajxgkxh9ghwagge3h2md8575zqlf';
const AGENTVERSE_TOKEN = process.env.AGENTVERSE_TOKEN || '';
const USER_SEED = process.env.USER_SEED || '';

const clientInstances = new Map<string, any>();

async function getClient(seed: string, token: string) {
  if (!clientInstances.has(seed)) {
    const UAgentClientModule = await import('uagent-client');
    const UAgentClient = UAgentClientModule.default || UAgentClientModule;
    
    const config: any = {
      timeout: 60000,
      autoStartBridge: false,
      userSeed: seed,
      agentverseToken: token
    };
    
    const client = new (UAgentClient as any)(config);
    await client.createUserBridge(seed, token);
    
    clientInstances.set(seed, client);
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  return clientInstances.get(seed);
}

export async function POST(request: NextRequest) {
  try {
    const { message, userSeed, agentverseToken } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }
    
    console.log('📨 Received message:', message);
    
    const seed = userSeed || USER_SEED;
    const token = agentverseToken || AGENTVERSE_TOKEN;
    
    console.log('🔧 Using config - UAGENT:', UAGENT_ADDRESS.substring(0, 20) + '...');
    console.log('🔧 Seed:', seed.substring(0, 8) + '...');
    
    const client = await getClient(seed, token);
    console.log('✅ Client ready, querying agent...');
    
    const result = await client.query(UAGENT_ADDRESS, message);

    if (result.success) {
      console.log('✅ Query successful');
      return NextResponse.json({ 
        response: result.response,
        success: true 
      });
    } else {
      console.error('❌ Query failed:', result.error);
      return NextResponse.json({ 
        response: 'I apologize, but I was unable to process your request at this time.',
        success: false,
        error: result.error 
      });
    }
  } catch (error) {
    console.error('🚨 Chat API error:', error);
    return NextResponse.json(
      { 
        response: 'An error occurred while processing your request.',
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

