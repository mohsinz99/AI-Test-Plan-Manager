'''
Author: Mohsin Zaidi
Date: 2025-11-17
Version: 1.0.0
Description: Main application file for the AI Test Plan Manager using FastAPI.

'''


from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from typing import List

import crud
import models
import db as database

# creates db tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Test Plan Endpoints

# Gets all test plans
@app.get("/api/plans", response_model=List[models.TestPlan])
def show_plans(limit: int = 30, db: Session = Depends(database.get_db)):
    plans = crud.get_plans(db, limit=limit)
    return plans

# Creates a new test plan
@app.post("/api/plans", response_model=models.TestPlan)
def create_plan(plan: models.TestPlanCreate, db: Session = Depends(database.get_db)):
    return crud.create_plan(db = db, plan = plan)

# Gets a single test plan by ID
@app.get("/api/plans/{plan_id}", response_model=models.TestPlan)
def read_plan(plan_id: int, db: Session = Depends(database.get_db)):
    db_plan = crud.get_plan(db, plan_id = plan_id)
    if db_plan is None:
        raise HTTPException(status_code = 404, detail = "Test Plan not found")
    return db_plan

# Updates existing test plan details
@app.put("/api/plans/{plan_id}", response_model=models.TestPlan)
def update_plan(plan_id: int, plan: models.TestPlanUpdate, db: Session = Depends(database.get_db)):
    db_plan = crud.update_plan(db, plan_id=plan_id, plan=plan)
    if db_plan is None:
        raise HTTPException(status_code = 404, detail = "Test Plan not found")
    return db_plan

# Deletes a test plan by ID
@app.delete("/api/plans/{plan_id}", response_model=models.TestPlan)
def delete_plan(plan_id: int, db: Session = Depends(database.get_db)):
    db_plan = crud.delete_plan(db, plan_id=plan_id)
    if db_plan is None:
        raise HTTPException(status_code = 404, detail = "Test Plan not found")
    return db_plan

# Test Step Endpoints

# Creates a new test step for a test plan
@app.post("/api/plans/{plan_id}/steps", response_model=models.TestStep)
def create_step_for_plan(plan_id: int, step: models.TestStepCreate, db: Session = Depends(database.get_db)):
    db_plan = crud.get_plan(db, plan_id=plan_id)
    if db_plan is None:
        raise HTTPException(status_code=404, detail="Test Plan not found")
    return crud.create_plan_step(db=db, step=step, plan_id=plan_id)

@app.get("/")
def read_root():
    return FileResponse('static/index.html')

app.mount("/static", StaticFiles(directory = "static"), name = "static")