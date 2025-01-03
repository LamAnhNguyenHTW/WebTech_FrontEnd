<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      showPassword: false, // Hinzufügen der fehlenden Datenvariable
      error: null,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword; // Umschalten des Passwortstatus
    },
    async handleLogin() {
      try {
        // Beispiel für eine API-Anfrage (auskommentiert)
        /*
        const response = await axios.post('http://localhost:8080/api/auth/login', {
          username: this.username,
          password: this.password,
        });
        localStorage.setItem('token', response.data.token);
        */
        this.$router.push('/produkt'); // Redirect to produkt page
      } catch (error) {
        this.error = 'Invalid username or password';
      }
    },
  },
};
</script>


<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="username"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-wrapper">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            required
          />
          <button
            type="button"
            class="toggle-password"
            @click="togglePassword"
          >
            {{ showPassword ? '🙈 Hide' : '👁 Show' }}
          </button>
        </div>
      </div>
      <button type="submit" class="submit-button">Login</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<style scoped>
/* Container styling */
.login-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: "Arial", sans-serif;
}

/* Form group spacing */
.form-group {
  margin-bottom: 20px;
}

/* Input fields */
input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Password wrapper */
.password-wrapper {
  display: flex;
  align-items: center;
}

.password-wrapper input {
  flex: 1;
}

.toggle-password {
  margin-left: 10px;
  padding: 8px 12px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
}

.toggle-password:hover {
  background-color: #0056b3;
}

/* Submit button */
.submit-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  background-color: #28a745;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #218838;
}

/* Error message */
.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}
</style>
