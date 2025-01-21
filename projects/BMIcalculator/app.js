function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const resultDiv = document.getElementById('result');

    // Remove previous animation class
    resultDiv.classList.remove('show');

    // Validate input with more specific messages
    if (isNaN(weight) || weight <= 0 || weight > 300) {
        showResult('Please enter a valid weight between 1-300 kg.', 'red');
        return;
    }
    if (isNaN(height) || height <= 0.5 || height > 3) {
        showResult('Please enter a valid height between 0.5-3 meters.', 'red');
        return;
    }

    // Calculate BMI
    const bmi = weight / (height * height);
    let bmiCategory = '';
    let color = '';

    // Determine BMI category with more precise ranges
    if (bmi < 18.5) {
        bmiCategory = 'Underweight';
        color = '#f1c40f';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        bmiCategory = 'Normal weight';
        color = '#2ecc71';
    } else if (bmi >= 25 && bmi < 29.9) {
        bmiCategory = 'Overweight';
        color = '#e67e22';
    } else {
        bmiCategory = 'Obesity';
        color = '#e74c3c';
    }

    // Calculate ideal weight range
    const idealLow = 18.5 * (height * height);
    const idealHigh = 24.9 * (height * height);

    // Display the result with ideal weight range
    const message = `
        Your BMI is ${bmi.toFixed(1)}
        <br>Category: ${bmiCategory}
        <br>Ideal weight range: ${idealLow.toFixed(1)} - ${idealHigh.toFixed(1)} kg
    `;
    
    showResult(message, color);
}

function showResult(message, color) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = message;
    resultDiv.style.color = color;
    
    // Add animation
    setTimeout(() => {
        resultDiv.classList.add('show');
    }, 10);
}

// Add event listeners for enter key
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculateBMI();
        }
    });
});
