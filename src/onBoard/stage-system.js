import { proxiedUrlFor } from "../utils/media-url-utils";
import React, { Component, useEffect } from "react";


import userDB from "../assets/onBoard/data/user_db.json";
import cueDB from "../assets/onBoard/data/cue_db.json";


class stgSysClass {


    constructor() {
        this.myUser = {name:"default", role:"guest", avatarURL:"none"} 
        this.cueDB = {}
		this.cueDB.listCue = [];
		this.mapItem = {};
		this.listAnim = [];
    }


    initUser(_username) {
 		fetch(proxiedUrlFor("https://onboardxr.github.io/onboard_json/user_db.json"))
	    .then(function (response) {
		    return response.json();
	    })
	    .then((data) => {
		    if (typeof data[_username] !== 'undefined') {
				this.myUser.name = data[_username].name;
				this.myUser.role = data[_username].role;
				if(data[_username].avatar !== undefined)
					this.myUser.avatar = data[_username].avatarURL;

				console.log(this.myUser);

				window.APP.store.update({ profile: { displayName: this.myUser.name} }); 
				window.APP.store.state.activity.hasChangedName = true;
				if(this.myUser.avatarURL !== "none")
					window.APP.store.state.profile.avatarId = proxiedUrlFor(this.myUser.avatarURL);

			} else {
				console.log(_username + " is unkown in the database of users");
			}

	    })
	    .catch(function (err) {
		    console.log(err);
	    });
/*

// LOCAL USAGE... omg, which one to chose....
	if (typeof userDB[_username] !== 'undefined') {
		this.myUser.name = userDB[_username].name;
		this.myUser.role = userDB[_username].role;
		if(userDB[_username].avatar !== undefined)
			this.myUser.avatar = userDB[_username].avatarURL;

		console.log(this.myUser);

		window.APP.store.update({ profile: { displayName: this.myUser.name} }); 
		window.APP.store.state.activity.hasChangedName = true;
		if(this.myUser.avatarURL !== "none")
			window.APP.store.state.profile.avatarId = proxiedUrlFor(this.myUser.avatarURL);

	} else {
		console.log(_username + " is unkown in the database of users");
	}
*/

    } 


	init () {

// LOCAL USAGE... omg, which one to chose....
/*
        this.cueDB = cueDB;
		console.log(this.cueDB);
*/

		fetch(proxiedUrlFor("https://onboardxr.github.io/onboard_json/cue_db.json"))
			.then(function (response) {
				return response.json();
			})
			.then( (data) => {
				this.cueDB = data;
    			setTimeout(() => renderCueVR(), 5000);
				console.log(this.cueDB);
			})
			.catch(function (err) {
				console.log(err);
			});

	}


    playAction (_cue) {
    	console.log("PLAYING TRIG: "+_cue.name);
    	_cue.played = true;

    	switch(_cue.action.type) {
    	case "ui_popin":
			addUIpop(_cue);
      	break;

    	case "spawn_item":
			spawnItem(_cue);
      	break;

		case "spawn_prop":
			spawnProp(_cue);
			break;

		case "move":
			moveItem (_cue);
			break;

		case "delete":
			delItem(_cue.target.src);
			_cue.ended = true; 
			break;

		case "change_scene":
			changeSceneTo(_cue.action.link);
			break;

		case "jump_to_waypoint":
			jumpToWaypoint(_cue.action.anchor);
			break;

		case "change_avatar":
			alert(" is not working... yet!");
			break;
		}
  	}



    // Functionalities ( Triggers / Behavior)

	// B.1) Changing scene
	changeSceneTo (_link) {
		alert("not working yet :(");	
    }

	// B.2) Changing waypoint
	jumpToWaypoint (_link) {
	    /*
	    let newUrl = document.location.href;
		newUrl = newUrl.split('#')[0];
		document.location.hash = _link;
		history.pushState({}, "", newUrl);
        //setInterval(() => document.hash = "", 2000);
	    */

        let anchorLink = _link;
        let newUrl = document.location.href;
        newUrl = newUrl.split('#')[0];
        document.location.hash = anchorLink;

	}

