from flask import Flask, request, jsonify
from pymongo import MongoClient
import os
import speech_recognition as sr
from pydub import AudioSegment
import tempfile

app = Flask(__name__)

# MongoDB Atlas connection
client = MongoClient("mongodb+srv://23mx302:bharbhar@senti.azz4m.mongodb.net/?retryWrites=true&w=majority&appName=senti")
db = client['senti']  # Database name
reviews_collection = db['sentiments']  # Collection name

recognizer = sr.Recognizer()

def convert_mp3_to_wav(mp3_file):
    sound = AudioSegment.from_mp3(mp3_file)
    wav_file = mp3_file.replace(".mp3", ".wav")
    sound.export(wav_file, format="wav")
    return wav_file

def convert_audio_to_text(audio_file):
    try:
        with sr.AudioFile(audio_file) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            return text
    except sr.UnknownValueError:
        return "Speech recognition could not understand the audio."
    except sr.RequestError as e:
        return f"Error with the API: {e}"

@app.route('/api/upload', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    
    if audio_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if audio_file and audio_file.filename.endswith('.mp3'):
        try:

            with tempfile.TemporaryDirectory() as temp_dir:
                mp3_path = os.path.join(temp_dir, audio_file.filename)
                audio_file.save(mp3_path)

                wav_path = convert_mp3_to_wav(mp3_path)

                transcribed_text = convert_audio_to_text(wav_path)

                reviews_collection.insert_one({"aud-review": transcribed_text})

                return jsonify({"transcribedText": transcribed_text})
        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    return jsonify({"error": "Invalid file type. Please upload an MP3 file."}), 400

if __name__ == '__main__':
    app.run(port=5000)
