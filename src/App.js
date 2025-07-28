import React, { useState } from "react";

// Backend configuration - change this to your backend URL
const BACKEND_URL = "http://localhost:8000";

function DWLIntro({ onStart }) {
  return (
    <div style={{ maxWidth: 600, margin: '2em auto', background: '#f9f9f9', padding: '2em', borderRadius: '8px' }}>
      <h1>What is DWL?</h1>
      <p>
        <strong>DWL</strong> is a model accelerator that speeds up training by <strong>10-40x</strong> without any loss in performance.
      </p>
      <ul>
        <li>Works with <strong>all model types</strong>: image, text, and multi-modal.</li>
        <li>Supports both <strong>custom models</strong> and <strong>predefined models</strong>.</li>
        <li>Major <strong>cost</strong> and <strong>time saver</strong> for machine learning engineers and researchers.</li>
        <li>Easy to use: just select your model and dataset, and DWL does the rest!</li>
      </ul>
      <p>
        DWL is designed to make large-scale training accessible and efficient for everyone.
      </p>
      <button onClick={onStart} style={{ marginTop: '2em', padding: '0.5em 2em', fontSize: '1.1em' }}>Start Training</button>
    </div>
  );
}

function TestModel({ modelName, datasetName, trainingMethod }) {
  const [input, setInput] = useState("");
  const [prediction, setPrediction] = useState(null);
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
    const formData = new FormData();
    formData.append("model_name", modelName);
    formData.append("user_input", input);
    formData.append("dataset_name", datasetName);
    formData.append("training_method", trainingMethod); // Add training method to form data
    try {
      const res = await fetch(`${BACKEND_URL}/predict`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
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
      <h3 style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '1.4em' }}>🧪 Test Trained Model</h3>
      
      {trainingMethod === 'dwl' && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '8px',
          border: '1px solid #ffeaa7',
          color: '#856404'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>⚠️ DWL Prediction Not Supported</div>
          <div style={{ fontSize: '0.9em' }}>
            DWL training currently only returns predictions, not the trained model. 
            The test feature uses untrained weights and will not provide meaningful results.
          </div>
        </div>
      )}
      
      <form onSubmit={handleTest} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>
            Input Text:
          </label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={trainingMethod === 'dwl' ? "DWL prediction not supported yet..." : "Enter text for prediction..."}
            disabled={trainingMethod === 'dwl'}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e8ed',
              borderRadius: '8px',
              fontSize: '1em',
              backgroundColor: trainingMethod === 'dwl' ? '#f8f9fa' : 'white',
              color: trainingMethod === 'dwl' ? '#6c757d' : '#2c3e50',
              transition: 'border-color 0.2s',
              cursor: trainingMethod === 'dwl' ? 'not-allowed' : 'text'
            }}
          />
        </div>
        <button 
          type="submit" 
          disabled={trainingMethod === 'dwl'}
          style={{
            padding: '12px 24px',
            fontSize: '1em',
            fontWeight: 'bold',
            backgroundColor: trainingMethod === 'dwl' ? '#95a5a6' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: trainingMethod === 'dwl' ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          {trainingMethod === 'dwl' ? '🚫 Not Available' : '🔮 Predict'}
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
  const [selectedTrainingMethod, setSelectedTrainingMethod] = useState("dwl");
  const [formError, setFormError] = useState("");

  // Function to handle dataset selection
  const handleDatasetChange = (datasetName) => {
    setSelectedDataset(datasetName);
  };

  // Function to handle training method selection
  const handleTrainingMethodChange = (trainingMethod) => {
    setSelectedTrainingMethod(trainingMethod);
  };

  // Parameter validation function
  function validateParams(formData) {
    // 'pretrained' is only present if checked
    if (!formData.get("pretrained")) {
      setFormError("Currently only supports pretrain.");
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

    const form = e.target;
    const formData = new FormData(form);
    setSelectedModel(formData.get("model_name"));

    // Validate parameters
    if (!validateParams(formData)) {
      setIsTraining(false);
      return;
    }

    // Use fetch to POST to /train/stream and read the response as a stream
    try {
      const response = await fetch(`${BACKEND_URL}/train/stream`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        setLogs("No response body from backend.");
        setIsTraining(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let logBuffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        logBuffer += decoder.decode(value, { stream: true });
        // SSE format: lines starting with "data: "
        const lines = logBuffer.split("\n");
        let newLogs = "";
        let newResults = "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const content = line.replace("data: ", "");
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
    } catch (error) {
      console.error("Training error:", error);
      setLogs(`Error connecting to backend: ${error.message}\n\nPlease make sure the backend server is running at ${BACKEND_URL}`);
    }
    setIsTraining(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px', fontSize: '2.2em' }}>
        DWL Model Trainer
      </h2>
      
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
                value="dwl" 
                defaultChecked 
                onChange={(e) => handleTrainingMethodChange(e.target.value)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontWeight: 'bold', color: '#2c5aa0', fontSize: '1.1em' }}>🚀 DWL (Faster)</span>
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

        {/* Model Selection */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#2c3e50' }}>
            Model Name:
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
          </select>
        </div>

        {/* Dataset Selection */}
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
                Label (Class Number):
              </label>
              <input
                type="number"
                name="custom_sample_label"
                min="0"
                placeholder="Enter class number (0, 1, 2, etc.)"
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
          disabled={isTraining}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '1.1em',
            fontWeight: 'bold',
            backgroundColor: isTraining ? '#95a5a6' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isTraining ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          {isTraining ? "🔄 Training..." : "🚀 Start Training"}
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
        
        {logs.includes("Training complete") && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            {selectedTrainingMethod === 'dwl' ? (
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
                  DWL training doesn't save the trained model weights. The downloaded file would only contain an untrained model structure.
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
        {logs.includes("Training complete") && selectedModel && (
          <div style={{ marginTop: '30px' }}>
            <TestModel modelName={selectedModel} datasetName={selectedDataset} trainingMethod={selectedTrainingMethod} />
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

function App() {
  const [page, setPage] = useState("intro");

  return (
    <div>
      {page === "intro" ? (
        <DWLIntro onStart={() => setPage("train")}/>
      ) : (
        <>
          <button onClick={() => setPage("intro")} style={{ margin: '1em', float: 'right' }}>What is DWL?</button>
          <TrainStream />
        </>
      )}
    </div>
  );
}

export default App; 