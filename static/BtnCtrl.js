class BtnCtrl{
	constructor(e){
	}

	clear(id){
		if( document.getElementById(id + '_option') ){
			document.getElementById(id + '_option').innerHTML = '';
		}
	}

	new(id, action){
		var btnId = id + '_' + action + 'Btn';
		var btnParent = document.getElementById(id + '_option');
		var btn = document.createElement("div");
		btn.setAttribute("id", btnId);
		btn.setAttribute("class", "cBtn");
		switch(action){
			case 'add':
				btn.innerHTML = '+';
				btn.style.color = 'rgb(33, 215, 137)';
				btn.onclick= function(){ editPath(id, action) };
				break;
			case 'del':
				btn.innerHTML = '&#10799';
				btn.style.color = 'rgb(255, 0, 0)';
				btn.onclick= function(){ delPath(id) };
				break;
			case 'edit':
				btn.innerHTML = '&#9998';
				btn.style.color = 'rgb(248, 198, 57)';
				btn.onclick= function(){ editPath(id, action) };
				break;
		}
		btnParent.appendChild(btn);
	}

	ctrl(id, action){
		var idGroup = id.split('_')[0];
		this.clear(id);
		if( action=='add' || action=='edit' ){
        	this.new(id, 'del');
        	this.new(id, 'edit');
		}else if( action=='del' ){
			this.new(id, 'add');
		}

		if( idGroup=='iMainPath'){
			if( action=='del' ){
				startAPP(false);
				document.getElementById('iOK').style.color = 'rgb(102, 106, 111)';
			}
		}
		else if( idGroup=='iImportPath' || idGroup=='iDataPath' || idGroup=='iFolderPath' ){
			var frameId = id.split('_')[0] + '_' + 0;
			console.log('id=' + id);
			if( action=='add'){
    			var timeInMilliseconds = new Date();
    			var UID = timeInMilliseconds.getTime();
    			var newId = idGroup + '_' + UID;
        		console.log('newId: ' + newId);
				createPath(frameId+'_list', newId);
				createOption(frameId+'_list', newId);
	        	this.new(newId, 'add');
			}else if( action=='del' ){
				document.getElementById(frameId + '_list').removeChild(document.getElementById(id + '_path'));
				document.getElementById(frameId + '_list').removeChild(document.getElementById(id + '_option'));
			}
		}

		else if( idGroup=='iIcon' ){
			if( action=='add' || action=='edit' ){
	        	iconPath = document.getElementById(id+'_path').value;
			}
		}
	}
}