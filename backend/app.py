from pdf_mail import sendpdf 
from fpdf import FPDF
import pathlib
import os 
from dotenv import load_dotenv
from flask import request, jsonify, Flask
from google.cloud import vision
import speech_recognition as sr
import io
import base64


app = Flask(__name__)
client = vision.ImageAnnotatorClient()


load_dotenv()  # take environment variables from .env.

@app.route('/sendNotes/Speech2Text', methods = ['POST'])
def sendNodesSpeech():
    toEmail = request.form['toEmail']
    fileName = request.form['fileName']

    r = sr.Recognizer()
    EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

    f = request.files['audio']

    with open (f'{fileName}.wav', 'wb') as audio:
        f.save(audio)
    with sr.AudioFile(f'{fileName}.wav') as source:
        audio_text= r.listen(source)
    try:   
        # using google speech recognition
        text = r.recognize_google(audio_text)
        print('Converting audio transcripts into text ...')
        print(text)
        f= open("test.txt","w+", encoding='utf-8')
        f.write(text)

        pdf = FPDF()   
    
    # Add a page
        pdf.add_page()
        pdf.set_font("Times", size = 15)

        f = open("test.txt", "r")
        for x in f:
            pdf.cell(200, 10, txt = x, ln = 1, align = 'L')
        
        # Store the pdf created
        pdf.output(f"{fileName}.pdf") 


    # Create email service 
        emailService = sendpdf("emailsendingpdf@gmail.com", 
                    f"{toEmail}", 
                    EMAIL_PASSWORD, 
                    f"{fileName} ", 
                    "Your Notes Are Attached To This Email.", 
                    f"{fileName}", 
                    pathlib.Path().resolve()) 

    #  send email
        emailService.email_send()
        with open(f"{fileName}.pdf", "rb") as pdf_file:
            encoded_bytes = base64.b64encode(pdf_file.read())
        os.remove(f"{fileName}.pdf")
        os.remove(f'{fileName}.wav')
        #Delete TXT file
        #os.remove("test.txt")

    except:
         return {"message": "Please Record again"}

    return {"message": encoded_bytes.decode('utf-8')}


@app.route('/sendNotes/OCR', methods =['POST'])
def sendMultipleImages():
    toEmail = request.json['toEmail']
    fileName = request.json['fileName']
    imageArray = request.json['imageArray']
    for i in range(len(imageArray)):
        if i==0:
            imgdata = base64.b64decode(imageArray[i])
            filename = f'converted{i}.jpg'  #
            with open(filename, 'wb') as f:
                f.write(imgdata)
            with io.open(filename, 'rb') as image_file:
                content = image_file.read()

            image = vision.Image(content=content)

            response = client.document_text_detection(image=image)
            docText = response.full_text_annotation.text
            print(docText)
            f= open("test.txt","w+", encoding='utf-8')
            f.write(docText)
            if response.error.message:
                 return {"message": response.error.message}
            os.remove(f"{filename}")

        else:
            imgdata = base64.b64decode(imageArray[i])
            filename = 'converted.jpg'  #
            with open(filename, 'wb') as f:
                f.write(imgdata)
            with io.open(filename, 'rb') as image_file:
                content = image_file.read()

            image = vision.Image(content=content)
            response = client.document_text_detection(image=image)
            docText = response.full_text_annotation.text
            print(docText)
            f= open("test.txt","a", encoding='utf-8')
            f.write('\n')
            f.write('\n')
            f.write('\n')
            f.write(docText)
            os.remove(f"{filename}")

     
    pdf = FPDF()   
    
    # Add a page
    pdf.add_page()
    pdf.set_font("Times", size = 15)

    f = open("test.txt", "r")
    for x in f:
        pdf.cell(200, 10, txt = x, ln = 1, align = 'L')
    
    # Store the pdf created
    pdf.output(f"{fileName}.pdf") 

    emailService(toEmail, fileName)
    #Create pdf string
    with open(f"{fileName}.pdf", "rb") as pdf_file:
        encoded_bytes = base64.b64encode(pdf_file.read())
    os.remove(f"{fileName}.pdf")

    return {"output": encoded_bytes.decode('utf-8')}
 
@app.route('/deleteFile', methods =['DELETE'])
def deleteFile ():
    os.remove("test.txt")

    return {"message": "File deleted"}


def emailService(toEmail, fileName):
    EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

    # Create email service 
    emailService = sendpdf("emailsendingpdf@gmail.com", 
                f"{toEmail}", 
                EMAIL_PASSWORD, 
                f"{fileName} PDF Notes", 
                "Your Notes Are Attached To This Email.", 
                f"{fileName}", 
                pathlib.Path().resolve()) 

  #  send email
    emailService.email_send()
    return True


if __name__ == "__main__":
    app.run(debug=True)