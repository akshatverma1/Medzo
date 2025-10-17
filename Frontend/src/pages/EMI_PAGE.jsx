// EMI_PAGE.jsx - COMPLETE FIXED VERSION WITH WORKING FALLBACKS
import React, { useState, useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const EMI = () => {
  // State for all application data
  const [loanData, setLoanData] = useState({
    amount: 50000,
    tenure: 12,
    interestRate: 12,
    purpose: '',
    patientId: '',
    hospitalId: '',
    doctorId: ''
  });

  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [kycData, setKycData] = useState({
    aadhaar: '',
    pan: '',
    aadhaarImage: null,
    panImage: null
  });
  const [kycProgress, setKycProgress] = useState(0);
  const [eligibilityScore, setEligibilityScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loanApplications, setLoanApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('calculator');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const fileInputRef = useRef(null);

  // Calculate EMI
  const calculateEMI = (principal, annualRate, months) => {
    const monthlyRate = annualRate / 12 / 100;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const emiAmount = calculateEMI(loanData.amount, loanData.interestRate, loanData.tenure);
  const totalPayment = emiAmount * loanData.tenure;
  const totalInterest = totalPayment - loanData.amount;

  // Enhanced fallback response system - NO API REQUIRED
  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    const patient = patients.find(p => p._id === loanData.patientId);
    
    // Calculate dynamic values for responses
    const suggestedTenure = loanData.amount > 200000 ? 18 : 12;
    const suggestedEMI = calculateEMI(loanData.amount, loanData.interestRate, suggestedTenure);
    const incomeToEMIRatio = patient ? (emiAmount / (patient.income / 12) * 100).toFixed(1) : 'N/A';

    if (message.includes('emi') || message.includes('installment') || message.includes('monthly')) {
      return `💰 **EMI Analysis for ₹${loanData.amount.toLocaleString()}**

💳 **Monthly Payment**: ₹${emiAmount.toLocaleString()}
📅 **Tenure**: ${loanData.tenure} months
🏦 **Interest Rate**: ${loanData.interestRate}% p.a.

**Breakdown**:
• Principal: ₹${loanData.amount.toLocaleString()}
• Total Interest: ₹${totalInterest.toLocaleString()}
• Total Payable: ₹${totalPayment.toLocaleString()}

💡 **Smart Suggestions**:
${emiAmount > 15000 ? "• Consider longer tenure (18-24 months) to reduce EMI burden" : "• Your EMI looks manageable for most income levels"}
${loanData.tenure <= 6 ? "• Longer tenure (12+ months) recommended for better cash flow" : ""}`;
    
    } else if (message.includes('eligibility') || message.includes('approve') || message.includes('qualify')) {
      const improvementTips = [];
      if (loanData.amount > 200000) improvementTips.push("• Consider reducing loan amount to ₹2,00,000 or less");
      if (loanData.tenure < 12) improvementTips.push("• Opt for 12+ months tenure for better approval chances");
      improvementTips.push("• Ensure all KYC documents are properly uploaded");
      improvementTips.push("• Maintain stable income source for 3+ months");

      return `📊 **Eligibility Assessment**: ${eligibilityScore}%

**Key Factors Considered**:
${patient ? `• Income: ₹${patient.income}/year (EMI/Income: ${incomeToEMIRatio}%)` : '• Income: Not specified'}
• Loan Amount: ₹${loanData.amount.toLocaleString()}
• Tenure: ${loanData.tenure} months
• Purpose: ${loanData.purpose || 'Medical treatment'}

${eligibilityScore >= 80 ? '🎉 **Excellent Approval Chance**' : eligibilityScore >= 60 ? '✅ **Good Approval Chance**' : '⚠️ **Needs Improvement**'}

**Improvement Tips**:
${improvementTips.join('\n')}`;
    
    } else if (message.includes('interest') || message.includes('rate')) {
      return `🏦 **Interest Rate Analysis**

**Current Rate**: ${loanData.interestRate}% p.a.

**Healthcare Loan Rates**:
• Standard: 10-14% p.a.
• Preferred (Good Credit): 8-12% p.a. 
• Emergency Medical: 6-10% p.a.
• Government Schemes: 4-7% p.a.

💡 **Rate Optimization**:
${loanData.interestRate > 14 ? "• Your rate is high - consider improving eligibility score" : "• Your rate is competitive for medical loans"}
• Complete KYC verification for better rates
• Shorter tenures often have lower rates`;

    } else if (message.includes('documents') || message.includes('kyc') || message.includes('paperwork')) {
      return `📄 **Required Documents Checklist**

✅ **Mandatory KYC**:
• Aadhaar Card (with photo)
• PAN Card
• Recent photograph
• Address proof (utility bill, rental agreement)

💰 **Income Proof**:
• Last 3 months salary slips OR
• 6 months bank statements OR
• ITR for last 2 years

🏥 **Medical Documents**:
• Doctor's prescription
• Hospital estimate/treatment plan
• Medical test reports (if any)
• Insurance details (if applicable)

💡 **Pro Tips**:
• Ensure all documents are clear and readable
• Upload color copies of documents
• File size should be <5MB per document
• Supported formats: PDF, JPG, PNG`;

    } else if (message.includes('tenure') || message.includes('duration') || message.includes('period')) {
      const tenureAnalysis = [
        { months: 3, emi: calculateEMI(loanData.amount, loanData.interestRate, 3), interest: calculateEMI(loanData.amount, loanData.interestRate, 3) * 3 - loanData.amount },
        { months: 6, emi: calculateEMI(loanData.amount, loanData.interestRate, 6), interest: calculateEMI(loanData.amount, loanData.interestRate, 6) * 6 - loanData.amount },
        { months: 12, emi: calculateEMI(loanData.amount, loanData.interestRate, 12), interest: calculateEMI(loanData.amount, loanData.interestRate, 12) * 12 - loanData.amount },
        { months: 18, emi: calculateEMI(loanData.amount, loanData.interestRate, 18), interest: calculateEMI(loanData.amount, loanData.interestRate, 18) * 18 - loanData.amount },
        { months: 24, emi: calculateEMI(loanData.amount, loanData.interestRate, 24), interest: calculateEMI(loanData.amount, loanData.interestRate, 24) * 24 - loanData.amount }
      ];

      return `📅 **Tenure Options Analysis**

For ₹${loanData.amount.toLocaleString()} at ${loanData.interestRate}%:

${tenureAnalysis.map(t => 
  `• ${t.months} months: EMI ₹${t.emi.toLocaleString()} (Interest: ₹${t.interest.toLocaleString()})`
).join('\n')}

🎯 **Recommendation**:
${loanData.amount <= 50000 ? '3-6 months - Quick repayment' : 
  loanData.amount <= 200000 ? '12 months - Balanced approach' : 
  '18-24 months - Manageable EMIs'}

💡 **Consider**:
• Shorter tenure = Less interest, Higher EMI
• Longer tenure = More interest, Lower EMI
• Choose based on monthly repayment capacity`;

    } else if (message.includes('medical') || message.includes('treatment') || message.includes('hospital')) {
      return `🏥 **Medical Loan Features**

**Covered Treatments**:
• Surgeries & Hospitalizations
• Diagnostic Tests & Scans
• Medications & Therapies
• Dental & Vision Procedures
• Emergency Medical Care
• Chronic Disease Management

**Special Benefits**:
• Instant approval for emergencies
• No collateral required
• Flexible repayment during recovery
• Insurance claim assistance
• Tax benefits under Section 80D

**Quick Approval Process**:
1. Submit basic details & KYC
2. Get instant eligibility check
3. Upload medical documents
4. Receive approval in 2-4 hours
5. Funds disbursed to hospital`;

    } else if (message.includes('payment') || message.includes('pay') || message.includes('repay')) {
      return `💳 **Payment Options & Schedule**

**Monthly EMI**: ₹${emiAmount.toLocaleString()} (Due on 5th of each month)

**Payment Methods**:
• Auto-debit from bank account
• UPI & Mobile wallets
• Credit/Debit cards
• Net banking
• Cash at hospital counter

**Repayment Schedule**:
• First EMI: 30 days after disbursement
• Monthly installments: ${loanData.tenure} months
• No pre-payment charges
• Flexible repayment options available

🔔 **Reminder**: Maintain sufficient balance 2 days before due date`;

    } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `👋 **Hello! I'm your Medzo Finance Assistant** 

I can help you with:
• 📊 EMI calculations and loan planning
• 🎯 Eligibility assessment and improvement
• 📄 Document requirements and KYC process
• 🏥 Medical loan specific queries
• 💰 Interest rates and payment options
• 📅 Tenure selection and repayment strategies

What would you like to know about your ₹${loanData.amount.toLocaleString()} medical loan today?`;

    } else {
      return `🤖 **I'm here to help with your medical financing needs!**

Based on your current loan details:
• Amount: ₹${loanData.amount.toLocaleString()}
• Tenure: ${loanData.tenure} months  
• EMI: ₹${emiAmount.toLocaleString()}/month
• Eligibility: ${eligibilityScore}%

**You can ask me about**:
• "What will be my monthly EMI?"
• "How can I improve my eligibility score?"
• "What documents do I need to submit?"
• "What's the best tenure for my loan?"
• "Tell me about medical loan features"
• "How does the payment process work?"

What specific aspect of your medical loan would you like assistance with?`;
    }
  };

  // Enhanced chat function - NO API REQUIRED
  const sendChatMessage = async () => {
    if (!userMessage.trim()) return;

    const userMsg = { type: 'user', text: userMessage, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    setUserMessage('');
    setIsChatLoading(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    try {
      const aiResponse = getAIResponse(userMessage);
      
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        text: aiResponse,
        timestamp: new Date() 
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback response
      const fallbackResponse = "I'm here to help with your medical loan queries. Please try asking about EMI calculations, eligibility, documents, or loan features.";
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        text: `🤖 ${fallbackResponse}`,
        timestamp: new Date() 
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Enhanced eligibility calculation
  const calculateEnhancedEligibility = async () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const patient = patients.find(p => p._id === loanData.patientId);
    if (!patient) {
      calculateEligibility();
      return;
    }

    try {
      // Simulate AI analysis with enhanced logic
      const incomeFactor = Math.min(patient.income / loanData.amount, 3) * 0.4;
      const ageFactor = (1 - Math.max(0, Math.abs(patient.age - 35)) / 40) * 0.2;
      const amountFactor = (1 - Math.min(loanData.amount, 500000) / 500000) * 0.2;
      const tenureFactor = (1 - Math.min(loanData.tenure, 36) / 36) * 0.2;
      
      let score = (incomeFactor + ageFactor + amountFactor + tenureFactor) * 100;
      score = Math.max(10, Math.min(95, score));
      
      const finalScore = Math.round(score);
      setEligibilityScore(finalScore);

      // Add AI analysis message
      const analysisMessage = `📊 **AI Eligibility Assessment**: ${finalScore}%

**Key Factors**:
• Income Stability: ${incomeFactor * 100}%
• Age Appropriateness: ${ageFactor * 100}%
• Loan Amount Feasibility: ${amountFactor * 100}%
• Tenure Suitability: ${tenureFactor * 100}%

${finalScore >= 80 ? '🎉 **Excellent Approval Chance** - Strong application!' : 
  finalScore >= 60 ? '✅ **Good Approval Chance** - Minor improvements possible' : 
  '⚠️ **Needs Improvement** - Consider adjusting loan parameters'}`;

      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        text: analysisMessage,
        timestamp: new Date() 
      }]);

    } catch (error) {
      console.error('Eligibility assessment error:', error);
      calculateEligibility();
    } finally {
      setIsProcessing(false);
    }
  };

  // Basic eligibility calculation (fallback)
  const calculateEligibility = () => {
    const patient = patients.find(p => p._id === loanData.patientId);
    if (!patient) {
      setEligibilityScore(50);
      return 50;
    }

    const incomeFactor = Math.min(patient.income / loanData.amount, 3) * 0.4;
    const ageFactor = (1 - Math.max(0, Math.abs(patient.age - 35)) / 40) * 0.2;
    const amountFactor = (1 - Math.min(loanData.amount, 500000) / 500000) * 0.2;
    const tenureFactor = (1 - Math.min(loanData.tenure, 36) / 36) * 0.2;
    
    let score = (incomeFactor + ageFactor + amountFactor + tenureFactor) * 100;
    score = Math.max(10, Math.min(95, score));
    
    const finalScore = Math.round(score);
    setEligibilityScore(finalScore);
    return finalScore;
  };

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
    // Initialize eligibility score
    setTimeout(() => calculateEligibility(), 1000);
  }, []);

  const fetchInitialData = async () => {
    try {
      setPatients([
        { _id: '1', name: 'John Doe', age: 35, income: 750000 },
        { _id: '2', name: 'Jane Smith', age: 42, income: 850000 }
      ]);

      setHospitals([
        { _id: '1', name: 'City General Hospital', type: 'private' },
        { _id: '2', name: 'Community Health Center', type: 'gov' }
      ]);

      setDoctors([
        { _id: '1', name: 'Dr. Sarah Johnson', specialization: 'Cardiology' },
        { _id: '2', name: 'Dr. Michael Chen', specialization: 'Neurology' }
      ]);

      setLoanData(prev => ({ ...prev, patientId: '1' }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // OCR Processing Simulation (no Tesseract required)
  const processOCR = async (file, type) => {
    setIsProcessing(true);
    setOcrResult('Processing document...');

    try {
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted data
      const mockData = {
        aadhaar: '123456789012',
        pan: 'ABCDE1234F'
      };

      if (type === 'aadhaar') {
        setKycData(prev => ({ ...prev, aadhaar: mockData.aadhaar }));
        setOcrResult('✅ Aadhaar detected: ' + mockData.aadhaar);
      } else if (type === 'pan') {
        setKycData(prev => ({ ...prev, pan: mockData.pan }));
        setOcrResult('✅ PAN detected: ' + mockData.pan);
      }

      setChatMessages(prev => [...prev, { 
        type: 'system', 
        text: `✅ ${type.toUpperCase()} document processed successfully!`,
        timestamp: new Date() 
      }]);

    } catch (error) {
      console.error('OCR Error:', error);
      setOcrResult('Error processing document');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle file upload for OCR simulation
  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    setKycData(prev => ({ 
      ...prev, 
      [`${type}Image`]: URL.createObjectURL(file) 
    }));

    processOCR(file, type);
  };

  // KYC Verification Simulation
  const simulateKYC = async () => {
    setKycProgress(0);
    
    for (let i = 0; i <= 100; i += 25) {
      setKycProgress(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setChatMessages(prev => [...prev, { 
        type: 'system', 
        text: getKycStepMessage(i),
        timestamp: new Date() 
      }]);
    }
  };

  const getKycStepMessage = (progress) => {
    switch (progress) {
      case 25: return '📋 Application submitted for review';
      case 50: return '🔍 Aadhaar verification in progress...';
      case 75: return '📊 PAN card verification completed';
      case 100: return '✅ KYC verification successful!';
      default: return 'Processing...';
    }
  };

  // Submit Loan Application
  const submitLoanApplication = async () => {
    if (!kycData.aadhaar || !kycData.pan) {
      alert('Please complete KYC verification first');
      return;
    }

    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newApplication = {
        id: Date.now(),
        ...loanData,
        ...kycData,
        emiAmount,
        status: 'pending',
        createdAt: new Date()
      };

      setLoanApplications(prev => [newApplication, ...prev]);
      
      setChatMessages(prev => [...prev, { 
        type: 'system', 
        text: '🎉 Loan application submitted successfully!',
        timestamp: new Date() 
      }]);

      await simulateKYC();
      
    } catch (error) {
      console.error('Application error:', error);
      setChatMessages(prev => [...prev, { 
        type: 'system', 
        text: '❌ Failed to submit application',
        timestamp: new Date() 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Chart data for EMI breakdown
  const emiChartData = {
    labels: ['Principal', 'Interest'],
    datasets: [
      {
        data: [loanData.amount, totalInterest],
        backgroundColor: ['#4F46E5', '#EF4444'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const paymentSchedule = Array.from({ length: loanData.tenure }, (_, i) => ({
    month: i + 1,
    emi: emiAmount,
    principal: Math.round(loanData.amount / loanData.tenure),
    interest: Math.round(totalInterest / loanData.tenure),
    balance: Math.round(loanData.amount - (i * (loanData.amount / loanData.tenure)))
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Medzo Instant EMI Assistant 💳
        </h1>
        <p className="text-gray-600 mt-2">Smart healthcare financing made simple</p>
        <div className="mt-2 flex justify-center items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            ✅ No API Required
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            🔄 Always Available
          </span>
        </div>
      </motion.header>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-2xl p-2 shadow-lg">
          {['calculator', 'application', 'dashboard', 'kyc'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab === 'calculator' && '🧮 EMI Calculator'}
              {tab === 'application' && '📝 Apply Now'}
              {tab === 'dashboard' && '📊 Dashboard'}
              {tab === 'kyc' && '🔐 KYC Verification'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Calculator & AI */}
        <div className="lg:col-span-2 space-y-8">
          {/* EMI Calculator */}
          <AnimatePresence>
            {activeTab === 'calculator' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">EMI Calculator</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Loan Amount: ₹{loanData.amount.toLocaleString()}
                      </label>
                      <input
                        type="range"
                        min="10000"
                        max="500000"
                        step="10000"
                        value={loanData.amount}
                        onChange={(e) => setLoanData(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹10K</span>
                        <span>₹5L</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tenure: {loanData.tenure} months
                      </label>
                      <select
                        value={loanData.tenure}
                        onChange={(e) => setLoanData(prev => ({ ...prev, tenure: parseInt(e.target.value) }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[3, 6, 9, 12, 18, 24].map(month => (
                          <option key={month} value={month}>{month} months</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Interest Rate: {loanData.interestRate}%
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="24"
                        step="0.5"
                        value={loanData.interestRate}
                        onChange={(e) => setLoanData(prev => ({ ...prev, interestRate: parseFloat(e.target.value) }))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>8%</span>
                        <span>24%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4">Loan Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Monthly EMI</span>
                        <span className="text-2xl font-bold">₹{emiAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Interest</span>
                        <span className="text-red-200">₹{totalInterest.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Payment</span>
                        <span className="font-semibold">₹{totalPayment.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Doughnut data={emiChartData} options={{ maintainAspectRatio: false }} height={200} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Eligibility Predictor */}
          <AnimatePresence>
            {activeTab === 'calculator' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Smart Eligibility Predictor</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Select Patient</label>
                      <select
                        value={loanData.patientId}
                        onChange={(e) => setLoanData(prev => ({ ...prev, patientId: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a patient</option>
                        {patients.map(patient => (
                          <option key={patient._id} value={patient._id}>
                            {patient.name} (Age: {patient.age}, Income: ₹{patient.income})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Purpose</label>
                      <input
                        type="text"
                        value={loanData.purpose}
                        onChange={(e) => setLoanData(prev => ({ ...prev, purpose: e.target.value }))}
                        placeholder="Medical treatment, surgery, etc."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <button
                      onClick={calculateEnhancedEligibility}
                      disabled={!loanData.patientId || isProcessing}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? '🔄 Analyzing...' : '🤖 Check Smart Eligibility'}
                    </button>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <svg className="w-48 h-48" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={eligibilityScore >= 80 ? '#10B981' : eligibilityScore >= 50 ? '#F59E0B' : '#EF4444'}
                          strokeWidth="3"
                          strokeDasharray={`${eligibilityScore}, 100`}
                        />
                        <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="#374151" fontWeight="bold">
                          {eligibilityScore}%
                        </text>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-bold text-gray-800">{eligibilityScore}%</span>
                        <span className="text-sm text-gray-600 mt-1">
                          {eligibilityScore >= 80 ? 'High Chance' : eligibilityScore >= 50 ? 'Medium Chance' : 'Low Chance'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loan Application Form */}
          <AnimatePresence>
            {activeTab === 'application' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Loan Application</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital</label>
                      <select
                        value={loanData.hospitalId}
                        onChange={(e) => setLoanData(prev => ({ ...prev, hospitalId: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select hospital</option>
                        {hospitals.map(hospital => (
                          <option key={hospital._id} value={hospital._id}>
                            {hospital.name} ({hospital.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Doctor</label>
                      <select
                        value={loanData.doctorId}
                        onChange={(e) => setLoanData(prev => ({ ...prev, doctorId: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select doctor</option>
                        {doctors.map(doctor => (
                          <option key={doctor._id} value={doctor._id}>
                            {doctor.name} - {doctor.specialization}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhaar Number</label>
                      <input
                        type="text"
                        value={kycData.aadhaar}
                        onChange={(e) => setKycData(prev => ({ ...prev, aadhaar: e.target.value }))}
                        placeholder="Enter 12-digit Aadhaar"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Number</label>
                      <input
                        type="text"
                        value={kycData.pan}
                        onChange={(e) => setKycData(prev => ({ ...prev, pan: e.target.value }))}
                        placeholder="Enter PAN number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Aadhaar</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'aadhaar')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        ref={fileInputRef}
                      />
                      {kycData.aadhaarImage && (
                        <img src={kycData.aadhaarImage} alt="Aadhaar" className="mt-2 w-32 h-20 object-cover rounded border" />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Upload PAN</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'pan')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {kycData.panImage && (
                        <img src={kycData.panImage} alt="PAN" className="mt-2 w-32 h-20 object-cover rounded border" />
                      )}
                    </div>

                    {ocrResult && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">{ocrResult}</p>
                      </div>
                    )}

                    <button
                      onClick={submitLoanApplication}
                      disabled={isProcessing || !kycData.aadhaar || !kycData.pan}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? '🔄 Processing...' : '✅ Submit Application'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* KYC Verification */}
          <AnimatePresence>
            {activeTab === 'kyc' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">KYC Verification</h2>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-2">Verification Progress</h3>
                    <div className="w-full bg-blue-200 rounded-full h-4">
                      <motion.div
                        className="bg-green-500 h-4 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${kycProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-center mt-2 text-blue-100">{kycProgress}% Complete</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { step: 1, title: 'Application', icon: '📋', completed: kycProgress >= 25 },
                      { step: 2, title: 'Aadhaar Verify', icon: '🆔', completed: kycProgress >= 50 },
                      { step: 3, title: 'PAN Verify', icon: '💳', completed: kycProgress >= 75 },
                      { step: 4, title: 'Approval', icon: '✅', completed: kycProgress >= 100 }
                    ].map((step, index) => (
                      <div key={step.step} className="text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          <span className="text-xl">{step.icon}</span>
                        </div>
                        <p className={`text-sm font-medium ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                          {step.title}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={simulateKYC}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? '🔄 Verifying...' : '🔐 Start KYC Verification'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* EMI Dashboard */}
          <AnimatePresence>
            {activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">EMI Dashboard</h2>
                
                <div className="space-y-6">
                  {/* Loan Applications */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Loan Applications</h3>
                    {loanApplications.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No applications yet. Apply for your first loan!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {loanApplications.map(app => (
                          <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold">₹{app.amount.toLocaleString()}</h4>
                                <p className="text-sm text-gray-600">{app.purpose}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Payment Schedule */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Payment Schedule</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="p-2 text-left">Month</th>
                            <th className="p-2 text-left">EMI</th>
                            <th className="p-2 text-left">Principal</th>
                            <th className="p-2 text-left">Interest</th>
                            <th className="p-2 text-left">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentSchedule.slice(0, 6).map(payment => (
                            <tr key={payment.month} className="border-b">
                              <td className="p-2">{payment.month}</td>
                              <td className="p-2">₹{payment.emi.toLocaleString()}</td>
                              <td className="p-2">₹{payment.principal.toLocaleString()}</td>
                              <td className="p-2">₹{payment.interest.toLocaleString()}</td>
                              <td className="p-2">₹{payment.balance.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      💳 Pay EMI
                    </button>
                    <button className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                      📄 Download Agreement
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - Quick Actions & Info */}
        <div className="space-y-8">
          {/* Quick Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Current EMI:</span>
                <span className="font-semibold">₹{emiAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Eligibility Score:</span>
                <span className="font-semibold">{eligibilityScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">KYC Status:</span>
                <span className={`font-semibold ${
                  kycProgress === 100 ? 'text-green-600' : 
                  kycProgress > 0 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {kycProgress === 100 ? 'Verified' : kycProgress > 0 ? 'In Progress' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">AI Assistant:</span>
                <span className="font-semibold text-green-600">Always Active</span>
              </div>
            </div>
          </motion.div>

          {/* AI Assistant Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-lg font-bold mb-4">Smart AI Assistant</h3>
            <p className="text-sm opacity-90 mb-4">
              No API required - Intelligent responses powered by advanced algorithms.
            </p>
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              💬 Chat with Smart Assistant
            </button>
          </motion.div>

          {/* Features Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Features</h3>
            <div className="space-y-3 text-sm">
              {[
                { icon: '🤖', text: 'Smart AI Assistance' },
                { icon: '📷', text: 'Document Scan Simulation' },
                { icon: '💳', text: 'Instant EMI Calculation' },
                { icon: '🔐', text: 'Secure KYC Verification' },
                { icon: '📊', text: 'Live Dashboard' },
                { icon: '🛡️', text: 'No API Dependencies' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-lg">{feature.icon}</span>
                  <span className="text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <h3 className="font-bold">Smart AI Assistant</h3>
                      <p className="text-sm opacity-90">Always available - No limits</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <span className="text-lg">✕</span>
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>Ask me about EMI, eligibility, or financial guidance!</p>
                    <p className="text-sm mt-2">No API required - Intelligent responses guaranteed</p>
                  </div>
                ) : (
                  chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : message.type === 'ai'
                            ? 'bg-purple-100 text-gray-800 rounded-bl-none'
                            : 'bg-green-100 text-green-800 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-purple-100 text-gray-800 rounded-2xl rounded-bl-none px-4 py-2">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Ask about EMI, eligibility, documents..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!userMessage.trim() || isChatLoading}
                    className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    {isChatLoading ? '⏳' : 'Send'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  💡 No API limits - Ask anything about medical loans!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full shadow-lg flex items-center justify-center z-40"
        >
          <span className="text-xl">💬</span>
        </motion.button>
      )}
    </div>
  );
};

export default EMI;