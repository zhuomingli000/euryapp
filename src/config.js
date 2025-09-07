// Configuration file for the Eury App

// Backend URL Configuration
// Change this URL based on your setup:
// - Local development: "http://localhost:8000"
// - Ngrok tunnel: "https://your-ngrok-url.ngrok.io"
// - Production server: "https://your-production-server.com"

// Use environment variable if available, otherwise use the default
const prod = true;
export const BACKEND_URL = prod ? "https://tnq4ievkmx1cx2-8888.proxy.runpod.net" : "https://unique-bullfrog-blatantly.ngrok-free.app";

// For ngrok tunnel, uncomment the line below:
// export const BACKEND_URL = "https://unique-bullfrog-blatantly.ngrok-free.app";

// App Configuration
export const APP_CONFIG = {
  name: "Eury Model Trainer",
  version: "1.0.0",
  description: "A web interface for training models using Eury (Deep Weight Learning)",
  features: {
    streaming: true,
    customSamples: true,
    comparisonTable: true,
    modelDownload: true
  }
};

// Default Training Parameters
export const DEFAULT_PARAMS = {
  learning_rate: 0.00002,
  epoch_max: 100,
  step_size: 10,
  patience_max: 5,
  num_components: 50,
  sampling_param: 1.0,
  bdr_compression_perc: 10.0
}; 