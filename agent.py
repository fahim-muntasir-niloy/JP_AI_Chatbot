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
    # checkpointer=InMemorySaver(),
    middleware=[],
    name="Japan AI Agent",
)


if __name__ == "__main__":
    response = agent.invoke(
        {
            "messages": [
                {"role": "user", "content": "Tell me about Mount Fuji in Japanese."}
            ]
        },
        # config={"configurable": {"thread_id": "1"}},
    )
    print(response)
