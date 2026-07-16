MEM = {
    canv: "",
    chunks: [],
    xmin: 0,
    xmax: 0,
    cwid: 512,
    cursx: 0,
    lasttick: 0,
    windx: 3000,
    windy: 800,
    planmtx: [],
  };

  function dummyloader(xmin, xmax) {
    for (var i = xmin; i < xmax; i += 200) {
      //MEM.chunks.push({tag:"?",x:i,y:100,canv:Tree.tree08(i,500,i)})
      //MEM.chunks.push({tag:"?",x:i,y:100,canv:Man.man(i,500)})
      //MEM.chunks.push({tag:"?",x:i,y:100,canv:Arch.arch01(i,500)})
      //MEM.chunks.push({tag:"?",x:i,y:100,canv:Arch.boat01(i,500)})
      //MEM.chunks.push({tag:"?",x:i,y:100,canv:Arch.transmissionTower01(i,500)})
      MEM.chunks.push({
        tag: "?",
        x: i,
        y: 100,
        canv: Arch.arch02(i, 500, 0, { sto: 1, rot: Math.random() }),
      });
    }
  }

  function chunkloader(xmin, xmax) {
    var add = function(nch) {
      if (nch.canv.includes("NaN")) {
        console.log("gotcha:");
        console.log(nch.tag);
        nch.canv = nch.canv.replace(/NaN/g, -1000);
      }
      if (MEM.chunks.length == 0) {
        MEM.chunks.push(nch);
        return;
      } else {
        if (nch.y <= MEM.chunks[0].y) {
          MEM.chunks.unshift(nch);
          return;
        } else if (nch.y >= MEM.chunks[MEM.chunks.length - 1].y) {
          MEM.chunks.push(nch);
          return;
        } else {
          for (var j = 0; j < MEM.chunks.length - 1; j++) {
            if (MEM.chunks[j].y <= nch.y && nch.y <= MEM.chunks[j + 1].y) {
              MEM.chunks.splice(j + 1, 0, nch);
              return;
            }
          }
        }
      }
      console.log("EH?WTF!");
      console.log(MEM.chunks);
      console.log(nch);
    };

    while (xmax > MEM.xmax - MEM.cwid || xmin < MEM.xmin + MEM.cwid) {
      console.log("generating new chunk...");

      var plan;
      if (xmax > MEM.xmax - MEM.cwid) {
        plan = mountplanner(MEM.xmax, MEM.xmax + MEM.cwid);
        MEM.xmax = MEM.xmax + MEM.cwid;
      } else {
        plan = mountplanner(MEM.xmin - MEM.cwid, MEM.xmin);
        MEM.xmin = MEM.xmin - MEM.cwid;
      }

      for (var i = 0; i < plan.length; i++) {
        if (plan[i].tag == "mount") {
          add({
            tag: plan[i].tag,
            x: plan[i].x,
            y: plan[i].y,
            canv: Mount.mountain(plan[i].x, plan[i].y, i * 2 * Math.random()),
            //{col:function(x){return "rgba(100,100,100,"+(0.5*Math.random()*plan[i].y/MEM.windy)+")"}}),
          });
          add({
            tag: plan[i].tag,
            x: plan[i].x,
            y: plan[i].y - 10000,
            canv: water(plan[i].x, plan[i].y, i * 2),
          });
        } else if (plan[i].tag == "flatmount") {
          add({
            tag: plan[i].tag,
            x: plan[i].x,
            y: plan[i].y,
            canv: Mount.flatMount(
              plan[i].x,
              plan[i].y,
              2 * Math.random() * Math.PI,
              {
                wid: 600 + Math.random() * 400,
                hei: 100,
                cho: 0.5 + Math.random() * 0.2,
              },
            ),
          });
        } else if (plan[i].tag == "distmount") {
          add({
            tag: plan[i].tag,
            x: plan[i].x,
            y: plan[i].y,
            canv: Mount.distMount(plan[i].x, plan[i].y, Math.random() * 100, {
              hei: 150,
              len: randChoice([500, 1000, 1500]),
            }),
          });
        } else if (plan[i].tag == "boat") {
          add({
            tag: plan[i].tag,
            x: plan[i].x,
            y: plan[i].y,
            canv: Arch.boat01(plan[i].x, plan[i].y, Math.random(), {
              sca: plan[i].y / 800,
              fli: randChoice([true, false]),
            }),
          });
        } else if (plan[i].tag == "redcirc") {
          add({
            tag: plan[i].tag,
            x: plan[i].x,
            y: plan[i].y,
            canv:
              "<circle cx='" +
              plan[i].x +
              "' cy='" +
              plan[i].y +
              "' r='20' stroke='black' fill='red' />",
          });
        } else if (plan[i].tag == "greencirc") {
          add({
            tag: plan[i].tag,
            x: plan[i].x,
            y: plan[i].y,
            canv:
              "<circle cx='" +
              plan[i].x +
              "' cy='" +
              plan[i].y +
              "' r='20' stroke='black' fill='green' />",
          });
        }
        // add ({
        //   x: plan[i].x,
        //   y: plan[i].y,
        //   canv:"<circle cx='"+plan[i].x+"' cy='"+plan[i].y+"' r='20' stroke='black' fill='red' />"
        // })
      }
    }
  }

  function chunkrender(xmin, xmax) {
    MEM.canv = "";

    for (var i = 0; i < MEM.chunks.length; i++) {
      if (
        xmin - MEM.cwid < MEM.chunks[i].x &&
        MEM.chunks[i].x < xmax + MEM.cwid
      ) {
        MEM.canv += MEM.chunks[i].canv;
      }
    }
  }

  document.addEventListener("mousemove", onMouseUpdate, false);
  document.addEventListener("mouseenter", onMouseUpdate, false);
  mouseX = 0;
  mouseY = 0;
  function onMouseUpdate(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
  }

  function calcViewBox() {
    var zoom = 1.142;
    return "" + MEM.cursx + " 0 " + MEM.windx / zoom + " " + MEM.windy / zoom;
  }

  function viewupdate() {
    try {
      document.getElementById("SVG").setAttribute("viewBox", calcViewBox());
    } catch (e) {
      console.log("not possible");
    }
    //setTimeout(viewupdate,100)
  }

  function needupdate() {
    return true;
    if (MEM.xmin < MEM.cursx && MEM.cursx < MEM.xmax - MEM.windx) {
      return false;
    }
    return true;
  }

  function update() {
    //console.log("update!")

    self.chunkloader(MEM.cursx, MEM.cursx + MEM.windx);
    self.chunkrender(MEM.cursx, MEM.cursx + MEM.windx);

    document.getElementById("BG").innerHTML =
      "<svg id='SVG' xmlns='http://www.w3.org/2000/svg' width='" +
      MEM.windx +
      "' height='" +
      MEM.windy +
      "' style='mix-blend-mode:multiply;'" +
      "viewBox = '" +
      calcViewBox() +
      "'" +
      "><g id='G' transform='translate(" +
      0 +
      ",0)'>" +
      MEM.canv +
      //+ "<circle cx='0' cy='0' r='50' stroke='black' fill='red' />"
      "</g></svg>";

    //setTimeout(update,1000);
  }
