class GUICtrl{
	constructor(e){
		this.languagePack = '';
	}

	newBtn(id, actType){
		var btnId = id + '_' + actType + 'Btn';
		var btnParent = document.getElementById(id + '_option');
		var btn = document.createElement("div");
		btn.setAttribute("id", btnId);
		btn.setAttribute("class", "cBtn");
		switch(actType){
			case 'add':
				btn.innerHTML = '+';
				btn.style.color = 'rgb(33, 215, 137)';
				btn.onclick= function(){ getPath(id, actType) };
				break;
			case 'del':
				btn.innerHTML = '&#10799';
				btn.style.color = 'rgb(255, 0, 0)';
				btn.onclick= function(){ delPath(id) };
				break;
			case 'edit':
				btn.innerHTML = '&#9998';
				btn.style.color = 'rgb(248, 198, 57)';
				btn.onclick= function(){ getPath(id, actType) };
				break;
		}
		btnParent.appendChild(btn);
	}

	reLayout(id, action){
		var idGroup = id.split('_')[0];
		this._layoutBtn(id, action);
		if( idGroup=='iImportPath' || idGroup=='iDataPath' || idGroup=='iFolderPath' ){
			var frameId = id.split('_')[0] + '_' + 0;
			if( action=='add'){
    			var timeInMilliseconds = new Date();
    			var UID = timeInMilliseconds.getTime();
    			var newId = idGroup + '_' + UID;
				createPath(frameId+'_list', newId);
				createOption(frameId+'_list', newId);
	        	this.newBtn(newId, 'add');
			}else if( action=='del' ){
				document.getElementById(frameId + '_list').removeChild(document.getElementById(id + '_path'));
				document.getElementById(frameId + '_list').removeChild(document.getElementById(id + '_option'));
			}
		}
	}

	showInfo(InfoType, id, languagePack){
		this._showFrame(InfoType);
		this._showContent(InfoType, id, languagePack);
	}

	hideInfo(){
		document.getElementById('iInfoFrame').classList.add('hideTranslate');
	}

	_showFrame(InfoType){
		switch(InfoType){
			case 'tips':
				document.getElementById('iInfo').style.color = ' rgb(248, 198, 57)';
				document.getElementById('iInfo').style.border = '5px solid  rgb(248, 198, 57)';
				document.getElementById('iInfoTitle').style.color = ' rgb(248, 198, 57)';
				document.getElementById('iInfoTitle').style.border = '5px solid  rgb(248, 198, 57)';
				break;

			case 'error':
				document.getElementById('iInfo').style.color = '#F00';
				document.getElementById('iInfo').style.border = '5px solid #F00';
				document.getElementById('iInfoTitle').style.color = '#F00';
				document.getElementById('iInfoTitle').style.border = '5px solid #F00';
				break;

			case 'about':
				document.getElementById('iInfo').style.color = 'rgb(33, 215, 137)';
				document.getElementById('iInfo').style.border = '5px solid rgb(33, 215, 137)';
				document.getElementById('iInfoTitle').style.color = 'rgb(33, 215, 137)';
				document.getElementById('iInfoTitle').style.border = '5px solid rgb(33, 215, 137)';
				break;
		}
		document.getElementById('iInfoTitle').style.borderBottom = 'none';
		document.getElementById('iInfoFrame').classList.remove('hideTranslate');
		document.getElementById('iInfoFrame').style.display = 'inline-block';
	}

	_showContent(InfoType, id, languagePack){
		switch(InfoType){
			case 'tips':
				this._showTips(id, languagePack);
				break;

			case 'error':
				this._showError(id, languagePack);
				break;

			case 'about':
				this._showAbout(id, languagePack);
				break;
		}
	}

	_showTips(id, languagePack){
		document.getElementById('iInfoTitle').innerHTML = languagePack['content_iInfoTitle_tips'];
		var idGroup = id.split('_')[0];
		var tips = '';
		switch(idGroup){
			case 'iMainPath':
				tips = languagePack['content_iMainPath_tips'];
				break;
			case 'iImportPath':
				tips = languagePack['content_iImportPath_tips'];
				break;
			case 'iDataPath':
				tips = languagePack['content_iDataPath_tips'];
				break;
			case 'iFolderPath':
				tips = languagePack['content_iFolderPath_tips'];
				break;
			case 'iAdvanced':
				tips = languagePack['content_iAdvanced'];
				break;
		}
		document.getElementById('iInfo').innerHTML = tips;
	}

	_showError(msg, languagePack){
		document.getElementById('iInfoTitle').innerHTML = languagePack['content_iInfoTitle_error'];
		switch(msg){
			case 'noMainPath':
				document.getElementById('iInfo').innerHTML = languagePack['content_noMainPath'];
				break;

			case 'overLapping':
				document.getElementById('iInfo').innerHTML = languagePack['content_overLapping'];
				break;
		}
		$('#iInfoFrame').effect('shake', { times:3, distance:5 }, 50);
	}

	_showAbout(item, languagePack){
		document.getElementById('iInfoTitle').innerHTML = languagePack['content_iInfoTitle_tips'];
		switch(item){
			case 'aboutMe':
				document.getElementById('iInfoTitle').innerHTML = '關於我';
				document.getElementById('iInfo').innerHTML = '一位由成就感驅動的工程師, 技術範圍涵蓋軟、硬、韌體, 甚至機構、製圖也略懂略懂, 擅長系統整合、新產品開發, 有興趣的人歡迎來信聯絡';
				break;
			case 'Gmail':
				document.getElementById('iInfoTitle').innerHTML = 'G-Mail';
				document.getElementById('iInfo').innerHTML = 'TripleC.Light@gmail.com';
				break;
			case 'Blog':
				document.getElementById('iInfoTitle').innerHTML = '網誌';
				document.getElementById('iInfo').innerHTML = '愛德華的空想科學誌<br>https://triplec-light.000webhostapp.com';
				break;
			case 'LinkedIn':
				document.getElementById('iInfoTitle').innerHTML = 'LinkedIn';
				document.getElementById('iInfo').innerHTML = 'https://www.linkedin.com/in/edward-chou-42058912a';
				break;
			case 'GitHub':
				document.getElementById('iInfoTitle').innerHTML = 'GitHub';
				document.getElementById('iInfo').innerHTML = 'https://github.com/TripleC-Light';
				break;
		}
	}

	_layoutBtn(id, action){
		this._clrAllBtn(id);
		if( action=='add' || action=='edit' ){
        	this.newBtn(id, 'del');
        	this.newBtn(id, 'edit');
		}else if( action=='del' ){
			this.newBtn(id, 'add');
		}
	}

	_clrAllBtn(id){
		if( document.getElementById(id + '_option') ){
			document.getElementById(id + '_option').innerHTML = '';
		}
	}
}