	// B.3) Adding a props
	spawnProp(_cue) { // TODO: need to call "spawnItem" from this function

		if(typeof this.mapItem[_cue.name] != undefined && this.mapItem[_cue.name] != null) {
			return;
		}

		var el = document.createElement("a-entity")
		AFRAME.scenes[0].appendChild(el)
		el.setAttribute("media-loader", { src: _cue.target.src, resolve: true })
		el.setAttribute("networked", { template: "#interactable-media" } )

        this.mapItem[_cue.name] = el;
		this.mapItem[_cue.name].listAnim = [];


        // Setting the props in front of the user, and facing it
        var selfEl = AFRAME.scenes[0].querySelector("#avatar-rig")
        var povCam = selfEl.querySelector("#avatar-pov-node")
        var dir = povCam.object3D.getWorldDirection();
        el.object3D.position.copy( selfEl.object3D.position )
        el.object3D.position.y += 1.3
        el.object3D.position.x += -dir.x
        el.object3D.position.z += -dir.z
		el.object3D.rotation.set(_cue.action.rot.x, _cue.action.rot.y, _cue.action.rot.z); 
		el.object3D.scale.set(_cue.action.scale.x, _cue.action.scale.y, _cue.action.scale.z); 

		return el;
	}

    spawnItem(_cue) {
		let el = document.createElement("a-entity")
		el.setAttribute("networked", { template: "#interactable-media" } )
		AFRAME.scenes[0].appendChild(el)
		this.mapItem[_cue.name] = el; 
		this.mapItem[_cue.name].listAnim = [];

		el.setAttribute("media-loader", { src: _cue.target.src, resolve: true })

		el.object3D.position.set(_cue.action.pos.x, _cue.action.pos.y, _cue.action.pos.z); 
		el.object3D.rotation.set(_cue.action.rot.x, _cue.action.rot.y, _cue.action.rot.z); 
		el.object3D.scale.set(_cue.action.scale.x, _cue.action.scale.y, _cue.action.scale.z); 

		switch(_cue.target.type) {
		case "glb": 	break;
		case "image": 	break;
		case "audio": 
		case "video": 
			let initEnded_audio = setInterval(()=>{ // INIT aspect, once the video element has been created;

				if(typeof el.components["media-video"] === "undefined") { return; }
				if(typeof el.components["media-video"].video === "undefined") { return; }

				updateAudio(el.components["media-video"], _cue);
				el.components["media-video"].video.loop = false;

				clearInterval(initEnded_audio);
			}, 100);

			let initEnded_endtrig = setInterval(()=>{
				if(typeof el.components["media-video"] === "undefined") { return; }
				if(typeof el.components["media-video"].video === "undefined") { return; }

				// Endtrig aspect
				if(el.components["media-video"].video.ended) {
			
					console.log("ENDED TRIG: "+_cue.name);
					el.object3D.position.y = 9999999; // TODO: do we went to delete the video each time?
					this.mapItem[_cue.name] = null;
					_cue.ended = true; 

					clearInterval(initEnded_endtrig);
				}
			}, 500);

			// Play / Pause => in another code if needed
	
			break;
		}

	}
	

	// B.4) Deleting an Item
	delItem (_name) {
		if(this.mapItem[_name] != undefined) {


			this.mapItem[_name].listAnim.forEach( (elt) => elt.pause());

			this.mapItem[_name].object3D.position.y = 9999999;
			this.mapItem[_name].object3D.matrixAutoUpdate = true; 
			this.mapItem[_name] = null;
		}
	}


	// B.5) Moving an Item
	moveItem (_cue) {
		let myObj = this.mapItem[_cue.target.src].object3D;
		this.mapItem[_cue.target.src].object3D.matrixAutoUpdate = true; 

		//anim.reverse()
		let animPos = AFRAME.ANIME.default.timeline({
			targets: myObj.position, loop: _cue.action.loop, autoplay: true, easing: 'easeInOutSine', duration: _cue.action.duration})
		animPos.add(_cue.action.pos);
		animPos.play();

		let animRot = AFRAME.ANIME.default.timeline({
			targets: myObj.rotation, loop: _cue.action.loop, autoplay: true, easing: 'easeInOutSine', duration: _cue.action.duration})
		animRot.add(_cue.action.rot);
		animRot.play();

		let animScale = AFRAME.ANIME.default.timeline({
			targets: myObj.scale, loop: _cue.action.loop, autoplay: true, easing: 'easeInOutSine', duration: _cue.action.duration})
		animScale.add(_cue.action.scale);
		animScale.play();

		this.mapItem[_cue.target.src].listAnim.push(animPos);
		this.mapItem[_cue.target.src].listAnim.push(animRot);
		this.mapItem[_cue.target.src].listAnim.push(animScale);
	}


	// B.6) Add UI element
	addUIpop(_cue) {
		document.getElementById("transition").getElementsByTagName("a")[0].href = _cue.target.dest;
		document.getElementById("transition").getElementsByTagName("a")[0].getElementsByTagName("img")[0].src = _cue.target.src;

		setTimeout(()=>{
			document.getElementById("transition").style.display = "block";  
		}, 200);
	}

