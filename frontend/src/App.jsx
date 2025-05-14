import { useState } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "C:/Programming/React/chrome_extension/chrome_extension/public/Animation - 1747194683619.json";
import { useRef } from "react";

function App() {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  const [summaryText, setSummaryText] = useState("");
  const [loading, setLoading] = useState(false);
  const xhrRef = useRef(null);

  function handleClick() {
    
    if (loading && xhrRef.current){
      xhrRef.current.abort();
      setSummaryText("Summarization stopped");
      setLoading(false);
    } 
    else{
      setLoading(true);
      setSummaryText(" ");
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        const url = tabs[0].url;
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        if (url.includes("youtube.com")) {
          xhr.open("GET", "http://127.0.0.1:5000/summary?url=" + url, true);
        } else {
          xhr.open("GET", "http://127.0.0.1:5000/websummary?url=" + url, true);
        }
        xhr.onload = function () {
          const text = xhr.responseText;
          if (xhr.status === 200) {
            setSummaryText(text);
          } else {
            setSummaryText("Failed to Summarize! Please try again later.");
          }
          setLoading(false);
        };
        xhr.send();
      });
    }
  }


  return (
    <>
      <div className="side-bar">
        <div className="summary-area">
          {!summaryText && (
            <div className="heading">
              <h1>Hello,</h1>
              <p>Summarize anything you wish</p>
            </div>
          )}
          <div className="summary">{summaryText}</div>
        </div>
        <div className="bottom-bar">
          <button className="summarize-button" onClick={handleClick}>
            {loading ? (
              <Lottie className="lottieanimation" animationData={loadingAnimation}/>
            ) : (
              "Summarize"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
