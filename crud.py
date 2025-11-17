'''
Author: Mohsin Zaidi
Date: 2025-11-17
Version: 1.0.0
Description: CRUD operations for the AI Test Plan Manager application.

'''



from sqlalchemy.orm import Session
import models

# Get a single test plan by ID
def get_plan(db: Session, plan_id: int):
    return db.query(models.DBTestPlan).filter(models.DBTestPlan.id == plan_id).first()

# Gets first 15 test plans
def get_plans(db: Session, limit: int = 15):
    return db.query(models.DBTestPlan).limit(limit).all()

# Adds new test plan to db
def create_plan(db: Session, plan: models.TestPlanCreate):
    db_plan = models.DBTestPlan(title=plan.title, description=plan.description)
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan
