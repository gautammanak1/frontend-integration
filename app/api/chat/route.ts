import { NextRequest, NextResponse } from 'next/server';

const UAGENT_ADDRESS = 'agent1qg74awmzslm46e84rhucndmpsjesxcdajxgkxh9ghwagge3h2md8575zqlf';
const AGENTVERSE_TOKEN = 'eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjMzMTg5MjksImdycCI6ImludGVybmFsIiwiaWF0IjoxNzU1NTQyOTI5LCJpc3MiOiJmZXRjaC5haSIsImp0aSI6IjAyYWNiMzlmODdmZTE3MDIyMTc3NjE2YSIsInNjb3BlIjoiYXYiLCJzdWIiOiIxM2JhOWQ2NTk1MmFhZmUyMTJiOTAxN2UwMDBkNWVlY2ZkZjFkYTdlNGI1NGYzMjkifQ.gEn4deBjj570CeFU_qM-R9GhGOMkeJYISopwBQX9Va9vtaGsBQDj7M0LyLbC-yqxNkzWifsRqPvc2Q4t0gCCxFKgSnXgk9LxcUXUzkIsjSeiJgBRvNayaqL5iYUtQDY_-UJ195__Yhgh-NWAWqsOysv4r40lggGHzNf9Az9xWjyvrUrmLOZD9HTNmu3f7Fm1Xhts6ETqz2c1WaaRhtpnp508oelPE8A4MuZcL4SPZWP97I424a2PR195IZKOXLaow-gLeo8GqP_CTJR7_k1kQS-O7OlX7i3m6syFvlS0XuswCWbKHmwDR1V3ivuP4kujGlCIWWAtrHAsXdKIk-YpWQ';
const USER_SEED = '123456789011============';

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
    return NextResponse.json(
      { 
        response: 'An error occurred while processing your request.',
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

