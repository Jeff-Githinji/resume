document.getElementById('LoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Serialize form data into JSON
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Send serialized JSON data
        });

        if (response.ok) {
            const result = await response.text();
            console.log('Login successful:', result);
            // Redirect or perform actions after successful login
        } else {
            throw new Error(`Login failed: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});


    document.getElementById('RegForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
    
        // Serialize form data into JSON
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
    
        try {
            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data), // Send serialized JSON data
            });
    
            if (response.ok) {
                const result = await response.text();
                console.log('Registration successful:', result);
                // Redirect or perform actions after successful registration
            } else {
                throw new Error(`Registration failed: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    });
    

    




  
  