	// B.7) Update Audio
	updateAudio(_component, _cue) {

		if(typeof _cue.action.volume !== "undefined") {
			//el.setAttribute("media-video", "volume", THREE.Math.clamp(_cue.action.volume, 0, 1));
			_component.volume = THREE.Math.clamp(_cue.action.volume, 0, 1);
			_component.updateVolumeLabel();
		}

		if(typeof _cue.action.distanceModel !== "undefined")
			_component.audio.setDistanceModel(_cue.action.distanceModel);
		  
		if(typeof _cue.action.rolloffFactor !== "undefined")
			_component.audio.setRolloffFactor(_cue.action.rolloffFactor);
		  
		if(typeof _cue.action.refDistance !== "undefined")
			_component.audio.setRefDistance(_cue.action.refDistance);
		  
		if(typeof _cue.action.maxDistance !== "undefined")
			_component.audio.setMaxDistance(_cue.action.maxDistance);
		  
		if(typeof _cue.action.coneInnerAngle !== "undefined")
			_component.audio.panner.coneInnerAngle = _cue.action.coneInnerAngle;
		  
		if(typeof _cue.action.coneOuterAngle !== "undefined")
			_component.audio.panner.coneOuterAngle = _cue.action.coneOuterAngle;
		  
		if(typeof _cue.action.coneOuterGain !== "undefined")
			_component.audio.panner.coneOuterGain = _cue.action.coneOuterGain;

	}
					
	// B.8) Call Global function from personal code (or not!)
    callGlobalFunction(_functionName) {
        window[_functionName]();
    }

					
	// B.8) Call Global function from personal code (or not!)
    callMethodFromObject(_objectName, _functionName) {
        window[_objectName][_functionName]();
    }

	 // C) Graphics

	 // C.1) Buttons interfaces for the cues
  renderCueUI () {
	let iCueTop = 1.3; // for the offset....
    let offsetY = 37;
    return (
      <div style={{pointerEvents: "auto", userSelect: "none", cursor: "pointer", "left": "20px", "position": "absolute", "top": "50px"}}>
        {this.myUser.role != "guest" && (<span className="divCue nameCue" style={{top:"68px", height:"20px"}}>{this.myUser.name}</span>)}
		{this.cueDB.listCue.map(cue => {
            if(this.myUser.role != cue.role)
                return;

			if(cue.trig.type != "button")
				return;

			switch(cue.action.type) {

			case "spawn_item":
			    iCueTop++;
				return (<div className="divCue" style={{top:(iCueTop*offsetY)+"px"}} key={cue.role+cue.name}>
					<span className="nameCue">{cue.name}</span>
					<div className="listLgCue">
						<img className="lgCue" src= "../assets/onBoard/load.svg" style=   {{float:"left"}}
							onClick={() => this.spawnItem(cue)}/>
						<img className="lgCue" src= "../assets/onBoard/delete.svg" style= {{float:"right"}}
							onClick={() => this.delItem(cue.name)}/>
					</div>
				</div>)
				break;

			case "spawn_prop":
			    iCueTop++;
				return (<div className="divCue" style={{top:(iCueTop*offsetY)+"px"}} key={cue.role+cue.name}>
					<span className="nameCue">{cue.name}</span>
					<div className="listLgCue">
						<img className="lgCue" src= "../assets/onBoard/load.svg" style=   {{float:"left"}}
							onClick={() => this.spawnProp(cue)}/>
						<img className="lgCue" src= "../assets/onBoard/delete.svg" style= {{float:"right"}}
							onClick={() => this.delItem(cue.name)}/>
					</div>
				</div>)
				break;

			case "delete":
			    iCueTop++;
				return (<div className="divCue" style={{top:(iCueTop*offsetY)+"px"}} key={cue.role+cue.name}>
					<span className="nameCue">{cue.name}</span>
					<div className="listLgCue">
						<img className="lgCue" src= "../assets/onBoard/delete.svg" style= {{float:"left"}}
							onClick={() => this.delItem(cue.target.src)}/>
					</div>
				</div>)
				break;

			case "move":
			    iCueTop++;
				return (<div className="divCue" style={{top:(iCueTop*offsetY)+"px"}} key={cue.role+cue.name}>
					<span className="nameCue">{cue.name}</span>
					<div className="listLgCue">
						<img className="lgCue" src= "../assets/onBoard/n1.svg" style= {{float:"left"}}
							onClick={() => this.moveItem(cue)}/>
					</div>
				</div>)
				break;

			case "jump_to_waypoint":
			    iCueTop++;
				return (<div className="divCue" style={{top:(iCueTop*offsetY)+"px"}} key={cue.role+cue.name}>
					<span className="nameCue">{cue.name}</span>
					<div className="listLgCue">
						<img className="lgCue" src= "../assets/onBoard/n1.svg"
                             onClick={() => this.jumpToWaypoint(cue.action.anchor)}/>
					</div>
				</div>)
				break;

			case "ui_popin":
			    iCueTop++;
				return (<div className="divCue" style={{top:(iCueTop*offsetY)+"px"}} key={cue.role+cue.name}>
					<span className="nameCue">{cue.name}</span>
					<div className="listLgCue">
					</div>
				</div>)
				break;

			case "change_scene":
			    iCueTop++;
				return (<div className="divCue" style={{top:(iCueTop*offsetY)+"px"}} key={cue.role+cue.name}>
					<span className="nameCue">{cue.name}</span>
					<div className="listLgCue">
					</div>
				</div>)
				break;

			case "change_avatar":
			    iCueTop++;
				return (<div className="divCue" style={{top:(iCueTop*offsetY)+"px"}} key={cue.role+cue.name}>
					<span className="nameCue">{cue.name}</span>
					<div className="listLgCue">
					</div>
				</div>)
				break;
                
			case "call_global_function":
			    iCueTop++;
				return (<div className="divCue" style={{top:(iCueTop*offsetY)+"px"}} key={cue.role+cue.name}>
					<span className="nameCue">{cue.name}</span>
					<div className="listLgCue">
						<img className="lgCue" src= "../assets/onBoard/n1.svg"
                             onClick={() => this.callGlobalFunction(cue.action.function_name)}/>
					</div>
				</div>)
				break;

			case "call_method_from_object":
			    iCueTop++;
				return (<div className="divCue" style={{top:(iCueTop*offsetY)+"px"}} key={cue.role+cue.name}>
					<span className="nameCue">{cue.name}</span>
					<div className="listLgCue">
						<img className="lgCue" src= "../assets/onBoard/n1.svg"
                             onClick={() => this.callMethodFromObject(cue.action.object_name, cue.action.function_name)}/>
					</div>
				</div>)
				break;

			}
        })}
      </div>
    );
  };

