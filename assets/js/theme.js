var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: light)");

if (prefersDarkScheme.matches) {
    document.body.classList.toggle('light');
} else {
    document.body.classList.toggle('dark');
} 


// Dark mode playground 👇
/*
function lightMode() {
    document.body.classList.toggle('light');
}
  
window.matchMedia("(prefers-color-scheme: light)").addEventListener('change',
    theme => theme.matches && lightMode()
); */

/*
window.matchMedia('(prefers-color-scheme: light)').addEventListener( "change", (e) => {
    if (e.matches) {
        console.log("🌝 you're in light mode");
        document.body.classList.toggle('light');
    }
    else {
        console.log("🌚 you're in dark mode");
        document.body.classList.toggle('dark');
    }
  });
*/

/*
window.matchMedia('(prefers-color-scheme: light)')
      .addEventListener('change', event => {
  if (event.matches) {
    //light mode
    //document.body.classList.toggle('light');
  } else {
    //document.body.classList.toggle('');
  }
})
*/