import React, { useState, useEffect } from "react";
import { BACKEND_URL, APP_CONFIG } from "./config";
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import UserProfile from './UserProfile';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function toXY(lossArr = [], epochTimes = [], { step = 1, addOrigin = true } = {}) {
  if (!lossArr.length) return []; // Default loss of 2.0 at time=0
  let t = 0;
  const pts = [];
  if (addOrigin) {
    pts.push({ x: 0, y: 5.0 }); // starting point at time=0
  }
  for (let i = 0; i < lossArr.length; i++) {
    const dt = Number(epochTimes?.[i] ?? step);
    t += isFinite(dt) ? dt : step;
    // keep 1 decimal for readability
    pts.push({ x: Math.round(t * 10) / 10, y: lossArr[i] });
  }
  return pts;
}

// Backend configuration is now imported from config.js
// To change the backend URL, edit the BACKEND_URL in config.js
function LossChart({
  lossData,
  timeData,
  trainingMethod,
  euryLossData,
  traditionalLossData,
  euryTimeData,
  traditionalTimeData,
}) {
  const datasets = [];

  // Eury (completed)
  if (euryLossData?.length) {
    datasets.push({
      label: "Eury - Completed",
      data: toXY(euryLossData, euryTimeData, { step: 1, addOrigin: true }),
      borderColor: "#3498db",
      backgroundColor: "rgba(52, 152, 219, 0.1)",
      borderWidth: 3,
      fill: false,
      tension: 0.4,
      pointBackgroundColor: "#3498db",
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
      pointRadius: 4,
      parsing: false,   // IMPORTANT: use x/y objects
      spanGaps: true,
    });
  }

  // Traditional (completed)
  if (traditionalLossData?.length) {
    datasets.push({
      label: "Traditional - Completed",
      data: toXY(traditionalLossData, traditionalTimeData, { step: 1, addOrigin: true }),
      borderColor: "#e74c3c",
      backgroundColor: "rgba(231, 76, 60, 0.1)",
      borderWidth: 3,
      fill: false,
      tension: 0.4,
      pointBackgroundColor: "#e74c3c",
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
      pointRadius: 4,
      parsing: false,
      spanGaps: true,
    });
  }

  // Current training run (dashed)
  // if (lossData?.length) {
  const isEury = trainingMethod === "eury";
  datasets.push({
    label: `${isEury ? "Eury" : "Traditional"} - Training Now`,
    data: toXY(lossData, timeData, { step: 1, addOrigin: true }),
    borderColor: isEury ? "#2980b9" : "#c0392b",
    backgroundColor: isEury ? "rgba(41, 128, 185, 0.2)" : "rgba(192, 57, 43, 0.2)",
    borderWidth: 3,
    fill: false,
    tension: 0.4,
    pointBackgroundColor: isEury ? "#2980b9" : "#c0392b",
    pointBorderColor: "#ffffff",
    pointBorderWidth: 2,
    pointRadius: 4,
    borderDash: [5, 5],
    parsing: false,
    spanGaps: true,
  });
  // }

  // if (datasets.length === 0) return null;

  const data = { datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "nearest", intersect: false },
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          // nice tooltip that shows time & loss
          label: (ctx) => {
            const { x, y } = ctx.raw || {};
            return ` ${ctx.dataset.label}: loss=${y}, t=${x}s`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        title: { display: true, text: "Cumulative Time (s)" },
        grid: { drawOnChartArea: true },
      },
      y: {
        title: { display: true, text: "Loss" },
        grid: { drawOnChartArea: true },
      },
    },
    elements: {
      line: { cubicInterpolationMode: "monotone" },
      point: { hitRadius: 10, hoverRadius: 6 },
    },
  };

  return (
    <div style={{ height: 360 }}>
      <Line data={data} options={options} />
    </div>
  );
}


function EuryIntro({ onStart }) {
  return (
    <div style={{ maxWidth: 600, margin: '2em auto', background: 'white', padding: '2em', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', border: '1px solid #e1e8ed' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>What is Eury?</h1>
      <p style={{ color: '#2c3e50', fontSize: '1.1em', lineHeight: '1.6' }}>
        <strong>Eury</strong> is a model accelerator that speeds up training by <strong>10-40x</strong> without any loss in performance.
      </p>
      <ul style={{ color: '#2c3e50', lineHeight: '1.6' }}>
        <li>Works with <strong>all model types</strong>: image, text, and multi-modal.</li>
        <li>Supports both <strong>custom models</strong> and <strong>predefined models</strong>.</li>
        <li>Major <strong>cost</strong> and <strong>time saver</strong> for machine learning engineers and researchers.</li>
        <li>Easy to use: just select your model and dataset, and Eury does the rest!</li>
      </ul>
      <p style={{ color: '#2c3e50', fontSize: '1.1em', lineHeight: '1.6' }}>
        Eury is designed to make large-scale training accessible and efficient for everyone.
      </p>
      
      {/* CLI Tool Information */}
      <div style={{ 
        marginTop: '2em', 
        padding: '1.5em', 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #e1e8ed', 
        borderRadius: '8px',
        color: '#2c3e50'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '1.2em' }}>
          💻 Command Line Interface
        </h3>
        <p style={{ margin: '0 0 10px 0', fontSize: '0.95em', lineHeight: '1.5', color: '#2c3e50' }}>
          Prefer the command line? Eury is also available as a Python CLI tool with the same powerful features.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <code style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '6px 10px', 
            borderRadius: '4px',
            color: '#2c3e50',
            fontSize: '0.9em',
            border: '1px solid #e1e8ed'
          }}>
            pip install eury-cli
          </code>
          <a 
            href="https://pypi.org/project/eury-cli/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#3498db',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '0.9em'
            }}
          >
            📦 View on PyPI →
          </a>
        </div>
      </div>
      
      <button onClick={() => {
        onStart();
        window.history.pushState({}, '', '/?page=train');
      }} style={{ marginTop: '2em', padding: '0.5em 2em', fontSize: '1.1em' }}>Start Training</button>
    </div>
  );
}

