// calculators.js — BMI and calorie calculator logic (features-tools.html only)

function calculateBMI(heightCm, weightKg) {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

function calculateCalories(age, gender, height, weight, activityFactor) {
  const base = gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  return Math.round(base * activityFactor);
}

document.addEventListener('DOMContentLoaded', () => {
  const bmiForm = document.getElementById('bmi-form');
  if (bmiForm) {
    bmiForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const height = Number(document.getElementById('height').value);
      const weight = Number(document.getElementById('weight').value);
      const result = document.getElementById('bmi-result');
      const category = document.getElementById('bmi-category');

      if (!height || !weight || height <= 0 || weight <= 0) {
        showToast('Please enter valid height and weight values.');
        return;
      }

      const bmi = calculateBMI(height, weight);
      result.textContent = bmi.toFixed(1);
      category.textContent = `Category: ${getBMICategory(bmi)}`;
      showToast(`BMI ${bmi.toFixed(1)} calculated`);
    });
  }

  const calorieForm = document.getElementById('calorie-form');
  if (calorieForm) {
    calorieForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const age = Number(document.getElementById('age').value);
      const gender = document.getElementById('gender').value;
      const height = Number(document.getElementById('calorie-height').value);
      const weight = Number(document.getElementById('calorie-weight').value);
      const activityLevel = Number(document.getElementById('activity-level').value);
      const result = document.getElementById('calorie-result');
      const summary = document.getElementById('calorie-summary');

      if (!age || !height || !weight) {
        showToast('Please complete all calorie calculator fields.');
        return;
      }

      const calories = calculateCalories(age, gender, height, weight, activityLevel);
      result.textContent = `${calories} kcal`;
      summary.textContent = `Estimated daily intake for maintenance: ${calories} kcal.`;
      showToast('Calories estimated successfully');
    });
  }
});
