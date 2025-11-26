import { NextRequest, NextResponse } from 'next/server';

const UAGENT_ADDRESS = '';
const AGENTVERSE_TOKEN = '';
const USER_SEED = '';


const clientInstances = new Map<string, any>();

async function getClient(seed: string, token: string) {
  if (!clientInstances.has(seed)) {
    try {
      const UAgentClientModule = await import('uagent-client');
      const UAgentClient = UAgentClientModule.default || UAgentClientModule;
      
      const config: any = {
        timeout: 60000,
        autoStartBridge: true,
        userSeed: seed,
        agentverseToken: token,
        bridgePort: 8000

      };
      
      const client = new (UAgentClient as any)(config);
      await client.createUserBridge(seed, token);
      
      clientInstances.set(seed, client);
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }
  
  return clientInstances.get(seed);
}

export async function POST(request: NextRequest) {
  try {
    const { message, userSeed, agentverseToken } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }
    
    const client = await getClient(
      userSeed || USER_SEED,
      agentverseToken || AGENTVERSE_TOKEN
    );
    
    const result = await client.query(UAGENT_ADDRESS, message);

    if (result.success) {
      return NextResponse.json({ 
        response: result.response,
        success: true 
      });
    } else {
      return NextResponse.json({ 
        response: 'I apologize, but I was unable to process your request at this time.',
        success: false,
        error: result.error 
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        response: 'An error occurred while processing your request.',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

