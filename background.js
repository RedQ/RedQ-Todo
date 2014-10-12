chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('hold.html', {
    'bounds': {
      'width': 400,
      'height': 500
    }
  });
});