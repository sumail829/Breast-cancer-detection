'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download, 
  FileText 
} from 'lucide-react';

// Dummy test results data
const testResults = [
  {
    id: "tr1",
    type: "Breast Cancer Screening",
    date: new Date(2025, 2, 10),
    result: "benign",
    doctorId: "d1",
    confidence: 95,
    notes: "No signs of malignancy detected.",
    isRead: true,
  },
  {
    id: "tr2",
    type: "Blood Work",
    date: new Date(2025, 1, 15),
    result: "normal",
    doctorId: "d3",
    notes: "All values within normal range.",
    isRead: true,
  },
  {
    id: "tr3",
    type: "Mammogram",
    date: new Date(2024, 10, 22),
    result: "benign",
    doctorId: "d2",
    confidence: 92,
    notes: "Follow-up recommended in 6 months.",
    isRead: true,
  },
  {
    id: "tr4",
    type: "Ultrasound",
    date: new Date(2024, 8, 5),
    result: "normal",
    doctorId: "d1",
    notes: "No abnormalities detected.",
    isRead: true,
  },
  {
    id: "tr5",
    type: "Breast Cancer Screening",
    date: new Date(2023, 10, 15),
    result: "benign",
    doctorId: "d1",
    confidence: 91,
    notes: "Annual follow-up recommended.",
    isRead: true,
  },
];

// Doctor information
const doctors = {
  d1: {
    name: "Dr. Sarah Johnson",
    specialty: "Oncologist",
  },
  d2: {
    name: "Dr. Michael Chen",
    specialty: "Radiologist",
  },
  d3: {
    name: "Dr. Emily Rodriguez",
    specialty: "General Practitioner",
  },
};

export default function PatientTestResultsList() {
  const [selectedTest, setSelectedTest] = useState(testResults[0]);
  const [testType, setTestType] = useState<string>("all");
  
  const filteredTests = testResults.filter((test) => {
    return testType === "all" || test.type === testType;
  });

  const getTestIcon = (result: string) => {
    switch (result) {
      case 'benign':
      case 'normal':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'malignant':
      case 'abnormal':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTestStatusClass = (result: string) => {
    switch (result) {
      case 'benign':
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'malignant':
      case 'abnormal':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              View your medical test results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by type</label>
              <Select value={testType} onValueChange={setTestType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tests</SelectItem>
                  <SelectItem value="Breast Cancer Screening">Breast Cancer Screening</SelectItem>
                  <SelectItem value="Mammogram">Mammogram</SelectItem>
                  <SelectItem value="Blood Work">Blood Work</SelectItem>
                  <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="border rounded-md overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto">
                  {filteredTests.map((test) => (
                    <div
                      key={test.id}
                      className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-accent ${
                        selectedTest.id === test.id ? 'bg-accent' : ''
                      } ${!test.isRead ? 'font-medium' : ''}`}
                      onClick={() => setSelectedTest(test)}
                    >
                      <div className={`p-2 rounded-full ${test.result === 'benign' || test.result === 'normal' ? 'bg-green-100' : test.result === 'pending' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                        {getTestIcon(test.result)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium truncate">{test.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {test.date.toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {doctors[test.doctorId as keyof typeof doctors].name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{selectedTest.type}</CardTitle>
                <CardDescription>
                  {selectedTest.date.toLocaleDateString()} - {doctors[selectedTest.doctorId as keyof typeof doctors].name}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-4">
                <div className="flex flex-col space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Result</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2">
                          {getTestIcon(selectedTest.result)}
                          <span className={`text-lg font-bold capitalize ${
                            selectedTest.result === 'benign' || selectedTest.result === 'normal'
                              ? 'text-green-600'
                              : selectedTest.result === 'malignant' || selectedTest.result === 'abnormal'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                          }`}>
                            {selectedTest.result}
                          </span>
                        </div>
                        {selectedTest.confidence && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Confidence: {selectedTest.confidence}%
                          </p>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Doctor's Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          {selectedTest.notes}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Recommendation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        {selectedTest.type === 'Breast Cancer Screening' && selectedTest.result === 'benign'
                          ? 'Based on your test results, we recommend a follow-up screening in 6-12 months. Continue with regular self-examinations and report any changes to your doctor immediately.'
                          : 'Continue with your regular check-ups as scheduled by your doctor. Maintain a healthy lifestyle and follow any specific recommendations provided by your healthcare provider.'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="details">
                <div className="p-6 text-center text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium mb-1">Detailed Report</h3>
                  <p className="text-sm mb-4">The detailed test results and metrics would be shown here.</p>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Full Report
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="history">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testResults
                      .filter(test => test.type === selectedTest.type)
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .map(test => (
                        <TableRow key={test.id}>
                          <TableCell>{test.date.toLocaleDateString()}</TableCell>
                          <TableCell>{test.type}</TableCell>
                          <TableCell>{doctors[test.doctorId as keyof typeof doctors].name}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTestStatusClass(test.result)}`}>
                              {test.result.charAt(0).toUpperCase() + test.result.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}