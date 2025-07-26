import React from 'react';
// Note: In a real project, you would install and import formik and yup:
// npm install formik yup
// For this demo, we'll simulate the Formik functionality

// Field type definitions
const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  DATE: 'date',
  FILE: 'file'
};

// Simplified form state management (simulating Formik)
const useFormik = (initialValues, onSubmit, validate) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, values[name]);
  };

  const validateField = (name, value) => {
    if (validate) {
      const fieldErrors = validate({ ...values, [name]: value });
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(values).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate all fields
    if (validate) {
      const formErrors = validate(values);
      setErrors(formErrors);
      
      if (Object.keys(formErrors).length > 0) {
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await onSubmit(values, {
        setSubmitting: setIsSubmitting,
        resetForm: () => {
          setValues(initialValues);
          setErrors({});
          setTouched({});
        }
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
  };
};

// Reusable Form Component
const ReusableForm = ({
  fields = [],
  initialValues = {},
  validationSchema,
  onSubmit,
  submitButtonText = 'Submit',
  resetButtonText = 'Reset',
  showResetButton = true,
  className = '',
  formTitle = '',
  isLoading = false
}) => {
  // Generate initial values from field configuration if not provided
  const getInitialValues = () => {
    if (Object.keys(initialValues).length > 0) {
      return initialValues;
    }
    
    const values = {};
    fields.forEach(field => {
      values[field.name] = field.defaultValue || (field.type === FIELD_TYPES.CHECKBOX ? false : '');
    });
    return values;
  };

  // Simple validation function (simulating Yup)
  const validate = (values) => {
    const errors = {};
    
    fields.forEach(field => {
      const value = values[field.name];
      
      // Required validation
      if (field.required && (!value || value === '')) {
        errors[field.name] = `${field.label} is required`;
      }
      
      // Email validation
      if (field.type === FIELD_TYPES.EMAIL && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field.name] = 'Invalid email format';
        }
      }
      
      // Number validation
      if (field.type === FIELD_TYPES.NUMBER && value) {
        const num = parseFloat(value);
        if (isNaN(num)) {
          errors[field.name] = 'Must be a valid number';
        } else {
          if (field.min !== undefined && num < field.min) {
            errors[field.name] = `Must be at least ${field.min}`;
          }
          if (field.max !== undefined && num > field.max) {
            errors[field.name] = `Must be no more than ${field.max}`;
          }
        }
      }
    });
    
    return errors;
  };

  const formik = useFormik(getInitialValues(), onSubmit, validate);

  // Render different field types
  const renderField = (field) => {
    const { name, type, label, placeholder, options, className: fieldClassName = '', ...fieldProps } = field;
    const hasError = formik.errors[name] && formik.touched[name];

    const baseInputClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      hasError ? 'border-red-500' : 'border-gray-300'
    } ${fieldClassName}`;

    switch (type) {
      case FIELD_TYPES.TEXTAREA:
        return (
          <textarea
            name={name}
            value={formik.values[name] || ''}
            onChange={(e) => formik.handleChange(name, e.target.value)}
            onBlur={() => formik.handleBlur(name)}
            placeholder={placeholder}
            className={`${baseInputClasses} min-h-[100px] resize-vertical`}
            {...fieldProps}
          />
        );

      case FIELD_TYPES.SELECT:
        return (
          <select
            name={name}
            value={formik.values[name] || ''}
            onChange={(e) => formik.handleChange(name, e.target.value)}
            onBlur={() => formik.handleBlur(name)}
            className={baseInputClasses}
            {...fieldProps}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case FIELD_TYPES.CHECKBOX:
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={name}
              checked={formik.values[name] || false}
              onChange={(e) => formik.handleChange(name, e.target.checked)}
              onBlur={() => formik.handleBlur(name)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              {...fieldProps}
            />
            <label htmlFor={name} className="text-sm text-gray-700">
              {label}
            </label>
          </div>
        );

      case FIELD_TYPES.RADIO:
        return (
          <div className="space-y-2">
            {options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={formik.values[name] === option.value}
                  onChange={(e) => formik.handleChange(name, e.target.value)}
                  onBlur={() => formik.handleBlur(name)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  {...fieldProps}
                />
                <label className="text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case FIELD_TYPES.FILE:
        return (
          <input
            type="file"
            name={name}
            onChange={(e) => formik.handleChange(name, e.target.files[0])}
            onBlur={() => formik.handleBlur(name)}
            className={`${baseInputClasses} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
            {...fieldProps}
          />
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={formik.values[name] || ''}
            onChange={(e) => formik.handleChange(name, e.target.value)}
            onBlur={() => formik.handleBlur(name)}
            placeholder={placeholder}
            className={baseInputClasses}
            {...fieldProps}
          />
        );
    }
  };

  return (
    <div className={`max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md ${className}`}>
      {formTitle && (
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {formTitle}
        </h2>
      )}
      
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-1">
            {field.type !== FIELD_TYPES.CHECKBOX && (
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            
            {renderField(field)}
            
            {formik.errors[field.name] && formik.touched[field.name] && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors[field.name]}
              </div>
            )}
          </div>
        ))}
        
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={formik.handleSubmit}
            disabled={isLoading || formik.isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading || formik.isSubmitting ? 'Loading...' : submitButtonText}
          </button>
          
          {showResetButton && (
            <button
              type="button"
              onClick={formik.resetForm}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              {resetButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Example usage with different entities
const App = () => {
  // User Entity Form Configuration
  const userFormFields = [
    {
      name: 'firstName',
      type: FIELD_TYPES.TEXT,
      label: 'First Name',
      placeholder: 'Enter your first name',
      required: true
    },
    {
      name: 'lastName',
      type: FIELD_TYPES.TEXT,
      label: 'Last Name',
      placeholder: 'Enter your last name',
      required: true
    },
    {
      name: 'email',
      type: FIELD_TYPES.EMAIL,
      label: 'Email',
      placeholder: 'Enter your email',
      required: true
    },
    {
      name: 'age',
      type: FIELD_TYPES.NUMBER,
      label: 'Age',
      placeholder: 'Enter your age',
      min: 18,
      max: 100
    },
    {
      name: 'bio',
      type: FIELD_TYPES.TEXTAREA,
      label: 'Bio',
      placeholder: 'Tell us about yourself',
      maxLength: 500
    },
    {
      name: 'country',
      type: FIELD_TYPES.SELECT,
      label: 'Country',
      placeholder: 'Select your country',
      options: [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'in', label: 'India' }
      ]
    },
    {
      name: 'newsletter',
      type: FIELD_TYPES.CHECKBOX,
      label: 'Subscribe to newsletter'
    }
  ];

  // Product Entity Form Configuration
  const productFormFields = [
    {
      name: 'name',
      type: FIELD_TYPES.TEXT,
      label: 'Product Name',
      placeholder: 'Enter product name',
      required: true
    },
    {
      name: 'price',
      type: FIELD_TYPES.NUMBER,
      label: 'Price',
      placeholder: 'Enter price',
      min: 0,
      step: 0.01,
      required: true
    },
    {
      name: 'category',
      type: FIELD_TYPES.SELECT,
      label: 'Category',
      placeholder: 'Select category',
      options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'books', label: 'Books' },
        { value: 'home', label: 'Home & Garden' }
      ],
      required: true
    },
    {
      name: 'description',
      type: FIELD_TYPES.TEXTAREA,
      label: 'Description',
      placeholder: 'Enter product description',
      maxLength: 1000
    },
    {
      name: 'availability',
      type: FIELD_TYPES.RADIO,
      label: 'Availability',
      options: [
        { value: 'in-stock', label: 'In Stock' },
        { value: 'out-of-stock', label: 'Out of Stock' },
        { value: 'pre-order', label: 'Pre-order' }
      ]
    },
    {
      name: 'image',
      type: FIELD_TYPES.FILE,
      label: 'Product Image',
      accept: 'image/*'
    }
  ];

  // Validation schemas (simplified version of Yup)
  const createValidationSchema = (fields) => {
    return (values) => {
      const errors = {};
      
      fields.forEach(field => {
        const value = values[field.name];
        
        // Required validation
        if (field.required && (!value || value === '')) {
          errors[field.name] = `${field.label} is required`;
        }
        
        // Email validation
        if (field.type === FIELD_TYPES.EMAIL && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors[field.name] = 'Invalid email format';
          }
        }
        
        // Number validation
        if (field.type === FIELD_TYPES.NUMBER && value) {
          const num = parseFloat(value);
          if (isNaN(num)) {
            errors[field.name] = 'Must be a valid number';
          } else {
            if (field.min !== undefined && num < field.min) {
              errors[field.name] = `Must be at least ${field.min}`;
            }
            if (field.max !== undefined && num > field.max) {
              errors[field.name] = `Must be no more than ${field.max}`;
            }
          }
        }
        
        // String length validation
        if (field.maxLength && value && value.length > field.maxLength) {
          errors[field.name] = `Must be less than ${field.maxLength} characters`;
        }
      });
      
      return errors;
    };
  };

  // Form submission handlers
  const handleUserSubmit = (values, { setSubmitting, resetForm }) => {
    console.log('User form submitted:', values);
    // Simulate API call
    setTimeout(() => {
      alert('User created successfully!');
      setSubmitting(false);
      resetForm();
    }, 1000);
  };

  const handleProductSubmit = (values, { setSubmitting, resetForm }) => {
    console.log('Product form submitted:', values);
    // Simulate API call
    setTimeout(() => {
      alert('Product created successfully!');
      setSubmitting(false);
      resetForm();
    }, 1000);
  };

  const [currentForm, setCurrentForm] = React.useState('user');

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Form Selector */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setCurrentForm('user')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              currentForm === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            User Form
          </button>
          <button
            onClick={() => setCurrentForm('product')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              currentForm === 'product'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Product Form
          </button>
        </div>
      </div>

      {/* Dynamic Form Rendering */}
      {currentForm === 'user' ? (
        <ReusableForm
          fields={userFormFields}
          onSubmit={handleUserSubmit}
          formTitle="Create User"
          submitButtonText="Create User"
        />
      ) : (
        <ReusableForm
          fields={productFormFields}
          onSubmit={handleProductSubmit}
          formTitle="Create Product"
          submitButtonText="Create Product"
        />
      )}
    </div>
  );
};

export default App;