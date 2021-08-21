from pdf_mail import sendpdf 
from fpdf import FPDF
import pathlib
import os 
from dotenv import load_dotenv
from flask import request, jsonify, Flask
from google.cloud import vision
import speech_recognition as sr
import io

app = Flask(__name__)
client = vision.ImageAnnotatorClient()


load_dotenv()  # take environment variables from .env.

@app.route('/sendNotes/Speech2Text')
def sendNodesSpeech():
    r = sr.Recognizer()

    with sr.AudioFile('test.wav') as source:
        audio_text= r.listen(source)
    try:
        
        # using google speech recognition
        text = r.recognize_google(audio_text)
        print('Converting audio transcripts into text ...')
        print(text)
     
    except:
         print('Sorry.. run again...')

    return {"message": "workes"}

@app.route('/sendNotes/OCR', methods = ['POST'])
def sendNotes():
    path = 'test.png'
    with io.open(path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.document_text_detection(image=image)
    docText = response.full_text_annotation.text
    f= open("test.txt","w+", encoding='utf-8')
    f.write(docText)
    print(docText)
   
    if response.error.message:
        return {"message": 'error'}

    EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')
    pdf = FPDF()   
    
    # Add a page
    pdf.add_page()
    pdf.set_font("Times", size = 15)

    f = open("test.txt", "r")
    for x in f:
        pdf.cell(200, 10, txt = x, ln = 1, align = 'L')
    
    # Store the pdf created
    pdf.output("test.pdf") 


   # Create email service 
    emailService = sendpdf("emailsendingpdf@gmail.com", 
                "myhealthpaluw@gmail.com", 
                EMAIL_PASSWORD, 
                "Flask Request", 
                "BODYYY", 
                "test", 
                pathlib.Path().resolve()) 

  #  send email
    emailService.email_send()
    os.remove("test.pdf")
    #Delete TXT file
    #os.remove("test.txt")

    return {"message": "Emailed notes"}

    
@app.route('/deleteFile', methods =['DELETE'])
def deleteFile ():
    os.remove("test.txt")

    return {"message": "File deleted"}


    
if __name__ == "__main__":
    app.run(debug=True)