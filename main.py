from fastapi import FastAPI , Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI(
    title="RAG SYSTEM",
    description="Document-Based RAG application",
    version="1.0.0"

)

#Server CSS and JS
app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)

#HTML templates
templates = Jinja2Templates(
    directory="templates"
)


@app.get("/")
async def home(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "request":request
        }
    )