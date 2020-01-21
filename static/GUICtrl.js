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

	showInfo(InfoType, id){
		this._showFrame(InfoType);
		this._showContent(InfoType, id);
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
		}
		document.getElementById('iInfoTitle').style.borderBottom = 'none';
		document.getElementById('iInfoFrame').classList.remove('hideTranslate');
		document.getElementById('iInfoFrame').style.display = 'inline-block';
	}

	_showContent(InfoType, id){
		switch(InfoType){
			case 'tips':
				this._showTips(id);
				break;

			case 'error':
				this._showError(id);
				break;
		}
	}

	_showTips(id){
		document.getElementById('iInfoTitle').innerHTML = '小提示';
		var idGroup = id.split('_')[0];
		var tips = '';
		switch(idGroup){
			case 'iMainPath':
				tips = '請選擇主要的程式進行轉換';
				break;
			case 'iImportPath':
				tips = '請選擇程式中Import的其他模組, 例如自行撰寫或是轉換程式找不到路徑的模組';
				break;
			case 'iDataPath':
				tips = '請選擇須一起打包至程式資料夾的檔案, 本程式會將這些檔案複製至輸出資料夾中, 例如: 圖片、音效、文字檔等等';
				break;
			case 'iFolderPath':
				tips = '請選擇須一起打包至程式資料夾的資料夾, 本程式會將資料夾連同其內的檔案一併複製至輸出資料夾中';
				break;
			case 'iAdvanced':
				tips = '進階設定';
				break;
		}
		document.getElementById('iInfo').innerHTML = tips;
	}

	_showError(msg){
		document.getElementById('iInfoTitle').innerHTML = '錯誤';
		switch(msg){
			case 'noMainPath':
				document.getElementById('iInfo').innerHTML = '請選擇主要的程式進行轉換';
				break;

			case 'overLapping':
				document.getElementById('iInfo').innerHTML = '該檔已經選擇過了, 與目前檔案重複';
				break;
		}
		$('#iInfoFrame').effect('shake', { times:3, distance:5 }, 50);
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
