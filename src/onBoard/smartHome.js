//mike
console.log('SMART HOME TIME');

setInterval(() => {
        if (window.smartHomeStartSoundTracking) {
                window.smartHomeSoundLevel = AFRAME.scenes[0].systems["local-audio-analyser"].volume;
                //console.log(window.smartHomeSoundLevel);
        }
}, 20);


//function smartHomeDefineFunctions() {
        window.smartHomeNetworkedObjects = [];


        // Set Screen Share in Position
        window.smartHomeSetupSS = function() {
            console.log('screen share setup called')
            window.smartHomeCurrentNetworkedObjects = document.querySelectorAll("[media-loader][networked]");
            window.smartHomeIndex = document.querySelectorAll("[media-loader][networked]").length - 1; 
        }
    
        // Set Elements in Starting Positions
        window.smartHomeSetup = function() {
            console.log('setup called')
            //Load objects and get array of networked objects
            //Load red light
            let redLight = document.createElement('a-entity');
            AFRAME.scenes[0].appendChild(redLight);
            redLight.setAttribute("media-loader", {src: 'https://github.com/mikemorran/onboardshowcontrol/blob/main/public/assets/redpoint.glb?raw=true', resolve: true });
            redLight.setAttribute("networked", {template : '#interactable-media'});
            window.smartHomeNetworkedObjects.push(redLight);
            console.log('red light added: ' , redLight.id);

            //Load blue light
            let blueLight = document.createElement('a-entity');
            AFRAME.scenes[0].appendChild(blueLight);
            blueLight.setAttribute("media-loader", {src: 'https://github.com/mikemorran/onboardshowcontrol/blob/main/public/assets/bluepoint.glb?raw=true', resolve: true });
            blueLight.setAttribute("networked", {template : '#interactable-media'});
            window.smartHomeNetworkedObjects.push(blueLight);
            console.log('blue light added: ' , blueLight.id);

            //Load white light
            let whiteLight = document.createElement('a-entity');
            AFRAME.scenes[0].appendChild(whiteLight);
            whiteLight.setAttribute("media-loader", {src: 'https://github.com/mikemorran/onboardshowcontrol/blob/main/public/assets/whitepoint.glb?raw=true', resolve: true });
            whiteLight.setAttribute("networked", {template : '#interactable-media'});
            window.smartHomeNetworkedObjects.push(whiteLight);
            console.log('white light added: ' , whiteLight.id);

            //Add screen share to array
            window.smartHomeNetworkedObjects.push(window.smartHomeCurrentNetworkedObjects[window.smartHomeIndex]);
            console.log('screen share added: ', window.smartHomeCurrentNetworkedObjects[window.smartHomeIndex].id);

            window.smartHomeStartSoundTracking = false;
            
            console.log(window.smartHomeNetworkedObjects);
            for (let i = 0; i < window.smartHomeNetworkedObjects.length; i++) {
                    //Set Blue Light Position
                    if (i === 0) {
                            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[i]).then((networkedEl) => {
                                    const mine = NAF.utils.isMine(networkedEl);
                                    var owned = NAF.utils.takeOwnership(networkedEl);
                                    networkedEl.setAttribute("rotation", '-2 0 0');
                                    networkedEl.setAttribute("scale", '5 5 5');
                                    networkedEl.setAttribute("position", '10.35 -11 5');
                            });
                    }
                    //Set Red Light Position
                    if (i === 1) {
                            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[i]).then((networkedEl) => {
                                    const mine = NAF.utils.isMine(networkedEl);
                                    var owned = NAF.utils.takeOwnership(networkedEl);
                                    networkedEl.setAttribute("rotation", '-2 0 0');
                                    networkedEl.setAttribute("scale", '5 5 5');
                                    networkedEl.setAttribute("position", '10.35 -36 5');
                            });
                    }
                    //Set White Light Position
                    if (i === 2) {
                            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[i]).then((networkedEl) => {
                                    const mine = NAF.utils.isMine(networkedEl);
                                    var owned = NAF.utils.takeOwnership(networkedEl);
                                    networkedEl.setAttribute("rotation", '-90 0 0');
                                    networkedEl.setAttribute("scale", '5 5 5');
                                    networkedEl.setAttribute("position", '10.35 -36 15');
                            });
                    }
                    if (i === 3) {
                        NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[i]).then((networkedEl) => {
                                const mine = NAF.utils.isMine(networkedEl);
                                var owned = NAF.utils.takeOwnership(networkedEl);
                                networkedEl.setAttribute('position', '9.584872245788574 4.4361066818237305 -3.2166662216186523');
                                networkedEl.setAttribute('rotation', '2.2107893285899247 0 0');
                                networkedEl.setAttribute('scale', '16.4 7.4 12.855183139022904');
                                networkedEl.setAttribute('pinnable', 'pinned:true');
                        });
                    }
            }
            window.smartHomeCue1();
        }
    
    
        //Initial Blue/Red Oscillation
        window.smartHomeCue1 = function() {
            window.smartHomeCue1Distance = 25;
            window.smartHomeCue1Offset = 0.1;
            window.smartHomeCue1UpperBound = window.smartHomeCue1Distance / window.smartHomeCue1Offset;
            window.smartHomeCue1IntervalTimer = 2000;
            window.smartHomeCue1Counter = 1;
            window.redDirection = -1;
            window.smartHomeCue1BlueY = -36;
            window.smartHomeCue1RedY = -11;
            window.smartHomeInterval1 = setInterval(() => {
                    //Flip Oscillation
                    console.log('counter: ' + window.smartHomeCue1Counter)
                    if (window.smartHomeCue1Counter < 0 || window.smartHomeCue1Counter > window.smartHomeCue1UpperBound) {
                            //flip oscillation
                            window.redDirection *= -1;
                            // window.smartHomeCue1Counter = 1;
                    }
    
                    //Move Red Light
                    NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[0]).then((networkedEl) => {
                            const mine = NAF.utils.isMine(networkedEl);
                            var owned = NAF.utils.takeOwnership(networkedEl);
                            window.smartHomeCue1RedY = -11 - (window.smartHomeCue1Offset * window.smartHomeCue1Counter);
                            networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1RedY.toString() + ' 5');
                    });
    
                    //Move Blue Light
                    NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[1]).then((networkedEl) => {
                            const mine = NAF.utils.isMine(networkedEl);
                            var owned = NAF.utils.takeOwnership(networkedEl);
                            window.smartHomeCue1BlueY = -36 - (-1 * window.smartHomeCue1Offset * window.smartHomeCue1Counter);
                            networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1BlueY.toString() + ' 5');
                    });
    
                    //console.log('RedY: ' + window.smartHomeCue1RedY, 'BlueY: ' + window.smartHomeCue1BlueY);
                    window.smartHomeCue1Counter += window.redDirection;
            }, 32);
        }
    
        //Fade to Black Then Lights Up
        window.smartHomeCue2 = function() {
            console.log('cue 1 called');
            window.redDirection = -1;
            window.smartHomeCue1Counter = 1;
            clearInterval(window.smartHomeInterval1);
            //Fade out Blue and Red
            window.smartHomeInterval2 = setInterval(() => {
            //Clear Interval Once Complete
            console.log('counter: ' + window.smartHomeCue1Counter)
            if (window.smartHomeCue1Counter < 0 || window.smartHomeCue1Counter > window.smartHomeCue1UpperBound / 5) {
    
                    console.log('reset called');
                    
                    //Reset Red Light
                    NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[0]).then((networkedEl) => {
                            const mine = NAF.utils.isMine(networkedEl);
                            var owned = NAF.utils.takeOwnership(networkedEl);
                            window.smartHomeCue1RedY = window.smartHomeCue1RedY - (window.smartHomeCue1Offset * window.smartHomeCue1Counter);
                            networkedEl.setAttribute('position', '10.35 -36 5');
                    });
    
                    //Reset Blue Light
                    NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[1]).then((networkedEl) => {
                            const mine = NAF.utils.isMine(networkedEl);
                            var owned = NAF.utils.takeOwnership(networkedEl);
                            window.smartHomeCue1BlueY = window.smartHomeCue1BlueY - (window.smartHomeCue1Offset * window.smartHomeCue1Counter);
                            networkedEl.setAttribute('position', '10.35 -36 5');
                    });
    
                    //Move White Light
                    NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[2]).then((networkedEl) => {
                            const mine = NAF.utils.isMine(networkedEl);
                            var owned = NAF.utils.takeOwnership(networkedEl);
                            networkedEl.setAttribute('position', '10.35 3 15');
                    });
    
                    clearInterval(window.smartHomeInterval2);
            }
    
            //Move Red Light
            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[0]).then((networkedEl) => {
                    const mine = NAF.utils.isMine(networkedEl);
                    var owned = NAF.utils.takeOwnership(networkedEl);
                    window.smartHomeCue1RedY = window.smartHomeCue1RedY - (window.smartHomeCue1Offset * window.smartHomeCue1Counter);
                    networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1RedY.toString() + ' 5');
            });
    
            //Move Blue Light
            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[1]).then((networkedEl) => {
                    const mine = NAF.utils.isMine(networkedEl);
                    var owned = NAF.utils.takeOwnership(networkedEl);
                    window.smartHomeCue1BlueY = window.smartHomeCue1BlueY - (window.smartHomeCue1Offset * window.smartHomeCue1Counter);
                    networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1BlueY.toString() + ' 5');
            });
    
            //console.log('RedY: ' + window.smartHomeCue1RedY, 'BlueY: ' + window.smartHomeCue1BlueY);
            window.smartHomeCue1Counter += -1 * window.redDirection;
            }, 128);
        }
    
        //Begin Voice Interaction and color change timing
        window.smartHomeCue3 = function() {
        console.log('cue three called');
        window.smartHomeCue4();
        window.smartHomePauseInteraction = false;
        window.smartHomeUpperThreshold = 0.2;
        window.smartHomeLowerThreshold = 0.01;
        
    
        //ADD TIMEOUT
        setTimeout(() => {
            console.log('Starting Smart Home Interaction');
            window.smartHomeStartSoundTracking = true;
            window.smartHomeCue3Offset = 36;
            window.smartHomeCue3Direction = 1;
            window.smartHomeOffsetEntity = 'blue';
            window.smartHomeInhale = false;
            window.smartHomeAnimationStarted = false;
            window.smartHomeCue1Counter = 1;
            window.redDirection = -1;
            window.smartHomeCue1Offset = 1;
            window.smartHomeCue3ColorChangeStarted = false;
            
    
            //Reset white light
            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[2]).then((networkedEl) => {
                    const mine = NAF.utils.isMine(networkedEl);
                    var owned = NAF.utils.takeOwnership(networkedEl);
                    networkedEl.setAttribute('position', '10.35 -34 5');
            });
            window.smartHomeCue1RedY = -33;
    
            //Offset blue light
            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[2]).then((networkedEl) => {
                    const mine = NAF.utils.isMine(networkedEl);
                    var owned = NAF.utils.takeOwnership(networkedEl);
                    networkedEl.setAttribute('position', '10.35 -70 5');
            });
            window.smartHomeCue1BlueY = -70;
    
            //Set interval checking breath
            window.smartHomeInterval3 = setInterval(() => {
                    console.log('cue 1 counter: ', window.smartHomeCue1Counter);
                    if (window.smartHomePauseInteraction === false) {
                    //console.log(window.smartHomeSoundLevel);
    
                    //If audio above threshold
                    if (window.smartHomeSoundLevel > window.smartHomeUpperThreshold && !window.smartHomeInhale && !window.smartHomeAnimationStarted) {
                            //Initiate color changes
                        if (!window.smartHomeCue3ColorChangeStarted) {
                                // Switch offset color
                            window.smartHomeInterval5 = setInterval(() => {
                                console.log('cue 3 offset: ' + window.smartHomeCue3Offset);
                                if (window.smartHomeCue3Offset < 1) {
                                        window.smartHomeCue3Direction *= -1;
                                        window.smartHomeOffsetEntity = 'red';
                                        console.log('switching! cue 3 direction :' , window.smartHomeCue3Direction, 'offset entity: ', window.smartHomeOffsetEntity);
                                }
                                if (window.smartHomeCue3Offset > 36) {
                                        clearInterval(window.smartHomeInterval5);
                                            //Set timeout for next cue
                                            console.log('pausing interaction');
                                            window.smartHomePauseInteraction = true;
                                            setTimeout(() => {
                                                console.log('moving to cue 5');
                                                window.smartHomeCue5();
                                                window.smartHomeUpperThreshold = 0.1;
                                            }, 41000);
                                }
                                window.smartHomeCue3Offset -= 1 * window.smartHomeCue3Direction;
                            }, 930);
                            window.smartHomeCue3ColorChangeStarted = true;
                            }
                    console.log('audio above threshold');
                            window.smartHomeAnimationStarted = true;
    
                            //Run inhale animation
                            window.smartHomeInterval4 = setInterval(() => {
                                    //Determine which entity is offset
                                    if (window.smartHomeOffsetEntity === 'blue') {
                                            //Move Red Light
                                            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[0]).then((networkedEl) => {
                                                    const mine = NAF.utils.isMine(networkedEl);
                                                    var owned = NAF.utils.takeOwnership(networkedEl);
                                                    window.smartHomeCue1RedY = -34 - (window.smartHomeCue1Offset * window.smartHomeCue1Counter);
                                                    networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1RedY.toString() + ' 5');
                                            });
                                            //Move Blue Light w/ offset
                                            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[1]).then((networkedEl) => {
                                                    const mine = NAF.utils.isMine(networkedEl);
                                                    var owned = NAF.utils.takeOwnership(networkedEl);
                                                    window.smartHomeCue1BlueY = -34 - (window.smartHomeCue1Offset * window.smartHomeCue1Counter) - window.smartHomeCue3Offset;
                                                    networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1BlueY.toString() + ' 5');
                                            });
                                    }
                                    if (window.smartHomeOffsetEntity === 'red') {
                                            //Move Red Light w/ offset
                                            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[0]).then((networkedEl) => {
                                                    const mine = NAF.utils.isMine(networkedEl);
                                                    var owned = NAF.utils.takeOwnership(networkedEl);
                                                    window.smartHomeCue1RedY = -34 - (window.smartHomeCue1Offset * window.smartHomeCue1Counter) - window.smartHomeCue3Offset;
                                                    networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1RedY.toString() + ' 5');
                                            });
                                            //Move Blue Light
                                            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[1]).then((networkedEl) => {
                                                    const mine = NAF.utils.isMine(networkedEl);
                                                    var owned = NAF.utils.takeOwnership(networkedEl);
                                                    window.smartHomeCue1BlueY = -34 - (window.smartHomeCue1Offset * window.smartHomeCue1Counter);
                                                    networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1BlueY.toString() + ' 5');
                                            });
                                    }
                        //console.log('red y: ' + window.smartHomeCue1RedY, 'blue y: ' + window.smartHomeCue1BlueY);
                                    window.smartHomeCue1Counter += window.redDirection;
                            }, 20);
    
                            //End inhale animation
                            setTimeout(() => {
                                    clearInterval(window.smartHomeInterval4);
                                    window.smartHomeInhale = true;
                                    window.smartHomeAnimationStarted = false;
                                    console.log('inhale animation finished');
                            }, 500);
                    }
                    //If audio below threshold
                    if (window.smartHomeSoundLevel < window.smartHomeLowerThreshold && window.smartHomeInhale && !window.smartHomeAnimationStarted) {
                            console.log('audio below threshold');
                            window.smartHomeAnimationStarted = true;
    
                            //Run exhale animation
                            window.smartHomeInterval2 = setInterval(() => {
                                    //Determine which entity is offset
                                    if (window.smartHomeOffsetEntity === 'blue') {
                                            //Move Red Light
                                            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[0]).then((networkedEl) => {
                                                    const mine = NAF.utils.isMine(networkedEl);
                                                    var owned = NAF.utils.takeOwnership(networkedEl);
                                                    window.smartHomeCue1RedY = -34 - (window.smartHomeCue1Offset * window.smartHomeCue1Counter);
                                                    networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1RedY.toString() + ' 5');
                                            });
                                            //Move Blue Light w/ offset
                                            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[1]).then((networkedEl) => {
                                                    const mine = NAF.utils.isMine(networkedEl);
                                                    var owned = NAF.utils.takeOwnership(networkedEl);
                                                    window.smartHomeCue1BlueY = -34 - (window.smartHomeCue1Offset * window.smartHomeCue1Counter) - window.smartHomeCue3Offset;
                                                    networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1BlueY.toString() + ' 5');
                                            });
                                    }
                                    if (window.smartHomeOffsetEntity === 'red') {
                                            //Move Red Light w/ offset
                                            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[0]).then((networkedEl) => {
                                                    const mine = NAF.utils.isMine(networkedEl);
                                                    var owned = NAF.utils.takeOwnership(networkedEl);
                                                    window.smartHomeCue1RedY = -34 - (window.smartHomeCue1Offset * window.smartHomeCue1Counter) - window.smartHomeCue3Offset;
                                                    networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1RedY.toString() + ' 5');
                                            });
                                            //Move Blue Light
                                            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[1]).then((networkedEl) => {
                                                    const mine = NAF.utils.isMine(networkedEl);
                                                    var owned = NAF.utils.takeOwnership(networkedEl);
                                                    window.smartHomeCue1BlueY = -34 - (window.smartHomeCue1Offset * window.smartHomeCue1Counter);
                                                    networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1BlueY.toString() + ' 5');
                                            });
                                    }
                            //console.log('red y: ' + window.smartHomeCue1RedY, 'blue y: ' + window.smartHomeCue1BlueY);
                            window.smartHomeCue1Counter += -1 * window.redDirection;
                            }, 20);
    
                            //End exhale animation
                            setTimeout(() => {
                    //Reset Values
                    if (window.smartHomeOffsetEntity === 'red') {
                        NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[0]).then((networkedEl) => {
                            const mine = NAF.utils.isMine(networkedEl);
                            var owned = NAF.utils.takeOwnership(networkedEl);
                            window.smartHomeCue1RedY = -34 - window.smartHomeCue3Offset;
                            networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1RedY.toString() + ' 5');
                        });
                        NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[1]).then((networkedEl) => {
                                                    const mine = NAF.utils.isMine(networkedEl);
                                                    var owned = NAF.utils.takeOwnership(networkedEl);
                                                    window.smartHomeCue1BlueY = -34;
                                                    networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1BlueY.toString() + ' 5');
                                            });
                    }
    
                    if (window.smartHomeOffsetEntity === 'blue') {
                                            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[0]).then((networkedEl) => {
                                                    const mine = NAF.utils.isMine(networkedEl);
                                                    var owned = NAF.utils.takeOwnership(networkedEl);
                                                    window.smartHomeCue1RedY = -34;
                                                    networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1RedY.toString() + ' 5');
                                            });
                                            NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[1]).then((networkedEl) => {
                                                    const mine = NAF.utils.isMine(networkedEl);
                                                    var owned = NAF.utils.takeOwnership(networkedEl);
                                                    window.smartHomeCue1BlueY = -34 - window.smartHomeCue3Offset;
                                                    networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1BlueY.toString() + ' 5');
                                            });
                                    }
                    
                                    clearInterval(window.smartHomeInterval2);
                                    window.smartHomeInhale = false;
                                    window.smartHomeAnimationStarted = false;
                                    window.smartHomeCue1Counter = 1;
                                    console.log('exhale animation finished');
                    
                            }, 500);
                    }
                }
                else {
                        console.log('interaction paused');
                }
            }, 100);
        }, 54000);
        }
    
        //Chaos lights
        window.smartHomeCue4 = function() {
        //make lights go crazy and end in blackout
        setTimeout(() => {
                window.smartHomeIsOn = 'red';
    
                //Move White Light
                NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[2]).then((networkedEl) => {
                        const mine = NAF.utils.isMine(networkedEl);
                        var owned = NAF.utils.takeOwnership(networkedEl);
                        networkedEl.setAttribute('position', '10.35 -36 15');
                });
    
                //Move Red Light
                NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[0]).then((networkedEl) => {
                        const mine = NAF.utils.isMine(networkedEl);
                        var owned = NAF.utils.takeOwnership(networkedEl);
                        networkedEl.setAttribute('position', '10.35 -5 15');
                });
    
                //Move Blue Light
                NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[1]).then((networkedEl) => {
                        const mine = NAF.utils.isMine(networkedEl);
                        var owned = NAF.utils.takeOwnership(networkedEl);
                        networkedEl.setAttribute('position', '10.35 -36 15');
                });
    
                //Run oscillation
                window.smartHomeInterval7 = setInterval(() => {
                if (window.smartHomeIsOn === 'red') {
                        window.smartHomeIsOn = 'blue';
                        console.log('changed to: ', window.smartHomeIsOn);
                        NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[1]).then((networkedEl) => {
                                const mine = NAF.utils.isMine(networkedEl);
                                var owned = NAF.utils.takeOwnership(networkedEl);
                                networkedEl.setAttribute('position', '10.35 -5 15');
                        });
                        NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[0]).then((networkedEl) => {
                                const mine = NAF.utils.isMine(networkedEl);
                                var owned = NAF.utils.takeOwnership(networkedEl);
                                networkedEl.setAttribute('position', '10.35 -36 15');
                        });
                }
                else if (window.smartHomeIsOn === 'blue') {
                        window.smartHomeIsOn = 'red';
                        console.log('changed to: ', window.smartHomeIsOn);
                        NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[0]).then((networkedEl) => {
                                const mine = NAF.utils.isMine(networkedEl);
                                var owned = NAF.utils.takeOwnership(networkedEl);
                                networkedEl.setAttribute('position', '10.35 -5 15');
                        });
                        NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[1]).then((networkedEl) => {
                                const mine = NAF.utils.isMine(networkedEl);
                                var owned = NAF.utils.takeOwnership(networkedEl);
                                networkedEl.setAttribute('position', '10.35 -36 15');
                        });
                }
                console.log(window.smartHomeIsOn);
                }, 700);

                setTimeout(() => {
                        console.log('blackout');
                        clearInterval(window.smartHomeInterval7);
                        NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[0]).then((networkedEl) => {
                                const mine = NAF.utils.isMine(networkedEl);
                                var owned = NAF.utils.takeOwnership(networkedEl);
                                networkedEl.setAttribute('position', '10.35 -34 15');
                        });
                        NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[1]).then((networkedEl) => {
                                const mine = NAF.utils.isMine(networkedEl);
                                var owned = NAF.utils.takeOwnership(networkedEl);
                                networkedEl.setAttribute('position', '10.35 -34 15');
                        });
                }, 11900);
        }, 14000);
        }
    
        //Make purple light
        window.smartHomeCue5 = function() {
        window.smartHomePauseInteraction = false;
        window.smartHomeOffsetEntity = 'red';
        window.smartHomeCue3Offset = 36;
        window.smartHomeCue3Direction = 1;
        window.smartHomeInterval6 = setInterval(() => {
            console.log('cue 3 offset: ' + window.smartHomeCue3Offset);
            window.smartHomeCue3Offset -= 1 * window.smartHomeCue3Direction;
            if (window.smartHomeCue3Offset < 1) {
                console.log('cue 5 finished, waiting for cue 6');
                clearInterval(window.smartHomeInterval6);
                setTimeout(() => {
                    window.smartHomeCue6();
                }, 72000);
            } 
        }, 2920);
        }
    
        //Fade to black
        window.smartHomeCue6 = function() {
        //Clear Intervals
        window.smartHomeStartSoundTracking = false;
        clearInterval(window.smartHomeInterval3);
            window.redDirection = -1;
            window.smartHomeCue1Counter = 1;
            clearInterval(window.smartHomeInterval1);
            //Fade out Blue and Red
            window.smartHomeInterval2 = setInterval(() => {
                //Clear Interval Once Complete
                console.log('counter: ' + window.smartHomeCue1Counter)
                if (window.smartHomeCue1Counter < 0 || window.smartHomeCue1Counter > window.smartHomeCue1UpperBound / 5) {
    
                        console.log('reset called');
    
                        //Reset Red Light
                        NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[0]).then((networkedEl) => {
                                const mine = NAF.utils.isMine(networkedEl);
                                var owned = NAF.utils.takeOwnership(networkedEl);
                                window.smartHomeCue1RedY = window.smartHomeCue1RedY - (window.smartHomeCue1Offset * window.smartHomeCue1Counter);
                                networkedEl.setAttribute('position', '10.35 -36 5');
                        });
    
                        //Reset Blue Light
                        NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[1]).then((networkedEl) => {
                                const mine = NAF.utils.isMine(networkedEl);
                                var owned = NAF.utils.takeOwnership(networkedEl);
                                window.smartHomeCue1BlueY = window.smartHomeCue1BlueY - (window.smartHomeCue1Offset * window.smartHomeCue1Counter);
                                networkedEl.setAttribute('position', '10.35 -36 5');
                        });
    
                        //Move White Light
                        NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[2]).then((networkedEl) => {
                                const mine = NAF.utils.isMine(networkedEl);
                                var owned = NAF.utils.takeOwnership(networkedEl);
                                networkedEl.setAttribute('position', '10.35 3 15');
                        });
    
                        clearInterval(window.smartHomeInterval2);
                }
    
                //Move Red Light
                NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[0]).then((networkedEl) => {
                        const mine = NAF.utils.isMine(networkedEl);
                        var owned = NAF.utils.takeOwnership(networkedEl);
                        window.smartHomeCue1RedY = window.smartHomeCue1RedY - (window.smartHomeCue1Offset * window.smartHomeCue1Counter);
                        networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1RedY.toString() + ' 5');
                });
    
                //Move Blue Light
                NAF.utils.getNetworkedEntity(window.smartHomeNetworkedObjects[1]).then((networkedEl) => {
                        const mine = NAF.utils.isMine(networkedEl);
                        var owned = NAF.utils.takeOwnership(networkedEl);
                        window.smartHomeCue1BlueY = window.smartHomeCue1BlueY - (window.smartHomeCue1Offset * window.smartHomeCue1Counter);
                        networkedEl.setAttribute('position', '10.35 ' + window.smartHomeCue1BlueY.toString() + ' 5');
                });
    
                //console.log('RedY: ' + window.smartHomeCue1RedY, 'BlueY: ' + window.smartHomeCue1BlueY);
                window.smartHomeCue1Counter += -1 * window.redDirection;
            }, 256);
        }
//}

//export { smartHomeDefineFunctions };

//mikend