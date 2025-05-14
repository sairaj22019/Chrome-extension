from flask import Flask, request
from youtube_transcript_api import YouTubeTranscriptApi
from transformers import pipeline
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)

@app.get('/summary')
def summary_api():
    url = request.args.get('url','')
    video_id = url.split('=')[1]
    summary = get_summary(get_transcript(video_id))
    return summary.strip(), 200

@app.get('/websummary')
def web_summary_api():
    url = request.args.get('url','')
    html_text = requests.get(url).text
    soup = BeautifulSoup(html_text, 'lxml')
    paragraphs = soup.find_all('p')
    webpage_text = '' 
    for paragraph in paragraphs:
        webpage_text = webpage_text + paragraph.text
    summary = get_summary(webpage_text)
    return summary.strip(), 200

def get_transcript(video_id):
    transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
    transcript = ' '.join([d['text'] for d in transcript_list])
    return transcript

summariser = pipeline('summarization',model='facebook/bart-large-cnn',device=-1)
def get_summary(transcript):
    summary = ''
    for i in range(0, (len(transcript)//1000)+1):
        summary_text = summariser(transcript[i*1000:(i+1)*1000])[0]["summary_text"]
        summary = summary + summary_text + ' '
    return summary

if __name__ == '__main__':
    app.run()
