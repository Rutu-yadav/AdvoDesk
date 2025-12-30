import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import { FaUpload, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    role: 'ADVOCATE',
    phone: '',
    enrollmentNumber: '',
    enrollmentDocument: null
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState('');
  const [documentError, setDocumentError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear specific field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }

    // Validate enrollment number format as user types
    if (name === 'enrollmentNumber' && value) {
      validateEnrollmentNumber(value);
    }
  };

  const validateEnrollmentNumber = (enrollmentNumber) => {
    const pattern = /^[A-Z]{1,3}\/\d{1,6}\/\d{4}$/;
    
    if (!pattern.test(enrollmentNumber)) {
      setEnrollmentError('Format: STATE/NUMBER/YEAR (e.g., MAH/5678/2021)');
      return false;
    }

    // Validate year
    const year = parseInt(enrollmentNumber.split('/')[2]);
    const currentYear = new Date().getFullYear();
    if (year < 1950 || year > currentYear) {
      setEnrollmentError(`Year must be between 1950 and ${currentYear}`);
      return false;
    }

    setEnrollmentError('');
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setFormData({ ...formData, enrollmentDocument: null });
      setDocumentError('');
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      setDocumentError('Only PDF files are allowed');
      setFormData({ ...formData, enrollmentDocument: null });
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setDocumentError('File size must be less than 5MB');
      setFormData({ ...formData, enrollmentDocument: null });
      return;
    }

    setDocumentError('');
    setFormData({ ...formData, enrollmentDocument: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSuccess('');
    setLoading(true);

    // Validation for advocates - enrollment number is mandatory
    if (formData.role === ROLES.ADVOCATE) {
      if (!formData.enrollmentNumber) {
        setEnrollmentError('Enrollment number is required');
        setLoading(false);
        return;
      }
      if (!validateEnrollmentNumber(formData.enrollmentNumber)) {
        setError('Please enter a valid enrollment number');
        setLoading(false);
        return;
      }
      if (!formData.enrollmentDocument) {
        setDocumentError('Enrollment document is required');
        setLoading(false);
        return;
      }
    }

    try {
      await register(formData);
      
      // Advocates need admin approval before login
      setSuccess('Registration successful! Your application is pending admin approval. You will be able to login once your enrollment is verified.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      if (err.response?.data && typeof err.response.data === 'object') {
        setFieldErrors(err.response.data);
        setError('Please correct the errors in the form.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isAdvocate = formData.role === ROLES.ADVOCATE;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="text-center text-4xl font-extrabold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
            AdvoDesk
          </h2>
          <h3 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Create your account
          </h3>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-start gap-2">
              <FaInfoCircle className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-start gap-2">
              <FaCheckCircle className="mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className={`input-field mt-1 ${fieldErrors.fullName ? 'border-red-500' : ''}`}
                value={formData.fullName}
                onChange={handleChange}
              />
              {fieldErrors.fullName && <p className="mt-1 text-xs text-red-500">{fieldErrors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username *
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`input-field mt-1 ${fieldErrors.username ? 'border-red-500' : ''}`}
                value={formData.username}
                onChange={handleChange}
              />
              {fieldErrors.username && <p className="mt-1 text-xs text-red-500">{fieldErrors.username}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`input-field mt-1 ${fieldErrors.email ? 'border-red-500' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={`input-field mt-1 ${fieldErrors.phone ? 'border-red-500' : ''}`}
                value={formData.phone}
                onChange={handleChange}
              />
              {fieldErrors.phone && <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`input-field mt-1 ${fieldErrors.password ? 'border-red-500' : ''}`}
                value={formData.password}
                onChange={handleChange}
              />
              {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
            </div>



            {/* Advocate-specific fields */}
            {isAdvocate && (
              <>
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Advocate Information *
                  </h4>
                  
                  <div>
                    <label htmlFor="enrollmentNumber" className="block text-sm font-medium text-gray-700">
                      Enrollment Number *
                    </label>
                    <input
                      id="enrollmentNumber"
                      name="enrollmentNumber"
                      type="text"
                      required
                      className={`input-field mt-1 ${enrollmentError || fieldErrors.enrollmentNumber ? 'border-red-500' : ''}`}
                      placeholder="e.g., MAH/5678/2021"
                      value={formData.enrollmentNumber}
                      onChange={handleChange}
                    />
                    {enrollmentError || fieldErrors.enrollmentNumber ? (
                      <p className="mt-1 text-sm text-red-600">{enrollmentError || fieldErrors.enrollmentNumber}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">
                        Format: STATE/NUMBER/YEAR (e.g., MAH/5678/2021, UP/1102/2022, D/2345/2023)
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label htmlFor="enrollmentDocument" className="block text-sm font-medium text-gray-700">
                      Enrollment Document (PDF) *
                    </label>
                    <div className="mt-1 flex items-center gap-3">
                      <label className="flex-1 cursor-pointer">
                        <div className={`input-field flex items-center justify-between ${documentError ? 'border-red-500' : ''}`}>
                          <span className="text-gray-500 text-sm truncate">
                            {formData.enrollmentDocument 
                              ? formData.enrollmentDocument.name 
                              : 'Choose PDF file...'}
                          </span>
                          <FaUpload className="text-gray-400" />
                        </div>
                        <input
                          id="enrollmentDocument"
                          name="enrollmentDocument"
                          type="file"
                          accept=".pdf"
                          required
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    {formData.enrollmentDocument && !documentError && (
                      <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                        <FaCheckCircle /> {(formData.enrollmentDocument.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                    {documentError ? (
                      <p className="mt-1 text-sm text-red-600">{documentError}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">
                        PDF only, maximum 5MB
                      </p>
                    )}
                  </div>

                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> After registration, your enrollment will be reviewed by an admin. 
                      You can login once your account is approved.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || (isAdvocate && (enrollmentError || documentError || !formData.enrollmentDocument))}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-sky-600 hover:text-sky-700 font-medium">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
