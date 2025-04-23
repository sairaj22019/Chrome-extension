function App() {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  return(
    <>
      <div className="summary-area">
        <div className="heading">
          <h1>Hello,</h1>
          <p>Summarize anything you wish</p>
        </div>
      </div>
      <button className="summarize-button">Summarize</button>
    </>
  )
}

export default App