function TestModel({ modelName, datasetName, trainingMethod, isCustomModel = false, modelArchitecture = "transformer" }) {
  const [input, setInput] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [generatedText, setGeneratedText] = useState(null);
  const [error, setError] = useState(null);

  // Class labels for different datasets
  const classLabelsMap = {
    "yahoo_answers_topics": [
      "Society & Culture", "Science & Mathematics", "Health", "Education & Reference",
      "Computers & Internet", "Sports", "Business & Finance", "Entertainment & Music",
      "Family & Relationships", "Politics & Government"
    ],
    "ag_news": ["World", "Sports", "Business", "Sci/Tech"],
    "emotion": ["joy", "sadness", "anger", "fear", "surprise", "love"],
    "imdb": ["Negative", "Positive"],
    "yelp_polarity": ["Negative", "Positive"],
    "amazon_polarity": ["Negative", "Positive"],
    "rotten_tomatoes": ["Negative", "Positive"],
    "trec": ["Description", "Entity", "Abbreviation", "Human", "Location", "Numeric"],
    "yelp_review_full": ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    "dbpedia_14": ["Company", "EducationalInstitution", "Artist", "Athlete", "OfficeHolder", 
                   "MeanOfTransportation", "Building", "NaturalPlace", "Village", "Animal", 
                   "Plant", "Album", "Film", "WrittenWork"],
    "go_emotions": ["admiration", "amusement", "anger", "annoyance", "approval", "caring", 
                   "confusion", "curiosity", "desire", "disappointment", "disapproval", 
                   "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief", 
                   "joy", "love", "nervousness", "optimism", "pride", "realization", 
                   "relief", "remorse", "sadness", "surprise", "neutral"],
    "banking77": ["General inquiries", "Account management", "Card services", "Loan services", 
                  "Investment services", "Insurance services", "Fraud and security", 
                  "Technical support", "Mobile banking", "Online banking", "ATM services", 
                  "Branch services", "International services", "Payment services", 
                  "Credit services", "Debit services", "Savings accounts", "Checking accounts", 
                  "Mortgage services", "Personal loans", "Business loans", "Student loans", 
                  "Auto loans", "Home equity loans", "Credit cards", "Debit cards", 
                  "Prepaid cards", "Gift cards", "Travel cards", "Business cards", 
                  "Rewards cards", "Cash back cards", "Balance transfer cards", 
                  "Secured cards", "Unsecured cards", "Co-branded cards", "Affinity cards", 
                  "Corporate cards", "Fleet cards", "Purchasing cards", "Virtual cards", 
                  "Contactless cards", "Chip cards", "Magnetic stripe cards", "EMV cards", 
                  "NFC cards", "QR code cards", "Barcode cards", "Smart cards", 
                  "Memory cards", "Processor cards", "Contact cards", "Contactless cards", 
                  "Dual interface cards", "Hybrid cards", "Combo cards", "Multi-application cards", 
                  "Single application cards", "Open loop cards", "Closed loop cards", 
                  "Private label cards", "White label cards", "Co-branded cards", 
                  "Affinity cards", "Corporate cards", "Fleet cards", "Purchasing cards", 
                  "Virtual cards", "Contactless cards", "Chip cards", "Magnetic stripe cards", 
                  "EMV cards", "NFC cards", "QR code cards", "Barcode cards", "Smart cards"]
  };

  const classLabels = classLabelsMap[datasetName] || [];

  // Helper function to convert class numbers to string labels
  const getClassLabel = (label) => {
    if (!label) return label;
    // If it's already a string label, return it
    if (classLabels.includes(label)) {
      return label;
    }
    // If it's a class number, convert it
    const classNum = parseInt(label.replace(/[^\d]/g, ''));
    if (!isNaN(classNum) && classNum < classLabels.length) {
      return classLabels[classNum];
    }
    // Fallback to original label
    return label;
  };

  const handleTest = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);
    setGeneratedText(null);
    const formData = new FormData();
    formData.append("model_name", modelName);
    formData.append("user_input", input);
    formData.append("dataset_name", datasetName);
    formData.append("training_method", trainingMethod); // Add training method to form data
    formData.append("custom", isCustomModel ? "true" : "false"); // Add custom parameter
    formData.append("model_type", modelArchitecture); // Add model architecture
    try {
      // Skip authentication - allow predictions without login
      const res = await fetch(`${BACKEND_URL}/predict`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (data.generated_text !== undefined) {
        // GPT model response
        setGeneratedText(data.generated_text);
        if (data.note) {
          setError(data.note); // Using error state to display the note
        }
      } else {
        // Transformer model response
        setPrediction(data.prediction);
        if (data.note) {
          setError(data.note); // Using error state to display the note
        }
      }
    } catch (err) {
      setError("Error during prediction. Please try again.");
    }
  };

  return (
    <div style={{ 
      background: 'white', 
      padding: '25px', 
      borderRadius: '12px', 
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e1e8ed'
    }}>
      <h3 style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '1.4em' }}>
        {modelArchitecture === "gpt" ? '💬 Test GPT Model' : '🧪 Test Trained Model'}
      </h3>
      
      {trainingMethod === 'eury' && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#e8f5e8', 
          borderRadius: '8px',
          border: '1px solid #c3e6c3',
          color: '#2d5a2d'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            {modelArchitecture === "gpt" ? 'ℹ️ GPT Eury Model Testing' : 
             isCustomModel ? 'ℹ️ Custom Eury Model Testing' : 'ℹ️ Eury Model Testing'}
          </div>
          <div style={{ fontSize: '0.9em' }}>
            {modelArchitecture === "gpt" 
              ? 'GPT Eury training optimizes text generation. The test feature will generate text continuations based on your input.'
              : isCustomModel 
                ? 'Custom Eury training provides predictions during training. The test feature will use the base BERT model for inference.'
                : 'Eury training provides predictions during training. The test feature will use the base model for inference. For best results, use traditional training method for model testing.'
            }
          </div>
        </div>
      )}
      
      <form onSubmit={handleTest} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>
            {modelArchitecture === "gpt" ? "Text Prompt:" : "Input Text:"}
          </label>
          {modelArchitecture === "gpt" ? (
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter a text prompt for the GPT model to continue..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '1em',
                backgroundColor: 'white',
                color: '#2c3e50',
                transition: 'border-color 0.2s',
                cursor: 'text',
                resize: 'vertical'
              }}
            />
          ) : (
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter text for prediction..."
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '1em',
                backgroundColor: 'white',
                color: '#2c3e50',
                transition: 'border-color 0.2s',
                cursor: 'text'
              }}
            />
          )}
        </div>
        <button 
          type="submit" 
          style={{
            padding: '12px 24px',
            fontSize: '1em',
            fontWeight: 'bold',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          {modelArchitecture === "gpt" ? '✨ Generate Text' : '🔮 Predict'}
        </button>
      </form>
      
      {error && (
        <div style={{ 
          color: '#e74c3c', 
          marginBottom: '15px', 
          padding: '12px', 
          backgroundColor: '#fdf2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '6px' 
        }}>
          {error}
        </div>
      )}
      
      {/* GPT Text Generation Results */}
      {generatedText !== null && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f0f8ff', 
          borderRadius: '8px',
          border: '1px solid #b3d9ff'
        }}>
          <div style={{ color: '#2c5aa0', fontWeight: 'bold', marginBottom: '8px' }}>
            ✨ Generated Text:
          </div>
          <div style={{ 
            padding: '12px',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #e1e8ed',
            fontFamily: 'Georgia, serif',
            fontSize: '1.05em',
            lineHeight: '1.6',
            color: '#2c3e50'
          }}>
            <div style={{ fontWeight: 'bold', color: '#666', fontSize: '0.9em', marginBottom: '8px' }}>
              Your prompt:
            </div>
            <div style={{ marginBottom: '12px', fontStyle: 'italic' }}>
              "{input}"
            </div>
            <div style={{ fontWeight: 'bold', color: '#666', fontSize: '0.9em', marginBottom: '8px' }}>
              Generated continuation:
            </div>
            <div>
              {generatedText || <em style={{ color: '#999' }}>No text generated</em>}
            </div>
          </div>
          {error && error.includes("untrained") && (
            <div style={{ color: '#f39c12', marginTop: '10px', fontSize: '0.9em' }}>
              ⚠️ <strong>Note:</strong> {error}
            </div>
          )}
        </div>
      )}

      {/* Transformer Classification Results */}
      {prediction !== null && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f0f8ff', 
          borderRadius: '8px',
          border: '1px solid #b3d9ff'
        }}>
          <div style={{ color: '#2c5aa0', fontWeight: 'bold', marginBottom: '8px' }}>
            🎯 Prediction Results:
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Predicted Class:</strong> {prediction}
          </div>
          {classLabels[prediction] && (
            <div style={{ color: '#2c5aa0' }}>
              <strong>Predicted Category:</strong> {classLabels[prediction]}
            </div>
          )}
          {error && error.includes("untrained") && (
            <div style={{ color: '#f39c12', marginTop: '10px', fontSize: '0.9em' }}>
              ⚠️ <strong>Note:</strong> {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TrainStream() {
  const [logs, setLogs] = useState("");
  const [results, setResults] = useState("");
  const [isTraining, setIsTraining] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedDataset, setSelectedDataset] = useState("");
  const [selectedTrainingMethod, setSelectedTrainingMethod] = useState("eury");
  const [completedTrainingMethod, setCompletedTrainingMethod] = useState(null); // Track the method used for completed training
  const [modelType, setModelType] = useState("pretrained");
  const [modelArchitecture, setModelArchitecture] = useState("transformer"); // transformer or gpt
  const [formError, setFormError] = useState("");
  
  // GPT models defined directly in frontend
  const gptModels = {
    // GPT-2 family
    "gpt2": {"name": "GPT-2", "size": "124M", "description": "OpenAI GPT-2 base model"},
    "gpt2-medium": {"name": "GPT-2 Medium", "size": "355M", "description": "OpenAI GPT-2 medium model"},
    "gpt2-large": {"name": "GPT-2 Large", "size": "774M", "description": "OpenAI GPT-2 large model"},
    "distilgpt2": {"name": "DistilGPT-2", "size": "82M", "description": "Lightweight GPT-2"},
    
    // EleutherAI GPT family
    "EleutherAI/gpt-neo-125M": {"name": "GPT-Neo 125M", "size": "125M", "description": "EleutherAI GPT-Neo 125M"},
    "EleutherAI/gpt-neo-1.3B": {"name": "GPT-Neo 1.3B", "size": "1.3B", "description": "EleutherAI GPT-Neo 1.3B"},
    "EleutherAI/gpt-j-6B": {"name": "GPT-J 6B", "size": "6B", "description": "EleutherAI GPT-J 6B"},
    
    // OPT (Meta)
    "facebook/opt-125m": {"name": "OPT 125M", "size": "125M", "description": "Meta OPT 125M"},
    "facebook/opt-350m": {"name": "OPT 350M", "size": "350M", "description": "Meta OPT 350M"},
    "facebook/opt-1.3b": {"name": "OPT 1.3B", "size": "1.3B", "description": "Meta OPT 1.3B"},
    
    // BLOOM
    "bigscience/bloom-560m": {"name": "BLOOM 560M", "size": "560M", "description": "BigScience BLOOM 560M"},
    "bigscience/bloom-1b1": {"name": "BLOOM 1.1B", "size": "1.1B", "description": "BigScience BLOOM 1.1B"},
    
    // Qwen
    "Qwen/Qwen-1_8B": {"name": "Qwen 1.8B", "size": "1.8B", "description": "Alibaba Qwen 1.8B", "trust_remote_code": true},
    "Qwen/Qwen2-0.5B": {"name": "Qwen2 0.5B", "size": "0.5B", "description": "Alibaba Qwen2 0.5B", "trust_remote_code": true},
  };
  const [queueStatus, setQueueStatus] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [showLoraSection, setShowLoraSection] = useState(false);
  
  // Loss data tracking
  const [currentLossData, setCurrentLossData] = useState([]);
  const [euryLossData, setEuryLossData] = useState([]);
  const [traditionalLossData, setTraditionalLossData] = useState([]);
  const [lastModelConfig, setLastModelConfig] = useState(null);
  const [trainingStartTime, setTrainingStartTime] = useState(null);
  const [lastEpochTime, setLastEpochTime] = useState(null);
  const [currentTimeData, setCurrentTimeData] = useState([]);
  const [euryTimeData, setEuryTimeData] = useState([]);
  const [traditionalTimeData, setTraditionalTimeData] = useState([]);

  // Class labels for different datasets
  const classLabelsMap = {
    "yahoo_answers_topics": [
      "Society & Culture", "Science & Mathematics", "Health", "Education & Reference",
      "Computers & Internet", "Sports", "Business & Finance", "Entertainment & Music",
      "Family & Relationships", "Politics & Government"
    ],
    "ag_news": ["World", "Sports", "Business", "Sci/Tech"],
    "emotion": ["joy", "sadness", "anger", "fear", "surprise", "love"],
    "imdb": ["Negative", "Positive"],
    "yelp_polarity": ["Negative", "Positive"],
    "amazon_polarity": ["Negative", "Positive"],
    "rotten_tomatoes": ["Negative", "Positive"],
    "trec": ["Description", "Entity", "Abbreviation", "Human", "Location", "Numeric"],
    "yelp_review_full": ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    "dbpedia_14": ["Company", "EducationalInstitution", "Artist", "Athlete", "OfficeHolder", 
                   "MeanOfTransportation", "Building", "NaturalPlace", "Village", "Animal", 
                   "Plant", "Album", "Film", "WrittenWork"],
    "go_emotions": ["admiration", "amusement", "anger", "annoyance", "approval", "caring", 
                   "confusion", "curiosity", "desire", "disappointment", "disapproval", 
                   "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief", 
                   "joy", "love", "nervousness", "optimism", "pride", "realization", 
                   "relief", "remorse", "sadness", "surprise", "neutral"],
    "banking77": ["General inquiries", "Account management", "Card services", "Loan services", 
                  "Investment services", "Insurance services", "Fraud and security", 
                  "Technical support", "Mobile banking", "Online banking", "ATM services", 
                  "Branch services", "International services", "Payment services", 
                  "Credit services", "Debit services", "Savings accounts", "Checking accounts", 
                  "Mortgage services", "Personal loans", "Business loans", "Student loans", 
                  "Auto loans", "Home equity loans", "Credit cards", "Debit cards", 
                  "Prepaid cards", "Gift cards", "Travel cards", "Business cards", 
                  "Rewards cards", "Cash back cards", "Balance transfer cards", 
                  "Secured cards", "Unsecured cards", "Co-branded cards", "Affinity cards", 
                  "Corporate cards", "Fleet cards", "Purchasing cards", "Virtual cards", 
                  "Contactless cards", "Chip cards", "Magnetic stripe cards", "EMV cards", 
                  "NFC cards", "QR code cards", "Barcode cards", "Smart cards", 
                  "Memory cards", "Processor cards", "Contact cards", "Contactless cards", 
                  "Dual interface cards", "Hybrid cards", "Combo cards", "Multi-application cards", 
                  "Single application cards", "Open loop cards", "Closed loop cards", 
                  "Private label cards", "White label cards", "Co-branded cards", 
                  "Affinity cards", "Corporate cards", "Fleet cards", "Purchasing cards", 
                  "Virtual cards", "Contactless cards", "Chip cards", "Magnetic stripe cards", 
                  "EMV cards", "NFC cards", "QR code cards", "Barcode cards", "Smart cards"]
  };

  // Function to handle dataset selection
  const handleDatasetChange = (datasetName) => {
    console.log('Dataset changed to:', datasetName);
    setSelectedDataset(datasetName);
  };

  // Function to handle training method selection
  const handleTrainingMethodChange = (trainingMethod) => {
    setSelectedTrainingMethod(trainingMethod);
  };

  // Function to parse loss values from log content
  const parseLossFromLog = (content) => {
    // Look for various loss patterns in the logs
    // Note: lossPatterns array is no longer used directly - we use trainingLossPatterns below
    // to ensure we only capture training losses, not validation/eval losses

    // For GPT models, prioritize training loss over validation loss
    // Check for GPT format first and return training loss if available
    const gptTrainMatch = content.match(/train loss\/token[:\s]*([0-9]+\.?[0-9]*)/i);
    if (gptTrainMatch && gptTrainMatch[1]) {
      const trainLoss = parseFloat(gptTrainMatch[1]);
      if (!isNaN(trainLoss) && trainLoss < 100) {
        return trainLoss;
      }
    }

    // Check for other training loss patterns (excluding validation/eval patterns)
    const trainingLossPatterns = [
      /training loss[:\s]*([0-9]+\.?[0-9]*)/i,
      /train_loss[:\s]*([0-9]+\.?[0-9]*)/i,
      /avg_loss[:\s]*([0-9]+\.?[0-9]*)/i,
      /epoch \d+[^\n]*loss[:\s]*([0-9]+\.?[0-9]*)/i
    ];

    for (const pattern of trainingLossPatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        const lossValue = parseFloat(match[1]);
        if (!isNaN(lossValue) && lossValue < 100) { // Basic validation
          return lossValue;
        }
      }
    }
    return null;
  };



  // Function to check queue status
  const checkQueueStatus = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/queue-status`);
      if (response.ok) {
        const status = await response.json();
        setQueueStatus(status);
      }
    } catch (error) {
      console.error("Error checking queue status:", error);
    }
  };

  // Check queue status on component mount and periodically
  React.useEffect(() => {
    checkQueueStatus();
    const interval = setInterval(checkQueueStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Parameter validation function
  function validateParams(formData) {
    // Check if pretrained is enabled
    const pretrained = formData.get("pretrained");
    if (pretrained !== "true") {
      setFormError("Currently only supports pretrained models.");
      return false;
    }
    
    // For custom models, validate required parameters
    const custom = formData.get("custom");
    if (custom === "true") {
      const modelConfig = formData.get("model_config");
      if (!modelConfig) {
        setFormError("Custom model configuration is required.");
        return false;
      }
    } else {
      // For pre-trained models, check if model is selected
      const modelName = formData.get("model_name");
      if (!modelName) {
        setFormError("Please select a pre-trained model.");
        return false;
      }
    }
    
    // Check if dataset is selected
    const datasetName = formData.get("dataset_name");
    if (!datasetName) {
      setFormError("Please select a dataset.");
      return false;
    }
    
    setFormError("");
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLogs("");
    setResults("");
    setIsTraining(true);
    setFormError("");
    setCompletedTrainingMethod(null); // Reset when starting new training

    const form = e.target;
    const formData = new FormData(form);
    
    // Handle model architecture
    const modelArchitecture = formData.get("model_architecture") || "transformer";
    formData.set("model_type_arch", modelArchitecture);
    
    // Handle model type and name
    const modelType = formData.get("model_type");
    if (modelType === "custom") {
      // For custom models, we don't need model_name, but we need custom parameters
      formData.delete("model_name");
      formData.set("custom", "true");
      
      // Handle pretrained checkbox for custom models
      const pretrained = formData.get("pretrained") === "on";
      formData.set("pretrained", pretrained ? "true" : "false");
      
      // Add custom model configuration
      const customConfig = {
        vocab_size: parseInt(formData.get("vocab_size") || "30522"),
        d_model: parseInt(formData.get("d_model") || "768"),
        nhead: parseInt(formData.get("nhead") || "12"),
        num_layers: parseInt(formData.get("num_layers") || "12"),
        max_len: parseInt(formData.get("max_len") || "512"),
        pad_token_id: parseInt(formData.get("pad_token_id") || "0")
      };
      formData.set("model_config", JSON.stringify(customConfig));
    } else {
      // For pre-trained models
      formData.set("custom", "false");
      setSelectedModel(formData.get("model_name"));
      
      // Handle pretrained checkbox for pre-trained models
      const pretrained = formData.get("pretrained") === "on";
      formData.set("pretrained", pretrained ? "true" : "false");
    }
    
    // Handle fast inference for GPT models
    if (modelArchitecture === "gpt") {
      const fastInference = formData.get("fast_dwl_inference") === "on";
      formData.set("fast_dwl_inference", fastInference ? "true" : "false");
      
      // For GPT models, use a default dataset if none selected
      if (!formData.get("dataset_name")) {
        formData.set("dataset_name", "yahoo_answers_topics");
      }
    } else {
      // For transformer models, ensure fast inference is false
      formData.set("fast_dwl_inference", "false");
    }
    
    // Set selectedModel for custom models too (use a default model name for testing)
    if (modelType === "custom") {
      setSelectedModel("bert-base-uncased"); // Default model for custom model testing
    }
    
    // Handle LoRA configuration
    const applyLora = formData.get("apply_lora") === "on";
    formData.set("apply_lora", applyLora ? "true" : "false");
    
    if (applyLora) {
      const loraConfig = {
        r: parseInt(formData.get("lora_r") || "8"),
        alpha: parseInt(formData.get("lora_alpha") || "16"),
        dropout: parseFloat(formData.get("lora_dropout") || "0.1"),
        target_modules: formData.get("lora_target_modules") || "q_proj,v_proj"
      };
      formData.set("lora_config_dict", JSON.stringify(loraConfig));
    }

    // Debug: Log what we're sending
    console.log("Form data being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Convert class name to class number for custom sample label
    const customSampleLabel = formData.get("custom_sample_label");
    if (customSampleLabel && selectedDataset) {
      const classLabels = classLabelsMap[selectedDataset] || [];
      const classIndex = classLabels.indexOf(customSampleLabel);
      if (classIndex !== -1) {
        formData.set("custom_sample_label", classIndex.toString());
      }
    }
    
    // Remove empty custom sample fields to prevent validation errors
    const customSampleText = formData.get("custom_sample_text");
    if (!customSampleText || customSampleText.trim() === "") {
      formData.delete("custom_sample_text");
      formData.delete("custom_sample_label");
    }
    
    // Ensure learning rate is properly formatted
    const learningRate = formData.get("learning_rate");
    if (learningRate && !isNaN(parseFloat(learningRate))) {
      formData.set("learning_rate", parseFloat(learningRate).toString());
    }
    
    // Set num_classes based on selected dataset
    const datasetName = formData.get("dataset_name");
    if (datasetName && classLabelsMap[datasetName]) {
      const numClasses = classLabelsMap[datasetName].length;
      formData.set("num_classes", numClasses.toString());
    }

    // Validate parameters
    if (!validateParams(formData)) {
      setIsTraining(false);
      return;
    }

    // Store the training method that will be used for this training session
    const trainingMethodUsed = formData.get("training_method");

    // Use fetch to POST to /train/stream and read the response as a stream
    try {
      console.log("Sending request to:", `${BACKEND_URL}/train/stream`);
      
      // Skip authentication - allow training without login
      const response = await fetch(`${BACKEND_URL}/train/stream`, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        // Try to get error details
        let errorDetails = "";
        try {
          const errorData = await response.json();
          errorDetails = JSON.stringify(errorData, null, 2);
        } catch (e) {
          errorDetails = await response.text();
        }
        
        console.error("Backend error details:", errorDetails);
        throw new Error(`HTTP error! status: ${response.status}\nDetails: ${errorDetails}`);
      }

      if (!response.body) {
        setLogs("No response body from backend.");
        setIsTraining(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let logBuffer = "";
      let temp = [];
      let tempTime = [];

      setCurrentLossData([]); // Reset current loss data
      setCurrentTimeData([]); // Reset time data  
      let startTime=Date.now();
      let lastTime=null;
      outerloop:while (true) {
        const { value, done } = await reader.read();
        if (done) break outerloop;
        logBuffer += decoder.decode(value, { stream: true });
        // SSE format: lines starting with "data: "
        const lines = logBuffer.split("\n");
        let newLogs = "";
        let newResults = "";
        for (const line of lines) {
          if (line.includes("Training complete")) {
            console.log("complete");
            break outerloop;
          }
          if (line.startsWith("data: ")) {
            const content = line.replace("data: ", "");

            
            // Parse loss values from the content
            const lossValue = parseLossFromLog(content);
            if (lossValue !== null) {
              setCurrentLossData(prev => [...prev, lossValue]);
              temp = [...temp, lossValue];
              // Calculate time since last epoch (per-epoch time)
              const currentTime = Date.now();
              if (lastTime === null) {
                // First epoch of this training run - start from training start time
                const epochDuration = (currentTime - startTime) / 1000;
                setCurrentTimeData(prev => [...prev, epochDuration]);
                tempTime = [...tempTime, epochDuration];
                lastTime = currentTime;
              } else {
                // Subsequent epochs - measure time since last epoch
                const epochDuration = (currentTime - lastTime) / 1000;
                setCurrentTimeData(prev => [...prev, epochDuration]);
                tempTime = [...tempTime, epochDuration];
                lastTime = currentTime;
              }
            }
            
            // Check if this is a results section
            if (content.includes("Sample Results and Predictions:") || 
                content.includes("Sample Text Examples with Predictions:") ||
                content.includes("First 10 predictions:") ||
                content.includes("Last 10 predictions:") ||
                content.includes("Unique predicted classes:") ||
                content.includes("Prediction distribution:") ||
                content.includes("Calculated accuracy:") ||
                content.includes("Text (truncated)") ||
                content.includes("True") && content.includes("Pred") ||
                content.includes("✓") || content.includes("✗") ||
                content.includes("Class") ||
                content.includes("Society & Culture") ||
                content.includes("Science & Mathematics") ||
                content.includes("Health") ||
                content.includes("Education") ||
                content.includes("World") ||
                content.includes("Sports") ||
                content.includes("Business") ||
                content.includes("Negative") ||
                content.includes("Positive")) {
              newResults += content + "\n";
            } else {
              newLogs += content + "\n";
            }
          }
        }
        setLogs((prev) => prev + newLogs);
        setResults((prev) => prev + newResults);
        logBuffer = lines[lines.length - 1]; // keep incomplete line for next chunk
      }
      
      // Set the completed training method when training finishes successfully
      setCompletedTrainingMethod(trainingMethodUsed);
      console.log(trainingMethodUsed);
      console.log('method result: ' + (trainingMethodUsed.trim() === 'eury'));
      console.log("Current loss data length:", currentLossData.length);
      console.log("Current loss temp data length:", temp.length);
      // Save loss data based on training method
      if (trainingMethodUsed.trim() === 'eury') {
        console.log('set eury data');
        console.log("Current loss data length:", currentLossData.length);
        setEuryLossData([...currentLossData]);
        setEuryLossData([...temp]);
        setEuryTimeData([...currentTimeData]);
        setEuryTimeData([...tempTime]);
        console.log('eury data saved');
      } else {
        console.log('set traditional data');
        console.log("Current loss data length:", currentLossData.length);
        setTraditionalLossData([...currentLossData]);
        setTraditionalLossData([...temp]);
        setTraditionalTimeData([...currentTimeData]);
        setTraditionalTimeData([...tempTime]);
        console.log('traditional data saved');
      }
      setCurrentLossData([]); // Reset current loss data
      setCurrentTimeData([]); // Reset time data  
    } catch (error) {
      console.error("Training error:", error);
      setLogs(`Error connecting to backend: ${error.message}\n\nPlease make sure the backend server is running at ${BACKEND_URL}`);
    }
    setIsTraining(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px', fontSize: '2.2em' }}>
        Eury Model Trainer
      </h2>
      
      {/* Queue Status Display */}
      {queueStatus && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '12px', 
          background: queueStatus.active_job.id ? '#fff3cd' : '#d1ecf1', 
          border: `1px solid ${queueStatus.active_job.id ? '#ffeaa7' : '#bee5eb'}`, 
          borderRadius: '8px',
          color: '#0c5460',
          fontSize: '0.9em'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>🖥️ GPU:</strong> {queueStatus.gpu_available ? '✅ Free' : '❌ Busy'}
            </div>
            <div>
              <strong>📊 Queue:</strong> {queueStatus.queue_size} waiting
            </div>
          </div>
          {queueStatus.active_job.id && (
            <div style={{ marginTop: '8px', fontSize: '0.85em' }}>
              <strong>🔄 Training:</strong> Job {queueStatus.active_job.id.slice(0, 8)}...
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e1e8ed'
      }}>
        
        {/* Training Method - Top */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#2c3e50' }}>
            Training Method:
          </label>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px',
            padding: '15px',
            border: '2px solid #e1e8ed',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 16px', borderRadius: '6px', transition: 'all 0.2s' }}>
              <input 
                type="radio" 
                name="training_method" 
                value="eury" 
                defaultChecked 
                onChange={(e) => handleTrainingMethodChange(e.target.value)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontWeight: 'bold', color: '#2c5aa0', fontSize: '1.1em' }}>🚀 Eury (Faster)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 16px', borderRadius: '6px', transition: 'all 0.2s' }}>
              <input 
                type="radio" 
                name="training_method" 
                value="traditional" 
                onChange={(e) => handleTrainingMethodChange(e.target.value)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontWeight: 'bold', color: '#8b4513', fontSize: '1.1em' }}>⚙️ Traditional</span>
            </label>
          </div>
        </div>

        {/* Model Architecture Selection */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#2c3e50' }}>
            Model Architecture:
          </label>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px',
            padding: '15px',
            border: '2px solid #e1e8ed',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 16px', borderRadius: '6px', transition: 'all 0.2s' }}>
              <input 
                type="radio" 
                name="model_architecture" 
                value="transformer" 
                checked={modelArchitecture === "transformer"}
                onChange={(e) => setModelArchitecture(e.target.value)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontWeight: 'bold', color: '#2c5aa0', fontSize: '1.1em' }}>🤖 Transformer (Classification)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 16px', borderRadius: '6px', transition: 'all 0.2s' }}>
              <input 
                type="radio" 
                name="model_architecture" 
                value="gpt" 
                checked={modelArchitecture === "gpt"}
                onChange={(e) => setModelArchitecture(e.target.value)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontWeight: 'bold', color: '#8b4513', fontSize: '1.1em' }}>💬 GPT (Text Generation)</span>
            </label>
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.9em', color: '#666', fontStyle: 'italic' }}>
            {modelArchitecture === "transformer" 
              ? "🎯 Transformer models are designed for classification tasks (e.g., sentiment analysis, topic classification)"
              : "✨ GPT models are designed for text generation tasks (e.g., completing text, creative writing)"
            }
          </div>
        </div>

        {/* Model Selection */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#2c3e50' }}>
            Model Type:
          </label>
          <select 
            name="model_type" 
            onChange={(e) => setModelType(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e8ed',
              borderRadius: '8px',
              fontSize: '1em',
              backgroundColor: 'white',
              transition: 'border-color 0.2s'
            }}
          >
            <option value="pretrained">Pre-trained Model</option>
            <option value="custom">Custom {modelArchitecture === "gpt" ? "GPT" : "Transformer"}</option>
          </select>
        </div>

        {/* Pre-trained Model Selection */}
        {modelType === 'pretrained' && (
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#2c3e50' }}>
              Pre-trained Model:
            </label>
            <select name="model_name" required style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e8ed',
              borderRadius: '8px',
              fontSize: '1em',
              backgroundColor: 'white',
              transition: 'border-color 0.2s'
            }}>
              <option value="">Select a model</option>
              {modelArchitecture === "transformer" ? (
                // Transformer models for classification
                <>
                  <option value="bert-base-uncased">BERT Base</option>
                  <option value="distilbert-base-uncased">DistilBERT</option>
                  <option value="roberta-base">RoBERTa</option>
                  <option value="google/electra-base-discriminator">ELECTRA</option>
                  <option value="albert-base-v2">ALBERT</option>
                  <option value="microsoft/deberta-base">DeBERTa</option>
                  <option value="funnel-transformer/small">Funnel</option>
                  <option value="google/mobilebert-uncased">MobileBERT</option>
                  <option value="prajjwal1/bert-tiny">TinyBERT</option>
                  <option value="microsoft/MiniLM-L12-H384-uncased">MiniLM</option>
                  <option value="camembert-base">CamemBERT</option>
                  <option value="xlm-roberta-base">XLM-RoBERTa</option>
                  <option value="facebook/bart-base">BART</option>
                  <option value="bert-base-multilingual-uncased">mBERT</option>
                  <option value="microsoft/layoutlm-base-uncased">LayoutLM</option>
                </>
              ) : (
                // GPT models for text generation
                Object.entries(gptModels).map(([modelId, info]) => (
                  <option key={modelId} value={modelId}>
                    {info.name} ({info.size}) - {info.description}
                  </option>
                ))
              )}
            </select>

          </div>
        )}

        {/* Custom Model Configuration */}
        {modelType === 'custom' && (
          <div style={{ marginBottom: '25px', padding: '20px', border: '2px solid #e1e8ed', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
            <h3 style={{ marginTop: '0', color: '#2c3e50' }}>Custom Transformer Configuration</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                  Vocabulary Size:
                </label>
                <input 
                  type="number" 
                  name="vocab_size" 
                  defaultValue={30522}
                  min="1000"
                  max="100000"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.9em'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                  Model Dimension (d_model):
                </label>
                <input 
                  type="number" 
                  name="d_model" 
                  defaultValue={768}
                  min="128"
                  max="4096"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.9em'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                  Number of Heads (nhead):
                </label>
                <input 
                  type="number" 
                  name="nhead" 
                  defaultValue={12}
                  min="1"
                  max="64"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.9em'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                  Number of Layers:
                </label>
                <input 
                  type="number" 
                  name="num_layers" 
                  defaultValue={12}
                  min="1"
                  max="48"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.9em'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                  Max Sequence Length:
                </label>
                <input 
                  type="number" 
                  name="max_len" 
                  defaultValue={512}
                  min="128"
                  max="4096"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.9em'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                  Pad Token ID:
                </label>
                <input 
                  type="number" 
                  name="pad_token_id" 
                  defaultValue={0}
                  min="0"
                  max="100000"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.9em'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Dataset Selection - Only for Transformer models */}
        {modelArchitecture === "transformer" && (
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#2c3e50' }}>
              Dataset:
            </label>
            <select name="dataset_name" required onChange={(e) => handleDatasetChange(e.target.value)} style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e8ed',
              borderRadius: '8px',
              fontSize: '1em',
              backgroundColor: 'white',
              transition: 'border-color 0.2s'
            }}>
              <option value="">Select a dataset</option>
              <option value="ag_news">📰 AG News (News classification)</option>
              <option value="dbpedia_14">📚 DBpedia 14 (Wikipedia articles)</option>
              <option value="yahoo_answers_topics">❓ Yahoo Answers Topics</option>
              <option value="yelp_review_full">⭐ Yelp Review Full (1-5 stars)</option>
              <option value="yelp_polarity">👍👎 Yelp Polarity (Positive/Negative)</option>
              <option value="amazon_polarity">🛒 Amazon Polarity (Sentiment)</option>
              <option value="trec">❓ TREC (Question classification)</option>
              <option value="emotion">😊 Emotion (Emotion labels)</option>
              <option value="go_emotions">😀 Go Emotions (28 emotions)</option>
              <option value="imdb">🎬 IMDB (Movie reviews)</option>
              <option value="banking77">🏦 Banking77 (Customer queries)</option>
              <option value="rotten_tomatoes">🍅 Rotten Tomatoes (Movie reviews)</option>
            </select>
          </div>
        )}

        {/* GPT Training Notice */}
        {modelArchitecture === "gpt" && (
          <div style={{ 
            marginBottom: '25px', 
            padding: '15px', 
            backgroundColor: '#e8f4fd', 
            borderRadius: '8px',
            border: '1px solid #b3d9ff',
            color: '#2c5aa0'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              💬 GPT Training Mode
            </div>
            <div style={{ fontSize: '0.9em' }}>
              GPT models are trained for text generation using the selected datasets as text corpus. The model will learn to generate text in a similar style and domain.
            </div>
          </div>
        )}

        {/* Learning Rate */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#2c3e50' }}>
            Learning Rate:
          </label>
          <input 
            type="number" 
            step="any" 
            name="learning_rate" 
            defaultValue={0.00002} 
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e8ed',
              borderRadius: '8px',
              fontSize: '1em',
              backgroundColor: 'white',
              transition: 'border-color 0.2s'
            }}
          />
        </div>

        {/* Fast Inference for GPT models */}
        {modelArchitecture === "gpt" && (
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                name="fast_dwl_inference" 
                defaultChecked={true}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Enable Fast DWL Inference</span>
            </label>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#666' }}>
              Speeds up inference for DWL-trained GPT models by using compression techniques.
            </p>
          </div>
        )}

        {/* LoRA Toggle */}
        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setShowLoraSection(!showLoraSection)}
            style={{
              padding: '10px 20px',
              fontSize: '1em',
              fontWeight: 'bold',
              backgroundColor: showLoraSection ? '#3498db' : '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {showLoraSection ? '🔽' : '▶️'} LoRA Configuration {showLoraSection ? '(Advanced)' : ''}
          </button>
          {!showLoraSection && (
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#666', fontStyle: 'italic' }}>
              Click to configure LoRA (Low-Rank Adaptation) parameters for efficient fine-tuning
            </p>
          )}
        </div>

        {/* LoRA Configuration */}
        {showLoraSection && (
          <div style={{ marginBottom: '25px', padding: '20px', border: '2px solid #e1e8ed', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
            <h3 style={{ marginTop: '0', color: '#2c3e50' }}>LoRA (Low-Rank Adaptation) Configuration</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="apply_lora" 
                  defaultChecked={false}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Enable LoRA</span>
              </label>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#666' }}>
                LoRA reduces the number of trainable parameters by using low-rank adaptation matrices.
              </p>
            </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                LoRA Rank (r):
              </label>
              <input 
                type="number" 
                name="lora_r" 
                defaultValue={8}
                min="1"
                max="64"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9em'
                }}
              />
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8em', color: '#666' }}>
                Lower rank = fewer parameters
              </p>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                LoRA Alpha:
              </label>
              <input 
                type="number" 
                name="lora_alpha" 
                defaultValue={16}
                min="1"
                max="128"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9em'
                }}
              />
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8em', color: '#666' }}>
                Scaling factor for LoRA weights
              </p>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                LoRA Dropout:
              </label>
              <input 
                type="number" 
                step="0.01"
                name="lora_dropout" 
                defaultValue={0.1}
                min="0"
                max="0.5"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9em'
                }}
              />
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8em', color: '#666' }}>
                Dropout rate for LoRA layers
              </p>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                Target Modules:
              </label>
              <select 
                name="lora_target_modules" 
                defaultValue="q_proj,v_proj"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9em'
                }}
              >
                <option value="q_proj,v_proj">Query & Value projections</option>
                <option value="q_proj,k_proj,v_proj">Query, Key & Value projections</option>
                <option value="q_proj,k_proj,v_proj,o_proj">All attention projections</option>
                <option value="all">All linear layers</option>
              </select>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8em', color: '#666' }}>
                Which layers to apply LoRA to
              </p>
            </div>
          </div>
        </div>
        )}

        {/* Pretrained Checkbox */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              name="pretrained" 
              defaultChecked
              style={{ transform: 'scale(1.2)' }}
            />
            <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Use Pretrained Model</span>
          </label>
        </div>

        {/* Hidden fields with default values */}
        <input type="hidden" name="epoch_max" value="100" />
        <input type="hidden" name="step_size" value="10" />
        <input type="hidden" name="patience_max" value="5" />
        <input type="hidden" name="num_components" value="50" />
        <input type="hidden" name="sampling_param" value="1.0" />
        <input type="hidden" name="bdr_compression_perc" value="10.0" />
        <input type="hidden" name="num_classes" value="0" />

        {/* Custom Sample Addition */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#2c3e50' }}>
            Add Custom Sample to Test Set (Optional):
          </label>
          <div style={{ 
            padding: '15px', 
            border: '2px solid #e1e8ed', 
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50', fontSize: '0.9em' }}>
                Sample Text:
              </label>
              <input
                type="text"
                name="custom_sample_text"
                placeholder="Enter your custom sample text..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9em',
                  backgroundColor: 'white'
                }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50', fontSize: '0.9em' }}>
                Label (Class):
              </label>
              <select
                name="custom_sample_label"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9em',
                  backgroundColor: selectedDataset ? 'white' : '#f8f9fa'
                }}
                disabled={!selectedDataset}
              >
                <option value="">Select a class {selectedDataset ? `(${selectedDataset})` : '(no dataset selected)'}</option>
                {selectedDataset && classLabelsMap[selectedDataset] ? 
                  classLabelsMap[selectedDataset].map((label, index) => (
                    <option key={index} value={label}>{label}</option>
                  )) : 
                  <option value="" disabled>Please select a dataset first</option>
                }
              </select>
              {!selectedDataset && (
                <div style={{ 
                  marginTop: '5px', 
                  fontSize: '0.8em', 
                  color: '#e74c3c', 
                  fontStyle: 'italic',
                  padding: '5px',
                  backgroundColor: '#fdf2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '3px'
                }}>
                  ⚠️ Please select a dataset above to see available class labels
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.8em', color: '#666', fontStyle: 'italic' }}>
              💡 This sample will be added to the test set and analyzed in the comparison results.
            </div>
          </div>
        </div>

        {/* Error Display */}
        {formError && (
          <div style={{ 
            color: '#e74c3c', 
            marginBottom: '20px', 
            padding: '12px', 
            backgroundColor: '#fdf2f2', 
            border: '1px solid #fecaca', 
            borderRadius: '6px' 
          }}>
            {formError}
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isTraining || (queueStatus && queueStatus.active_job.id && !jobId)}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '1.1em',
            fontWeight: 'bold',
            backgroundColor: isTraining ? '#95a5a6' : (queueStatus && queueStatus.active_job.id && !jobId) ? '#f39c12' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (isTraining || (queueStatus && queueStatus.active_job.id && !jobId)) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          {isTraining ? "🔄 Training..." : 
           (queueStatus && queueStatus.active_job.id && !jobId) ? "⏳ GPU Busy - Training in Progress" : 
           "🚀 Start Training"}
        </button>
      </form>
      
      {selectedDataset && (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.3em' }}>📊 Selected Configuration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div><strong>Dataset:</strong> {selectedDataset}</div>
            <div><strong>Training Method:</strong> {selectedTrainingMethod || 'Not selected'}</div>
            <div><strong>Number of Classes:</strong> Auto-detected by backend</div>
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        {/* Job Status Display */}
        {jobId && (
          <div style={{ 
            marginBottom: '20px', 
            padding: '12px', 
            background: '#e8f5e8', 
            border: '1px solid #c3e6c3', 
            borderRadius: '8px',
            color: '#155724',
            fontSize: '0.9em'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>🎯 Job:</strong> {jobId.slice(0, 8)}...
              </div>
              <div>
                <strong>Status:</strong> {isTraining ? '🔄 Training' : '✅ Done'}
              </div>
            </div>
          </div>
        )}
        
        <h3 style={{ color: '#2c3e50', marginBottom: '15px', fontSize: '1.4em' }}>📋 Backend Logs:</h3>
        <pre style={{ 
          background: "#2c3e50", 
          color: "#2ecc71", 
          padding: "20px", 
          minHeight: "200px", 
          maxHeight: "400px", 
          overflow: "auto",
          borderRadius: '8px',
          border: '1px solid #34495e',
          fontSize: '0.9em',
          lineHeight: '1.4'
        }}>
          {logs}
        </pre>
        
        {/* Loss Chart Display */}
        <LossChart 
          lossData={currentLossData} 
          timeData={currentTimeData}
          trainingMethod={completedTrainingMethod || selectedTrainingMethod}
          euryLossData={euryLossData}
          traditionalLossData={traditionalLossData}
          euryTimeData={euryTimeData}
          traditionalTimeData={traditionalTimeData}
        />
        
        {/* Combined Loss Chart - show only if both training methods have been run
        {(euryLossData.length > 0 && traditionalLossData.length > 0) && (
          <CombinedLossChart 
            euryLossData={euryLossData}
            traditionalLossData={traditionalLossData}
          />
        )} */}

        {/* Pretty Results Display */}
        {results && (
          <ComparisonResults results={results} datasetName={selectedDataset} />
        )}
        
        {/* Fallback to plain text if parsing fails */}
        {results && !results.includes("Text (truncated)") && !results.includes("Custom Sample Analysis") && (
          <>
            <h3 style={{ color: '#2c3e50', marginBottom: '15px', marginTop: '30px', fontSize: '1.4em' }}>📈 Training Results & Predictions:</h3>
            <pre style={{ 
              background: "#f8f9fa", 
              color: "#2c3e50", 
              padding: "20px", 
              minHeight: "200px", 
              maxHeight: "600px", 
              overflow: "auto", 
              border: "2px solid #e1e8ed", 
              borderRadius: "8px",
              fontSize: '0.9em',
              lineHeight: '1.4',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
              {results}
            </pre>
          </>
        )}
        
        {(logs.includes("Training complete") || logs.includes("✅ Training complete!")) && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            {completedTrainingMethod === 'eury' ? (
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#fff3cd', 
                borderRadius: '8px',
                border: '1px solid #ffeaa7',
                color: '#856404',
                marginBottom: '15px'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>⚠️ Model Download Not Available</div>
                <div style={{ fontSize: '0.9em', marginBottom: '15px' }}>
                  Eury training doesn't save the trained model weights. The downloaded file would only contain an untrained model structure.
                </div>
                <button 
                  disabled
                  style={{
                    padding: '12px 24px',
                    fontSize: '1em',
                    fontWeight: 'bold',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'not-allowed',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  🚫 Download Not Available
                </button>
              </div>
            ) : (
              <a href={`${BACKEND_URL}/download-model`} download>
                <button style={{
                  padding: '12px 24px',
                  fontSize: '1em',
                  fontWeight: 'bold',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  💾 Download Trained Model
                </button>
              </a>
            )}
          </div>
        )}
        
        {/* TestModel component for inference */}
        {(logs.includes("Training complete") || logs.includes("✅ Training complete!")) && (
          <div style={{ marginTop: '30px' }}>
            <TestModel 
              modelName={selectedModel} 
              datasetName={selectedDataset} 
              trainingMethod={completedTrainingMethod || selectedTrainingMethod}
              isCustomModel={selectedModel === "bert-base-uncased" && (completedTrainingMethod || selectedTrainingMethod) === "eury"}
              modelArchitecture={modelArchitecture}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// New component for prettier comparison results
function ComparisonResults({ results, datasetName }) {
  const [activeTab, setActiveTab] = useState('comparison');
  
  // Class labels for different datasets
  const classLabelsMap = {
    "yahoo_answers_topics": [
      "Society & Culture", "Science & Mathematics", "Health", "Education & Reference",
      "Computers & Internet", "Sports", "Business & Finance", "Entertainment & Music",
      "Family & Relationships", "Politics & Government"
    ],
    "ag_news": ["World", "Sports", "Business", "Sci/Tech"],
    "emotion": ["joy", "sadness", "anger", "fear", "surprise", "love"],
    "imdb": ["Negative", "Positive"],
    "yelp_polarity": ["Negative", "Positive"],
    "amazon_polarity": ["Negative", "Positive"],
    "rotten_tomatoes": ["Negative", "Positive"],
    "trec": ["Description", "Entity", "Abbreviation", "Human", "Location", "Numeric"],
    "yelp_review_full": ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    "dbpedia_14": ["Company", "EducationalInstitution", "Artist", "Athlete", "OfficeHolder", 
                   "MeanOfTransportation", "Building", "NaturalPlace", "Village", "Animal", 
                   "Plant", "Album", "Film", "WrittenWork"],
    "go_emotions": ["admiration", "amusement", "anger", "annoyance", "approval", "caring", 
                   "confusion", "curiosity", "desire", "disappointment", "disapproval", 
                   "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief", 
                   "joy", "love", "nervousness", "optimism", "pride", "realization", 
                   "relief", "remorse", "sadness", "surprise", "neutral"],
    "banking77": ["General inquiries", "Account management", "Card services", "Loan services", 
                  "Investment services", "Insurance services", "Fraud and security", 
                  "Technical support", "Mobile banking", "Online banking", "ATM services", 
                  "Branch services", "International services", "Payment services", 
                  "Credit services", "Debit services", "Savings accounts", "Checking accounts", 
                  "Mortgage services", "Personal loans", "Business loans", "Student loans", 
                  "Auto loans", "Home equity loans", "Credit cards", "Debit cards", 
                  "Prepaid cards", "Gift cards", "Travel cards", "Business cards", 
                  "Rewards cards", "Cash back cards", "Balance transfer cards", 
                  "Secured cards", "Unsecured cards", "Co-branded cards", "Affinity cards", 
                  "Corporate cards", "Fleet cards", "Purchasing cards", "Virtual cards", 
                  "Contactless cards", "Chip cards", "Magnetic stripe cards", "EMV cards", 
                  "NFC cards", "QR code cards", "Barcode cards", "Smart cards", 
                  "Memory cards", "Processor cards", "Contact cards", "Contactless cards", 
                  "Dual interface cards", "Hybrid cards", "Combo cards", "Multi-application cards", 
                  "Single application cards", "Open loop cards", "Closed loop cards", 
                  "Private label cards", "White label cards", "Co-branded cards", 
                  "Affinity cards", "Corporate cards", "Fleet cards", "Purchasing cards", 
                  "Virtual cards", "Contactless cards", "Chip cards", "Magnetic stripe cards", 
                  "EMV cards", "NFC cards", "QR code cards", "Barcode cards", "Smart cards"]
  };

  const classLabels = classLabelsMap[datasetName] || [];

  // Helper function to convert class numbers to string labels
  const getClassLabel = (label) => {
    if (!label) return label;
    // If it's already a string label, return it
    if (classLabels.includes(label)) {
      return label;
    }
    // If it's a class number, convert it
    const classNum = parseInt(label.replace(/[^\d]/g, ''));
    if (!isNaN(classNum) && classNum < classLabels.length) {
      return classLabels[classNum];
    }
    // Fallback to original label
    return label;
  };

  // Parse the results to extract comparison data
  const parseComparisonData = () => {
    const lines = results.split('\n');
    const comparisonData = [];
    let customSampleData = null;
    let analysisData = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Extract analysis data
      if (line.includes("Pretrained Accuracy:")) {
        const match = line.match(/Pretrained Accuracy:\s*([\d.]+)%/);
        if (match) analysisData.pretrainedAccuracy = parseFloat(match[1]);
      }
      if (line.includes("Fine-tuned Accuracy:")) {
        const match = line.match(/Fine-tuned Accuracy:\s*([\d.]+)%/);
        if (match) analysisData.fineTunedAccuracy = parseFloat(match[1]);
      }
      if (line.includes("Accuracy Improvement:")) {
        const match = line.match(/Accuracy Improvement:\s*([+-]?[\d.]+)%/);
        if (match) analysisData.improvement = parseFloat(match[1]);
      }
      if (line.includes("Predictions Changed:")) {
        const match = line.match(/Predictions Changed:\s*(\d+)\/(\d+)\s*\(([\d.]+)%\)/);
        if (match) {
          analysisData.changed = parseInt(match[1]);
          analysisData.total = parseInt(match[2]);
          analysisData.changePercentage = parseFloat(match[3]);
        }
      }
      
      // Extract comparison table data
      if (line.includes("Text (truncated)") && line.includes("True") && line.includes("Pretrained")) {
        // Skip header line and start parsing data
        i++;
        while (i < lines.length && lines[i].trim() && !lines[i].includes("Custom Sample Analysis")) {
          const dataLine = lines[i];
          if (dataLine.includes("---")) {
            i++;
            continue;
          }
          
          // Try fixed-width parsing first (backend format)
          if (dataLine.length >= 80) {
            const text = dataLine.substring(0, 35).trim();
            const trueLabel = dataLine.substring(35, 45).trim();
            const pretrainedPred = dataLine.substring(45, 55).trim();
            const fineTunedPred = dataLine.substring(55, 65).trim();
            const changed = dataLine.substring(65, 73).trim();
            const improved = dataLine.substring(73, 81).trim();
            
            // Only add if we have meaningful data (not just dashes or empty)
            if (text && text !== "Text (truncated)" && !text.includes("---") && trueLabel && pretrainedPred && fineTunedPred) {
              comparisonData.push({
                text: text.replace("...", ""),
                trueLabel: getClassLabel(trueLabel),
                pretrainedPred: getClassLabel(pretrainedPred),
                fineTunedPred: getClassLabel(fineTunedPred),
                changed: changed === "✓",
                improved: improved === "✓" ? "improved" : improved === "✗" ? "worsened" : "same"
              });
            }
          } else {
            // Fallback: try space-based parsing for different formats
            const parts = dataLine.split(/\s{2,}/);
            if (parts.length >= 4) {
              const text = parts[0];
              const trueLabel = parts[1];
              const pretrainedPred = parts[2];
              const fineTunedPred = parts[3];
              const changed = parts[4] || "=";
              const improved = parts[5] || "=";
              
              if (text && text !== "Text (truncated)" && !text.includes("---") && trueLabel && pretrainedPred && fineTunedPred) {
                // Convert class numbers to string labels
                const getClassLabel = (label) => {
                  // If it's already a string label, return it
                  if (classLabels.includes(label)) {
                    return label;
                  }
                  // If it's a class number, convert it
                  const classNum = parseInt(label.replace(/[^\d]/g, ''));
                  if (!isNaN(classNum) && classNum < classLabels.length) {
                    return classLabels[classNum];
                  }
                  // Fallback to original label
                  return label;
                };
                
                comparisonData.push({
                  text: text.replace("...", ""),
                  trueLabel: getClassLabel(trueLabel),
                  pretrainedPred: getClassLabel(pretrainedPred),
                  fineTunedPred: getClassLabel(fineTunedPred),
                  changed: changed === "✓",
                  improved: improved === "✓" ? "improved" : improved === "✗" ? "worsened" : "same"
                });
              }
            }
          }
          i++;
        }
      }
      
      // Extract custom sample data
      if (line.includes("Custom Sample Analysis")) {
        i++;
        const customData = {};
        while (i < lines.length && lines[i].trim() && !lines[i].includes("🎯")) {
          const customLine = lines[i];
          if (customLine.includes("Sample:")) {
            customData.sample = customLine.split("'")[1] || customLine.split(":")[1]?.trim();
          } else if (customLine.includes("True Label:")) {
            const labelText = customLine.split(":")[1]?.trim();
            customData.trueLabel = getClassLabel(labelText);
          } else if (customLine.includes("Pretrained Prediction:")) {
            const labelText = customLine.split(":")[1]?.trim();
            customData.pretrainedPred = getClassLabel(labelText);
          } else if (customLine.includes("Fine-tuned Prediction:")) {
            const labelText = customLine.split(":")[1]?.trim();
            customData.fineTunedPred = getClassLabel(labelText);
          } else if (customLine.includes("Pretrained Correct:")) {
            customData.pretrainedCorrect = customLine.includes("✓");
          } else if (customLine.includes("Fine-tuned Correct:")) {
            customData.fineTunedCorrect = customLine.includes("✓");
          }
          i++;
        }
        if (Object.keys(customData).length > 0) {
          customSampleData = customData;
        }
      }
    }
    
    return { comparisonData, customSampleData, analysisData };
  };

  const { comparisonData, customSampleData, analysisData } = parseComparisonData();

  // Debug: Log what we found
  console.log('Parsing results:', { 
    hasResults: !!results, 
    comparisonDataLength: comparisonData.length, 
    hasCustomSample: !!customSampleData,
    analysisDataKeys: Object.keys(analysisData)
  });

  // Show component even if parsing fails, but with fallback
  if (!results) {
    return null;
  }

  return (
    <div style={{ marginTop: '30px' }}>
      <h3 style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '1.6em', textAlign: 'center' }}>
        🎯 Training Results Analysis
      </h3>
      
      {/* Analysis Summary */}
      {Object.keys(analysisData).length > 0 && (
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px',
          borderRadius: '12px',
          color: 'white',
          marginBottom: '25px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '1.3em' }}>📊 Performance Summary</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            {analysisData.pretrainedAccuracy !== undefined && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Pretrained Accuracy</div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{analysisData.pretrainedAccuracy.toFixed(1)}%</div>
              </div>
            )}
            {analysisData.fineTunedAccuracy !== undefined && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Fine-tuned Accuracy</div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{analysisData.fineTunedAccuracy.toFixed(1)}%</div>
              </div>
            )}
            {analysisData.improvement !== undefined && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Improvement</div>
                <div style={{ 
                  fontSize: '1.5em', 
                  fontWeight: 'bold',
                  color: analysisData.improvement >= 0 ? '#2ecc71' : '#e74c3c'
                }}>
                  {analysisData.improvement >= 0 ? '+' : ''}{analysisData.improvement.toFixed(1)}%
                </div>
              </div>
            )}
            {analysisData.changed !== undefined && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Predictions Changed</div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
                  {analysisData.changed}/{analysisData.total} ({analysisData.changePercentage.toFixed(1)}%)
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '2px solid #e1e8ed',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setActiveTab('comparison')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'comparison' ? '#3498db' : 'transparent',
            color: activeTab === 'comparison' ? 'white' : '#2c3e50',
            cursor: 'pointer',
            fontWeight: 'bold',
            borderRadius: '8px 8px 0 0',
            transition: 'all 0.2s'
          }}
        >
          📋 Comparison Table
        </button>
        {customSampleData && (
          <button
            onClick={() => setActiveTab('custom')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: activeTab === 'custom' ? '#3498db' : 'transparent',
              color: activeTab === 'custom' ? 'white' : '#2c3e50',
              cursor: 'pointer',
              fontWeight: 'bold',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.2s'
            }}
          >
            🎯 Custom Sample
          </button>
        )}
      </div>

      {/* Comparison Table Tab */}
      {activeTab === 'comparison' && (
        <>
          {comparisonData.length > 0 ? (
            <div style={{ 
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              <div style={{ 
                background: '#f8f9fa',
                padding: '15px 20px',
                borderBottom: '1px solid #e1e8ed'
              }}>
                <h4 style={{ margin: 0, color: '#2c3e50' }}>Sample Predictions Comparison</h4>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e1e8ed', fontWeight: 'bold' }}>Text</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e1e8ed', fontWeight: 'bold' }}>True</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e1e8ed', fontWeight: 'bold' }}>Pretrained</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e1e8ed', fontWeight: 'bold' }}>Fine-tuned</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e1e8ed', fontWeight: 'bold' }}>Changed</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e1e8ed', fontWeight: 'bold' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #f1f3f4' }}>
                        <td style={{ padding: '12px', maxWidth: '200px', wordBreak: 'break-word' }}>
                          <div style={{ fontSize: '0.9em' }}>{row.text}</div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: '0.8em',
                            fontWeight: 'bold',
                            background: '#e3f2fd',
                            color: '#1976d2'
                          }}>
                            {row.trueLabel}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: '0.8em',
                            fontWeight: 'bold',
                            background: '#fff3e0',
                            color: '#f57c00'
                          }}>
                            {row.pretrainedPred}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: '0.8em',
                            fontWeight: 'bold',
                            background: '#e8f5e8',
                            color: '#388e3c'
                          }}>
                            {row.fineTunedPred}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {row.changed ? (
                            <span style={{ color: '#e74c3c', fontSize: '1.2em' }}>✓</span>
                          ) : (
                            <span style={{ color: '#95a5a6', fontSize: '1.2em' }}>−</span>
                          )}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {row.improved === 'improved' && (
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.8em',
                              fontWeight: 'bold',
                              background: '#d4edda',
                              color: '#155724'
                            }}>
                              ✨ Improved
                            </span>
                          )}
                          {row.improved === 'worsened' && (
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.8em',
                              fontWeight: 'bold',
                              background: '#f8d7da',
                              color: '#721c24'
                            }}>
                              ⚠️ Worsened
                            </span>
                          )}
                          {row.improved === 'same' && (
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.8em',
                              fontWeight: 'bold',
                              background: '#f8f9fa',
                              color: '#6c757d'
                            }}>
                              = Same
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ 
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              padding: '25px',
              textAlign: 'center'
            }}>
              <div style={{ color: '#6c757d', fontSize: '1.1em', marginBottom: '15px' }}>
                📋 Comparison table data not found in results
              </div>
              <div style={{ color: '#95a5a6', fontSize: '0.9em' }}>
                The comparison table will appear here when training completes and comparison data is available.
              </div>
            </div>
          )}
        </>
      )}

      {/* Custom Sample Tab */}
      {activeTab === 'custom' && (
        <>
          {customSampleData ? (
            <div style={{ 
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              padding: '25px'
            }}>
              <h4 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '1.4em' }}>
                🎯 Custom Sample Analysis
              </h4>
              
              <div style={{ 
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#2c3e50' }}>Sample Text:</strong>
                  <div style={{ 
                    marginTop: '5px',
                    padding: '10px',
                    background: 'white',
                    borderRadius: '4px',
                    border: '1px solid #e1e8ed',
                    fontStyle: 'italic'
                  }}>
                    "{customSampleData.sample}"
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div style={{ 
                  padding: '15px',
                  borderRadius: '8px',
                  border: '2px solid #e3f2fd',
                  background: '#f3f8ff'
                }}>
                  <h5 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>True Label</h5>
                  <div style={{ fontSize: '1.1em', fontWeight: 'bold' }}>{customSampleData.trueLabel}</div>
                </div>

                <div style={{ 
                  padding: '15px',
                  borderRadius: '8px',
                  border: '2px solid #fff3e0',
                  background: '#fffbf0'
                }}>
                  <h5 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>Pretrained Prediction</h5>
                  <div style={{ fontSize: '1.1em', fontWeight: 'bold' }}>{customSampleData.pretrainedPred}</div>
                  <div style={{ marginTop: '5px' }}>
                    {customSampleData.pretrainedCorrect ? (
                      <span style={{ color: '#27ae60', fontWeight: 'bold' }}>✓ Correct</span>
                    ) : (
                      <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>✗ Incorrect</span>
                    )}
                  </div>
                </div>

                <div style={{ 
                  padding: '15px',
                  borderRadius: '8px',
                  border: '2px solid #e8f5e8',
                  background: '#f0f9f0'
                }}>
                  <h5 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>Fine-tuned Prediction</h5>
                  <div style={{ fontSize: '1.1em', fontWeight: 'bold' }}>{customSampleData.fineTunedPred}</div>
                  <div style={{ marginTop: '5px' }}>
                    {customSampleData.fineTunedCorrect ? (
                      <span style={{ color: '#27ae60', fontWeight: 'bold' }}>✓ Correct</span>
                    ) : (
                      <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>✗ Incorrect</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div style={{ 
                marginTop: '20px',
                padding: '15px',
                borderRadius: '8px',
                background: customSampleData.pretrainedCorrect && customSampleData.fineTunedCorrect ? '#d4edda' :
                           !customSampleData.pretrainedCorrect && customSampleData.fineTunedCorrect ? '#fff3cd' :
                           customSampleData.pretrainedCorrect && !customSampleData.fineTunedCorrect ? '#f8d7da' : '#f8d7da',
                border: customSampleData.pretrainedCorrect && customSampleData.fineTunedCorrect ? '1px solid #c3e6cb' :
                       !customSampleData.pretrainedCorrect && customSampleData.fineTunedCorrect ? '1px solid #ffeaa7' :
                       customSampleData.pretrainedCorrect && !customSampleData.fineTunedCorrect ? '1px solid #f5c6cb' : '1px solid #f5c6cb'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {customSampleData.pretrainedCorrect && customSampleData.fineTunedCorrect ? '✅ Both models got it right' :
                   !customSampleData.pretrainedCorrect && customSampleData.fineTunedCorrect ? '✨ Fine-tuning improved this sample!' :
                   customSampleData.pretrainedCorrect && !customSampleData.fineTunedCorrect ? '⚠️ Fine-tuning made this sample worse' :
                   '❌ Both models got it wrong'}
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
                  {customSampleData.pretrainedCorrect && customSampleData.fineTunedCorrect ? 'The model was already performing well on this sample.' :
                   !customSampleData.pretrainedCorrect && customSampleData.fineTunedCorrect ? 'The fine-tuning process successfully improved the model\'s performance on this specific sample.' :
                   customSampleData.pretrainedCorrect && !customSampleData.fineTunedCorrect ? 'The fine-tuning process may have overfitted or changed the model\'s behavior in a way that hurt performance on this sample.' :
                   'This sample appears to be challenging for both the pretrained and fine-tuned models.'}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ 
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              padding: '25px',
              textAlign: 'center'
            }}>
              <div style={{ color: '#6c757d', fontSize: '1.1em', marginBottom: '15px' }}>
                🎯 No custom sample data found
              </div>
              <div style={{ color: '#95a5a6', fontSize: '0.9em', marginBottom: '20px' }}>
                To see custom sample analysis, add a custom sample in the training form above.
              </div>
              <div style={{ 
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #e1e8ed'
              }}>
                <div style={{ fontSize: '0.9em', color: '#6c757d' }}>
                  💡 <strong>Tip:</strong> You can add a custom sample by filling in the "Sample Text" and "Label" fields in the training form above.
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState("intro");
  const [currentRoute, setCurrentRoute] = useState('main');

  useEffect(() => {
    // Simple routing based on URL
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    
    if (path === '/login') {
      setCurrentRoute('login');
    } else {
      setCurrentRoute('main');
      // Set page based on URL parameter
      if (pageParam === 'train') {
        setPage('train');
      }
    }
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2em',
        color: '#2c3e50'
      }}>
        Loading...
      </div>
    );
  }

  // Show login page if on login route
  if (currentRoute === 'login') {
    return <Login />;
  }

  return (
    <div>
      {/* Login button in top right corner */}
      {!user && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000
        }}>
          <button
            onClick={() => {
              setCurrentRoute('login');
              window.history.pushState({}, '', '/login');
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            🔐 Sign In
          </button>
        </div>
      )}

      {/* User profile when logged in */}
      {user && <UserProfile />}

      {page === "intro" ? (
        <EuryIntro onStart={() => setPage("train")}/>
      ) : (
        <>
          <button onClick={() => {
            setPage("intro");
            window.history.pushState({}, '', '/');
          }} style={{ margin: '1em', float: 'right' }}>What is Eury?</button>
          <TrainStream />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 