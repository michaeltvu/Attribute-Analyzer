from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from predictionModel import Model
import uvicorn
import numpy as np
import os
from datetime import datetime

app = FastAPI()
model = Model('model_vggface_v2.h5')

# Enable CORS (Cross-Origin Resource Sharing) to allow requests from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can customize this based on your requirements
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define an endpoint to handle image uploads and make predictions
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Save the uploaded image to a temporary file
        with open("temp.jpg", "wb") as buffer:
            buffer.write(file.file.read())
        
        # Make predictions using the loaded model
        predlist, predstr = model.predict('temp.jpg')

        if os.path.isfile('temp.jpg'):
            os.remove('temp.jpg')

        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        print("Current Time =", current_time)
        return JSONResponse(content={"attributes": predstr, 'attributes_array': predlist})
        # return JSONResponse(content={"predicted_class": preds.tolist()})

    except Exception as e:
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        print("Current Time =", current_time)
        
        print(f"Error: {e}")
        return JSONResponse(content={"error": "Internal Server Error"}, status_code=500)

if __name__ == "__main__":
    # Run the FastAPI app with UVicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)