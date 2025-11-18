'''
Author: Mohsin Zaidi
Date: 2025-11-17
Version: 1.0.0
Description: Database models and Pydantic schemas for the AI Test Plan Manager application.

'''


from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import List, Optional

from db import Base


# Defines db table setup
class DBTestPlan(Base):
    __tablename__ = "test_plans"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)

    steps = relationship("DBTestStep", back_populates="plan", cascade="all, delete-orphan")


class DBTestStep(Base):
    __tablename__ = "test_steps"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    plan_id = Column(Integer, ForeignKey("test_plans.id"))

    plan = relationship("DBTestPlan", back_populates="steps")


# Schemas for Test Steps
class TestStepBase(BaseModel):
    text: str


class TestStepCreate(TestStepBase):
    pass


class TestStepUpdate(TestStepBase):
    pass


class TestStep(TestStepBase):
    id: int
    plan_id: int

    class Config:
        from_attributes = True


# Schemas for Test Plans

# Require test plan name and optional description field
class TestPlanBase(BaseModel):
    title: str
    description: Optional[str] = None


# Create a new empty test plan
class TestPlanCreate(TestPlanBase):
    pass


# Update an existing test plan
class TestPlanUpdate(TestPlanBase):
    pass


class TestPlan(TestPlanBase):
    id: int
    steps: List[TestStep] = []

    class Config:
        from_attributes = True