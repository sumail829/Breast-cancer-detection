"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';


export default function CancerDetection() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setMessage("");
      setResults(null);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      setMessage("Please select an image first");
      return;
    }
  //  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  //   const patientId = user._id
  //   console.log(patientId,"this is new patient Id")

    setIsLoading(true);
    setMessage("Analyzing image...");

    const formData = new FormData();
    formData.append('imageUrl', imageFile);
    // formData.append('patientId', patientId); 

    try {

       
      
      const res = await axios.post('http://localhost:4000/api/patients/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
           Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      setMessage(res.data.message || "Analysis complete");   console.log(res.data,"this is result")
      setResults(res.data);
   
    } catch (error: any) {
      console.error(error);
      setMessage("Error analyzing image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(()=>{
  //   const fetchResult=async()=>{
  //     try {
  //       const res=await axios.get()
  //     } catch (error) {
        
  //     }
  //   }
  // })
  // Function to format confidence percentage
  const formatConfidence = (confidence: number) => {
    // Convert negative confidence to positive and scale to percentage
    const positiveConfidence = Math.abs(confidence);
    const percentage = Math.min(100, positiveConfidence * 100);
    return `${percentage.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Breast Cancer Detection</h1>
            <p className="text-gray-600">Upload a medical scan for analysis</p>
          </div>

          <div className="space-y-6">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="mt-4">
                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out">
                  Select Image
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="mt-2 text-sm text-gray-500">Supported formats: JPEG, PNG</p>
              </div>
            </div>

            {/* Preview Section */}
            {preview && (
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Image Preview</h3>
                <div className="flex justify-center">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-80 rounded-lg shadow-sm border border-gray-200" 
                  />
                </div>
              </div>
            )}

            {/* Results Section */}
            {results && (
              <div className="space-y-6">
                {/* Prediction Results */}
                <div className="bg-gray-100 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Detection Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg shadow-sm ${
                      results.prediction?.label === 'Malignant' 
                        ? 'bg-red-50 border border-red-200' 
                        : 'bg-green-50 border border-green-200'
                    }`}>
                      <p className="text-sm font-medium text-gray-500">Diagnosis</p>
                      <p className={`text-xl font-semibold ${
                        results.prediction?.label === 'Malignant' 
                          ? 'text-red-700' 
                          : 'text-green-700'
                      }`}>
                        {results.prediction?.label || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <p className="text-sm font-medium text-gray-500">Confidence Level</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {results.prediction?.confidence !== undefined 
                          ? formatConfidence(results.prediction.confidence) 
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="bg-gray-100 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Record</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-gray-900">{results.record?.firstName || 'N/A'} {results.record?.lastName || 'N/A'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <p className="text-sm font-medium text-gray-500">Age</p>
                      <p className="text-gray-900">{results.record?.age || 'N/A'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <p className="text-sm font-medium text-gray-500">Condition</p>
                      <p className="text-gray-900">{results.record?.disease || 'N/A'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <p className="text-sm font-medium text-gray-500">Contact</p>
                      <p className="text-gray-900">{results.record?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={handleImageUpload}
                disabled={!imageFile || isLoading}
                className={`px-6 py-3 rounded-md text-white font-medium transition duration-150 ease-in-out ${
                  !imageFile || isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Analyze Image'}
              </button>
            </div>

            {/* Status Message */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes("Error") 
                  ? "bg-red-50 text-red-700" 
                  : "bg-green-50 text-green-700"
              }`}>
                <p className="text-center">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}