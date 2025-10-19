"""
Simple Responding Agent for Testing
This agent responds to chat messages with actual answers
"""
from datetime import datetime
from uuid import uuid4
from uagents import Agent, Protocol, Context
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    TextContent,
    chat_protocol_spec,
)

# Create agent with mailbox
agent = Agent(
    name="chat-assistant",
    seed="chat-assistant-test-seed-123",
    port=8003,
    mailbox=True
)

# Initialize chat protocol
chat_proto = Protocol(spec=chat_protocol_spec)

@agent.on_event("startup")
async def startup(ctx: Context):
    ctx.logger.info("=" * 50)
    ctx.logger.info("🤖 Chat Assistant Agent Started!")
    ctx.logger.info("=" * 50)
    ctx.logger.info(f"📍 Agent Address: {ctx.agent.address}")
    ctx.logger.info(f"🌐 Port: 8003")
    ctx.logger.info(f"📬 Mailbox: Enabled")
    ctx.logger.info("=" * 50)
    ctx.logger.info("\n✅ Copy this address to your chat app:")
    ctx.logger.info(f"   {ctx.agent.address}\n")

@chat_proto.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming chat messages and send intelligent responses"""
    
    for item in msg.content:
        if isinstance(item, TextContent):
            query = item.text.lower()
            ctx.logger.info(f"📥 Received: '{item.text}' from {sender[:20]}...")
            
            # Send acknowledgement
            ack = ChatAcknowledgement(
                timestamp=datetime.utcnow(),
                acknowledged_msg_id=msg.msg_id
            )
            await ctx.send(sender, ack)
            ctx.logger.info("✅ Acknowledgement sent")
            
            # Generate response based on query
            if "bitcoin" in query or "btc" in query:
                response_text = "Bitcoin is a decentralized cryptocurrency that was invented in 2008 by an unknown person or group using the name Satoshi Nakamoto. It operates on a peer-to-peer network without the need for a central authority."
            elif "hello" in query or "hi" in query:
                response_text = "Hello! I'm your chat assistant. I can help you with questions about cryptocurrency, technology, or general topics. How can I assist you today?"
            elif "how are you" in query:
                response_text = "I'm functioning perfectly! Thank you for asking. I'm here and ready to help you with any questions you have."
            elif "ethereum" in query or "eth" in query:
                response_text = "Ethereum is a decentralized, open-source blockchain platform that enables smart contracts and decentralized applications (dApps). It was proposed by Vitalik Buterin in 2013 and launched in 2015."
            elif "agent" in query or "uagent" in query:
                response_text = "I'm a uAgent built on the Fetch.ai platform! uAgents can communicate with each other using protocols, perform autonomous tasks, and integrate with various services. Pretty cool, right?"
            elif "weather" in query:
                response_text = "I don't have access to real-time weather data, but I can tell you that weather information is typically obtained through APIs like OpenWeatherMap or similar services. Would you like to know about something else?"
            else:
                response_text = f"I received your message: '{item.text}'. I'm a simple chat assistant. Try asking me about Bitcoin, Ethereum, agents, or just say hello!"
            
            # Send response message
            response = ChatMessage(
                timestamp=datetime.utcnow(),
                msg_id=uuid4(),
                content=[TextContent(type="text", text=response_text)]
            )
            await ctx.send(sender, response)
            ctx.logger.info(f"📤 Response sent: '{response_text[:50]}...'")

@chat_proto.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements"""
    ctx.logger.info(f"✅ Received acknowledgement from {sender[:20]}...")

# Include chat protocol
agent.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🚀 Starting Chat Assistant Agent...")
    print("=" * 60)
    print("\n⏳ Please wait while the agent initializes...\n")
    agent.run()

