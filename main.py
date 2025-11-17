'''
Author: Mohsin Zaidi
Date: 2025-11-17
Version: 1.0.0
Description: Main application file for the AI Test Plan Manager using FastAPI.

'''


from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Test": "Plan"}
