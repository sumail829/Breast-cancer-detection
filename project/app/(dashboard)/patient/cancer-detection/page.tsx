'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Calendar, CheckCircle2, FileUp, Microscope, RotateCw, Upload } from "lucide-react";
import axios from 'axios';

export default function CancerDetectionPage() {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<"malignant" | "benign" | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = async () => {
    if (!selectedPatient) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a patient before uploading data",
      });
      return;
    }

    if (!imageFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an image to upload",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      setIsUploading(true);
      setUploadSuccess(false);
      
      console.log("Uploading image:", imageFile.name);
      console.log("Patient ID:", selectedPatient);
      
      const response = await axios.post(
        `http://localhost:4000/api/records/${selectedPatient}/uploadImage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload response:", response.data);
      setUploadSuccess(true);
      
      toast({
        title: "Upload successful!",
        description: `Image "${imageFile.name}" uploaded successfully`,
      });
      
    } catch (error) {
      console.error("Upload failed:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error details:", error.response?.data);
      }
      
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || "Something went wrong while uploading the image."
          : "Something went wrong while uploading the image.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePredict = () => {
    if (!selectedPatient) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a patient before running prediction",
      });
      return;
    }

    if (!uploadSuccess) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an image first",
      });
      return;
    }

    setIsPredicting(true);
    setPredictionResult(null);

    // Simulate prediction delay
    setTimeout(() => {
      setIsPredicting(false);
      // Randomly determine result for demo purposes
      const result = Math.random() > 0.7 ? 'malignant' : 'benign';
      setPredictionResult(result);

      toast({
        title: "Prediction complete",
        description: `Cancer prediction result: ${result}`,
        variant: result === 'malignant' ? 'destructive' : 'default',
      });
    }, 3000);
  };

  const resetForm = () => {
    setSelectedPatient('');
    setPredictionResult(null);
    setImageFile(null);
    setUploadSuccess(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImageFile(file);
    setUploadSuccess(false); // Reset upload success when new file is selected
    
    if (file) {
      console.log("File selected:", file.name, "Size:", file.size, "Type:", file.type);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Breast Cancer Detection</h1>
        <p className="text-muted-foreground">
          Upload patient data and run breast cancer predictions
        </p>
      </div>

      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Upload & Detect</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Statistics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Patient Data Upload</CardTitle>
                <CardDescription>
                  Upload patient data for breast cancer detection analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="patient-select">Select Patient</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="p1">Emily Richards</SelectItem>
                      <SelectItem value="p2">John Smith</SelectItem>
                      <SelectItem value="p3">Maria Garcia</SelectItem>
                      <SelectItem value="p4">David Kim</SelectItem>
                      <SelectItem value="p5">Sarah Johnson</SelectItem>
                      <SelectItem value="p6">Michael Thompson</SelectItem>
                      <SelectItem value="p7">Jennifer Lee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Upload Method</Label>
                  <RadioGroup defaultValue="scan" className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="scan" id="scan" />
                      <Label htmlFor="scan" className="font-normal">Upload scan images</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="data" id="data" />
                      <Label htmlFor="data" className="font-normal">Enter data manually</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid w-full items-center gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="picture">Upload Mammogram Images</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer ${
                          uploadSuccess 
                            ? 'bg-green-50 border-green-300 dark:bg-green-900/20' 
                            : 'bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploadSuccess ? (
                            <>
                              <CheckCircle2 className="w-8 h-8 mb-4 text-green-500" />
                              <p className="mb-2 text-sm text-green-600">
                                <span className="font-semibold">Upload successful!</span>
                              </p>
                              <p className="text-xs text-green-500">
                                {imageFile?.name}
                              </p>
                            </>
                          ) : (
                            <>
                              <FileUp className="w-8 h-8 mb-4 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                DICOM, PNG, or JPEG (MAX. 100MB)
                              </p>
                              {imageFile && (
                                <p className="text-xs text-blue-600 mt-2">
                                  Selected: {imageFile.name}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                        <Input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          accept=".dcm,.png,.jpg,.jpeg,.dicom"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any relevant notes about the patient's condition"
                    className="min-h-[100px]"
                  />
                </div>

                {/* Debug Information */}
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h4 className="font-semibold mb-2">Debug Info:</h4>
                  <p className="text-sm">Selected Patient: {selectedPatient || 'None'}</p>
                  <p className="text-sm">Selected File: {imageFile?.name || 'None'}</p>
                  <p className="text-sm">File Size: {imageFile ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</p>
                  <p className="text-sm">Upload Status: {uploadSuccess ? 'Success' : 'Pending'}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetForm}>Reset</Button>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    disabled={isUploading || !selectedPatient || !imageFile}
                    onClick={handleUpload}
                  >
                    {isUploading && <RotateCw className="mr-2 h-4 w-4 animate-spin" />}
                    {isUploading ? 'Uploading...' : 'Upload Data'}
                  </Button>
                  <Button
                    disabled={isPredicting || !selectedPatient || !uploadSuccess}
                    onClick={handlePredict}
                  >
                    {isPredicting && <RotateCw className="mr-2 h-4 w-4 animate-spin" />}
                    {isPredicting ? 'Processing...' : 'Run Detection'}
                    {!isPredicting && <Microscope className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prediction Result</CardTitle>
                <CardDescription>
                  {predictionResult
                    ? 'Analysis complete'
                    : 'Waiting for analysis to complete'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                {isPredicting ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">Running analysis...</p>
                  </div>
                ) : predictionResult ? (
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div
                      className={`h-24 w-24 rounded-full flex items-center justify-center ${predictionResult === 'benign'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                        }`}
                    >
                      {predictionResult === 'benign' ? (
                        <CheckCircle2 className="h-12 w-12" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold">
                        {predictionResult === 'benign' ? 'Benign' : 'Malignant'}
                      </h3>
                      <p className={`${predictionResult === 'benign'
                        ? 'text-green-600'
                        : 'text-red-600'
                        }`}>
                        {predictionResult === 'benign'
                          ? 'No signs of malignancy detected'
                          : 'Signs of malignancy detected'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Confidence: {predictionResult === 'benign' ? '92%' : '89%'}
                      </p>
                    </div>
                    <div className="w-full max-w-xs mt-6">
                      <Button variant="outline" className="w-full">
                        View Detailed Report
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">No prediction results yet</p>
                    <p className="text-xs text-muted-foreground">
                      Select a patient and upload data to run cancer detection
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detection History</CardTitle>
              <CardDescription>
                View all previous breast cancer detection tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <p className="text-lg text-muted-foreground">Detection history placeholder</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detection Statistics</CardTitle>
              <CardDescription>
                View statistics about your breast cancer detection tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <p className="text-lg text-muted-foreground">Detection statistics placeholder</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}