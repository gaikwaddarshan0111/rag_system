from src.config import (
    WEB_SEARCH_PROVIDER
)

from src.web_search.providers import (
    tavily_provider
)


def search_web(
    question: str,
    max_results: int = 5
):

    if WEB_SEARCH_PROVIDER == "tavily":

        return tavily_provider.search(
            question,
            max_results=max_results
        )


    raise RuntimeError(
        f"Unsupported web search provider: "
        f"{WEB_SEARCH_PROVIDER}"
    )


def build_web_context(
    results
):

    if not results:

        return ""


    context_parts = []


    for index, result in enumerate(
        results,
        start=1
    ):

        context_parts.append(

            f"""
Web Source {index}

Title:
{result.get("title", "")}

URL:
{result.get("url", "")}

Content:
{result.get("content", "")}
"""

        )


    return "\n\n---\n\n".join(
        context_parts
    )