    // VR User Interface

/*

    addButt(_posX, _posY, _img, _func) {

        let vrHUD = AFRAME.scenes[0].querySelector("a-entity[in-world-hud]")

        let newButt = document.createElement("a-image")
        vrHUD.appendChild(newButt)
        newButt.setAttribute("is-remote-hover-target", true)
        newButt.setAttribute("tags", "singleActionButton:true")
        newButt.setAttribute("sprite", {})
        newButt.setAttribute("class", "hud")
        newButt.object3D.position.set(_posX, _posY, 0.001);
        newButt.object3D.scale.set(0.1, 0.1, 0.1);
        newButt.setAttribute("src", _img)
        newButt.object3D.addEventListener("interact", _func);

    }

   renderCueVR() {

		let iCueRight = 0;
		let offsetY = -0.15, offsetX = 0.12, ofX = -0.3;

	   // Name
		 let vrHUD = AFRAME.scenes[0].querySelector("a-entity[in-world-hud]")

		 let nameHUD = document.createElement("a-entity")
		 nameHUD.setAttribute("text", "value: " + this.myUser.name )
		 vrHUD.appendChild(nameHUD)
		 nameHUD.setAttribute("class", "hud")
		 nameHUD.object3D.position.set(-0.15, offsetY, 0.001);
		 //nameHUD.object3D.scale.set(0.1, 0.1, 0.1);


		animSys.cueDB.listCue.map(d => {
			if(animSys.user.role != d.role)
				return;
			switch(d.type) {
			case "props":
				addButt(ofX + iCueRight*offsetX, offsetY, "#imgPropsLoad", () => {animSys.addProps(d.name, d.url)});
				addButt(ofX + iCueRight*offsetX, offsetY-0.12, "#imgPropsDelete", () => {animSys.delProps(d.name, d.url)});
				iCueRight++;
				break;
			case "avatar":
				//addButt(ofX + iCueRight*offsetX, offsetY, "#imgAvatar", () => {animSys.changeAvatarTo(d.url)});
				//iCueRight++;
				break;
			case "waypoint":
				addButt(ofX + iCueRight*offsetX, offsetY, "#imgWaypoint", () => {animSys.changeWaypointTo(d.url)});
				iCueRight++;
				break;
			}
		});
    } 
	*/
}

export default stgSysClass;

