
import json
from rich import print

def token_processor(token) -> str:
    """Safely extract a text token from various possible token formats.

    Handles cases where `token` may be:
    - a list of dicts like [{"text": "..."}, ...]
    - a dict with a "text" or "content" key
    - a plain string
    Returns an empty string when no text is present or on unexpected shapes.
    """
    try:
        # List of dicts: take the first item's text/content
        if isinstance(token, list) and token:
            first = token[0]
            if isinstance(first, dict):
                return first.get("text") or first.get("content") or ""
            # first element might be a string
            if isinstance(first, str):
                return first

        # Dict-like object
        if isinstance(token, dict):
            return token.get("text") or token.get("content") or ""

        # Plain string
        if isinstance(token, str):
            return token

        # Fallback: try attribute access (safe)
        if hasattr(token, "text"):
            return getattr(token, "text") or ""
        if hasattr(token, "content"):
            return getattr(token, "content") or ""

    except Exception:
        # Defensive: never let token parsing raise and break the stream
        return ""

    return ""

# def tool_processor(tool_call: dict) -> str:


async def event_generator(agent, user_input: str, thread_id: str, stream_mode:list=["updates", "messages"]):
    """Stream agent execution events to frontend."""
    
    async for chunk in agent.astream(
        {
            "messages": [
                {"role": "user", "content": user_input}
            ]
        },
        stream_mode=stream_mode,
        config={"configurable": {"thread_id": thread_id}},
    ):
        # Unpack the stream_mode tuple: (stream_mode_name, data)
        stream_mode_name, data = chunk
        
        if stream_mode_name == "updates":
            # Process state updates (tool calls, responses)
            for step_name, step_data in data.items():
                messages = step_data.get("messages", [])
                if messages:
                    latest_msg = messages[-1]
                    
                    # LLM tool call detection
                    if hasattr(latest_msg, "tool_calls") and latest_msg.tool_calls:
                        for tool_call in latest_msg.tool_calls:
                            event = {
                                "type": "tool_call",
                                "step": step_name,
                                "tool_name": tool_call.get("name"),
                                "tool_input": tool_call.get("args"),
                                "tool_id": tool_call.get("id"),
                            }
                            yield f"data: {json.dumps(event)}\n\n"
                    
                    # Tool execution result (ToolMessage)
                    elif latest_msg.__class__.__name__ == "ToolMessage":
                        event = {
                            "type": "tool_output",
                            "step": step_name,
                            "tool_name": latest_msg.name,
                            "output": latest_msg.content,
                            "tool_call_id": latest_msg.tool_call_id,
                        }
                        yield f"data: {json.dumps(event)}\n\n"
                    
                    # Final LLM response
                    # elif hasattr(latest_msg, "content") and latest_msg.content:
                    #     event = {
                    #         "type": "llm_response",
                    #         "step": step_name,
                    #         "content": latest_msg.content,
                    #     }
                    #     yield f"data: {json.dumps(event)}\n\n"
        
        elif stream_mode_name == "messages":
            # Stream individual LLM tokens for real-time display
            msg, metadata = data
            if msg.content:
                token = token_processor(msg.content)
                event = {
                    "type": "llm_token",
                    "node": metadata.get("langgraph_node"),
                    "token": token,
                }
                print(token, end="", flush=True)
                yield f"data: {json.dumps(event)}\n\n"