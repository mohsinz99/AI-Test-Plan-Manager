/*
Author: Mohsin Zaidi
Date: 2025-11-17
Version: 1.0.0
Description: Main JavaScript file for the Test Plan Manager frontend.
*/


document.addEventListener('DOMContentLoaded', () => {

    const planList = document.getElementById('plan-list');
    const newPlanBtn = document.getElementById('new-plan-btn');


    async function loadAllPlans() {
        try {
            const response = await fetch('/api/plans');
            if (!response.ok) throw new Error('Failed to fetch plans');
            const plans = await response.json();
            
            planList.innerHTML = '';

            // Populate the list with fetched plans
            plans.forEach(plan => {
                const tempList = document.createElement('li');
                tempList.textContent = plan.title;
                tempList.dataset.id = plan.id;
                planList.appendChild(tempList);
            });
        }
        catch (error) {
            console.error('Error loading plans:', error);
        }
    }

    newPlanBtn.addEventListener('click', async () => {
        const newPlan = {title: "New Test Plan", description: ""};

        try {
            const response = await fetch('/api/plans', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newPlan)
            });
            if (!response.ok) throw new Error('Failed to create plan');

            // Reloads plan list
            await loadAllPlans(); 

        }
        catch (error) {
            console.error('Error creating new plan:', error);
        }
    });

    loadAllPlans();

});