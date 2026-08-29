from tavily import TavilyClient

from src.config import TAVILY_API_KEY


def search(
    question: str,
    max_results: int = 5
):

    if not TAVILY_API_KEY:

        raise RuntimeError(
            "TAVILY_API_KEY is not configured."
        )


    question = question.strip()


    if not question:

        return []


    client = TavilyClient(
        api_key=TAVILY_API_KEY
    )


    response = client.search(

        query=question,

        search_depth="basic",

        max_results=max_results,

        include_answer=False

    )


    results = []


    for result in response.get(
        "results",
        []
    ):

        content = result.get(
            "content",
            ""
        )


        if not content:

            continue


        results.append(

            {
                "title": result.get(
                    "title",
                    ""
                ),

                "url": result.get(
                    "url",
                    ""
                ),

                "content": content,

                "score": result.get(
                    "score"
                )

            }

        )


    return results