from urllib.parse import urlparse

from tavily import TavilyClient

from src.config import TAVILY_API_KEY


# =========================================================
# SOURCE CONFIGURATION
# =========================================================

MAX_RESULTS = 5
MAX_CONTEXT_RESULTS = 3


# =========================================================
# OFFICIAL DOMAINS
# =========================================================

OFFICIAL_DOMAINS = {

    "zoho": {
        "zoho.com"
    },
     "salesforce": {
        "salesforce.com"
    }

}


# =========================================================
# DOMAIN HELPERS
# =========================================================

def get_hostname(
    url: str
) -> str:

    if not url:
        return ""

    try:

        hostname = (
            urlparse(url).hostname
            or ""
        ).lower()

        if hostname.startswith("www."):

            hostname = hostname[4:]

        return hostname

    except Exception:

        return ""


# =========================================================
# OFFICIAL DOMAIN CHECK
# =========================================================

def is_official_domain(
    url: str
) -> bool:

    hostname = get_hostname(
        url
    )

    if not hostname:
        return False

    for domains in OFFICIAL_DOMAINS.values():

        if hostname in domains:

            return True

    return False


# =========================================================
# SCORE SOURCE
# =========================================================

def source_priority(
    result,
    question: str
) -> float:

    score = result.get(
        "score"
    ) or 0.0

    url = result.get(
        "url",
        ""
    )

    hostname = get_hostname(
        url
    )

    priority = score


    # =====================================================
    # OFFICIAL DOMAIN BOOST
    # =====================================================

    question_lower = question.lower()


    for entity, domains in OFFICIAL_DOMAINS.items():

        if entity in question_lower:

            if hostname in domains:

                priority += 0.30


    # =====================================================
    # SECONDARY SOURCE PENALTY
    # =====================================================

    secondary_domains = {

        "wikipedia.org",
        "medium.com",
        "blogspot.com",
        "wordpress.com"

    }


    if hostname in secondary_domains:

        priority -= 0.05


    return priority


# =========================================================
# WEB SEARCH
# =========================================================

def search(
    question: str,
    max_results: int = MAX_RESULTS
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


    # =====================================================
    # RANK RESULTS
    # =====================================================

    results.sort(

        key=lambda result:
            source_priority(
                result,
                question
            ),

        reverse=True

    )


    # =====================================================
    # LIMIT RESULTS SENT TO RAG
    # =====================================================

    return results[
        :MAX_CONTEXT_RESULTS
    ]