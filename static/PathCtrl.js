class PathCtrl{
	constructor(e){
		this.mainPath = '';
		this.importPathList = [];
		this.dataPathList = [];
		this.folderPathList = [];
		this.iconPath = '';
	}

	edit(id, action, path_){
		var result = new Boolean(false);
		result = false;

		if( path_ != '' ){
			if( this.checkOverlap(id, path_) ){
				this.save(id, action, path_);
				this.show(id, path_);
				result = true;
			}
			else{
				showTips('');
				showError('overLapping');
			}
			
			// if( id=='iIcon' ){
			// 	var iconName = document.getElementById(id+'_path_').value;
			// 	iconName = iconName.split('/');
			// 	iconName = iconName[iconName.length-1];
			// 	console.log(iconName);
			// 	document.getElementById('iIconPic').src = '/static/tmpForPyInstaller/' + iconName;
			// 	btn.ctrl(id, action);
			// }
        }

        return result;
	}

	delete(id){
		var idGroup = id.split('_')[0];
		if( idGroup=='iMainPath'){
			this.mainPath = '';
		}
		else if( idGroup=='iImportPath' || idGroup=='iDataPath' || idGroup=='iFolderPath' ){
			var frameId = id.split('_')[0] + '_' + 0;
			var pathList = [];
			pathList = this.getPathList(idGroup);
			var tmpPath = document.getElementById(id+'_path').value;
			console.log('tmpPath=' + tmpPath);
			for( var i=0; i<pathList.length; i++ ){
				if( pathList[i] == tmpPath ){
					pathList.splice(i,1);
					break;
				}
			}
			this.savePathList(idGroup, pathList);
		}
		document.getElementById(id+'_path').value = '';
	}

	checkOverlap(id, path_){
		var result = new Boolean(true);
		if( path_ == this.mainPath ){
			console.log('overlapping');
			result = false;
		}
		console.log('path_=' + path_);
		this.importPathList.forEach(function(importPath) {
			console.log('importPath=' + importPath);
			if( path_ == importPath ){
				console.log('overlapping');
				result = false;
			}
		})
		this.dataPathList.forEach(function(importPath) {
			if( path_ == importPath ){
				console.log('overlapping');
				result = false;
			}
		})
		this.folderPathList.forEach(function(importPath) {
			if( path_ == importPath ){
				console.log('overlapping');
				result = false;
			}
		})
		return result;
	}

	show(id, path_){
		document.getElementById(id+'_path').value = path_;
	}

	save(id, action, path_){
		var idGroup = id.split('_')[0];
		// console.log('idGroup: ' + idGroup);
		if( idGroup=='iMainPath'){
			if( action=='add' || action=='edit' ){
	        	this.mainPath = path_;
			}else if( action=='del' ){
				this.mainPath = '';
			}
		}

		else if( idGroup=='iImportPath' || idGroup=='iDataPath' || idGroup=='iFolderPath' ){
			var frameId = id.split('_')[0] + '_' + 0;
			var pathList = [];
			pathList = this.getPathList(idGroup);
			if( action=='add'){
				pathList[pathList.length] = path_;

			}else if( action=='edit' ){
				var tmpPath = document.getElementById(id+'_path').value;
				console.log('tmpPath=' + tmpPath);
				for( var i=0; i<pathList.length; i++ ){
					if( pathList[i] == tmpPath ){
						pathList[i] = path_;
						break;
					}
				}

			}else if( action=='del' ){
				// var tmpPath = document.getElementById(id+'_path').value;
				// console.log('tmpPath=' + tmpPath);
				// for( var i=0; i<pathList.length; i++ ){
				// 	if( pathList[i] == tmpPath ){
				// 		pathList[i] = '';
				// 		break;
				// 	}
				// }
			}

    		console.log(pathList);
    		this.savePathList(idGroup, pathList);
		}

	}

	getPathList(idGroup){
		switch(idGroup){
			case 'iImportPath':
				return this.importPathList;
			case 'iDataPath':
				return this.dataPathList;
			case 'iFolderPath':
				return this.folderPathList;
		}
	}

	savePathList(idGroup, pathList){
		switch(idGroup){
			case 'iMainPath':
				this.importPathList = pathList;
				console.log('importPathList= '+importPathList);
				return;
			case 'iDataPath':
				this.dataPathList = pathList;
				console.log('dataPathList= '+dataPathList);
				return;
			case 'iFolderPath':
				this.folderPathList = pathList;
				console.log('folderPathList= '+folderPathList);
				return;
		}
	}
}