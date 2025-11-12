from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver
from langchain.messages import HumanMessage
from rich import print
from prompt import system_prompt
from models.llm import llm
from tools import search_knowledgebase

agent = create_agent(
    model=llm,
    tools=[search_knowledgebase],
    system_prompt=system_prompt,
    checkpointer=InMemorySaver(),
    middleware=[],
    name="Japan AI Agent",
)

# async def run_agent(input_text: str):
#     async for chunk in agent.astream(
#         {
#             "messages": [
#                 {"role": "user", "content": input_text}
#             ]
#         },
#         stream_mode='updates',
#         config={"configurable": {"thread_id": "test_thread_123"}},
#     ):
#         for step, data in chunk.items():
#             yield step
#             yield "------"
#             yield data['messages'][-1].content_blocks
#         #     print(f"step: {step}")
#         #     print(f"content: {data['messages'][-1].content_blocks}")
#         # yield chunk
    

# if __name__ == "__main__":
#     import asyncio
    
#     async def main():
#         async for chunk in run_agent("Can I get subsidies for my computer Japan?"):
#             print(chunk)
    
#     asyncio.run(main())
