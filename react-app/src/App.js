import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [response, setResponse] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setUploadError(null)
        } 
        else {
            setImagePreview(null);
        }
    };

    const handleUpload = async () => {
        // Check if an image is selected
        if (!selectedFile) {
            setUploadError('Please select an image before uploading.');
            return;
        }

        setLoading(true);
    
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
        
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                body: formData,
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    // 'Access-Control-Allow-Origin': '*',
                },
            });

            const responseData = await response.json();
            if (responseData.attributes_array) {
                setResponse(responseData);
                setUploadError(null); // Reset the error message
            }
            else {
                setUploadError('Error uploading image')
            }
        } 
        catch (error) {
            console.error('Error uploading image:', error);
            setUploadError('Error uploading image:', error)
            // setUploadError('An error occurred while uploading the image. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };

    const labelsMapping = ['5\'o Clock Shadow', 'Arched Eyebrows', 'Attractive', 'Bags Under Eyes', 'Bald', 'Bangs', 'Big Lips', 'Big Nose', 'Black Hair', 'Blond Hair', 'Blurry', 'Brown Hair', 'Bushy Eyebrows', 'Chubby', 'Double Chin', 'Eyeglasses', 'Goatee', 'Gray Hair', 'Heavy Makeup', 'High Cheekbones', 'Male', 'Mouth Slightly Open', 'Mustache', 'Narrow Eyes', 'No Beard', 'Oval Face', 'Pale Skin', 'Pointy Nose', 'Receding Hairline', 'Rosy Cheeks', 'Sideburns', 'Smiling', 'Straight Hair', 'Wavy Hair', 'Wearing Earrings', 'Wearing Hat', 'Wearing Lipstick', 'Wearing Necklace', 'Wearing Necktie', 'Young']

    return (
        <div className={"container my-5"}>
            <h1 className="mb-4">Attributes Analyzer</h1>

            <div className="alert alert-info" role="alert">
                <h4 className="alert-heading">How It Works</h4>
                <p>
                    Welcome to the Attributes Analyzer! Upload a photo of a person, and our system will analyze it using a Keras model
                    trained on celebrity faces. The model predicts various attributes of the person in the photo, providing insights into their
                    potential features.    
                </p>
                <hr />
                <p className="mb-0">
                    Note: This is a fun and experimental tool. Predictions may not be accurate for all types of images, as the model is specifically
                    trained on celebrity faces.
                </p>
            </div>

            <div className="row">
                <div className="col mt-4">
                    <h2 className="mb-3">Image Upload</h2>
                    {selectedFile && (
                        <div className="mb-4">
                            <img src={imagePreview} alt="Selected" className="img-fluid w-55" />
                        </div>
                    )}
                    <div className="row">
                        <div className="col-6">
                            <input type="file" className="form-control w-100" accept="image/*" onChange={handleFileChange} />
                        </div>
                        <div className="col">
                            <button className="btn btn-primary" onClick={handleUpload}>
                                Upload
                            </button>
                        </div>
                    </div>
                    {uploadError ? (
                        <div className="alert alert-danger mt-4" role="alert">
                            {uploadError}
                        </div>
                    ) : null}
                </div>
                {loading ? (
                    <div class="col mt-4 mx-auto justify-content-center">
                        <div class="spinner-border text-danger" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : response ? (
                    <div className="col mt-4">
                        <h2>Predicted Attributes</h2>
                        <ul className="list-group list-group-item-action text-primary-emphasis">
                            {response.attributes_array.map((value, index) => (
                                value === 1 ? (
                                    <li key={index} className="list-group-item list-group-item-action list-group-item-dark">
                                        {labelsMapping[index]}
                                    </li>
                                ) : null
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="col mt-4">
                        <h2>Upload An Image to Get Attributes</h2>
                        <p>
                            Once you upload an image, our system will analyze it, and you'll receive predictions about the person's attributes.
                            Click the "Upload" button to get started!
                        </p>
                    </div>
                )}
            </div>


        </div>
    );
};

export default App;