/*
Author: Mohsin Zaidi
Date: 2025-11-17
Version: 1.0.0
Description: Main JavaScript file for the Test Plan Manager frontend.
*/


document.addEventListener('DOMContentLoaded', () => {

    const planList = document.getElementById('plan-list');
    const newPlanBtn = document.getElementById('new-plan-btn');
    const centerMessage = document.getElementById('center-message');
    const planDetails = document.getElementById('plan-details');
    const planTitleInput = document.getElementById('plan-title');
    const planDescInput = document.getElementById('plan-desc');
    const savePlanBtn = document.getElementById('save-plan-btn');
    const deletePlanBtn = document.getElementById('delete-plan-btn');
    const stepList = document.getElementById('step-list');
    const newStepInput = document.getElementById('new-step-input');
    const addStepBtn = document.getElementById('add-step-btn');

    let selectedPlanId = null;

    function showHome() {
        selectedPlanId = null;
        centerMessage.classList.remove('hidden');
        planDetails.classList.add('hidden');

        // Deselect any active plan in the list to reset to home view
        planList.querySelectorAll('li').forEach(li => {
            li.classList.remove('active');
        });
    }

    // Sets active plan by plan ID and loads the plan details
    function setActivePlan(id) {
        selectedPlanId = id;
        planList.querySelectorAll('li').forEach(li => {
            li.classList.toggle('active', li.dataset.id === id);
        });

        loadPlanDetails(id);
    }

    // Updates the step list in the UI
    function updateStepList(step) {
        const li = document.createElement('li');
        li.className = 'test-step-item';
        li.dataset.stepId = step.id;
        
        li.innerHTML = `
            <span>${step.text}</span>
            <div class = "step-buttons">
                <button class = "secondary outline edit-step-btn">Edit</button>
                <button class = "contrast delete-step-btn">Delete</button>
            </div>`;
        stepList.appendChild(li);
    }

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

    // Loading chosen plan details
    async function loadPlanDetails(id) {
        try {
            const response = await fetch(`/api/plans/${id}`);
            if (!response.ok) throw new Error('Failed to fetch plan details');
            const plan = await response.json();

            planTitleInput.value = plan.title;
            planDescInput.value = plan.description;
            stepList.innerHTML = '';
            plan.steps.forEach(updateStepList);
            centerMessage.classList.add('hidden');
            planDetails.classList.remove('hidden');
        
        }
        catch (error) {
            console.error('Error loading plan details:', error);
            showHome();
        }
    }

// Event Listeners for button clicks
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

    // Choose a plan from plan list
    planList.addEventListener('click', (event) => {
        const li = event.target.closest('li');
        if (li && planList.contains(li)) {
            const id = li.dataset.id;
            if (id !== selectedPlanId) {
                setActivePlan(id);
            }
        }
    });

    // Save button for plan details
    savePlanBtn.addEventListener('click', async () => {
        if (!selectedPlanId){
            return;
        }

        const updatedPlan = {
            title: planTitleInput.value,
            description: planDescInput.value
        };
        try {
            const response = await fetch(`/api/plans/${selectedPlanId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPlan)
            });
            if (!response.ok) throw new Error('Failed to save plan');

            // Update title in list of plans
            const activeLi = planList.querySelector(`li[data-id="${selectedPlanId}"]`);
            if (activeLi) {
                activeLi.textContent = updatedPlan.title;
            }
        }
        catch (error) {
            console.error('Error saving plan:', error);
        }
    });

    // Delete plan button
    deletePlanBtn.addEventListener('click', async () => {
        if (!selectedPlanId){
            return;
        }

        // Popup confirmation to delete
        if (!confirm('Are you sure you want to delete this test plan?')) {
            return;
        }

        try {
            const response = await fetch(`/api/plans/${selectedPlanId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete plan');

            await loadAllPlans();
            showHome();

        }
        catch (error) {
            console.error('Error deleting plan:', error);
        }
    });

    async function addNewStep(text) {
        if (!text || !selectedPlanId){
            return;
        }

        try {
            const response = await fetch(`/api/plans/${selectedPlanId}/steps`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({text: text})
            });
            if (!response.ok) throw new Error('Failed to add step');

            const newStep = await response.json();
            updateStepList(newStep);
            return true;
        }
        catch (error) {
            console.error('Error adding new step:', error);
            return false;
        }
    }
    addStepBtn.addEventListener('click', async () => {
        const text = newStepInput.value.trim();
        if (await addNewStep(text)) {
            newStepInput.value = '';
        }
    });

    stepList.addEventListener('click', async (event) => {
        const target = event.target;
        const stepLi = target.closest('.test-step-item');
        if (!stepLi){
            return;
        }

        const stepId = stepLi.dataset.stepId;
        const span = stepLi.querySelector('span');

        // Delete step button actions
        if (target.classList.contains('delete-step-btn')) {
            if (!confirm('Are you sure you want to delete this step?')) return;

            try {
                const response = await fetch(`/api/steps/${stepId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Failed to delete step');
                stepLi.remove();
            }
            catch (error) {
                console.error('Error deleting step:', error);
            }
        }

        // Edit test step
        if (target.classList.contains('edit-step-btn')) {
            const currentText = span.textContent;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            stepLi.insertBefore(input, span);
            span.classList.add('hidden');
            
            // Switch to save button
            target.textContent = 'Save';
            target.classList.remove('edit-step-btn', 'secondary', 'outline');
            target.classList.add('save-step-btn');
        }
        
        // Save test step
        else if (target.classList.contains('save-step-btn')) {
            const input = stepLi.querySelector('input[type = "text"]');
            const newText = input.value.trim();
            
            if (newText) {
                try {
                    const response = await fetch(`/api/steps/${stepId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({text: newText})
                    });
                    if (!response.ok) throw new Error('Failed to update step');

                    span.textContent = newText;
                    span.classList.remove('hidden');
                    input.remove();
                    
                    // Switch back to edit button
                    target.textContent = 'Edit';
                    target.classList.remove('save-step-btn');
                    target.classList.add('edit-step-btn', 'secondary', 'outline');

                } catch (error) {
                    console.error('Error updating step:', error);
                }
            }
        }
    });

    loadAllPlans();

});