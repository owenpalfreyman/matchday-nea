import uvicorn

if __name__ == "__main__":
    # Runs server app/app.py -> runs API in app variable
    # host being 0.0.0.0 means it will run on localhost
    uvicorn.run("app.app:app", host="0.0.0.0", port=8000, reload=True)
    