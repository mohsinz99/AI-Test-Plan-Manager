'''
Author: Mohsin Zaidi
Date: 2025-11-17
Version: 1.0.0
Description: CRUD operations for the AI Test Plan Manager application.
'''


from sqlalchemy.orm import Session

import models

# Test Plan CRUD

# Get a single test plan by ID
def get_plan(db: Session, plan_id: int):
    return db.query(models.DBTestPlan).filter(models.DBTestPlan.id == plan_id).first()

# Gets first 15 test plans
def get_plans(db: Session, limit: int = 30):
    return db.query(models.DBTestPlan).limit(limit).all()

# Adds new test plan to db
def create_plan(db: Session, plan: models.TestPlanCreate):
    db_plan = models.DBTestPlan(title = plan.title, description = plan.description)
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

# Updates existing plan with new name/description
def update_plan(db: Session, plan_id: int, plan: models.TestPlanUpdate):
    db_plan = get_plan(db, plan_id)
    if db_plan:
        db_plan.title = plan.title
        db_plan.description = plan.description
        db.commit()
        db.refresh(db_plan)
    return db_plan

# Deletes a test plan by ID
def delete_plan(db: Session, plan_id: int):
    db_plan = get_plan(db, plan_id)
    if db_plan:
        db.delete(db_plan)
        db.commit()
    return db_plan


# Test Step CRUD

# Adds new test step to db
def create_plan_step(db: Session, step: models.TestStepCreate, plan_id: int):
    db_step = models.DBTestStep(text = step.text, plan_id = plan_id)
    db.add(db_step)
    db.commit()
    db.refresh(db_step)
    return db_step

# Get a single test step by ID
def get_step(db: Session, step_id: int):
    return db.query(models.DBTestStep).filter(models.DBTestStep.id == step_id).first()

# Updates existing step with new step text
def update_step(db: Session, step_id: int, step: models.TestStepUpdate):
    db_step = get_step(db, step_id)
    if db_step:
        db_step.text = step.text
        db.commit()
        db.refresh(db_step)
    return db_step

# Deletes a test step by ID
def delete_step(db: Session, step_id: int):
    db_step = get_step(db, step_id)
    if db_step:
        db.delete(db_step)
        db.commit()
    return db_step