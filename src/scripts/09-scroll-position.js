        window.addEventListener("scroll", function(e) {
          document.getElementById("SETTING").style.left = Math.max(
            4,
            40 - window.scrollX
          );
        });
