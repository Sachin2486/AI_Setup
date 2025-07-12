import React, { useReducer } from 'react';
import './App.css';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Initial state for the form
const initialState = {
  name: '',
  email: '',
  password: '',
  errors: {}
};

// Reducer function to handle form state changes
function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: {
          ...state.errors,
          [action.field]: '' // Clear error when field is updated
        }
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.message
        }
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

function FormComponent() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { theme, toggleTheme } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FIELD', field: name, value });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!state.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!state.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!state.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (state.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Update errors in state
    Object.keys(newErrors).forEach(field => {
      dispatch({ type: 'SET_ERROR', field, message: newErrors[field] });
    });

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', state);
      dispatch({ type: 'RESET_FORM' });
    }
  };

  return (
    <div className="App">
      <div className="form-container">
        <div className="theme-toggle">
          <button onClick={toggleTheme} className="theme-button">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <h1>Registration Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={state.name}
              onChange={handleChange}
              className={state.errors.name ? 'error' : ''}
            />
            {state.errors.name && <span className="error-message">{state.errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={state.email}
              onChange={handleChange}
              className={state.errors.email ? 'error' : ''}
            />
            {state.errors.email && <span className="error-message">{state.errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={state.password}
              onChange={handleChange}
              className={state.errors.password ? 'error' : ''}
            />
            {state.errors.password && <span className="error-message">{state.errors.password}</span>}
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <FormComponent />
    </ThemeProvider>
  );
}

export default App;
