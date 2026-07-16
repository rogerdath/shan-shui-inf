            MEM.lasttick = new Date().getTime();
            document.getElementById("INP_SEED").value = SEED;
            document
              .getElementById("BG")
              .setAttribute("style", "width:" + MEM.windx + "px");
            update();
            document.body.scrollTo(0, 0);
            console.log(["SCROLLX", window.scrollX]);
            present();
            //draw();
