import { proxiedUrlFor } from "../utils/media-url-utils";
import silhouetteImg from "../assets/onBoard/strings-silhouette.jpg";
import silhouetteImg0 from "../assets/onBoard/strings-silhouette-0D.png";
import silhouetteImg1 from "../assets/onBoard/strings-silhouette-1D.png";
import silhouetteImg2 from "../assets/onBoard/strings-silhouette-2D.png";
import silhouetteImg3 from "../assets/onBoard/strings-silhouette-3D.png";
import silhouetteImg0H from "../assets/onBoard/strings-silhouette-0H.png";
import silhouetteImg1H from "../assets/onBoard/strings-silhouette-1H.png";
import silhouetteImg2H from "../assets/onBoard/strings-silhouette-2H.png";
import silhouetteImg3H from "../assets/onBoard/strings-silhouette-3H.png";


class StringsFloormatClass {

    constructor() {
    }

    //--------------------------------------------------

    init() {

        let perfMode = 0;
        let prevPerfMode = 0;
        let floormatCreated = false;

        let isConnected = false;
        let id;
        let zonesActivatedClem = [0, 0, 0, 0];
        let zonesAvailable = [0, 0, 0, 0];
        let quadrantsCurr = [0, 0, 0, 0];
        let allPlayers = [];
        let circles = [];
        let playersOnMat;

        //--- WS
        const wsClem = new WebSocket(serverAddress, 'wss');      // live version wss

        wsClem.onopen = (e) => {
            wsClem.send(`${Math.random() * Math.pow(10, 7)}`);
            isConnected = true;
            console.log("------We are connected to strings.dance. Hooray!")
          }
      
        wsClem.onmessage = async (e) => {
            let {data} = e;
            if (typeof data === 'string') {
                id = JSON.parse(data).id
            }
            else {
                if (data.arrayBuffer) {
                const buffer = await data.arrayBuffer();
                const parsed = new Float32Array(buffer);
                routeMessage(parsed);
                }
            }
        }
      
        // Handle messages coming in
        function routeMessage(m) {
            //console.log(m);
        
            // Zones available
            zonesAvailable = m.slice(0, 4);
        
            // Zones %
            zonesActivatedClem = m.slice(4, 8);

            // Player positions
            allPlayers = m.slice(8, m.length-1);

            // Performance mode
            prevPerfMode = perfMode;
            perfMode = m[m.length-1];

            if(prevPerfMode != perfMode) {
                console.log(perfMode);
            
                if(perfMode >= 2 && perfMode < 5 && floormatCreated == false) {
                    addObjectsToScene();
                }
                if(perfMode == 5 && floormatCreated == true) {
                    clearScene();
                }
            }
        }      
      

        //--- All materials 
        const zonesMatDefault0 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(silhouetteImg0), transparent:true });
        const zonesMatDefault1 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(silhouetteImg1), transparent:true });
        const zonesMatDefault2 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(silhouetteImg2), transparent:true });
        const zonesMatDefault3 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(silhouetteImg3), transparent:true });
        const zonesMatDefault = [zonesMatDefault0, zonesMatDefault1, zonesMatDefault2, zonesMatDefault3];

        const zonesMatHover0 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(silhouetteImg0H), transparent:true });
        const zonesMatHover1 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(silhouetteImg1H), transparent:true });
        const zonesMatHover2 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(silhouetteImg2H), transparent:true });
        const zonesMatHover3 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(silhouetteImg3H), transparent:true });
        const zonesMatHover = [zonesMatHover0, zonesMatHover1, zonesMatHover2, zonesMatHover3];

        const zonesMatBlue = new THREE.MeshBasicMaterial({ 
            color: 0x3FA7D6, 
            opacity: 0.9,
            transparent:true});

        const zonesMatProgress = new THREE.MeshBasicMaterial({ 
            color: 0xD2D3DB,
            opacity: 0.5,
            transparent:true });  


        //--- Play area (4 zones)
        const zonesW = 6;
        const zonesH = 8;
        const zoneGeo = new THREE.PlaneGeometry(zonesW, zonesH);
    
        const playAreaStartX = -zonesW;
        const playAreaStartZ = -zonesH -9;
        const playAreaW = zonesW * 2;
        const playAreaH = zonesH * 2;
    
        // Zone 0
        const zone0 = new THREE.Mesh(zoneGeo, zonesMatDefault[0]);
        zone0.rotation.x = Math.PI * -.5;
        zone0.position.set(-zonesW / 2 - 0.1, 0.41, -zonesH / 2 - 0.1 -9);
        zone0.matrixAutoUpdate = true;

        // Zone 1
        const zone1 = new THREE.Mesh(zoneGeo, zonesMatDefault[1]);
        zone1.rotation.x = Math.PI * -.5;
        zone1.position.set(zonesW / 2 + 0.1, 0.41, -zonesH / 2 - 0.1 -9);
        zone1.matrixAutoUpdate = true;
    
        // Zone 2
        const zone2 = new THREE.Mesh(zoneGeo, zonesMatDefault[2]);
        zone2.rotation.x = Math.PI * -.5;
        zone2.position.set(-zonesW / 2 - 0.1, 0.41, zonesH / 2 + 0.1 -9);
        zone2.matrixAutoUpdate = true;
    
        // Zone 3
        const zone3 = new THREE.Mesh(zoneGeo, zonesMatDefault[3]);
        zone3.rotation.x = Math.PI * -.5;
        zone3.position.set(zonesW / 2 + 0.1, 0.41, zonesH / 2 + 0.1 -9);
        zone3.matrixAutoUpdate = true;

        const zones = [zone0, zone1, zone2, zone3];
        let zonesAcivatedPlayer = [0, 0, 0, 0];
    
    
        //--- Control UI (vertical)
    
        // 4 quadrants for progress bar
        const quadrantW = zonesW/4*0.8;
        const quadrantH = zonesH/4;
        const quadrantGeo = new THREE.PlaneGeometry(quadrantW, quadrantH); 
    
        const quadrant0 = new THREE.Mesh(quadrantGeo, zonesMatProgress);
        quadrant0.position.set(-quadrantW/2-0.05, -quadrantH/2-0.05, 0);
        quadrant0.matrixAutoUpdate = true;      // need this to update size while running
    
        const quadrant1 = new THREE.Mesh(quadrantGeo, zonesMatProgress);
        quadrant1.position.set(quadrantW/2+0.05, -quadrantH/2-0.05, 0);
        quadrant1.matrixAutoUpdate = true;
    
        const quadrant2 = new THREE.Mesh(quadrantGeo, zonesMatProgress);
        quadrant2.position.set(-quadrantW/2-0.05, quadrantH/2+0.05, 0);
        quadrant2.matrixAutoUpdate = true;
    
        const quadrant3 = new THREE.Mesh(quadrantGeo, zonesMatProgress);
        quadrant3.position.set(quadrantW/2+0.05, quadrantH/2+0.05, 0);
        quadrant3.matrixAutoUpdate = true;
    
        const quadrants = [quadrant0, quadrant1, quadrant2, quadrant3];
        const quadrantsOriginPosX = [quadrant0.position.x, quadrant1.position.x, quadrant2.position.x, quadrant3.position.x];
        const quadrantsOriginPosY = [quadrant0.position.y, quadrant1.position.y, quadrant2.position.y, quadrant3.position.y];
    
        // Background image with silhouette
        const imgSilhouette = new THREE.TextureLoader().load(silhouetteImg);
    
        const bgImgTexture = new THREE.MeshBasicMaterial({ map: imgSilhouette });
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(quadrantW*2+0.1, quadrantH*2+0.1), bgImgTexture);
        plane.scale.y = -1; // Flip image
        plane.position.set(0, -quadrantH, -0.05);   
        
        // UI Group
        const ui = new THREE.Group();
        ui.add(quadrant0);
        ui.add(quadrant1);
        ui.add(quadrant2);
        ui.add(quadrant3);
        ui.add(plane);

        ui.rotation.y = Math.PI * .1;
        ui.scale.y = -1;
        ui.position.set(- 7, 2, -11.5 -9);


        //--- Number of participants on UI
        const textCanvas = document.createElement( 'canvas' );
        textCanvas.height = 34;

        function createNumText( text, posX, posY ) {
        
            const ctx = textCanvas.getContext( '2d' );
            const font = '20px arial';
        
            ctx.font = font;
            textCanvas.width = Math.ceil( ctx.measureText( text ).width + 25 );
        
            ctx.font = font;
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 8;
            ctx.lineJoin = 'miter';
            ctx.miterLimit = 3;
            //ctx.strokeText( text, 8, 26 );
            ctx.fillStyle = '#666666';
            ctx.fillText( text, 8, 26 );
        
            const spriteMap = new THREE.Texture( ctx.getImageData( 0, 0, textCanvas.width, textCanvas.height ) );
            spriteMap.minFilter = THREE.LinearFilter;
            spriteMap.generateMipmaps = false;
            spriteMap.needsUpdate = true;
        
            const sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: spriteMap } ) );
            sprite.scale.set( 0.8 * textCanvas.width / textCanvas.height, 0.5, 1 );
            sprite.position.x = posX ;
            sprite.position.y = posY ;
            sprite.position.z = 0.1 ;
        
            return sprite;
        }
        
        function updateNumText( sprite, text, isFull ) {
                
            const ctx = textCanvas.getContext( '2d' );
            const font = '20px arial';
        
            ctx.font = font;
            textCanvas.width = Math.ceil( ctx.measureText( text ).width + 25 );
        
            ctx.font = font;
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 8;
            ctx.lineJoin = 'miter';
            ctx.miterLimit = 3;
            //ctx.strokeText( text, 8, 26 );
            if(isFull) {
                ctx.fillStyle = 'white';
            } else {
                ctx.fillStyle = '#666666';
            }
            ctx.fillText( text, 10, 26 );
        
            const spriteMap = new THREE.Texture( ctx.getImageData( 0, 0, textCanvas.width, textCanvas.height ) );
            spriteMap.minFilter = THREE.LinearFilter;
            spriteMap.generateMipmaps = false;
            spriteMap.needsUpdate = true;
        
            sprite.material = new THREE.SpriteMaterial( { map: spriteMap } );
            //sprite.scale.set( 0.5 * textCanvas.width / textCanvas.height, 0.5, 1 );
        
        }
    
        const num0 = createNumText("X", -quadrantW + 0.4, -quadrantH*2 + 0.2);
        const num1 = createNumText("X", quadrantW - 0.3, -quadrantH*2 + 0.2);
        const num2 = createNumText("X", -quadrantW + 0.4,  - 0.2);
        const num3 = createNumText("X", quadrantW - 0.3, - 0.2);

        const numbers = [num0, num1, num2, num3];
                
        ui.add(num0);
        ui.add(num1);
        ui.add(num2);
        ui.add(num3);


        
        //--- Add to scene
        function addObjectsToScene() {
            console.log("----Creating floormat");
            floormatCreated = true;
            AFRAME.scenes[0].object3D.add(zone0);
            AFRAME.scenes[0].object3D.add(zone1);
            AFRAME.scenes[0].object3D.add(zone2);
            AFRAME.scenes[0].object3D.add(zone3);
            AFRAME.scenes[0].object3D.add(ui);
            
        }

        function clearScene() {
            console.log("----Removing floormat");
            floormatCreated = false;
            AFRAME.scenes[0].object3D.remove(zone0);
            AFRAME.scenes[0].object3D.remove(zone1);
            AFRAME.scenes[0].object3D.remove(zone2);
            AFRAME.scenes[0].object3D.remove(zone3);
            AFRAME.scenes[0].object3D.remove(ui);
        }
      
      
        //--- Animations

        let startTimer = Date.now();
    
        function animRender(time) {
            time *= 0.001;  // convert time to seconds
            let timer = Date.now();
        
            //-- Put here the things that need to be updated
            
            if(perfMode >= 2 && perfMode <5) {

                // % of player position related to play area
                let playerPos = AFRAME.scenes[0].querySelector("#avatar-rig").object3D.position
                let playerAreaPosX = -(playAreaStartX - playerPos.x) / playAreaW;
                let playerAreaPosZ = -(playAreaStartZ - playerPos.z) / playAreaH;
            
                // Test if inside a zone
                zonesAcivatedPlayer = [0, 0, 0, 0];
                if (playerAreaPosX > 0 && playerAreaPosX <= 0.5) {  //left side
                    if (playerAreaPosZ > 0 && playerAreaPosZ <= 0.5) zonesAcivatedPlayer[0] = 1;
                    if (playerAreaPosZ > 0.5 && playerAreaPosZ <= 1) zonesAcivatedPlayer[2] = 1;
                } else if (playerAreaPosX > 0.5 && playerAreaPosX <= 1) {  //right side
                    if (playerAreaPosZ > 0 && playerAreaPosZ <= 0.5) zonesAcivatedPlayer[1] = 1;
                    if (playerAreaPosZ > 0.5 && playerAreaPosZ <= 1) zonesAcivatedPlayer[3] = 1;
                }
            
                // Update visibility
                for (let i = 0; i < 4; i++) {
                    if (zonesAvailable[i] == 0) {
                    zones[i].visible = false;
                    quadrants[i].visible = false;
                    } else {
                    zones[i].visible = true;
                    quadrants[i].visible = true;
                    }
                }
            
                // Update floormat colours
                for (let i = 0; i < 4; i++) {
                    if (zonesActivatedClem[i] == 1) {
                    zones[i].material = zonesMatBlue;
                    } else {
                    if (zonesAcivatedPlayer[i] == 1) {
                        zones[i].material = zonesMatHover[i];
                    } else {
                        zones[i].material = zonesMatDefault[i];
                    }
                    }
                }

                // Update players circles
                playersOnMat = 0;
                for(let i = 0; i < (allPlayers.length)/5; i++) {
                    if(circles[i]){
                        //update
                        circles[i].position.set(-quadrantW + quadrantW*allPlayers[i*5+2]*2, -quadrantH*2 + quadrantH*allPlayers[i*5+3]*2, 0.01);
                    } else {
                        //create
                        const circleGeo = new THREE.CircleGeometry( 0.09, 8);
                        const circleMat = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
                        const circle = new THREE.Mesh( circleGeo, circleMat );
                        circle.position.set(-quadrantW + quadrantW*allPlayers[i*5+2]*2, -quadrantH*2 + quadrantH*allPlayers[i*5+3]*2, 0.01);
                        circle.matrixAutoUpdate = true;
                        circles.push(circle);
                        ui.add( circle );
                    }
                    if(allPlayers[i*5+2] < 0 || allPlayers[i*5+2] > 1 || allPlayers[i*5+3] < 0 || allPlayers[i*5+3] > 1) {
                        circles[i].visible = false;     // hide circle when outside of area
                    } else {
                        circles[i].visible = true;
                        playersOnMat++;
                    }
                }

                if(allPlayers.length/5 < circles.length) {
                    // delete existing circles
                    for(let i = allPlayers.length/5; i < circles.length; i++) {
                        ui.remove(circles[i]);
                        circles.splice(i, 1);
                    }
                }
                    
            
                // Update progress bars
                for (let i = 0; i < 4; i++) {
                    // Animation
                    if (Math.abs(quadrantsCurr[i]-zonesActivatedClem[i]) <= 0.05) {  // avoid flickering
                    quadrantsCurr[i] = zonesActivatedClem[i]; 
                    } else {
                        if (quadrantsCurr[i] < zonesActivatedClem[i]) {
                            quadrantsCurr[i] += 0.05;
                        } else if (quadrantsCurr[i] > zonesActivatedClem[i]) {
                            quadrantsCurr[i] -= 0.05;
                        }
                    }
            
                    if (quadrantsCurr[i] == 0)  {
                    quadrants[i].scale.y = 0.01;  // Bug if scale == 0
                    } else {
                    quadrants[i].scale.y = quadrantsCurr[i];
                    }
                    
                    // Lock at the bottom
                    quadrants[i].position.set(quadrantsOriginPosX[i], quadrantsOriginPosY[i] - (quadrantH/2 + quadrantH*quadrants[i].scale.y/2) , 0);
                
                    // Colours
                    if (quadrantsCurr[i] == 1) {
                    quadrants[i].material = zonesMatBlue;
                    } else {
                    quadrants[i].material = zonesMatProgress;
                    }
                
                }

                // Update numbers
                for (let i = 0; i < 4; i++) {
                    if(circles.length * quadrantsCurr[i] < circles.length){
                        updateNumText(numbers[i], Math.round( Math.ceil(playersOnMat*0.51) * quadrantsCurr[i]) + "/" + Math.ceil( playersOnMat*0.51), false);
                    } else {
                        updateNumText(numbers[i], "✓", true);
                    }
                }

            
                // Send data
                if (timer - startTimer > 150 && isConnected) {
                    const data = new Float32Array(8);
                    data[0] = playerAreaPosX;
                    data[1] = playerAreaPosZ;
            
                    let sumZones = zonesAcivatedPlayer[0] + zonesAcivatedPlayer[1] + zonesAcivatedPlayer[2] + zonesAcivatedPlayer[3];
                    if (sumZones != 0) {
                        data[2] = 1
                    } else {
                        data[2] = 0;
                    }
            
                    data[3] = zonesAcivatedPlayer[0];
                    data[4] = zonesAcivatedPlayer[1];
                    data[5] = zonesAcivatedPlayer[2];
                    data[6] = zonesAcivatedPlayer[3];
            
                    data[7] = 25;
            
                    wsClem.send(data);
            
                    startTimer = Date.now();
                }
            }
        
            requestAnimationFrame(animRender);
        }
    
        requestAnimationFrame(animRender);
    
    }
}


//-------------------------------------------------------------




export default StringsFloormatClass;
