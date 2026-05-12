

    document.querySelector('#login-form').addEventListener('submit', async (e) =>  {
        e.preventDefault()
        const email = document.querySelector('#email').value
        const password = document.querySelector('#password').value
        const response = await fetch('http://localhost:5678/api/users/login', {
               method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
})
        const data = await response.json()
        // if (email === Email.email & password === Email.password )
           if ( response.ok) {
                localStorage.setItem('token', data.token )
                // localStorage.getItem('token')
                window.location.href ='./index.html'
           } else {
                document.querySelector('#error-message').style.display = 'block'
}
}) 
