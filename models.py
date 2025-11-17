'''
Author: Mohsin Zaidi
Date: 2025-11-17
Version: 1.0.0
Description: Database models and Pydantic schemas for the AI Test Plan Manager application.

'''



from sqlalchemy import Column, Integer, String, Text
from pydantic import BaseModel
from typing import List, Optional

from db import Base


# Defines db table setup
class DBTestPlan(Base):
    __tablename__ = "test_plans"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)


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
    steps: List = []

    class Config:
        from_attributes = True