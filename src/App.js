import React, { useState } from "react";

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

function TestModel({ modelName }) {
  const [input, setInput] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  // Optionally, define a mapping from class index to label
  // Example for yahoo_answers_topics (10 classes):
  const classLabels = [
    "Society & Culture",
    "Science & Mathematics",
    "Health",
    "Education & Reference",
    "Computers & Internet",
    "Sports",
    "Business & Finance",
    "Entertainment & Music",
    "Family & Relationships",
    "Politics & Government"
  ];

  const handleTest = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);
    const formData = new FormData();
    formData.append("model_name", modelName);
    formData.append("user_input", input);
    try {
      const res = await fetch("http://64.62.226.208:8000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError("Error during prediction. Please try again.");
    }
  };

  return (
    <div>
      <h3>Test Trained Model</h3>
      <form onSubmit={handleTest}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter input for prediction"
        />
        <button type="submit">Predict</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {prediction !== null && (
        <div style={{ marginTop: '1em', color: '#0f0' }}>
          <strong>Prediction index:</strong> {prediction}<br />
          {classLabels[prediction] && (
            <span><strong>Predicted label:</strong> {classLabels[prediction]}</span>
          )}
        </div>
      )}
    </div>
  );
}

function TrainStream() {
  const [logs, setLogs] = useState("");
  const [isTraining, setIsTraining] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [formError, setFormError] = useState("");

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
    const response = await fetch("http://64.62.226.208:8000/train/stream", {
      method: "POST",
      body: formData,
    });

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
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          newLogs += line.replace("data: ", "") + "\n";
        }
      }
      setLogs((prev) => prev + newLogs);
      logBuffer = lines[lines.length - 1]; // keep incomplete line for next chunk
    }
    setIsTraining(false);
  };

  return (
    <div>
      <h2>DWL Model Trainer (Streaming Logs)</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Model Name:
          <select name="model_name" required>
            <option value="">Select</option>
            <option value="bert-base-uncased">bert-base-uncased</option>
            <option value="distilbert-base-uncased">distilbert-base-uncased</option>
            <option value="roberta-base">roberta-base</option>
            <option value="google/electra-base-discriminator">google/electra-base-discriminator</option>
            <option value="albert-base-v2">albert-base-v2</option>
            <option value="microsoft/deberta-base">microsoft/deberta-base</option>
            <option value="funnel-transformer/small">funnel-transformer/small</option>
            <option value="google/mobilebert-uncased">google/mobilebert-uncased</option>
            <option value="prajjwal1/bert-tiny">prajjwal1/bert-tiny</option>
            <option value="microsoft/MiniLM-L12-H384-uncased">microsoft/MiniLM-L12-H384-uncased</option>
            <option value="camembert-base">camembert-base</option>
            <option value="xlm-roberta-base">xlm-roberta-base</option>
            <option value="facebook/bart-base">facebook/bart-base</option>
            <option value="bert-base-multilingual-uncased">bert-base-multilingual-uncased</option>
            <option value="microsoft/layoutlm-base-uncased">microsoft/layoutlm-base-uncased</option>
          </select>
        </label>
        <br />
        <label>
          Pretrained:
          <input type="checkbox" name="pretrained" />
        </label>
        <br />
        <label>
          Num Classes:
          <input type="number" name="num_classes" defaultValue={2} />
        </label>
        <br />
        <label>
          Epoch Max:
          <input type="number" name="epoch_max" defaultValue={100} />
        </label>
        <br />
        <label>
          Step Size:
          <input type="number" name="step_size" defaultValue={10} />
        </label>
        <br />
        <label>
          Patience Max:
          <input type="number" name="patience_max" defaultValue={5} />
        </label>
        <br />
        <label>
          Learning Rate:
          <input type="number" step="any" name="learning_rate" defaultValue={0.00002} />
        </label>
        <br />
        <label>
          Num Components:
          <input type="number" name="num_components" defaultValue={50} />
        </label>
        <br />
        <label>
          Sampling Param:
          <input type="number" step="any" name="sampling_param" defaultValue={1} />
        </label>
        <br />
        <label>
          BDR Compression %:
          <input type="number" step="any" name="bdr_compression_perc" defaultValue={10} />
        </label>
        <br />
        <label>
          Dataset (upload):
          <input type="file" name="dataset" />
        </label>
        <br />
        {formError && <div style={{ color: 'red', marginBottom: '1em' }}>{formError}</div>}
        <button type="submit" disabled={isTraining}>
          {isTraining ? "Training..." : "Run & Stream Logs"}
        </button>
      </form>
      <h3>Backend Logs:</h3>
      <pre style={{ background: "#222", color: "#0f0", padding: "1em", minHeight: "200px" }}>
        {logs}
      </pre>
      {logs.includes("Training complete") && (
        <a href="http://localhost:8000/download-model" download>
          <button>Download Trained Model</button>
        </a>
      )}
      {/* TestModel component for inference */}
      {logs.includes("Training complete") && selectedModel && (
        <TestModel modelName={selectedModel} />
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