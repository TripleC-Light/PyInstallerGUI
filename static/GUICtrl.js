class GUICtrl{
	constructor(e){}

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
		// else if( idGroup=='iIcon' ){
		// 	if( action=='add' || action=='edit' ){
	 //        	iconPath = document.getElementById(id+'_path').value;
		// 	}
		// }
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
